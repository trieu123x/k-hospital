import express from "express"
import { register, login, logout, getMe } from "../controllers/auth.js"
import { authenticate } from "../middlewares/authenticate.js"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.post("/logout", authenticate, logout)
router.get("/me", authenticate, getMe)

export default router
