const request = require("supertest");
const app = require("../../app");
const db = require("../../config/db");

beforeAll((done) => db.connect(done));
afterAll((done) => db.end(done));

describe("FULL E2E FLOW – Register → Login → Apply Leave", () => {

  let token;

  test("Register new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "e2euser@test.com",
        password: "e2epass",
        name: "E2E Test"
      });

    expect(res.status).toBe(201);
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
        start_date: "2025-02-10",
        end_date: "2025-02-12",
        type: "sick",
        reason: "fever"
      });

    expect([200, 201]).toContain(res.status);
  });

});
