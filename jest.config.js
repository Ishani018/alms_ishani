// jest.config.js
module.exports = {
  testMatch: [
    "**/tests/**/*.test.js",
    "**/tests/**/*.spec.js",
  ],
  testEnvironment: "node",
  roots: ["<rootDir>/tests"], // 👈 ensures Jest starts in /tests
};