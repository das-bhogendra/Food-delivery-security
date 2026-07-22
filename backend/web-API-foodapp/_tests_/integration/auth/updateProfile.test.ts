import request from "supertest";
import app from "../../../src/app";
import { UserModel } from "../../../src/models/user.model";
import { connectionDatabase } from "../../../src/database/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

let agent: request.Agent;
const uniqueEmail = `test_updateprofile_${Date.now()}@example.com`;
const uniqueUsername = `testuser_updateprofile_${Date.now()}`;

beforeAll(async () => {
  await connectionDatabase();

  const collections = Object.keys(mongoose.connection.collections);
  for (const key of collections) {
    await mongoose.connection.collections[key].deleteMany({});
  }

  // Create test user directly in DB
  const hashedPassword = await bcrypt.hash("Test@1234", 10);
  const user = await UserModel.create({
    email: uniqueEmail,
    password: hashedPassword,
    username: uniqueUsername,
    fullName: "Test User UpdateProfile",
  });

  // Authenticate using /api/auth/login to obtain auth_token cookie
  agent = request.agent(app);
  const loginRes = await agent.post("/api/auth/login").send({
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

describe("Update Profile Integration Tests", () => {
  test("should update profile with valid token", async () => {
    const res = await agent
      .put("/api/auth/profile")
      .send({
        fullName: "Updated Name",
      });


    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fullName).toBe("Updated Name");
  });

  test("should fail without token", async () => {
    const res = await request(app)
      .put("/api/auth/profile")
      .send({
        fullName: "Updated Name",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("should update email successfully", async () => {
    const res = await agent
      .put("/api/auth/profile")
      .send({
        email: `new_${uniqueEmail}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("should update username successfully", async () => {
    const res = await agent
      .put("/api/auth/profile")
      .send({
        username: `new_${uniqueUsername}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
