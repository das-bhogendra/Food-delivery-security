//import jwt from "jsonwebtoken";
//import { JWT_SECRET } from "../config/config";
//import { Request, Response, NextFunction } from "express";
//import { HttpError } from "../errors/http.error";
//import { UserRepository } from "../repository/user.repository";
//import { IUser } from "../models/user.model";

//declare global {
  //namespace Express {
    //interface Request {
      //user?: IUser; // original Mongoose ObjectId type
    //}
  //}
//}

//const userRepository = new UserRepository();

// ---------------- AUTHORIZED MIDDLEWARE ----------------
// export const authorizedMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authHeader = req.headers.authorization;
//     console.log("[AUTH] Auth Header:", authHeader); // 🔹 debug

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       throw new HttpError(401, "Unauthorized: Header malformed");
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) throw new HttpError(401, "Unauthorized: Token missing");

//     let decodedToken: any;
//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET);
//       console.log("[AUTH] Decoded Token:", decodedToken); // 🔹 debug
//     } catch (err) {
//       console.error("[AUTH] JWT Verify Error:", err);
//       throw new HttpError(401, "Unauthorized: Token invalid or expired");
//     }

//     if (!decodedToken?.userId) {
//       throw new HttpError(401, "Unauthorized: Token invalid");
//     }

//     const user = await userRepository.getUserById(decodedToken.userId);
//     console.log("[AUTH] User from DB:", user); // 🔹 debug

//     if (!user) throw new HttpError(401, "Unauthorized: User not found");

//     req.user = user; // attach user to request
//     next();
//   } catch (error: any) {
//     console.error("[AUTH] Middleware Error:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: error.message || "Unauthorized",
//     });
//   }
// };

// ---------------- ADMIN ONLY ----------------
// export const adminOnlyMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log("[ADMIN] Checking user role:", req.user?.role); // 🔹 debug
//   if (req.user?.role === "admin") {
//     return next();
//   }
//   return res.status(403).json({ success: false, message: "Forbidden, Admin only" });
// };

// ---------------- USER OR ADMIN CHECK (OPTIONAL) ----------------
// export const userOrAdmin = (req: Request, res: Response, next: NextFunction) => {
//   console.log("[USER/ADMIN] User present?", !!req.user); // 🔹 debug
//   if (req.user) return next();
//   return res.status(403).json({ success: false, message: "Forbidden" });
// };

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


export const authorizedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.auth_token;

    if (!token) throw new HttpError(401, "You must be logged in as admin");

    
    const decodedToken = jwt.verify(token, JWT_SECRET) as { id?: string; userId?: string; role?: string };

    
    const userId = decodedToken.id || decodedToken.userId;
    
    console.log("[AUTH] UserId from token:", userId); // 🔹 debug
    
    if (!userId)
      throw new HttpError(401, "Unauthorized: Token invalid");

    
    const user = await userRepository.getUserById(userId);
    console.log("[AUTH] User from DB:", user); // 🔹 debug
    if (!user) throw new HttpError(401, "Unauthorized: User not found");

    req.user = user; // attach user to request

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