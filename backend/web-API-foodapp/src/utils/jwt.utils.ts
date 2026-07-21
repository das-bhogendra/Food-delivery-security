import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

export class JwtUtil {

  static sign(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "60d",
    });
  }

  static verify<T>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
  }
}
