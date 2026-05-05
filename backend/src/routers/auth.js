import express from "express"
import { register, login, logout, getMe, forgotPassword, resetPassword, verifyRegister, registerDoctor, refreshToken } from "../controllers/auth.js"
import { validate } from "../middlewares/validate-handler.js"
import { authSchema } from "../validates/auth.js"
import { authenticate } from "../middlewares/authenticate.js"

const router = express.Router()

import multer from "multer"
const upload = multer({ storage: multer.memoryStorage() })

// Public routes
router.post("/register", validate({ body: authSchema.register }), register)
router.post("/verify-register", validate({ body: authSchema.verifyRegister }), verifyRegister)
router.post("/login", validate({ body: authSchema.login }), login)
router.post("/forgot-password", validate({ body: authSchema.forgotPassword }), forgotPassword)
router.post("/reset-password", validate({ body: authSchema.resetPassword }), resetPassword)
router.post("/register-doctor", upload.single("avatar"), validate({ body: authSchema.registerDoctor }), registerDoctor)
router.post("/refresh-token", refreshToken)

// Protected routes
router.post("/logout", authenticate, logout)
router.get("/me", authenticate, getMe)

export default router
