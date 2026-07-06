import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
} from "../dtos/user.dto";
import { UserRepository } from "../repository/user.repository";
import { PasswordUtil } from "../utils/password.utils";
import { JwtUtil } from "../utils/jwt.utils";
import { HttpError } from "../errors/http.error";

const userRepository = new UserRepository();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

export class UserService {
  async registerUser(dto: CreateUserDto) {
    const [emailExists, usernameExists] = await Promise.all([
      userRepository.getUserByEmail(dto.email),
      userRepository.getUserByUsername(dto.username),
    ]);

    if (emailExists) {
      throw new HttpError(409, "Email already registered");
    }

    if (usernameExists) {
      throw new HttpError(409, "Username already taken");
    }

    const hashedPassword = await PasswordUtil.hash(dto.password);

    const user = await userRepository.createUser({
      fullName: dto.fullName,
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      role: "user", // Prevent privilege escalation
      phoneNumber: dto.phoneNumber,
      profilePicture: dto.profilePicture,
    });

    return user;
  }

  async getUserById(userId: string) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return user;
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (data.email && user.email !== data.email) {
      const emailExists = await userRepository.getUserByEmail(data.email);

      if (emailExists) {
        throw new HttpError(403, "Email already in use");
      }
    }

    if (data.username && user.username !== data.username) {
      const usernameExists = await userRepository.getUserByUsername(
        data.username
      );

      if (usernameExists) {
        throw new HttpError(403, "Username already in use");
      }
    }

    if (data.password) {
      data.password = await PasswordUtil.hash(data.password);
    }

    const updatedUser = await userRepository.updateOneUser(userId, data);

    return updatedUser;
  }

  async loginUser(dto: LoginUserDto) {
  // Find user by email or username
  const user = await userRepository.getAuthUser(dto.identifier);

  if (!user) {
    throw new HttpError(401, "Invalid email/username or password.");
  }

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > new Date()) {
    const minutesLeft = Math.ceil(
      (user.lockUntil.getTime() - Date.now()) / (1000 * 60)
    );

    throw new HttpError(
      423,
      `Your account is locked due to multiple failed login attempts. Please try again after ${minutesLeft} minute(s).`
    );
  }

  // Lock expired -> unlock automatically
  if (user.lockUntil && user.lockUntil <= new Date()) {
    await userRepository.resetFailedLoginAttempts(user._id.toString());

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
  }

  // Verify password
  const isValidPassword = await PasswordUtil.compare(
    dto.password,
    user.password
  );

  // Wrong password
  if (!isValidPassword) {
    const updatedUser =
      await userRepository.incrementFailedLoginAttempts(
        user._id.toString()
      );

    const failedAttempts =
      updatedUser?.failedLoginAttempts ?? 0;

    // Lock account after maximum attempts
    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(
        Date.now() + LOCK_TIME
      );

      await userRepository.lockAccount(
        user._id.toString(),
        lockUntil
      );

      throw new HttpError(
        423,
        "Your account has been locked for 15 minutes due to too many failed login attempts."
      );
    }

    const remainingAttempts =
      MAX_LOGIN_ATTEMPTS - failedAttempts;

    throw new HttpError(
      401,
      `Invalid password. ${remainingAttempts} login attempt(s) remaining before your account is locked.`
    );
  }

  // Successful login
  await userRepository.resetFailedLoginAttempts(
    user._id.toString()
  );

  const updatedUser =
    await userRepository.updateLastLogin(
      user._id.toString()
    );

  const token = JwtUtil.sign({
    id: user._id,
    role: user.role,
  });

  const { password, ...safeUser } =
    updatedUser!.toObject();

  return {
    token,
    user: safeUser,
  };
}
}

