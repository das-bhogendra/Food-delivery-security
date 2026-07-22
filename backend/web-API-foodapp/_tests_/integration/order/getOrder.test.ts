import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app";
import { connectionDatabase } from "../../../src/database/mongodb";
import { UserModel } from "../../../src/models/user.model";
import { Order } from "../../../src/models/order.model";
import bcrypt from "bcryptjs";

describe("Get Order Integration Tests", () => {
  const uniqueEmail = `test_getorder_${Date.now()}@example.com`;

  beforeAll(async () => {
    await connectionDatabase();
  }, 30000);

  afterAll(async () => {
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
    // Create user and login to obtain auth_token cookie
    const hashedPassword = await bcrypt.hash("Test@1234", 10);
    const user = await UserModel.create({
      email: uniqueEmail,
      password: hashedPassword,
      username: `testuser_${Date.now()}`,
      fullName: "Test User GetOrder",
      role: "user",
    });
    const testUserId = user._id.toString();

    // Login to get auth_token cookie
    const loginRes = await request(app).post("/api/auth/login").send({
      identifier: uniqueEmail,
      password: "Test@1234",
    });
    expect(loginRes.status).toBe(200);

    // Extract auth_token cookie from set-cookie header
    const setCookie = loginRes.headers["set-cookie"];
    const cookieArr = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
    const authCookieHeader = cookieArr.find((c: string) => c.includes("auth_token"));
    expect(authCookieHeader).toBeDefined();
    const authCookie = authCookieHeader.split(";")[0];

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
      .set("Cookie", authCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("should return 404 for invalid order id", async () => {
    // Create user and login to obtain auth_token cookie
    const email2 = `test_getorder_2_${Date.now()}@example.com`;
    const hashedPassword = await bcrypt.hash("Test@1234", 10);
    const user = await UserModel.create({
      email: email2,
      password: hashedPassword,
      username: `testuser_2_${Date.now()}`,
      fullName: "Test User GetOrder 2",
      role: "user",
    });
    const testUserId = user._id.toString();

    // Login to get auth_token cookie
    const loginRes = await request(app).post("/api/auth/login").send({
      identifier: email2,
      password: "Test@1234",
    });
    expect(loginRes.status).toBe(200);

    // Extract auth_token cookie from set-cookie header
    const setCookie = loginRes.headers["set-cookie"];
    const cookieArr = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
    const authCookieHeader = cookieArr.find((c: string) => c.includes("auth_token"));
    expect(authCookieHeader).toBeDefined();
    const authCookie = authCookieHeader.split(";")[0];

    // Make the request with invalid order ID
    const res = await request(app)
      .get("/api/orders/64abc1234567890000000000")
      .set("Cookie", authCookie);

    expect(res.status).toBe(404);
  });
});
