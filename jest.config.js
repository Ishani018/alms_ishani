// jest.config.js
module.exports = {
  // ... other settings
  collectCoverage: true,
  coverageDirectory: "coverage",
  
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    },
  },
};
