import { CreateUserDto, LoginUserDto, UpdateUserDto } from "../dtos/user.dto";
import { UserRepository } from "../repository/user.repository";
import { PasswordUtil } from "../utils/password.utils";
import { JwtUtil } from "../utils/jwt.utils";
import { HttpError } from "../errors/http.error";



const userRepository = new UserRepository();

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
      role: "user",
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
        if(user.email !== data.email){
            const emailExists = await userRepository.getUserByEmail(data.email!);
            if(emailExists){
                throw new HttpError(403, "Email already in use");
            }
        }
        if(user.username !== data.username){
            const usernameExists = await userRepository.getUserByUsername(data.username!);
            if(usernameExists){
                throw new HttpError(403, "Username already in use");
            }
        }
        if(data.password){
            data.password = await PasswordUtil.hash(data.password);
            
        }
        const updatedUser = await userRepository.updateOneUser(userId, data);
        return updatedUser;
    }

  async loginUser(dto: LoginUserDto) {

    const user = await userRepository.getUserByEmail(dto.email);

    if (!user) {
      throw new HttpError(404, "Invalid credentials");
    }

    const isValid = await PasswordUtil.compare(
      dto.password,
      user.password
    );

    if (!isValid) {
      throw new HttpError(401, "Invalid credentials");
    }

    const token = JwtUtil.sign({
      id: user._id,
      role: user.role,
    });

    const { password, ...safeUser } = user.toObject();

    return {
      token,
      user: safeUser,
    };
  }
}

