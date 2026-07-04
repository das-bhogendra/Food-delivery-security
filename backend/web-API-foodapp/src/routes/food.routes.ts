import { Router } from "express";
import {
  authorizedMiddleware,
  adminOnlyMiddleware,
} from "../middlewares/authorization.middleware";
import { foodUpload } from "../middlewares/foodUpload";

import {
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getAllFoodItems,
  getFoodItemsByUser,
  getFoodItemsByType,
  getBestSellerFoodItems,
  getDiscountedFoodItems,
  getFoodItemById, // ✅ correct name
} from "../controllers/food.controller";

const router = Router();

// ================= PUBLIC ROUTES =================

// 🔥 Order matters here

router.get("/", getAllFoodItems);

router.get("/best-sellers", getBestSellerFoodItems);
router.get("/discounted", getDiscountedFoodItems);

// ✅ GET BY ID must be before user/type routes
router.get("/:id", getFoodItemById);

router.get("/user/:userId", getFoodItemsByUser);
router.get("/type/:type", getFoodItemsByType);

// ================= AUTH ROUTES =================

// ✅ Create Food Item
router.post(
  "/",
  authorizedMiddleware,
  adminOnlyMiddleware,
  foodUpload.single("foodPhoto"),
  createFoodItem
);

// ✅ Update Food Item
router.put(
  "/:id",
  authorizedMiddleware,
  adminOnlyMiddleware,
  foodUpload.single("foodPhoto"),
  updateFoodItem
);

// ✅ Delete Food Item
router.delete(
  "/:id",
  authorizedMiddleware,
  adminOnlyMiddleware,
  deleteFoodItem
);

export default router;