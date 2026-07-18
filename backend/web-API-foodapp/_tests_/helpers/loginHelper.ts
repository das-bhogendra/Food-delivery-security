import request from "supertest";
import app from "../../src/app";

/**
 * Login and return the token + cookie header value.
 * Note: application authentication middleware uses cookie `auth_token`, not Authorization header.
 */
export const loginAndGetToken = async (
  email: string,
  password: string
): Promise<{ token: string; cookie: string }> => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  const token = res.body?.token;
  if (!token) {
    throw new Error(`Login failed: ${res.body?.message || "No token returned"}`);
  }

  const setCookie = res.headers["set-cookie"];
  if (!setCookie) {
    throw new Error("Login failed: set-cookie header missing");
  }

  // pick auth_token cookie
  const cookieArr = Array.isArray(setCookie) ? setCookie : [setCookie];
  const authCookie = cookieArr.find((c) => c.includes("auth_token"));
  if (!authCookie) {
    throw new Error("Login failed: auth_token cookie missing");
  }

  // keep only `name=value`
  const cookie = authCookie.split(";")[0];
  return { token, cookie };
};

export const registerAndLogin = async (userData: {
  email: string;
  password: string;
  username: string;
  fullName: string;
}): Promise<{ token: string; userId: string }> => {
  // Register user first
  throw new Error("registerAndLogin not implemented in this test helper");
};

