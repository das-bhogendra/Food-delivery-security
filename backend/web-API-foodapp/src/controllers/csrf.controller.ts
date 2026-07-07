import { Request, Response } from "express";
import { generateCsrfToken } from "../middlewares/csrf.middleware";

export const getCsrfToken = (req: Request, res: Response) => {
  const token = generateCsrfToken(req, res);

  return res.status(200).json({
    success: true,
    csrfToken: token,
  });
};