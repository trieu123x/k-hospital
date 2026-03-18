import express from "express"
import { userController } from "../controllers/user.js"
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js"

const router = express.Router()

// GET /users: Fetch all users based on roles
// Accessible by admin and doctor
router.get("/", authenticate, authorizeRoles('admin', 'doctor'), userController.getAllUsers)

// GET /users/:id: Fetch specific user
// Accessible by all authenticated roles (service validates data visibility)
router.get("/:id", authenticate, authorizeRoles('admin', 'doctor', 'patient'), userController.getUserById)

// PATCH /users/:id: Update specific user profile
// Accessible by all roles, allowed only for own profile
router.patch("/:id", authenticate, authorizeRoles('admin', 'doctor', 'patient'), userController.updateUser)

export default router
