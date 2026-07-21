import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const verifyRecaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({
      success: false,
      message: "CAPTCHA token is missing",
    });
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );
    console.log("reCAPTCHA response:", response.data);
    if (!response.data.success) {
      return res.status(400).json({
        success: false,
        message: "CAPTCHA verification failed",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "CAPTCHA verification error",
    });
  }
};