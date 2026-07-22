import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route";
import adminUserRoutes from "./routes/admin/user.routes";
import foodRoutes from "./routes/food.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3003",'http://10.151.153.202:5005'],
}));

app.use(express.json()); // instead of bodyParser
app.use(cookieParser());

// Static
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/public", express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/fooditems", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);


export default app;