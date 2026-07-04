import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoriesByUser,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller";

import { authorizedMiddleware } from "../middlewares/authorization.middleware";

const router = Router();

router.post("/", authorizedMiddleware, createCategory);
router.get("/", getAllCategories);
router.get("/user/:userId", getCategoriesByUser);
router.get("/:id", getCategoryById);

router.put("/:id", authorizedMiddleware, updateCategory);
router.delete("/:id", authorizedMiddleware, deleteCategory);

export default router;
