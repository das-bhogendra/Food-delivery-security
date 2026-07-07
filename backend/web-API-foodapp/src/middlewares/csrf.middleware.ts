import { doubleCsrf } from "csrf-csrf";

const csrf = doubleCsrf({
  getSecret: () => process.env.JWT_SECRET!,

  getSessionIdentifier: (req) => {
    return req.user?._id?.toString() ?? "";
  },

  cookieName: "__Host-csrf-token",

  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },

  ignoredMethods: ["GET", "HEAD", "OPTIONS"],

  getCsrfTokenFromRequest: (req) =>
    req.headers["x-csrf-token"] as string,
});

export const generateCsrfToken = csrf.generateCsrfToken;
export const doubleCsrfProtection = csrf.doubleCsrfProtection;