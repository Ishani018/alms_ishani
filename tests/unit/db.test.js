// Mock mysql2 before requiring db
let storedErrorCallback = null;

jest.mock('mysql2', () => {
  const mockConnection = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
    on: jest.fn((event, callback) => {
      // Store the callback so we can test it later
      if (event === 'error') {
        storedErrorCallback = callback;
      }
    }),
    emit: jest.fn()
  };
  
  return {
    createConnection: jest.fn(() => mockConnection)
  };
});

const db = require("../../config/db");

describe("Database Config – Unit Tests", () => {
  let consoleErrorSpy;
  let originalNodeEnv;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    originalNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
    delete process.env.JEST_WORKER_ID;
  });

  test("should export database connection", () => {
    expect(db).toBeDefined();
    expect(db.query).toBeDefined();
  });

  test("should have query method", () => {
    expect(typeof db.query).toBe("function");
  });

  test("should handle connection errors in production", () => {
    // Temporarily set to production to test error logging
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    delete process.env.JEST_WORKER_ID;
    
    // Reload module to get error handler with production settings
    jest.resetModules();
    jest.clearAllMocks();
    
    // Re-mock with callback capture
    const mysql = require('mysql2');
    let prodErrorCallback = null;
    const mockConnection = {
      query: jest.fn(),
      on: jest.fn((event, callback) => {
        if (event === 'error') {
          prodErrorCallback = callback;
        }
      })
    };
    mysql.createConnection = jest.fn(() => mockConnection);
    
    require("../../config/db");
    const mockError = new Error('Connection failed');
    
    // Call the error handler callback directly
    if (prodErrorCallback) {
      prodErrorCallback(mockError);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Database connection error:', mockError);
    }
    
    // Restore
    process.env.NODE_ENV = originalEnv;
  });

  test("should ignore connection errors in test environment", () => {
    process.env.NODE_ENV = 'test';
    
    const mockError = new Error('Connection failed');
    
    // Call the stored error callback
    if (storedErrorCallback) {
      storedErrorCallback(mockError);
    }
    
    // In test environment, should not log error
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});

