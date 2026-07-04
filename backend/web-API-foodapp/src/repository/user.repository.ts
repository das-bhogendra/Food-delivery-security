import { IUser, UserModel } from "../models/user.model";

export interface IUserRepository {
  createUser(data: Partial<IUser>): Promise<IUser>;
  getUserByUsername(username: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;

  // 🔐 AUTH ONLY
  getAuthUser(identifier: string): Promise<IUser | null>;

  getUserById(id: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  updateOneUser(id: string, data: Partial<IUser>): Promise<IUser | null>;
  deleteOneUser(id: string): Promise<boolean>;
}


export class UserRepository implements IUserRepository {

  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(data);
    return await user.save();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await UserModel.findOne({ username });
  }

  /**
   * AUTH QUERY
   * - Allows login via username OR email
   * - Includes password for bcrypt comparison
   */
  async getAuthUser(identifier: string): Promise<IUser | null> {
    return await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
  }

  async getUserById(id: string): Promise<IUser | null> {
    // Ensure we're using a valid ObjectId format
    console.log("[UserRepository] getUserById called with:", id);
    console.log("[UserRepository] Type of id:", typeof id);
    
    if (!id || typeof id !== 'string') {
      console.log("[UserRepository] Invalid ID - returning null");
      return null;
    }
    try {
      const user = await UserModel.findById(id);
      console.log("[UserRepository] User found:", user ? user._id : null);
      return user;
    } catch (error: any) {
      console.error("[UserRepository] Error finding user by ID:", error.message);
      return null;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    return await UserModel.find();
  }

  async updateOneUser(
    id: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteOneUser(id: string): Promise<boolean> {
    const user = await UserModel.findByIdAndDelete(id);
    return user !== null;
  }
}
