import express from "express"
import { register, login, logout, getMe, forgotPassword, resetPassword } from "../controllers/auth.js"
import { authenticate } from "../middlewares/authenticate.js"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

// Protected routes
router.post("/logout", authenticate, logout)
router.get("/me", authenticate, getMe)

export default router
