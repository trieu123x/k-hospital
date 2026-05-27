import express from "express"
import { getUsersForAdmin, userController } from "../controllers/user.js"
import { authenticate, authorizeAdmin, authorizeRoles } from "../middlewares/authenticate.js"

import { validate } from "../middlewares/validate-handler.js"
import { userSchema } from "../validates/user.js"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

// GET /users: Fetch all users based on roles
router.get("/", authenticate, authorizeAdmin, validate(userSchema.getAll), userController.getAllUsers)

// GET /users/admin: Fetch all users for admin (using same logic as getAllUsers)
router.get("/admin", authenticate, authorizeAdmin, validate(userSchema.getAll), getUsersForAdmin)

// GET /users/count: Count total users
router.get("/count", authenticate, authorizeAdmin, userController.getTotalUsers)

// GET /users/:id: Fetch specific user
router.get("/:id", authenticate, authorizeRoles('ADMIN', 'DOCTOR', 'PATIENT'), validate(userSchema.getById), userController.getUserById)

// PATCH /users/:id: Update specific user profile
router.patch("/:id", authenticate, authorizeRoles('ADMIN', 'DOCTOR', 'PATIENT'), upload.single("avatar"), validate(userSchema.update), userController.updateUser)

// PATCH /users/:id/block: Block or unblock a user
router.patch("/:id/block", authenticate, authorizeAdmin, validate(userSchema.toggleBlock), userController.toggleBlockUser)

// DELETE /users/:id: Delete a user
router.delete("/:id", authenticate, authorizeAdmin, validate(userSchema.getById), userController.deleteUser)

export default router
