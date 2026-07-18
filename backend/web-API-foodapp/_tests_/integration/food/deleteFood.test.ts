import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app";
import { connectionDatabase } from "../../../src/database/mongodb";
import { UserModel } from "../../../src/models/user.model";
import { FoodItem } from "../../../src/models/food.model";
import bcrypt from "bcryptjs";

describe("Delete Food Item Integration Tests", () => {

  let token: string;
  let foodId: string;
  const uniqueEmail = `test_deletefood_${Date.now()}@example.com`;
  const uniqueUsername = `testuser_deletefood_${Date.now()}`;

  beforeAll(async () => {
    // Connect to database
    await connectionDatabase();

    // Clear collections
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
      fullName: "Test User DeleteFood",
      role: "admin",
    });

    // Login to get auth cookie (authorizedMiddleware reads req.cookies.auth_token)
    const agent = request.agent(app);
    (globalThis as any).__foodDelAuthAgent = agent;

    const loginRes = await agent.post("/api/auth/login").send({
      identifier: uniqueEmail,
      password: "Test@1234",
    });
    expect(loginRes.status).toBe(200);

    // Sanity: ensure auth_token cookie was issued
    const setCookie = loginRes.headers["set-cookie"];
    const cookieArr = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
    const authCookie = cookieArr.find((c) => c.includes("auth_token"));
    expect(authCookie).toBeDefined();

    // Keep token variable only for debugging; auth relies on cookie
    token = loginRes.body.token;

    // Create a food item to delete


    const food = await FoodItem.create({
      name: "Temp Food",
      price: 200,
      type: "veg",
      addedBy: user._id,
      isAvailable: true,
    });
    foodId = food._id.toString();
  }, 30000);

  test("should delete food successfully", async () => {
    const agent = (globalThis as any).__foodDelAuthAgent as ReturnType<typeof request.agent>;

    const res = await agent
      .delete(`/api/fooditems/${foodId}`);
    expect(res.status).toBe(200);

    expect(res.body.message).toBe("Food item deleted successfully");
  });

});
