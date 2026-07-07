
import { Request, Response } from "express";

import z from "zod";
import { UserService } from "../services/user.service";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "../dtos/user.dto";
import { JwtUtil } from "../utils/jwt.utils";


const userService = new UserService();

export class AuthController {

  async register(req: Request, res: Response) {

    try {
      const parsedData = CreateUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const newUser = await userService.registerUser(parsedData.data);

      const token = JwtUtil.sign({ id: newUser._id, role: newUser.role });

      res.cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // true in production
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });


      const { password, ...safeUser } = newUser.toObject();

      return res.status(201).json({
        success: true,
        data: safeUser,
        token,
        message: "Register success",
      });

    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const parsedData = LoginUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const { token, user } = await userService.loginUser(parsedData.data);

      const { password, ...safeUser } = user;

      res.cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // true in production
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });


      return res.status(200).json({
        success: true,
        data: safeUser,
        token,
        message: "Login success",
      });

    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getProfile(req: Request, res: Response) {
        try {
            const userId = req.user?._id?.toString();
            if (!userId) {
                return res.status(400).json(
                    { success: false, message: "User Id Not found" }
                );
            }
            const user = await userService.getUserById(userId);
            return res.status(200).json(
                { success: true, data: user, message: "User profile fetched successfully" }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

  

  async updateProfile(req:Request, res: Response) {
  try {
    const userId = req.user?._id?.toString();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    const parsedData = UpdateUserDto.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: z.prettifyError(parsedData.error),
      });
    }

    // Handle profile image upload
    if (req.file) {
      parsedData.data.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await userService.updateUser(
      userId,
      parsedData.data
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or update failed",
      });
    }

    const { password, ...safeUser } = updatedUser.toObject();

    return res.status(200).json({
      success: true,
      data: safeUser,
      message: "User profile updated successfully",
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}


}
