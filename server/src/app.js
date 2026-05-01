import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { env } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payment", paymentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
