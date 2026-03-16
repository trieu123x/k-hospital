import express from "express"
import cors from "cors"
import diseaseCatgorizeRouter from "./routers/disease-categorizes.js"
import diseaseRouter from "./routers/disease.js"
import userNotificationRouter from "./routers/user-notification.js"
import { globalErrorHandler } from "./middlewares/error-handler.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/disease-catgorize", diseaseCatgorizeRouter)
app.use("/disease", diseaseRouter)
app.use("/user-notification", userNotificationRouter)

app.use(globalErrorHandler)


export default app