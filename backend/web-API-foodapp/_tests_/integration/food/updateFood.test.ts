import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app";
import { connectionDatabase } from "../../../src/database/mongodb";
import { UserModel } from "../../../src/models/user.model";
import { FoodItem } from "../../../src/models/food.model";
import bcrypt from "bcryptjs";

describe("Update Food Item Integration Tests", () => {
  let foodId: string;
  const uniqueEmail = `test_updatefood_${Date.now()}@example.com`;
  const uniqueUsername = `testuser_updatefood_${Date.now()}`;

  beforeAll(async () => {
    // Connect to database
    await connectionDatabase();

    // Clear collections
    const collections = Object.keys(mongoose.connection.collections);
    for (const key of collections) {
      await mongoose.connection.collections[key].deleteMany({});
    }

    // Create test user with admin role
    const hashedPassword = await bcrypt.hash("Test@1234", 10);
    const user = await UserModel.create({
      email: uniqueEmail,
      password: hashedPassword,
      username: uniqueUsername,
      fullName: "Test User UpdateFood",
      role: "admin",
    });

    // Login to get auth cookie (authorizedMiddleware reads req.cookies.auth_token)
    const agent = request.agent(app);
    const loginRes = await agent.post("/api/auth/login").send({
      identifier: uniqueEmail,
      password: "Test@1234",
    });
    (globalThis as any).__foodUpdAuthAgent = agent;

    // Create a food item to update
    const food = await FoodItem.create({
      name: "Original Food",
      price: 200,
      type: "veg",
      description: "Original description",
      addedBy: user._id,
      isAvailable: true,
    });
    foodId = food._id.toString();
  }, 30000);

  test("should update food successfully", async () => {
    const agent = (globalThis as any).__foodUpdAuthAgent as ReturnType<typeof request.agent>;
    const res = await agent
      .put(`/api/fooditems/${foodId}`)
      .send({
        name: "Updated Food",
        price: 300,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

});
