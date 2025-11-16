const authController = require("../../controllers/authController");
const db = require("../../config/db");
const jwt = require("jsonwebtoken");

jest.mock("../../config/db", () => ({ query: jest.fn() }));
jest.mock("jsonwebtoken");

describe("Auth Controller – Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    test("should return 400 when name missing", () => {
      const req = { body: { email: "test@test.com", password: "123", role: "employee" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("All fields required");
    });

    test("should return 400 when email missing", () => {
      const req = { body: { name: "Test", password: "123", role: "employee" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("All fields required");
    });

    test("should return 400 when password missing", () => {
      const req = { body: { name: "Test", email: "test@test.com", role: "employee" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("All fields required");
    });

    test("should return 400 when role missing", () => {
      const req = { body: { name: "Test", email: "test@test.com", password: "123" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("All fields required");
    });

    test("should register user successfully", () => {
      const req = { body: { name: "Test", email: "test@test.com", password: "123", role: "employee" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      db.query.mockImplementation((sql, params, callback) => {
        callback(null);
      });

      authController.register(req, res);
      expect(db.query).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith("User registered successfully");
    });

    test("should return 500 on database error", () => {
      const req = { body: { name: "Test", email: "test@test.com", password: "123", role: "employee" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      db.query.mockImplementation((sql, params, callback) => {
        callback(new Error("DB Error"));
      });

      authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Could not register");
    });
  });

  describe("login", () => {
    test("should return 400 when email missing", () => {
      const req = { body: { password: "123" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Email and password required");
    });

    test("should return 400 when password missing", () => {
      const req = { body: { email: "test@test.com" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Email and password required");
    });

    test("should return 500 on database error", () => {
      const req = { body: { email: "test@test.com", password: "123" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };

      db.query.mockImplementation((sql, params, callback) => {
        callback(new Error("DB Error"));
      });

      authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server error");
    });

    test("should return 401 when user not found", () => {
      const req = { body: { email: "test@test.com", password: "123" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };

      db.query.mockImplementation((sql, params, callback) => {
        callback(null, []);
      });

      authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Invalid email or password");
    });

    test("should return 401 when password incorrect", () => {
      const req = { body: { email: "test@test.com", password: "wrong" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };

      db.query.mockImplementation((sql, params, callback) => {
        callback(null, [{ id: 1, email: "test@test.com", password: "correct", role: "employee" }]);
      });

      authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Invalid email or password");
    });

    test("should login successfully and return token", () => {
      const req = { body: { email: "test@test.com", password: "123" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };

      const mockUser = { id: 1, email: "test@test.com", password: "123", role: "employee" };
      db.query.mockImplementation((sql, params, callback) => {
        callback(null, [mockUser]);
      });

      jwt.sign.mockReturnValue("mock-token");

      authController.login(req, res);
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1, role: "employee" }, "secretkey");
      expect(res.json).toHaveBeenCalledWith({
        token: "mock-token",
        role: "employee",
        id: 1
      });
    });
  });
});
