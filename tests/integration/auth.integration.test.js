const request = require("supertest");
const app = require("../../app");
const db = require("../../config/db");

// Mock database connection for integration tests
jest.mock("../../config/db", () => ({
  query: jest.fn()
}));

beforeAll(() => {
  // Setup mock database responses
  db.query.mockImplementation((sql, params, callback) => {
    if (sql.includes("INSERT INTO users")) {
      callback(null, { insertId: 1 });
    } else if (sql.includes("SELECT * FROM users WHERE email")) {
      if (params && params[0] === "int_user@test.com") {
        callback(null, [{ id: 1, email: "int_user@test.com", password: "123456", role: "employee", name: "Integration User" }]);
      } else {
        callback(null, []);
      }
    } else {
      callback(null, []);
    }
  });
});

afterAll(() => {
  jest.clearAllMocks();
});

describe("AUTH API – Integration", () => {

  test("POST /auth/register → 200", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "int_user@test.com",
        password: "123456",
        name: "Integration User",
        role: "employee"
      });

    expect([200, 201]).toContain(res.status);
  });

  test("POST /auth/login → 200 + token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "int_user@test.com",
        password: "123456"
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});
