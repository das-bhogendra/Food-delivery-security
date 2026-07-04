import { Router } from "express";
import { authorizedMiddleware, adminOnlyMiddleware } 
  from "../../middlewares/authorization.middleware";
import { uploads } from "../../middlewares/upload.middleware";
import { UserController } from "../../controllers/admin/user.controller";

const router = Router();
const userController = new UserController();

// CREATE user (with image upload)
router.post(
  "/",
  authorizedMiddleware,
  adminOnlyMiddleware,
  uploads.single("image"),
  userController.createUser
);



router.get(
  "/",
  authorizedMiddleware,
  adminOnlyMiddleware,
  userController.getAllUsers
);

// GET user by id
router.get(
  "/:id",
  authorizedMiddleware,
  adminOnlyMiddleware,
  userController.getUserById
);

// UPDATE user (with optional image)
router.put(
  "/:id",
  authorizedMiddleware,
  adminOnlyMiddleware,
  uploads.single("image"),
  userController.updateUser
);

// DELETE user
router.delete(
  "/:id",
  authorizedMiddleware,
  adminOnlyMiddleware,
  userController.deleteUser
);

export default router;
