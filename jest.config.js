/** @type {import('jest').Config} */
module.exports = {
	// Use Node test environment for backend
	testEnvironment: 'node',
	// Look for JS test files
	testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
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
};
