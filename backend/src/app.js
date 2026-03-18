import express from "express"
import cors from "cors"
import diseaseCatgorizeRouter from "./routers/disease-categorizes.js"
import diseaseRouter from "./routers/disease.js"
import userNotificationRouter from "./routers/user-notification.js"
import authRouter from "./routers/auth.js"
import userRouter from "./routers/user.js"
import doctorRouter from "./routers/doctor.js"
import appointmentRouter from "./routers/appointment.js"
import { globalErrorHandler } from "./middlewares/error-handler.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRouter)
app.use("/users", userRouter)
app.use("/doctors", doctorRouter)
app.use("/appointments", appointmentRouter)
app.use("/disease-catgorize", diseaseCatgorizeRouter)
app.use("/disease", diseaseRouter)
app.use("/user-notification", userNotificationRouter)

app.use(globalErrorHandler)

export default app