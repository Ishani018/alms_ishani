// jest.config.js
module.exports = {
  roots: ["<rootDir>/tests"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testEnvironment: "node",

  collectCoverage: true,               // ✅ Generate coverage info
  coverageDirectory: "coverage",       // Output folder (default is fine)
  
  coverageThreshold: {                 // ✅ Temporary threshold
    global: {
      branches: 15,                    // % of branch coverage
      functions: 20,                   // % of functions covered
      lines: 25,                       // % of lines covered
      statements: 25                   // % of statements covered
    },
  },
};