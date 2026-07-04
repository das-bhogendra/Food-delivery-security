import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app";
import { connectionDatabase } from "../../../src/database/mongodb";
import { UserModel } from "../../../src/models/user.model";
import { FoodItem } from "../../../src/models/food.model";
import { Order } from "../../../src/models/order.model";
import bcrypt from "bcryptjs";

let token: string;
let testUserId: string;
let testFoodId: string;
let orderId: string;
const uniqueEmail = `test_updateorder_${Date.now()}@example.com`;

beforeAll(async () => {
  // 1️⃣ Connect to DB
  await connectionDatabase();

  // 2️⃣ Clear existing collections
  const collections = Object.keys(mongoose.connection.collections);
  for (const key of collections) {
    await mongoose.connection.collections[key].deleteMany({});
  }

  // 3️⃣ Create test user with unique email
  const hashedPassword = await bcrypt.hash("Test@1234", 10);
  const user = await UserModel.create({
    email: uniqueEmail,
    password: hashedPassword,
    username: `testuser_${Date.now()}`,
    fullName: "Test User UpdateOrder",
    role: "user",
  });
  testUserId = user._id.toString();

  // 4️⃣ Login user to get token
  const loginRes = await request(app).post("/api/auth/login").send({
    email: uniqueEmail,
    password: "Test@1234",
  });
  token = loginRes.body.token;

  // 5️⃣ Seed a food item
  const food = await FoodItem.create({
    name: "Test Burger",
    description: "Delicious test burger",
    type: "veg",
    price: 300,
    addedBy: testUserId,
    isAvailable: true,
  });
  testFoodId = food._id.toString();

  // 6️⃣ Create an order to update
  const orderObj = new Order({
    userId: new mongoose.Types.ObjectId(testUserId),
    foodItems: [{ 
      foodId: new mongoose.Types.ObjectId(testFoodId), 
      name: "Test Burger", 
      price: 300, 
      quantity: 2 
    }],
    totalAmount: 600,
    status: "pending",
  });
  const savedOrder = await orderObj.save();
  orderId = savedOrder._id.toString();
}, 30000);

afterAll(async () => {
  try {
    const collections = Object.keys(mongoose.connection.collections);
    for (const key of collections) {
      await mongoose.connection.collections[key].deleteMany({});
    }
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error("Error in afterAll:", error);
  }
}, 30000);

describe("Update Order Integration Tests", () => {
  test("should update order status successfully", async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "confirmed" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Order updated successfully");
    expect(res.body.data.status).toBe("confirmed");
  });

  test("should fail with invalid status", async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "invalid_status" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("should fail without token", async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .send({ status: "confirmed" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
