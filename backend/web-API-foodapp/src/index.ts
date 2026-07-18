import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import authRoutes from "./routes/auth.route";
import adminUserRoutes from "./routes/admin/user.routes";

import categoryRoutes from "./routes/category.routes";
import orderRoutes from "./routes/order.routes";
import foodRoutes from "./routes/food.routes";

import { connectionDatabase } from "./database/mongodb";
import paymentRoutes from "./routes/payment.routes";

import csrfRoutes from "./routes/csrf.route";
import logoutRoutes from "./routes/logout.route";

import {
  doubleCsrfProtection,
} from "./middlewares/csrf.middleware";


dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 5005;

function normalizePort(value: unknown): number {
  if (typeof value === "number") return value;
  const n = Number(value);
  return Number.isFinite(n) ? n : 5005;
}

const effectivePort = normalizePort(process.env.PORT);


app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "http://localhost:3000", "http://localhost:3001", "http://192.168.80.1:3000",],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://192.168.80.1:3000",],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-csrf-token",
    ],
  })
);
// Parse JSON body
app.use(express.json({ limit: "10mb" }));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.use(cookieParser());

app.use("/api/csrf", csrfRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/auth", logoutRoutes);


// Apply CSRF protection AFTER the token route
app.use(doubleCsrfProtection);

// Serve public folder
app.use("/public", express.static(path.join(__dirname, "../public")));

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// =======================
// ROUTES
// =======================



// Admin user routes
app.use("/api/admin/users", adminUserRoutes);

// Category routes
app.use("/api/categories", categoryRoutes);

// Order routes
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
    console.log(" MongoDB connected");

    const server = app.listen(effectivePort, () => {
      console.log(` Server running at http://localhost:${effectivePort}`);
    });

    server.on("error", (err: any) => {
      if (err?.code === "EADDRINUSE") {
        console.error(
          ` Port ${effectivePort} is already in use. Stop the other server or set PORT in .env to a free value.`
        );
      } else {
        console.error(" Server listen error:", err);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error(" Server failed to start:", error);
    process.exit(1);
  }
}

start();





