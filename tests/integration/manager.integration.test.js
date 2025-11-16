const request = require("supertest");
const app = require("../../app");
const db = require("../../config/db");

let managerToken;

beforeAll(async () => {
  db.connect(() => {});

  await request(app).post("/auth/register").send({
    email: "manager@test.com",
    password: "manager123",
    name: "Manager",
    role: "manager"
  });

  const login = await request(app).post("/auth/login").send({
    email: "manager@test.com",
    password: "manager123"
  });

  managerToken = login.body.token;
});

afterAll((done) => db.end(done));

describe("MANAGER API – Integration", () => {

  test("GET /manager/leaves → should return list", async () => {
    const res = await request(app)
      .get("/manager/leaves")
      .set("Authorization", `Bearer ${managerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
