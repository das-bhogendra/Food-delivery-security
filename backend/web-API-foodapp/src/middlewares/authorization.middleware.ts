import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http.error";
import { UserRepository } from "../repository/user.repository";
import { IUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const userRepository = new UserRepository();

// ---------------- AUTHORIZED MIDDLEWARE (COOKIE ONLY) ----------------
// The token is stored by AuthController in cookie `auth_token`.
export const authorizedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.auth_token;
    if (!token) throw new HttpError(401, "Unauthorized");

    // AuthController signs: JwtUtil.sign({ id: user._id, role })
    const decodedToken = jwt.verify(token, JWT_SECRET) as {
      id?: string;
      role?: string;
    };

    const userId = decodedToken.id;
    if (!userId) throw new HttpError(401, "Unauthorized: Token invalid");

    const user = await userRepository.getUserById(userId);
    if (!user) throw new HttpError(401, "Unauthorized: User not found");

    req.user = user;
    next();
  } catch (error: any) {
    console.error("[AUTH] Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
};

// ---------------- ADMIN ONLY ----------------
export const adminOnlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "admin") return next();
  return res
    .status(403)
    .json({ success: false, message: "Forbidden, Admin only" });
};

