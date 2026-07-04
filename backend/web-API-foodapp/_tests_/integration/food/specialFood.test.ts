import request from "supertest";
import app from "../../../src/app";


describe("Special Food Routes", () => {

  test("should get best seller foods", async () => {
    const res = await request(app)
      .get("/api/fooditems/best-sellers");

    expect(res.status).toBe(200);
  });

  test("should get discounted foods", async () => {
    const res = await request(app)
      .get("/api/fooditems/discounted");

    expect(res.status).toBe(200);
  });

});
