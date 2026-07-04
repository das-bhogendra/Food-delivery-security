// controllers/admin/user.controller.ts
import { Request, Response } from "express";
import { z } from "zod";

import { UserRepository } from "../../repository/user.repository";
import { HttpError } from "../../errors/http.error";
import { UserService } from "../../services/user.service";
import { CreateUserDto, UpdateUserDto } from "../../dtos/user.dto";

const userRepo = new UserRepository();
const userService = new UserService();

export class UserController {

  // CREATE USER (Admin)
  createUser = async (req: Request, res: Response) => {
    try {
      const image = req.file?.filename; // multer file if uploaded
      const parsed = CreateUserDto.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, errors: parsed.error });

      const data = { ...parsed.data, profilePicture: image }; // optional image field
      const user = await userService.registerUser(data);

      const { _id, password, ...safeUser } = user.toObject();
      safeUser._id = _id.toString();

      return res.status(201).json({
        success: true,
        data: safeUser,
        message: "User created successfully"
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
    }
  };

  // GET ALL USERS
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await userRepo.getAllUsers();
      const safeUsers = users.map(u => {
        const { _id, password, ...user } = u.toObject();
        user._id = _id.toString();
        return user;
      });

      return res.status(200).json({
        success: true,
        data: safeUsers,
        message: "Users fetched successfully"
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  // GET USER BY ID
  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await userRepo.getUserById(id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const { _id, password, ...safeUser } = user.toObject();
      safeUser._id = _id.toString();

      return res.status(200).json({
        success: true,
        data: safeUser,
        message: "User fetched successfully"
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  // UPDATE USER
  updateUser = async (req: Request, res: Response) => {
    try {
      const parsed = UpdateUserDto.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, errors: parsed.error });

      const { id } = req.params;
      const updatedUser = await userRepo.updateOneUser(id, parsed.data);
      if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

      const { _id, password, ...safeUser } = updatedUser.toObject();
      safeUser._id = _id.toString();

      return res.status(200).json({
        success: true,
        data: safeUser,
        message: "User updated successfully"
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  // DELETE USER
  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await userRepo.deleteOneUser(id);
      if (!deleted) return res.status(404).json({ success: false, message: "User not found" });

      return res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
}