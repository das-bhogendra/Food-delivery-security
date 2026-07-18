import request from "supertest";
import app from "../../../src/app";
import { UserModel } from "../../../src/models/user.model";
import { connectionDatabase } from "../../../src/database/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

let tokenCookieAgent: request.Agent;
const uniqueEmail = `test_whoami_${Date.now()}@example.com`;
const uniqueUsername = `testuser_whoami_${Date.now()}`;

beforeAll(async () => {
  await connectionDatabase();

  const collections = Object.keys(mongoose.connection.collections);
  for (const key of collections) {
    await mongoose.connection.collections[key].deleteMany({});
  }

  const hashedPassword = await bcrypt.hash("Test@1234", 10);
  await UserModel.create({
    email: uniqueEmail,
    password: hashedPassword,
    username: uniqueUsername,
    fullName: "Test User WhoAmI",
    role: "user",
  });

  // Use cookie returned by /api/auth/login (authorizedMiddleware reads req.cookies.auth_token)
  tokenCookieAgent = request.agent(app);
  const loginRes = await tokenCookieAgent.post("/api/auth/login").send({
    identifier: uniqueEmail,
    password: "Test@1234",
  });

  expect(loginRes.status).toBe(200);
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
    const res = await tokenCookieAgent.get("/api/auth/whoami");

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

