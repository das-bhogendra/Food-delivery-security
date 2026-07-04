import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app";
import { connectionDatabase } from "../../../src/database/mongodb";
import { UserModel } from "../../../src/models/user.model";
import { FoodItem } from "../../../src/models/food.model";
import bcrypt from "bcryptjs";

let token: string;
let testFoodId: string;
let testUserId: string;
const uniqueEmail = `test_createorder_${Date.now()}@example.com`;

beforeAll(async () => {
  // 1️⃣ Connect to test database
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
    fullName: "Test User CreateOrder",
    role: "user",
  });
  testUserId = user._id.toString();

  // 4️⃣ Login user to get JWT token
  const loginRes = await request(app).post("/api/auth/login").send({
    email: uniqueEmail,
    password: "Test@1234",
  });
  token = loginRes.body.token;

  // 5️⃣ Create a test food item
  const food = await FoodItem.create({
    name: "Test Pizza",
    description: "Delicious test pizza",
    type: "veg",
    price: 500,
    imageUrl: "http://example.com/food.jpg",
    addedBy: testUserId,
    isAvailable: true,
    isBestSeller: false,
    isDiscounted: false,
  });
  testFoodId = food._id.toString();
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

describe("Create Order Integration Tests", () => {
  test("should create order successfully", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        foodItems: [testFoodId],
        status: "pending",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Order created successfully");
    expect(res.body.data.foodItems.length).toBe(1);
  });

  test("should fail without token", async () => {
    const res = await request(app).post("/api/orders").send({
      foodItems: [{ foodId: testFoodId, quantity: 1 }],
      totalAmount: 500,
      status: "pending",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
