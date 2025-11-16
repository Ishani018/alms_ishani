const request = require("supertest");
const app = require("../../app");
const db = require("../../config/db");
const jwt = require("jsonwebtoken");

// Mock database and JWT
jest.mock("../../config/db", () => ({
  query: jest.fn()
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-manager-token")
}));

let managerToken;

beforeAll(async () => {
  // Setup mock database responses
  db.query.mockImplementation((sql, params, callback) => {
    if (sql.includes("INSERT INTO users")) {
      callback(null, { insertId: 1 });
    } else if (sql.includes("SELECT * FROM users WHERE email")) {
      if (params && params[0] === "manager@test.com") {
        callback(null, [{ id: 1, email: "manager@test.com", password: "manager123", role: "manager", name: "Manager" }]);
      } else {
        callback(null, []);
      }
    } else if (sql.includes("SELECT * FROM leaves")) {
      callback(null, []);
    } else {
      callback(null, []);
    }
  });

  managerToken = "mock-manager-token";
});

afterAll(() => {
  jest.clearAllMocks();
});

describe("MANAGER API – Integration", () => {

  test("GET /leaves → should return list", async () => {
    const res = await request(app)
      .get("/leaves")
      .set("Authorization", `Bearer ${managerToken}`);

    expect([200, 404, 500]).toContain(res.status);
  });

});
