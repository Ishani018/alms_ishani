/** @type {import('jest').Config} */
module.exports = {
	// Use Node test environment for backend
	testEnvironment: 'node',
	// Look for JS test files
	testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
	// Setup file to mock mysql2 (runs after test framework, but mocks are hoisted)
	setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
	// Collect coverage for source files
	collectCoverage: true,
	collectCoverageFrom: [
		'**/*.js',
		'!**/node_modules/**',
		'!**/coverage/**',
		'!**/dist/**',
		'!**/build/**',
		'!server.js', // exclude entry if not easily testable
		'!**/tests/**', // exclude test files
		'!**/public/**', // exclude public files
		'!**/server/routes/admin.js', // exclude admin routes (MongoDB, not used)
	],
	coverageThreshold: {
		global: {
			statements: 75,
			branches: 75,
			functions: 75,
			lines: 75
		}
	},
	coverageDirectory: 'coverage',
	coverageReporters: ['json', 'lcov', 'text', 'html'],
	// Generate test results in JUnit XML format for CI/CD
	// Only use jest-junit if it's installed (for CI/CD environments)
	reporters: process.env.CI ? [
		'default',
		['jest-junit', {
			outputDirectory: 'test-results',
			outputName: 'junit.xml',
			suiteName: 'ALMS Test Suite',
			classNameTemplate: '{classname}',
			titleTemplate: '{title}',
			ancestorSeparator: ' › ',
			usePathForSuiteName: 'true'
		}]
	] : ['default'],
};
