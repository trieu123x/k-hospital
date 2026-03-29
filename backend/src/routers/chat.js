import express from "express"
import { createSession, getSessions, getSessionHistory, saveMessage, updateTopic } from "../controllers/chat.js"
import { validate } from "../middlewares/validate-handler.js"
import { chatSchema } from "../validates/chat.js"

const router = express.Router()

router.post("/", validate({ body: chatSchema.createSession }), createSession)
router.get("/", validate({ query: chatSchema.getSessions }), getSessions)

router.get("/:id/messages", validate({
    params: chatSchema.params,
    query: chatSchema.getHistory
}), getSessionHistory)

router.post("/:id/messages", validate({
    params: chatSchema.params,
    body: chatSchema.saveMessage
}), saveMessage)

router.post("/:id/topic", validate({ params: chatSchema.params }), updateTopic)

export default router
