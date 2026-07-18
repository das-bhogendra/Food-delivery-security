import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app";
import { connectionDatabase } from "../../../src/database/mongodb";
import { UserModel } from "../../../src/models/user.model";
import bcrypt from "bcryptjs";
import { loginAndGetToken } from "../../helpers/loginHelper";

describe("Create Food Item Integration Tests", () => {


  let agent: request.Agent;
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

    // Login to set auth_token cookie (authorizedMiddleware reads req.cookies.auth_token)
    agent = request.agent(app);
    const loginRes = await agent.post("/api/auth/login").send({
      identifier: uniqueEmail,
      password: "Test@1234",
    });

    token = loginRes.body?.token;
    if (!token) {
      throw new Error(`Login failed: ${loginRes.body?.message || "No token"}`);
    }

    // Use the agent's internal cookie jar; cookie-parser should read it via req.cookies.auth_token.
    // We still keep the `token` value for debugging, but protected routes rely on cookie.
    const setCookie = loginRes.headers['set-cookie'];
    if (!setCookie) {
      throw new Error('Login did not set auth_token cookie');
    }
    (agent as any).__authCookie = setCookie;







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
    // Ensure we reuse the auth_token cookie for protected endpoints.
    // (Some servers/tests may not automatically attach it after login.)
    if (Array.isArray((agent as any).jar?.cookies)) {
      // no-op: best-effort
    }

    console.log("[TEST] cookies present before POST:", (agent as any)?.jar?.getCookies?.({ path: "/" }) || (agent as any)?.jar);

    const res = await agent
      .post("/api/fooditems")
      .send({
        name: "Pizza",
        price: 500,
        type: "veg",
        description: "Delicious pizza",
        isAvailable: true,
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
        type: "veg",
        description: "No auth burger",
        isAvailable: true,
      });


    expect(res.status).toBe(401);
  });


});
