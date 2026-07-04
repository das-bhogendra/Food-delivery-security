import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app";
import { connectionDatabase } from "../../../src/database/mongodb";
import { UserModel } from "../../../src/models/user.model";
import { Order } from "../../../src/models/order.model";
import bcrypt from "bcryptjs";

describe("Delete Order Integration Tests", () => {
  let token: string;
  let testUserId: string;
  let orderId: string;
  const uniqueEmail = `test_deleteorder_${Date.now()}@example.com`;
  const uniqueUsername = `testuser_deleteorder_${Date.now()}`;

  beforeAll(async () => {
    // Connect to database
    await connectionDatabase();

    // Clear collections - but DON'T delete the test user after
    const collections = Object.keys(mongoose.connection.collections);
    for (const key of collections) {
      await mongoose.connection.collections[key].deleteMany({});
    }

    // Create test user with unique email
    const hashedPassword = await bcrypt.hash("Test@1234", 10);
    const user = await UserModel.create({
      email: uniqueEmail,
      password: hashedPassword,
      username: uniqueUsername,
      fullName: "Test User DeleteOrder",
      role: "user",
    });
    testUserId = user._id.toString();

    // Login to get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: uniqueEmail,
      password: "Test@1234",
    });
    token = loginRes.body.token;

    // Create an order
    const orderObj = new Order({
      userId: new mongoose.Types.ObjectId(testUserId),
      foodItems: [],
      totalAmount: 700,
      status: "pending",
    });
    const savedOrder = await orderObj.save();
    orderId = savedOrder._id.toString();
  }, 30000);

  afterAll(async () => {
    try {
      // Only delete orders, keep users for other tests
      if (mongoose.connection.readyState === 1) {
        await Order.deleteMany({});
      }
    } catch (error) {
      console.error("Error in afterAll:", error);
    }
  }, 30000);

  test("should delete order successfully", async () => {
    const res = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Order deleted successfully");
  });
});
