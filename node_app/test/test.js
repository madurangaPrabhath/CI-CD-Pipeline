const assert = require("node:assert");
const request = require("supertest");
const app = require("../index");

describe("API routes", () => {
  describe("GET /", () => {
    it("responds with the welcome message", async () => {
      const res = await request(app).get("/");
      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(res.body, { response: "Hello, Welcome to World" });
    });
  });

  describe("GET /will", () => {
    it("responds with 'Hello World'", async () => {
      const res = await request(app).get("/will");
      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(res.body, { response: "Hello World" });
    });
  });

  describe("GET /ready", () => {
    it("responds with 'Great!, It works!'", async () => {
      const res = await request(app).get("/ready");
      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(res.body, { response: "Great!, It works!" });
    });
  });

  describe("GET /unknown", () => {
    it("returns a 404 for unknown routes", async () => {
      const res = await request(app).get("/does-not-exist");
      assert.strictEqual(res.status, 404);
      assert.deepStrictEqual(res.body, { error: "Not Found" });
    });
  });
});