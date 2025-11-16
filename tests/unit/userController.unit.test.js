const userController = require("../../controllers/userController");
const User = require("../../models/userModel");

jest.mock("../../models/userModel");

describe("User Controller – Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listUsers", () => {
    test("should list all users successfully", () => {
      const req = {};
      const res = { json: jest.fn() };
      const mockUsers = [{ id: 1, name: "Test", email: "test@test.com" }];

      User.getAll.mockImplementation((callback) => {
        callback(null, mockUsers);
      });

      userController.listUsers(req, res);
      expect(User.getAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    test("should return 500 on error", () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.getAll.mockImplementation((callback) => {
        callback(new Error("DB Error"));
      });

      userController.listUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });
  });

  describe("getUserById", () => {
    test("should get user by id successfully", () => {
      const req = { params: { id: 1 } };
      const res = { json: jest.fn() };
      const mockUser = { id: 1, name: "Test", email: "test@test.com" };

      User.findById.mockImplementation((id, callback) => {
        callback(null, [mockUser]);
      });

      userController.getUserById(req, res);
      expect(User.findById).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    test("should return 500 on error", () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findById.mockImplementation((id, callback) => {
        callback(new Error("DB Error"));
      });

      userController.getUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });

    test("should return 404 when user not found", () => {
      const req = { params: { id: 999 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findById.mockImplementation((id, callback) => {
        callback(null, []);
      });

      userController.getUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });

  describe("createUser", () => {
    test("should create user successfully", () => {
      const req = { body: { name: "Test", email: "test@test.com", password: "123", role: "employee" } };
      const res = { json: jest.fn() };

      User.create.mockImplementation((data, callback) => {
        callback(null, { insertId: 1 });
      });

      userController.createUser(req, res);
      expect(User.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "User created", id: 1 });
    });

    test("should return 500 on error", () => {
      const req = { body: { name: "Test", email: "test@test.com", password: "123", role: "employee" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.create.mockImplementation((data, callback) => {
        callback(new Error("DB Error"));
      });

      userController.createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });
  });

  describe("updateUser", () => {
    test("should update user successfully", () => {
      const req = { params: { id: 1 }, body: { name: "Updated", email: "updated@test.com", role: "manager" } };
      const res = { json: jest.fn() };

      User.update.mockImplementation((id, data, callback) => {
        callback(null);
      });

      userController.updateUser(req, res);
      expect(User.update).toHaveBeenCalledWith(1, req.body, expect.any(Function));
      expect(res.json).toHaveBeenCalledWith({ message: "User updated" });
    });

    test("should return 500 on error", () => {
      const req = { params: { id: 1 }, body: { name: "Updated", email: "updated@test.com", role: "manager" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.update.mockImplementation((id, data, callback) => {
        callback(new Error("DB Error"));
      });

      userController.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });
  });

  describe("deleteUser", () => {
    test("should delete user successfully", () => {
      const req = { params: { id: 1 } };
      const res = { json: jest.fn() };

      User.delete.mockImplementation((id, callback) => {
        callback(null);
      });

      userController.deleteUser(req, res);
      expect(User.delete).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.json).toHaveBeenCalledWith({ message: "User deleted" });
    });

    test("should return 500 on error", () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.delete.mockImplementation((id, callback) => {
        callback(new Error("DB Error"));
      });

      userController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });
  });

  describe("listByRole", () => {
    test("should list users by role successfully", () => {
      const req = { params: { role: "employee" } };
      const res = { json: jest.fn() };
      const mockUsers = [{ id: 1, name: "Test", email: "test@test.com", role: "employee" }];

      User.findByRole.mockImplementation((role, callback) => {
        callback(null, mockUsers);
      });

      userController.listByRole(req, res);
      expect(User.findByRole).toHaveBeenCalledWith("employee", expect.any(Function));
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    test("should return 500 on error", () => {
      const req = { params: { role: "employee" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findByRole.mockImplementation((role, callback) => {
        callback(new Error("DB Error"));
      });

      userController.listByRole(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });
  });
});
