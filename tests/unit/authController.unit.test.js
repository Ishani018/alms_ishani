const authController = require("../../controllers/authController");
jest.mock("../../config/db", () => ({ query: jest.fn() }));

describe("Auth Controller – Unit Tests", () => {

  test("register → should return 400 when email missing", () => {
    const req = { body: { password: "123" } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("login → should return 400 when credentials missing", () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});
