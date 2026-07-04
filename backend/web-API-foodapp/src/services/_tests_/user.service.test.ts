import { UserService } from "../user.service";
import { UserRepository } from "../../repository/user.repository";
import { PasswordUtil } from "../../utils/password.utils";
import { JwtUtil } from "../../utils/jwt.utils";
import { HttpError } from "../../errors/http.error";
import bcrypt from "bcryptjs";

jest.mock("../../repository/user.repository");
jest.mock("../../utils/password.utils");
jest.mock("../../utils/jwt.utils");
jest.mock("bcryptjs");

describe("UserService", () => {
  let service: UserService;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    service = new UserService();
    userRepo = new UserRepository() as jest.Mocked<UserRepository>;
    jest.clearAllMocks();
  });

  const mockUserRepo = () => {
    return {
      getUserByEmail: jest.fn(),
      getUserByUsername: jest.fn(),
      createUser: jest.fn(),
      getUserById: jest.fn(),
      updateOneUser: jest.fn(),
    };
  };

  // ================= REGISTER USER =================
  it("should register a new user", async () => {
    const dto = { fullName: "John Doe", username: "john", email: "john@example.com", password: "pass123", role: "user" };
    const mocks = mockUserRepo();
    mocks.getUserByEmail.mockResolvedValue(null);
    mocks.getUserByUsername.mockResolvedValue(null);
    (PasswordUtil.hash as jest.Mock).mockResolvedValue("hashedPassword");
    const mockUser = { _id: "1", ...dto, password: "hashedPassword" };
    mocks.createUser.mockResolvedValue(mockUser as any);

    jest.spyOn(UserRepository.prototype, 'getUserByEmail').mockImplementation(mocks.getUserByEmail);
    jest.spyOn(UserRepository.prototype, 'getUserByUsername').mockImplementation(mocks.getUserByUsername);
    jest.spyOn(UserRepository.prototype, 'createUser').mockImplementation(mocks.createUser);

    const result = await service.registerUser(dto as any);

    expect(mocks.getUserByEmail).toHaveBeenCalledWith(dto.email);
    expect(mocks.getUserByUsername).toHaveBeenCalledWith(dto.username);
    expect(PasswordUtil.hash).toHaveBeenCalledWith(dto.password);
    expect(mocks.createUser).toHaveBeenCalledWith(expect.objectContaining({ password: "hashedPassword" }));
    expect(result).toEqual(mockUser);
  });

  it("should throw error if email exists", async () => {
    const mocks = mockUserRepo();
    mocks.getUserByEmail.mockResolvedValue({ _id: "1" } as any);
    jest.spyOn(UserRepository.prototype, 'getUserByEmail').mockImplementation(mocks.getUserByEmail);

    await expect(service.registerUser({ email: "a" } as any)).rejects.toThrow(HttpError);
  });

  it("should throw error if username exists", async () => {
    const mocks = mockUserRepo();
    mocks.getUserByEmail.mockResolvedValue(null);
    mocks.getUserByUsername.mockResolvedValue({ _id: "1" } as any);
    jest.spyOn(UserRepository.prototype, 'getUserByEmail').mockImplementation(mocks.getUserByEmail);
    jest.spyOn(UserRepository.prototype, 'getUserByUsername').mockImplementation(mocks.getUserByUsername);

    await expect(service.registerUser({ email: "a", username: "u" } as any)).rejects.toThrow(HttpError);
  });

  // ================= LOGIN USER =================
  it("should login user successfully", async () => {
    const dto = { email: "a", password: "pass" };
    const mocks = mockUserRepo();
    const mockUser: any = {
      _id: "1",
      email: "a",
      password: "hashed",
      role: "user",
      toObject: () => ({ _id: "1", email: "a", password: "hashed", role: "user" })
    };
    mocks.getUserByEmail.mockResolvedValue(mockUser);
    (PasswordUtil.compare as jest.Mock).mockResolvedValue(true);
    (JwtUtil.sign as jest.Mock).mockReturnValue("jwtToken");

    jest.spyOn(UserRepository.prototype, 'getUserByEmail').mockImplementation(mocks.getUserByEmail);

    const result = await service.loginUser(dto as any);

    expect(mocks.getUserByEmail).toHaveBeenCalledWith(dto.email);
    expect(PasswordUtil.compare).toHaveBeenCalledWith(dto.password, mockUser.password);
    expect(JwtUtil.sign).toHaveBeenCalledWith({ id: mockUser._id, role: mockUser.role });
    expect(result).toEqual({ token: "jwtToken", user: { _id: "1", email: "a", role: "user" } });
  });

  it("should throw error if user not found", async () => {
    const mocks = mockUserRepo();
    mocks.getUserByEmail.mockResolvedValue(null);
    jest.spyOn(UserRepository.prototype, 'getUserByEmail').mockImplementation(mocks.getUserByEmail);

    await expect(service.loginUser({ email: "a", password: "p" } as any)).rejects.toThrow(HttpError);
  });

  it("should throw error if password invalid", async () => {
    const mocks = mockUserRepo();
    const mockUser: any = { password: "hashed", toObject: () => ({ password: "hashed" }) };
    mocks.getUserByEmail.mockResolvedValue(mockUser);
    (PasswordUtil.compare as jest.Mock).mockResolvedValue(false);

    jest.spyOn(UserRepository.prototype, 'getUserByEmail').mockImplementation(mocks.getUserByEmail);

    await expect(service.loginUser({ email: "a", password: "p" } as any)).rejects.toThrow(HttpError);
  });

  // ================= GET USER BY ID =================
  it("should get user by ID", async () => {
    const mocks = mockUserRepo();
    const mockUser = { _id: "1", email: "a" };
    mocks.getUserById.mockResolvedValue(mockUser as any);

    jest.spyOn(UserRepository.prototype, 'getUserById').mockImplementation(mocks.getUserById);

    const result = await service.getUserById("1");

    expect(mocks.getUserById).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockUser);
  });

  it("should throw error if user not found by ID", async () => {
    const mocks = mockUserRepo();
    mocks.getUserById.mockResolvedValue(null);
    jest.spyOn(UserRepository.prototype, 'getUserById').mockImplementation(mocks.getUserById);

    await expect(service.getUserById("1")).rejects.toThrow(HttpError);
  });

  // ================= UPDATE USER =================
  it("should update user successfully with password", async () => {
    const mocks = mockUserRepo();
    const mockUser = { _id: "1", email: "a", username: "u" };
    mocks.getUserById.mockResolvedValue(mockUser as any);
    mocks.getUserByEmail.mockResolvedValue(null);
    mocks.getUserByUsername.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedNewPass");
    const dto = { email: "b", username: "u2", password: "newpass" };
    mocks.updateOneUser.mockResolvedValue({ ...mockUser, ...dto, password: "hashedNewPass" } as any);

    jest.spyOn(UserRepository.prototype, 'getUserById').mockImplementation(mocks.getUserById);
    jest.spyOn(UserRepository.prototype, 'getUserByEmail').mockImplementation(mocks.getUserByEmail);
    jest.spyOn(UserRepository.prototype, 'getUserByUsername').mockImplementation(mocks.getUserByUsername);
    jest.spyOn(UserRepository.prototype, 'updateOneUser').mockImplementation(mocks.updateOneUser);

    const result = await service.updateUser("1", dto as any);

    expect(mocks.updateOneUser).toHaveBeenCalledWith("1", expect.objectContaining({ password: "hashedNewPass" }));
    expect(result).toEqual({ ...mockUser, ...dto, password: "hashedNewPass" });
  });

  it("should throw error if email already in use", async () => {
    const mocks = mockUserRepo();
    const mockUser = { _id: "1", email: "a", username: "u" };
    mocks.getUserById.mockResolvedValue(mockUser as any);
    mocks.getUserByEmail.mockResolvedValue({ _id: "2" } as any);
    
    jest.spyOn(UserRepository.prototype, 'getUserById').mockImplementation(mocks.getUserById);
    jest.spyOn(UserRepository.prototype, 'getUserByEmail').mockImplementation(mocks.getUserByEmail);

    await expect(service.updateUser("1", { email: "b" } as any)).rejects.toThrow(HttpError);
  });

  it("should throw error if username already in use", async () => {
    const mocks = mockUserRepo();
    const mockUser = { _id: "1", email: "a", username: "u" };
    mocks.getUserById.mockResolvedValue(mockUser as any);
    mocks.getUserByEmail.mockResolvedValue(null);
    mocks.getUserByUsername.mockResolvedValue({ _id: "2" } as any);

    jest.spyOn(UserRepository.prototype, 'getUserById').mockImplementation(mocks.getUserById);
    jest.spyOn(UserRepository.prototype, 'getUserByEmail').mockImplementation(mocks.getUserByEmail);
    jest.spyOn(UserRepository.prototype, 'getUserByUsername').mockImplementation(mocks.getUserByUsername);

    await expect(service.updateUser("1", { username: "u2" } as any)).rejects.toThrow(HttpError);
  });
});
