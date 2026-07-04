import request from "supertest";
import app from "../../../src/app";
import { UserModel } from "../../../src/models/user.model";

describe("Register Integration Tests", () => {

  const testUser = {
    email: "test@example.com",
    password: "Test@1234",
    confirmPassword: "Test@1234",
    username: "testuser",
    fullName: "Test User",
  };

  beforeEach(async () => {
    await UserModel.deleteMany({ email: testUser.email });
  });

  test("should register successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.message).toBe("Register success");
  });

  test("should fail with duplicate email", async () => {
    await request(app).post("/api/auth/register").send(testUser);

    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

});