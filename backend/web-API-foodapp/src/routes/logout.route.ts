import { Router } from "express";
import { LogoutController } from "../controllers/logout.controller";

const router = Router();
const logoutController = new LogoutController();

router.post("/logout", logoutController.logout);

export default router;

