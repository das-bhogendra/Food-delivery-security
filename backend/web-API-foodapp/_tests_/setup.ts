// _tests_/setup.ts
import mongoose from "mongoose";
import { connectionDatabase } from "../src/database/mongodb";
import { UserModel } from "../src/models/user.model";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../src/config/config";

/**
 * Connect to test DB before running tests
 */
beforeAll(async () => {
  await connectionDatabase();
}, 30000);

/**
 * Clean up test collections before each test
 * This ensures each test runs in isolation
 * NOTE: We don't delete users here because tests create their own users
 * and need them to persist for the test execution
 */
beforeEach(async () => {
  // Only clean up collections that are safe to clean before each test
  // Don't delete users as they may be needed by tests
}, 10000);

/**
 * Close DB connection after all tests
 */
afterAll(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
}, 30000);

/**
 * Helper: generate JWT for test users
 */
export const generateTestToken = (userId: string, role: string = "user") => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "7d" });
};
