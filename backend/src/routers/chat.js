import express from "express"
import { createSession, getSessions, getSessionHistory, saveMessage, updateTopic, deleteSession } from "../controllers/chat.js"
import { validate } from "../middlewares/validate-handler.js"
import { chatSchema } from "../validates/chat.js"
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js"

const router = express.Router()

// Chat routes are protected by authenticate middleware to ensure user-specific data isolation

router.post("/", authenticate, validate({ body: chatSchema.createSession }), createSession)
router.get("/", authenticate, validate({ query: chatSchema.getSessions }), getSessions)

router.get("/:id/messages", authenticate, validate({
    params: chatSchema.params,
    query: chatSchema.getHistory
}), getSessionHistory)

router.post("/:id/messages", authenticate, validate({
    params: chatSchema.params, 
    body: chatSchema.saveMessage
}), saveMessage)

router.post("/:id/topic", authenticate, authorizeRoles("ADMIN"), validate({ params: chatSchema.params }), updateTopic)

router.delete("/:id", authenticate, validate({ params: chatSchema.params }), deleteSession)

export default router
