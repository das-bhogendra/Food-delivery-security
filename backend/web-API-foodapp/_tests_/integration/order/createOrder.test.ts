import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app";
import { connectionDatabase } from "../../../src/database/mongodb";
import { UserModel } from "../../../src/models/user.model";
import { FoodItem } from "../../../src/models/food.model";
import bcrypt from "bcryptjs";

let agent: request.Agent;
let authCookie: string;
let testFoodId: string;
const uniqueEmail = `test_createorder_${Date.now()}@example.com`;

beforeAll(async () => {
  await connectionDatabase();

  // Avoid clearing all collections because it can disrupt auth/JWT verification across suites.
  // Only clear order-related collections.
  await mongoose.connection.collection('orders').deleteMany({});
  // In case other collections exist in the environment, delete them defensively.
  const safeCollections = ['payments', 'fooditems', 'foods'];
  for (const c of safeCollections) {
    const col = mongoose.connection.collections[c];
    if (col) await col.deleteMany({});
  }


  const hashedPassword = await bcrypt.hash("Test@1234", 10);
  const user = await UserModel.create({
    email: uniqueEmail,
    password: hashedPassword,
    username: `testuser_${Date.now()}`,
    fullName: "Test User CreateOrder",
    role: "user",
  });
  const testUserId = user._id.toString();

  agent = request.agent(app);
  const loginRes = await agent.post("/api/auth/login").send({
    identifier: uniqueEmail,
    password: "Test@1234",
  });

  console.log("[TEST createOrder] login status:", loginRes.status);
  console.log("[TEST createOrder] login set-cookie:", loginRes.headers["set-cookie"]);

  const setCookie = loginRes.headers["set-cookie"];
  const cookieArr = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  const authCookieHeader = cookieArr.find((c) => c.includes("auth_token"));
  if (!authCookieHeader) {
    throw new Error("Login did not set auth_token cookie");
  }
  authCookie = authCookieHeader.split(";")[0];

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
    const whoamiRes = await request(app)
      .get("/api/auth/whoami")
      .set("Cookie", authCookie);

    // Debug guard: verify cookie auth works for the same middleware stack.
    expect(whoamiRes.status).toBe(200);

    const res = await agent
      .post("/api/orders")
      .set("Cookie", authCookie)
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

