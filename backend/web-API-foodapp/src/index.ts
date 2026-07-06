import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRoutes from "./routes/auth.route";
import adminUserRoutes from "./routes/admin/user.routes";

import categoryRoutes from "./routes/category.routes";
import orderRoutes from "./routes/order.routes";
import foodRoutes from "./routes/food.routes";

import { connectionDatabase } from "./database/mongodb";
import paymentRoutes from "./routes/payment.routes";


dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 5005;

app.use(helmet());
// Parse JSON body
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
// =======================
// STATIC FILES
// =======================

// Serve public folder
app.use("/public", express.static(path.join(__dirname, "../public")));

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// =======================
// ROUTES
// =======================

// Auth routes
app.use("/api/auth", authRoutes);

// Admin user routes
app.use("/api/admin/users", adminUserRoutes);

// ✅ Category routes
app.use("/api/categories", categoryRoutes);

// ✅ Order routes
app.use("/api/orders", orderRoutes);

app.use("/api/fooditems", foodRoutes);
app.use("/api/payment", paymentRoutes);
// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =======================
// START SERVER
// =======================
async function start() {
  try {
    await connectionDatabase();
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
}

start();


