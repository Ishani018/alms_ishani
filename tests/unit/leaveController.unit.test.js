const Leave = require("../../models/leaveModel");
const db = require("../../config/db");

jest.mock("../../models/leaveModel");
jest.mock("../../config/db", () => ({ query: jest.fn() }));

const mockSendMail = jest.fn().mockResolvedValue(true);
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail
  }))
}));

const leaveController = require("../../controllers/leaveController");

describe("Leave Controller – Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createLeave", () => {
    test("should create leave successfully", () => {
      const req = { body: { employee_id: 1, start_date: "2025-01-01", end_date: "2025-01-05", reason: "Vacation" } };
      const res = { send: jest.fn() };

      Leave.create.mockImplementation((data, callback) => {
        callback(null);
      });

      leaveController.createLeave(req, res);
      expect(Leave.create).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith("Leave request created");
    });

    test("should handle error when creating leave", () => {
      const req = { body: { employee_id: 1, start_date: "2025-01-01", end_date: "2025-01-05", reason: "Vacation" } };
      const res = { send: jest.fn() };

      Leave.create.mockImplementation((data, callback) => {
        callback(new Error("DB Error"));
      });

      expect(() => leaveController.createLeave(req, res)).toThrow();
    });
  });

  describe("getLeaves", () => {
    test("should get all leaves successfully", () => {
      const req = {};
      const res = { json: jest.fn() };
      const mockLeaves = [{ id: 1, employee_id: 1, start_date: "2025-01-01", end_date: "2025-01-05" }];

      Leave.getAll.mockImplementation((callback) => {
        callback(null, mockLeaves);
      });

      leaveController.getLeaves(req, res);
      expect(Leave.getAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockLeaves);
    });

    test("should handle error when getting leaves", () => {
      const req = {};
      const res = { json: jest.fn() };

      Leave.getAll.mockImplementation((callback) => {
        callback(new Error("DB Error"));
      });

      expect(() => leaveController.getLeaves(req, res)).toThrow();
    });
  });

  describe("getEmployeeLeaves", () => {
    test("should get employee leaves successfully", () => {
      const req = { params: { id: 1 } };
      const res = { json: jest.fn() };
      const mockLeaves = [{ id: 1, employee_id: 1, start_date: "2025-01-01", end_date: "2025-01-05" }];

      Leave.getByEmployee.mockImplementation((id, callback) => {
        callback(null, mockLeaves);
      });

      leaveController.getEmployeeLeaves(req, res);
      expect(Leave.getByEmployee).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.json).toHaveBeenCalledWith(mockLeaves);
    });

    test("should handle error when getting employee leaves", () => {
      const req = { params: { id: 1 } };
      const res = { json: jest.fn() };

      Leave.getByEmployee.mockImplementation((id, callback) => {
        callback(new Error("DB Error"));
      });

      expect(() => leaveController.getEmployeeLeaves(req, res)).toThrow();
    });
  });

  describe("updateStatus", () => {
    test("should update status to Declined and send email", async () => {
      const req = { params: { id: 1 }, body: { status: "Declined" } };
      const res = { send: jest.fn() };

      const mockLeave = { id: 1, employee_id: 1, start_date: "2025-01-01", end_date: "2025-01-05", type: "casual" };
      const mockUser = { email: "test@test.com", name: "Test User" };

      mockSendMail.mockResolvedValue(true);

      Leave.updateStatus.mockImplementation((id, status, callback) => {
        callback(null);
      });

      db.query
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockLeave]);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockUser]);
        });

      leaveController.updateStatus(req, res);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 300));

      expect(Leave.updateStatus).toHaveBeenCalled();
      expect(db.query).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });

    test("should update status to Approved and deduct balance", async () => {
      const req = { params: { id: 1 }, body: { status: "Approved" } };
      const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

      const mockLeave = { id: 1, employee_id: 1, start_date: "2025-01-01", end_date: "2025-01-05", type: "casual" };
      const mockUser = { leave_balance: 10, email: "test@test.com", name: "Test User" };

      mockSendMail.mockResolvedValue(true);

      db.query
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockLeave]);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockUser]);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null);
        });

      Leave.updateStatus.mockImplementation((id, status, callback) => {
        callback(null);
      });

      leaveController.updateStatus(req, res);

      await new Promise(resolve => setTimeout(resolve, 300));

      expect(Leave.updateStatus).toHaveBeenCalled();
      expect(db.query).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });

    test("should return 404 when leave not found for approval", () => {
      const req = { params: { id: 1 }, body: { status: "Approved" } };
      const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

      db.query.mockImplementation((sql, params, callback) => {
        callback(null, []);
      });

      leaveController.updateStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Leave request not found");
    });

    test("should return 400 when insufficient leave balance", () => {
      const req = { params: { id: 1 }, body: { status: "Approved" } };
      const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

      const mockLeave = { id: 1, employee_id: 1, start_date: "2025-01-01", end_date: "2025-01-10", type: "casual" };
      const mockUser = { leave_balance: 5, email: "test@test.com", name: "Test User" };

      db.query
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockLeave]);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockUser]);
        });

      leaveController.updateStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Insufficient leave balance");
    });

    test("should return 404 when user not found for approval", () => {
      const req = { params: { id: 1 }, body: { status: "Approved" } };
      const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

      const mockLeave = { id: 1, employee_id: 1, start_date: "2025-01-01", end_date: "2025-01-05", type: "casual" };

      db.query
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockLeave]);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, []);
        });

      leaveController.updateStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("User not found");
    });

    test("should handle email send failure for declined status", async () => {
      const req = { params: { id: 1 }, body: { status: "Declined" } };
      const res = { send: jest.fn() };

      const mockLeave = { id: 1, employee_id: 1, start_date: "2025-01-01", end_date: "2025-01-05", type: "casual" };
      const mockUser = { email: "test@test.com", name: "Test User" };

      mockSendMail.mockRejectedValueOnce(new Error("Email failed"));

      Leave.updateStatus.mockImplementation((id, status, callback) => {
        callback(null);
      });

      db.query
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockLeave]);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockUser]);
        });

      leaveController.updateStatus(req, res);

      await new Promise(resolve => setTimeout(resolve, 300));

      expect(res.send).toHaveBeenCalledWith("Leave status updated, but email not sent");
    });

    test("should handle email send failure for approved status", async () => {
      const req = { params: { id: 1 }, body: { status: "Approved" } };
      const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

      const mockLeave = { id: 1, employee_id: 1, start_date: "2025-01-01", end_date: "2025-01-05", type: "casual" };
      const mockUser = { leave_balance: 10, email: "test@test.com", name: "Test User" };

      mockSendMail.mockRejectedValueOnce(new Error("Email failed"));

      db.query
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockLeave]);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockUser]);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null);
        });

      Leave.updateStatus.mockImplementation((id, status, callback) => {
        callback(null);
      });

      leaveController.updateStatus(req, res);

      await new Promise(resolve => setTimeout(resolve, 300));

      expect(res.send).toHaveBeenCalledWith("Leave status updated, but email not sent");
    });

    test("should return 500 when balance update fails", async () => {
      const req = { params: { id: 1 }, body: { status: "Approved" } };
      const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

      const mockLeave = { id: 1, employee_id: 1, start_date: "2025-01-01", end_date: "2025-01-05", type: "casual" };
      const mockUser = { leave_balance: 10, email: "test@test.com", name: "Test User" };

      db.query
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockLeave]);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockUser]);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("DB Error"));
        });

      Leave.updateStatus.mockImplementation((id, status, callback) => {
        callback(null);
      });

      leaveController.updateStatus(req, res);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating balance");
    });

    test("should handle case when leave not found for declined status", () => {
      const req = { params: { id: 1 }, body: { status: "Declined" } };
      const res = { send: jest.fn() };

      Leave.updateStatus.mockImplementation((id, status, callback) => {
        callback(null);
      });

      db.query.mockImplementationOnce((sql, params, callback) => {
        callback(null, []);
      });

      leaveController.updateStatus(req, res);

      expect(res.send).toHaveBeenCalledWith("Leave status updated");
    });

    test("should handle case when user not found for declined status", () => {
      const req = { params: { id: 1 }, body: { status: "Declined" } };
      const res = { send: jest.fn() };

      const mockLeave = { id: 1, employee_id: 1, start_date: "2025-01-01", end_date: "2025-01-05", type: "casual" };

      Leave.updateStatus.mockImplementation((id, status, callback) => {
        callback(null);
      });

      db.query
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [mockLeave]);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, []);
        });

      leaveController.updateStatus(req, res);

      expect(res.send).toHaveBeenCalledWith("Leave status updated");
    });
  });
});
