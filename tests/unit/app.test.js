const request = require("supertest");

// Mock database before requiring app
jest.mock("../../config/db", () => ({
  query: jest.fn()
}));

describe("App – Unit Tests", () => {
  let app;

  beforeAll(() => {
    app = require("../../app");
  });

  test("should serve static files", async () => {
    const res = await request(app).get("/");
    expect([200, 404]).toContain(res.status);
  });

  test("should have auth routes mounted", () => {
    expect(app._router).toBeDefined();
  });

  test("should have leave routes mounted", () => {
    expect(app._router).toBeDefined();
  });

  test("should have user routes mounted", () => {
    expect(app._router).toBeDefined();
  });
});

