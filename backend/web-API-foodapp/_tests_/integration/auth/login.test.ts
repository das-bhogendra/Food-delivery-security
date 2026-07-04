import request from "supertest";
import app from "../../../src/app";
import { UserModel } from "../../../src/models/user.model";
import bcrypt from "bcryptjs";

describe("Login Integration Tests", () => {
  const testEmail = "test@example.com";
  const testPassword = "Test@1234";
  const testUsername = "testuser";
  const testFullName = "Test User";

  beforeEach(async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    await UserModel.create({
      email: testEmail,
      password: hashedPassword,
      username: testUsername,
      fullName: testFullName,
    });
  });

  afterEach(async () => {
    await UserModel.deleteMany({ email: testEmail });
  });

  test("should login successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.message).toBe("Login success");
    expect(res.body.data).toBeDefined();
  });

  test("should fail with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("should fail with non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nonexistent@example.com",
        password: testPassword,
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
