import { Request, Response, NextFunction } from "express";
import { doubleCsrf } from "csrf-csrf";

const cookieName =
  process.env.NODE_ENV === "production"
    ? "__Host-csrf-token"
    : "csrf-token";

const csrf = doubleCsrf({
  getSecret: () => process.env.JWT_SECRET!,

  // Keep CSRF token stable across requests; bind CSRF to auth cookie value.
  getSessionIdentifier: (req) => {
    return req.cookies?.auth_token ?? "";
  },


  cookieName,

  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  },

  ignoredMethods: ["GET", "HEAD", "OPTIONS"],

  getCsrfTokenFromRequest: (req) => {
    return req.headers["x-csrf-token"] as string;
  },
});

export const generateCsrfToken = csrf.generateCsrfToken;

export const doubleCsrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return csrf.doubleCsrfProtection(req, res, next);
};