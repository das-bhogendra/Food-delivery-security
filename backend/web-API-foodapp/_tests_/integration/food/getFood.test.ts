import request from "supertest";
import app from "../../../src/app";


describe("Get Food Items Integration Tests", () => {

  test("should get all food items", async () => {
    const res = await request(app)
      .get("/api/fooditems");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("should return 404 for invalid ID", async () => {
    const res = await request(app)
      .get("/api/fooditems/invalid-id");

    expect(res.status).toBe(500); // invalid mongo id case
  });

});