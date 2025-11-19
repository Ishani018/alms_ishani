const Leave = require("../../models/leaveModel");
const db = require("../../config/db");

jest.mock("../../config/db", () => ({ query: jest.fn() }));

describe("Leave Model – Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    test("should create leave with correct SQL", () => {
      const data = {
        employee_id: 1,
        start_date: "2025-01-01",
        end_date: "2025-01-05",
        reason: "Vacation"
      };
      const callback = jest.fn();

      Leave.create(data, callback);
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO leaves (employee_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?)",
        [1, "2025-01-01", "2025-01-05", "Vacation", "Pending"],
        callback
      );
    });
  });

  describe("getAll", () => {
    test("should get all leaves", () => {
      const callback = jest.fn();

      Leave.getAll(callback);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM leaves", callback);
    });
  });

  describe("updateStatus", () => {
    test("should update leave status", () => {
      const id = 1;
      const status = "Approved";
      const callback = jest.fn();

      Leave.updateStatus(id, status, callback);
      expect(db.query).toHaveBeenCalledWith(
        "UPDATE leaves SET status = ? WHERE id = ?",
        [status, id],
        callback
      );
    });
  });

  describe("getByEmployee", () => {
    test("should get leaves by employee id", () => {
      const id = 1;
      const callback = jest.fn();

      Leave.getByEmployee(id, callback);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM leaves WHERE employee_id = ?",
        [id],
        callback
      );
    });
  });
});

