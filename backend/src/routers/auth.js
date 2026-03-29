import express from "express"
import { register, login, logout, getMe, forgotPassword, resetPassword } from "../controllers/auth.js"
import { authenticate } from "../middlewares/authenticate.js"
import { validate } from "../middlewares/validate-handler.js"
import { authSchema } from "../validates/auth.js"

const router = express.Router()

// Public routes
router.post("/register", validate({ body: authSchema.register }), register)
router.post("/login", validate({ body: authSchema.login }), login)
router.post("/forgot-password", validate({ body: authSchema.forgotPassword }), forgotPassword)
router.post("/reset-password", validate({ body: authSchema.resetPassword }), resetPassword)

// Protected routes
router.post("/logout", authenticate, logout)
router.get("/me", authenticate, getMe)

export default router
