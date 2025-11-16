const User = require("../../models/userModel");
const db = require("../../config/db");

jest.mock("../../config/db", () => ({ query: jest.fn() }));

describe("User Model – Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    test("should create user with correct SQL", () => {
      const data = { name: "Test", email: "test@test.com", password: "123", role: "employee" };
      const callback = jest.fn();

      User.create(data, callback);
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Test", "test@test.com", "123", "employee"],
        callback
      );
    });
  });

  describe("findByEmail", () => {
    test("should find user by email", () => {
      const email = "test@test.com";
      const callback = jest.fn();

      User.findByEmail(email, callback);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE email = ?",
        [email],
        callback
      );
    });
  });

  describe("getAll", () => {
    test("should get all users", () => {
      const callback = jest.fn();

      User.getAll(callback);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM users", callback);
    });
  });

  describe("findById", () => {
    test("should find user by id", () => {
      const id = 1;
      const callback = jest.fn();

      User.findById(id, callback);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE id = ?",
        [id],
        callback
      );
    });
  });

  describe("update", () => {
    test("should update user with correct SQL", () => {
      const id = 1;
      const data = { name: "Updated", email: "updated@test.com", role: "manager" };
      const callback = jest.fn();

      User.update(id, data, callback);
      expect(db.query).toHaveBeenCalledWith(
        "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
        ["Updated", "updated@test.com", "manager", id],
        callback
      );
    });
  });

  describe("delete", () => {
    test("should delete user by id", () => {
      const id = 1;
      const callback = jest.fn();

      User.delete(id, callback);
      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM users WHERE id = ?",
        [id],
        callback
      );
    });
  });

  describe("findByRole", () => {
    test("should find users by role", () => {
      const role = "employee";
      const callback = jest.fn();

      User.findByRole(role, callback);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE role = ?",
        [role],
        callback
      );
    });
  });
});

