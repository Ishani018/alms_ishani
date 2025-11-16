// Global test setup - mock mysql2 before any modules are loaded
// This prevents db.js from trying to establish a real connection
jest.mock('mysql2', () => {
  const mockConnection = {
    query: jest.fn(),
    connect: jest.fn((callback) => {
      if (callback) callback(null);
    }),
    end: jest.fn((callback) => {
      if (callback) callback(null);
    }),
    on: jest.fn(),
    emit: jest.fn(),
    once: jest.fn(),
    removeListener: jest.fn()
  };
  
  return {
    createConnection: jest.fn(() => mockConnection)
  };
});

