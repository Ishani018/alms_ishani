// jest.config.js
module.exports = {
  roots: ["<rootDir>/tests"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testEnvironment: "node",

  collectCoverage: true,               // ✅ Generate coverage info
  coverageDirectory: "coverage",       // Output folder (default is fine)
  
  coverageThreshold: {                 // ✅ Temporary threshold
    global: {
      branches: 50,                    // % of branch coverage
      functions: 50,                   // % of functions covered
      lines: 50,                       // % of lines covered
      statements: 50                   // % of statements covered
    },
  },
};