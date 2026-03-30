import express from "express"
import { userController } from "../controllers/user.js"
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js"

import { validate } from "../middlewares/validate-handler.js"
import { userSchema } from "../validates/user.js"

const router = express.Router()

// GET /users: Fetch all users based on roles
router.get("/", authenticate, authorizeRoles('admin', 'doctor'), validate(userSchema.getAll), userController.getAllUsers)

// GET /users/:id: Fetch specific user
router.get("/:id", authenticate, authorizeRoles('admin', 'doctor', 'patient'), validate(userSchema.getById), userController.getUserById)

// PATCH /users/:id: Update specific user profile
router.patch("/:id", authenticate, authorizeRoles('admin', 'doctor', 'patient'), validate(userSchema.update), userController.updateUser)

// PATCH /users/:id/block: Block or unblock a user
router.patch("/:id/block", authenticate, authorizeRoles('admin'), validate(userSchema.toggleBlock), userController.toggleBlockUser)

// DELETE /users/:id: Delete a user
router.delete("/:id", authenticate, authorizeRoles('admin'), validate(userSchema.getById), userController.deleteUser)

export default router
