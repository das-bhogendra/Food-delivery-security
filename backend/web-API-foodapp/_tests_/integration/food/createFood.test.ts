import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app";
import { connectionDatabase } from "../../../src/database/mongodb";
import { UserModel } from "../../../src/models/user.model";
import bcrypt from "bcryptjs";

describe("Create Food Item Integration Tests", () => {
  let token: string;
  const uniqueEmail = `test_createfood_${Date.now()}@example.com`;
  const uniqueUsername = `testuser_createfood_${Date.now()}`;

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
      fullName: "Test User CreateFood",
      role: "admin",
    });

    // Login to get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: uniqueEmail,
      password: "Test@1234",
    });
    token = loginRes.body.token;
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

  test("should create food item successfully", async () => {
    const res = await request(app)
      .post("/api/fooditems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Pizza",
        price: 500,
        type: "veg",
        description: "Delicious pizza"
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Food item created successfully");
  });

  test("should fail without token", async () => {
    const res = await request(app)
      .post("/api/fooditems")
      .send({
        name: "Burger",
        price: 300,
        type: "veg"
      });

    expect(res.status).toBe(401);
  });

});
