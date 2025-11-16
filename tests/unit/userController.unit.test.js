const userController = require("../../controllers/userController");
jest.mock("../../config/db", () => ({ query: jest.fn() }));

describe("User Controller – Unit Tests", () => {

  test("getProfile → should return error if no user", () => {
    const req = { user: null };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    userController.getProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

});
