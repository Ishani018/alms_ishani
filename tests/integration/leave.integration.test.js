const request = require("supertest");
const app = require("../../app");
const db = require("../../config/db");
const jwt = require("jsonwebtoken");

// Mock database and JWT
jest.mock("../../config/db", () => ({
  query: jest.fn()
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-token")
}));

let token;

beforeAll(async () => {
  // Setup mock database responses
  db.query.mockImplementation((sql, params, callback) => {
    if (sql.includes("INSERT INTO users")) {
      callback(null, { insertId: 1 });
    } else if (sql.includes("SELECT * FROM users WHERE email")) {
      if (params && params[0] === "leave_user@test.com") {
        callback(null, [{ id: 1, email: "leave_user@test.com", password: "123456", role: "employee", name: "Leave User" }]);
      } else {
        callback(null, []);
      }
    } else if (sql.includes("INSERT INTO leaves")) {
      callback(null, { insertId: 1 });
    } else {
      callback(null, []);
    }
  });

  token = "mock-token";
});

afterAll(() => {
  jest.clearAllMocks();
});

describe("LEAVE API – Integration", () => {

  test("POST /leaves → create leave", async () => {
    const res = await request(app)
      .post("/leaves")
      .set("Authorization", `Bearer ${token}`)
      .send({
        employee_id: 1,
        start_date: "2025-02-01",
        end_date: "2025-02-03",
        reason: "sick"
      });

    expect([200, 201]).toContain(res.status);
  });

});
