const request = require("supertest");
const app = require("../../app");
const db = require("../../config/db");

beforeAll((done) => db.connect(done));
afterAll((done) => db.end(done));

describe("AUTH API – Integration", () => {

  test("POST /auth/register → 201", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "int_user@test.com",
        password: "123456",
        name: "Integration User"
      });

    expect(res.status).toBe(201);
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
