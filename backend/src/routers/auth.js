import express from "express";
import multer from "multer";
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  registerDoctor,
  refreshToken
} from "../controllers/auth.js";
import { validate } from "../middlewares/validate-handler.js";
import { authSchema } from "../validates/auth.js";
import { authenticate, authorizeAdmin } from "../middlewares/authenticate.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ================================
// PUBLIC ROUTES (Không cần Token)
// ================================
router.post("/register", validate({ body: authSchema.register }), register);
router.post("/login", validate({ body: authSchema.login }), login);
router.post("/forgot-password", validate({ body: authSchema.forgotPassword }), forgotPassword);
router.post("/reset-password", validate({ body: authSchema.resetPassword }), resetPassword);

router.post("/refresh-token", refreshToken);


// ================================
// PROTECTED ROUTES (Cần Token)
// ================================
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);


// ================================
// ADMIN ROUTES 
// ================================
router.post(
  "/register-doctor",
  authenticate,
  authorizeAdmin,
  upload.single("avatar"),
  validate({ body: authSchema.registerDoctor }),
  registerDoctor
);

export default router;