import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,


  max: 10,

  
  standardHeaders: true,


  legacyHeaders: false,

  // Custom response
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "Too many login requests from this IP. Please try again after 15 minutes.",
    });
  },
});
