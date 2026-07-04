import { Router } from "express";
import {
  createPayment,
  getPaymentByOrder,
  updatePaymentStatus,
} from "../controllers/payment.controller";

import { authorizedMiddleware } from "../middlewares/authorization.middleware";

const router = Router();

router.post("/create", authorizedMiddleware, createPayment);
router.put("/:orderId/status", authorizedMiddleware, updatePaymentStatus);
router.get("/:orderId", authorizedMiddleware, getPaymentByOrder);

export default router;
