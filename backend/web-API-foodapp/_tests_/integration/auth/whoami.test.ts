import request from "supertest";
import app from "../../../src/app";
import { UserModel } from "../../../src/models/user.model";
import { connectionDatabase } from "../../../src/database/mongodb";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../src/config/config";

let token: string;
const uniqueEmail = `test_whoami_${Date.now()}@example.com`;
const uniqueUsername = `testuser_whoami_${Date.now()}`;

beforeAll(async () => {
  // Connect to DB
  await connectionDatabase();

  // Clear test users
  const collections = Object.keys(mongoose.connection.collections);
  for (const key of collections) {
    await mongoose.connection.collections[key].deleteMany({});
  }

  // Create test user directly in DB
  const user = await UserModel.create({
    email: uniqueEmail,
    password: "Test@1234",
    username: uniqueUsername,
    fullName: "Test User WhoAmI",
  });

  // Generate JWT token for middleware
  token = jwt.sign({ id: user._id, role: "user" }, JWT_SECRET, { expiresIn: "7d" });
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const collections = Object.keys(mongoose.connection.collections);
      for (const key of collections) {
        await mongoose.connection.collections[key].deleteMany({});
      }
    }
  } catch (error) {
    console.error("Error in afterAll:", error);
  }
});

describe("WhoAmI Integration Tests", () => {
  test("should return profile with valid token", async () => {
    const res = await request(app)
      .get("/api/auth/whoami")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(uniqueEmail);
  });

  test("should fail without token", async () => {
    const res = await request(app).get("/api/auth/whoami");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
