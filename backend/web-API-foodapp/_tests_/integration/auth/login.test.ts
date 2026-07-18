import request from "supertest";

import app from "../../../src/app";
import { UserModel } from "../../../src/models/user.model";
import bcrypt from "bcryptjs";

describe("Login Integration Tests", () => {
  const testPassword = "Test@1234";
  const testUsername = `testuser_login_${Date.now()}`;
  const testFullName = "Test User";
  const testEmail = `test_login_${Date.now()}@example.com`;

  beforeEach(async () => {
    await UserModel.deleteMany({ email: testEmail });

    const hashedPassword = await bcrypt.hash(testPassword, 10);
    await UserModel.create({
      email: testEmail,
      password: hashedPassword,
      username: testUsername,
      fullName: testFullName,
      role: "user",
    });
  });

  afterEach(async () => {
    await UserModel.deleteMany({ email: testEmail });
  });

  test("should login successfully", async () => {
    // Use an agent so cookie state is preserved and rate-limit headers are handled consistently.
    const agent = request.agent(app);
    const res = await agent.post("/api/auth/login").send({
      identifier: testEmail,
      password: testPassword,
    });


    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.message).toBe("Login success");
    expect(res.body.data).toBeDefined();

    // ensure cookie was set
    const setCookie = res.headers["set-cookie"];
    if (Array.isArray(setCookie)) {
      expect(setCookie.join(";")).toContain("auth_token");
    } else if (typeof setCookie === "string") {
      expect(setCookie).toContain("auth_token");
    } else {
      throw new Error("set-cookie header missing");
    }
  });

  test("should fail with invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      identifier: testEmail,
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("should fail with non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: `nonexistent_${Date.now()}@example.com`,
        password: testPassword,
      });

    // Depending on rate-limit state, this can be 401 (auth failure) or 429 (too many requests).
    expect([401, 429]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });
});



