import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import diseaseCatgorizeRouter from "./routers/disease-categorizes.js";
import diseaseRouter from "./routers/disease.js";
import chatRouter from "./routers/chat.js";
import userNotificationRouter from "./routers/user-notification.js";
import authRouter from "./routers/auth.js";
import userRouter from "./routers/user.js";
import doctorRouter from "./routers/doctor.js";
import appointmentRouter from "./routers/appointment.js";
import specialtyRouter from "./routers/specialty.js";
import medicineRouter from "./routers/medicine.js";
import newsRouter from "./routers/news.js";
import eventRouter from "./routers/event.js";
import reportRouter from "./routers/report.js";
import degreeRouter from "./routers/degree.js";
import medicineTypeRouter from "./routers/medicine-type.js";
import { globalErrorHandler } from "./middlewares/error-handler.js";
import dotenv from "dotenv";
import { setupSwagger } from "./configs/swagger-config.js";
import { setupDeleteCronJob } from "./helpers/delete-helper.js"; // tạm thời chưa chạy

dotenv.config();
const app = express();

// Tin tưởng Proxy (Railway dùng Proxy để xử lý HTTPS)
app.set('trust proxy', 1);

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        "http://localhost:3000",
        "https://k-hospital-git-dev-trieu123xs-projects.vercel.app",
        "https://k-hospital-production.up.railway.app"
      ];
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MediCare Backend is alive!' });
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/doctors", doctorRouter);
app.use("/appointments", appointmentRouter);
app.use("/specialties", specialtyRouter);
app.use("/disease-catgorize", diseaseCatgorizeRouter);
app.use("/disease", diseaseRouter);
app.use("/chat", chatRouter);
app.use("/user-notification", userNotificationRouter);
app.use("/medicines", medicineRouter);
app.use("/news", newsRouter);
app.use("/event", eventRouter);
app.use("/report", reportRouter);
app.use("/degrees", degreeRouter);
app.use("/medicine-types", medicineTypeRouter);

app.use(globalErrorHandler);

setupSwagger(app);

export default app;
