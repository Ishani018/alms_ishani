const request = require("supertest");
const db = require("../../config/db");

// Mock database and JWT before requiring app
jest.mock("../../config/db", () => ({
  query: jest.fn()
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-e2e-token")
}));

const app = require("../../app");

beforeAll(() => {
  // Setup mock database responses
  const registeredUsers = new Set();
  
  db.query.mockImplementation((sql, params, callback) => {
    if (sql.includes("INSERT INTO users")) {
      const email = params[1]; // email is second param
      registeredUsers.add(email);
      callback(null, { insertId: 1 });
    } else if (sql.includes("SELECT * FROM users WHERE email")) {
      if (params && params[0] === "e2euser@test.com") {
        callback(null, [{ id: 1, email: "e2euser@test.com", password: "e2epass", role: "employee", name: "E2E Test" }]);
      } else {
        callback(null, []);
      }
    } else if (sql.includes("INSERT INTO leaves")) {
      callback(null, { insertId: 1 });
    } else {
      callback(null, []);
    }
  });
});

afterAll(() => {
  jest.clearAllMocks();
});

describe("FULL E2E FLOW – Register → Login → Apply Leave", () => {
  let token;

  test("Register new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "e2euser@test.com",
        password: "e2epass",
        name: "E2E Test",
        role: "employee"
      });

    expect([200, 201]).toContain(res.status);
  });

  test("Login user", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "e2euser@test.com",
        password: "e2epass"
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test("Apply Leave (authenticated)", async () => {
    const res = await request(app)
      .post("/leaves")
      .set("Authorization", `Bearer ${token}`)
      .send({
        employee_id: 1,
        start_date: "2025-02-10",
        end_date: "2025-02-12",
        reason: "fever"
      });

    expect([200, 201]).toContain(res.status);
  });
});
