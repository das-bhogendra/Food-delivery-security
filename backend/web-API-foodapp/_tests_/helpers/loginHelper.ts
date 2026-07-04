import request from "supertest";
import app from "../../src/app";

export const loginAndGetToken = async (email: string, password: string): Promise<string> => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  if (!res.body.token) {
    throw new Error(`Login failed: ${res.body.message || 'No token returned'}`);
  }

  return res.body.token;
};

export const registerAndLogin = async (userData: {
  email: string;
  password: string;
  username: string;
  fullName: string;
}): Promise<{ token: string; userId: string }> => {
  // Register user first
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send(userData);

  if (!registerRes.body.token) {
    throw new Error(`Registration failed: ${registerRes.body.message || 'No token returned'}`);
  }

  return {
    token: registerRes.body.token,
    userId: registerRes.body.data._id
  };
};
