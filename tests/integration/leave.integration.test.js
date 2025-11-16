const request = require("supertest");
const app = require("../../app");
const db = require("../../config/db");

let token;

beforeAll(async () => {
  db.connect(() => {});
  await request(app).post("/auth/register").send({
    email: "leave_user@test.com",
    password: "123456",
    name: "Leave User"
  });

  const login = await request(app).post("/auth/login").send({
    email: "leave_user@test.com",
    password: "123456"
  });

  token = login.body.token;
});

afterAll((done) => db.end(done));

describe("LEAVE API – Integration", () => {

  test("POST /leaves → create leave", async () => {
    const res = await request(app)
      .post("/leaves")
      .set("Authorization", `Bearer ${token}`)
      .send({
        start_date: "2025-02-01",
        end_date: "2025-02-03",
        type: "casual",
        reason: "sick"
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("id");
  });

});
