import express from "express"
import cors from "cors"
import diseaseCatgorizeRouter from "./routers/disease-categorizes.js"
import diseaseRouter from "./routers/disease.js"
import chatRouter from "./routers/chat.js"
import userNotificationRouter from "./routers/user-notification.js"
import eventRouter from "./routers/event.js"
import reportRouter from "./routers/report.js"
import { globalErrorHandler } from "./middlewares/error-handler.js"
import dotenv from "dotenv"
import { setupSwagger } from "./configs/swagger-config.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.use("/disease-catgorize", diseaseCatgorizeRouter)
app.use("/disease", diseaseRouter)
app.use("/chat", chatRouter)
app.use("/user-notification", userNotificationRouter)
app.use("/event", eventRouter)
app.use("/report", reportRouter)

app.use(globalErrorHandler)

setupSwagger(app)

export default app