import { Router } from "express";
import { generateCsrfToken } from "../middlewares/csrf.middleware";

const router = Router();

router.get("/", (req, res) => {
  const token = generateCsrfToken(req, res);

  res.json({
    success: true,
    csrfToken: token,
  });
});

export default router;