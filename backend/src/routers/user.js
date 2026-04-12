import express from "express"
import { userController } from "../controllers/user.js"
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js"

import { validate } from "../middlewares/validate-handler.js"
import { userSchema } from "../validates/user.js"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

// // GET /users: Fetch all users based on roles
// router.get("/", authenticate, authorizeRoles('ADMIN'), validate(userSchema.getAll), userController.getAllUsers)
// router.get("/admin", userController.getUsersForAdmin)
// router.get("/count", userController.getTotalUsers)

// // GET /users/:id: Fetch specific user
// router.get("/:id", authenticate, authorizeRoles('ADMIN', 'DOCTOR'), validate(userSchema.getById), userController.getUserById)

// // PATCH /users/:id: Update specific user profile
// router.patch("/:id", authenticate, authorizeRoles('ADMIN', 'DOCTOR', 'PATIENT'), validate(userSchema.update), userController.updateUser)

// // PATCH /users/:id/block: Block or unblock a user
// router.patch("/:id/block", authenticate, authorizeRoles('ADMIN'), validate(userSchema.toggleBlock), userController.toggleBlockUser)

// // DELETE /users/:id: Delete a user
// router.delete("/:id", authenticate, authorizeRoles('ADMIN'), validate(userSchema.getById), userController.deleteUser)

router.get("/", validate(userSchema.getAll), userController.getAllUsers)
router.get("/admin", userController.getUsersForAdmin)
router.get("/count", userController.getTotalUsers)
router.get("/:id", validate(userSchema.getById), userController.getUserById)
router.patch("/:id", upload.single("avatar"), validate(userSchema.update), userController.updateUser)
router.patch("/:id/block", validate(userSchema.toggleBlock), userController.toggleBlockUser)
router.delete("/:id", validate(userSchema.getById), userController.deleteUser)


export default router
