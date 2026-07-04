import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrder,
} from "../controllers/order.controller";

import { authorizedMiddleware } from "../middlewares/authorization.middleware";

const router = Router();

router.post("/", authorizedMiddleware, createOrder);
router.get("/", authorizedMiddleware, getAllOrders);
router.get("/:id", authorizedMiddleware, getOrderById);
router.get("/user/:userId", authorizedMiddleware, getOrdersByUser);
router.put("/:id", authorizedMiddleware, updateOrder);
router.delete("/:id", authorizedMiddleware, deleteOrder);

export default router;
