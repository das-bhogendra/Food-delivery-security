import { Request, Response } from "express";

export class LogoutController {
  async logout(req: Request, res: Response) {
    // Clear auth_token managed by backend only
    res.clearCookie("auth_token", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    // If backend also manages CSRF cookie during logout, clear it too.
    // (CSRF token cookie name used by the current CSRF middleware is "csrf-token".)
    res.clearCookie("csrf-token", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout success",
    });
  }
}

