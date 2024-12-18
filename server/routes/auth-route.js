import express from "express";
import AuthController from "../controllers/auth-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password/:token", AuthController.resetPassword);
router.get("/check-auth", authMiddleware, AuthController.checkAuth);

export default router;
