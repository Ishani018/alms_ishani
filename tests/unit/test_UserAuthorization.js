/**
 * Test file for the authorize middleware (server/middleware/authorize.js).
 * This test suite assumes the use of a testing framework like Jest.
 */

// Import the middleware to be tested
const authorize = require('../../server/middleware/authMiddleware.js');

describe('Authorize Middleware', () => {
    let req;
    let res;
    let next;

    // Set up mock objects before each test
    beforeEach(() => {
        // Mock the request object (req)
        req = {};
        // Mock the response object (res) with status and json methods
        res = {
            status: jest.fn().mockReturnThis(), // Mocks .status(code).json(body) chain
            json: jest.fn().mockReturnThis()
        };
        // Mock the next function
        next = jest.fn();
    });

    // --- TEST SUITE 1: Successful Authorization ---

    it('should call next() if the user is authenticated and has the required single role (admin)', () => {
        // Arrange: Middleware requires 'admin' role
        const middleware = authorize('admin');
        // Arrange: Mock authenticated user with 'admin' role
        req.user = { id: 1, role: 'admin' };

        // Act
        middleware(req, res, next);

        // Assert: Should proceed to the next middleware/route handler
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should call next() if the user is authenticated and has one of the required roles (manager)', () => {
        // Arrange: Middleware requires ['admin', 'manager'] roles
        const middleware = authorize(['admin', 'manager']);
        // Arrange: Mock authenticated user with 'manager' role
        req.user = { id: 2, role: 'manager' };

        // Act
        middleware(req, res, next);

        // Assert: Should proceed to the next middleware/route handler
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    // --- TEST SUITE 2: Authorization Denied (403 Forbidden) ---

    it('should return 403 Forbidden if the user is authenticated but has an unauthorized role (employee)', () => {
        // Arrange: Middleware requires 'admin' role
        const middleware = authorize('admin');
        // Arrange: Mock authenticated user with 'employee' role
        req.user = { id: 3, role: 'employee' };

        // Act
        middleware(req, res, next);

        // Assert: Should stop the request chain and return 403
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Forbidden: You do not have the required permissions'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 Forbidden if the user role is not in the required array', () => {
        // Arrange: Middleware requires ['admin', 'manager'] roles
        const middleware = authorize(['admin', 'manager']);
        // Arrange: Mock authenticated user with 'super-user' role (not listed)
        req.user = { id: 4, role: 'super-user' };

        // Act
        middleware(req, res, next);

        // Assert: Should stop the request chain and return 403
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    // --- TEST SUITE 3: Authentication Denied (401 Unauthorized) ---

    it('should return 401 Unauthorized if req.user is missing (user not authenticated)', () => {
        // Arrange: Middleware requires 'admin' role
        const middleware = authorize('admin');
        // Arrange: req.user is undefined (authMiddleware failed or was skipped)

        // Act
        middleware(req, res, next);

        // Assert: Should return 401
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Authorization denied'
        });
        expect(next).not.toHaveBeenCalled();
    });
});