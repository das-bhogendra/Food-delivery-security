import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app";
import { connectionDatabase } from "../../../src/database/mongodb";
import { UserModel } from "../../../src/models/user.model";
import { Order } from "../../../src/models/order.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../src/config/config";

describe("Get Order Integration Tests", () => {
  const uniqueEmail = `test_getorder_${Date.now()}@example.com`;

  beforeAll(async () => {
    // Connect to database (reuse if already connected)
    await connectionDatabase();
  }, 30000);

  afterAll(async () => {
    // Don't close the connection here - let Jest handle it
    try {
      const collections = Object.keys(mongoose.connection.collections);
      for (const key of collections) {
        if (mongoose.connection.collections[key]) {
          await mongoose.connection.collections[key].deleteMany({});
        }
      }
    } catch (error) {
      console.error("Error in afterAll:", error);
    }
  }, 30000);

  test("should get order by ID", async () => {
    // Create user inside the test to avoid setup.ts beforeEach clearing it
    const hashedPassword = await bcrypt.hash("Test@1234", 10);
    const user = await UserModel.create({
      email: uniqueEmail,
      password: hashedPassword,
      username: `testuser_${Date.now()}`,
      fullName: "Test User GetOrder",
      role: "user",
    });
    const testUserId = user._id.toString();

    // Generate JWT token
    const token = jwt.sign({ id: testUserId, role: "user" }, JWT_SECRET, { expiresIn: "7d" });

    // Create an order
    const orderObj = new Order({
      userId: new mongoose.Types.ObjectId(testUserId),
      foodItems: [],
      totalAmount: 500,
      status: "pending",
    });
    const savedOrder = await orderObj.save();
    const orderId = savedOrder._id.toString();

    // Make the request
    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Cookie", `auth_token=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("should return 404 for invalid order id", async () => {
    // Create user inside the test to avoid setup.ts beforeEach clearing it
    const hashedPassword = await bcrypt.hash("Test@1234", 10);
    const user = await UserModel.create({
      email: `test_getorder_2_${Date.now()}@example.com`,
      password: hashedPassword,
      username: `testuser_2_${Date.now()}`,
      fullName: "Test User GetOrder 2",
      role: "user",
    });
    const testUserId = user._id.toString();

    // Generate JWT token
    const token = jwt.sign({ id: testUserId, role: "user" }, JWT_SECRET, { expiresIn: "7d" });

    // Make the request with invalid order ID
    const res = await request(app)
      .get("/api/orders/64abc1234567890000000000")
      .set("Cookie", `auth_token=${token}`);

    expect(res.status).toBe(404);
  });
});
