const leaveController = require("../../controllers/leaveController");
jest.mock("../../config/db", () => ({ query: jest.fn() }));

describe("Leave Controller – Unit Tests", () => {

  test("createLeave → missing fields → 400", () => {
    const req = { body: {}, user: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    leaveController.createLeave(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});
