# Automated Leave Management System

**Project ID:** P12  
**Course:** UE23CS341A  
**Academic Year:** 2025  
**Semester:** 5th Sem  
**Campus:** RR  
**Branch:** CSE  
**Section:** E  
**Team:** ALMS

## 📋 Project Description

A comprehensive leave management system to manage applying/approving leaves and different types of leave. This system automates the entire leave management process, from employee leave requests to manager approvals, with support for various leave types, leave balances, and reporting features.

This repository contains the source code and documentation for the Automated Leave Management System project, developed as part of the UE23CS341A course at PES University.

## 🧑‍💻 Development Team (ALMS)

- **@JastiTheCoder** - Scrum Master
- **@Ishani018** - Developer Team
- **@jahnvi1504** - Developer Team
- **@kakarlachaithanya** - Developer Team

## 👨‍🏫 Teaching Assistant

- **@RakshithKakunje9**
- **@Thaman-N**
- **@v-s-v-i-s-h-w-a-s**

## 👨‍⚖️ Faculty Supervisor

- **@rbanginwar**

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (v6 or higher) - for database
- Git - for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pestechnology/PESU_RR_CSE_E_P12_Automated_Leave_Management_System_ALMS.git
   cd PESU_RR_CSE_E_P12_Automated_Leave_Management_System_ALMS
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
PESU_RR_CSE_E_P12_Automated_Leave_Management_System_ALMS/
├── src/                      # Source code
│   ├── controllers/         # Request handlers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration files
│   └── app.js               # Application entry point
├── docs/                    # Documentation
│   ├── requirements/        # Requirements documentation
│   ├── design/              # Design documents
│   ├── api/                 # API documentation
│   ├── user-guide/          # User guides
│   ├── developer-guide/     # Developer documentation
│   └── rubrics/             # Evaluation rubrics
├── tests/                   # Test files
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── e2e/                 # End-to-end tests
├── .github/                 # GitHub workflows and templates
│   ├── workflows/           # CI/CD pipelines
│   └── ISSUE_TEMPLATE/      # Issue templates
├── coverage/                # Test coverage reports
├── logs/                    # Application logs
├── public/                  # Static files
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies
├── jest.config.js           # Jest configuration
├── eslint.config.mjs        # ESLint configuration
└── README.md                # This file
```

## 🛠️ Development Guidelines

### Branching Strategy

- **main**: Production-ready code
- **develop**: Development branch
- **feature/***: Feature branches
- **bugfix/***: Bug fix branches
- **hotfix/***: Hotfix branches

### Commit Messages

Follow conventional commit format:

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test-related changes
- `chore`: Maintenance tasks

### Code Review Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Create Pull Request to `develop`
4. Request review from team members
5. Merge after approval

## 📚 Documentation

### Available Documentation

- **[Requirements Documentation](docs/requirements/)** - System requirements and specifications
- **[Design Documentation](docs/design/)** - System design, architecture, and diagrams
- **[API Documentation](docs/api/)** - API endpoints and specifications
- **[User Guide](docs/user-guide/)** - End-user documentation
- **[Developer Guide](docs/developer-guide/)** - Developer setup and contribution guide
- **[Evaluation Rubrics](docs/rubrics/)** - Project evaluation criteria and rubrics

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run e2e tests only
npm run test:e2e
```

### Test Coverage

The project maintains a minimum of **75% code coverage** across all metrics:
- Branches: ≥ 75%
- Functions: ≥ 75%
- Lines: ≥ 75%
- Statements: ≥ 75%

View detailed coverage reports in `coverage/lcov-report/index.html`

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for Continuous Integration and Continuous Deployment. The CI/CD pipeline ensures code quality, security, and reliability through automated testing, linting, coverage analysis, and security scanning.

### Pipeline Overview

The CI/CD pipeline runs automatically on:
- Push events to `main` and `develop` branches
- Pull request events targeting `main` and `develop` branches

### Pipeline Stages

#### Stage 1: Build
**Purpose:** Install dependencies and verify the project builds successfully.

**What it does:**
- Installs all npm dependencies using `npm ci`
- Verifies that the main application files are syntactically valid
- Ensures the codebase is buildable and ready for testing

**How to run locally:**
```bash
# Install dependencies
npm ci

# Verify build
node -c src/app.js
```

**Quality Gate:** Build must complete successfully. Pipeline fails if dependencies cannot be installed or code has syntax errors.

#### Stage 2: Test
**Purpose:** Execute unit, integration, and system tests to verify functionality.

**What it does:**
- Runs the complete test suite using Jest
- Executes all tests in the `tests/` directory
- Generates test results and coverage data
- Uploads test results as artifacts

**How to run locally:**
```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm test -- --watch
```

**Quality Gate:** All tests must pass. Pipeline fails if any test fails.

#### Stage 3: Coverage
**Purpose:** Generate code coverage reports and enforce minimum 75% coverage threshold.

**What it does:**
- Generates comprehensive code coverage reports in HTML, JSON, and text formats
- Calculates coverage for branches, functions, lines, and statements
- Enforces a strict 75% minimum coverage requirement across all metrics
- Creates an HTML coverage report in the `coverage/` directory

**How to run locally:**
```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report (after running coverage)
# Open coverage/lcov-report/index.html in your browser
```

**Coverage Thresholds:**
- Branches: ≥ 75%
- Functions: ≥ 75%
- Lines: ≥ 75%
- Statements: ≥ 75%

**Quality Gate:** Coverage must meet or exceed 75% for all metrics. Pipeline fails if coverage falls below the threshold.

#### Stage 4: Lint
**Purpose:** Check code quality, style consistency, and catch potential errors using ESLint.

**What it does:**
- Runs ESLint on all JavaScript files (.js, .mjs, .cjs)
- Checks code against recommended ESLint rules and project configuration
- Generates lint reports in JSON and HTML formats
- Enforces strict quality standards

**How to run locally:**
```bash
# Run linter
npm run lint

# Run linter and auto-fix issues where possible
npm run lint:fix

# Run linter with JSON output
npm run lint -- --format json --output-file lint-report.json

# Run linter with HTML output
npm run lint -- --format html --output-file lint-report.html
```

**Quality Gate:**
- Errors: 0 errors allowed (pipeline fails on any error)
- Warnings: Maximum 10 warnings allowed (pipeline fails if warnings exceed 10)

#### Stage 5: Security
**Purpose:** Scan dependencies for known vulnerabilities and security issues.

**What it does:**
- Runs `npm audit` to scan all installed dependencies
- Checks for known security vulnerabilities in the dependency tree
- Generates a detailed security report in JSON and text formats
- Categorizes vulnerabilities by severity (critical, high, moderate, low)

**How to run locally:**
```bash
# Run security audit
npm audit

# Run audit and save JSON report
npm audit --audit-level=moderate --json > security-report.json

# Run audit with text output
npm audit --audit-level=moderate > security-output.txt

# Fix vulnerabilities automatically (if possible)
npm audit fix
```

**Quality Gate:** No critical vulnerabilities allowed. Pipeline fails immediately if any critical vulnerabilities are detected.

#### Stage 6: Deploy
**Purpose:** Create a deployment-ready artifact containing all necessary files and reports.

**What it does:**
- Creates a comprehensive deployment package (.zip file)
- Includes source code, configuration files, and documentation
- Packages all generated reports (coverage, lint, security, test results)
- Ensures README and all config files are included
- Excludes unnecessary files (node_modules, .git, logs, etc.)

**Deployment Artifact Contents:**
- ✅ Source code (all JavaScript files, controllers, models, routes, etc.)
- ✅ Configuration files (package.json, package-lock.json, jest.config.js, eslint.config.mjs)
- ✅ Documentation (README.md and all docs/)
- ✅ Coverage reports (HTML, JSON, text)
- ✅ Lint reports (JSON, HTML, text)
- ✅ Security reports (JSON, text)
- ✅ Test results

### Running CI/CD Checks Locally

Before pushing code, you can run all CI/CD checks locally to ensure they pass:

```bash
# 1. Build - Install dependencies
npm ci

# 2. Build - Verify syntax
node -c src/app.js

# 3. Test - Run test suite
npm test

# 4. Coverage - Generate and check coverage (must be ≥ 75%)
npm run test:coverage

# 5. Lint - Check code quality (must have 0 errors, ≤ 10 warnings)
npm run lint

# 6. Security - Check for vulnerabilities (must have 0 critical)
npm audit --audit-level=moderate
```

### Viewing Pipeline Results

1. Navigate to your repository on GitHub
2. Click on the **Actions** tab
3. Select a workflow run to view detailed logs for each stage
4. Download artifacts (reports and deployment ZIP) from the workflow run page

### Quality Gates Summary

| Stage | Quality Gate | Failure Condition |
|-------|-------------|-------------------|
| Build | Build Success | Dependencies fail to install or syntax errors |
| Test | All Tests Pass | Any test failure |
| Coverage | ≥ 75% Coverage | Coverage below 75% for any metric |
| Lint | 0 Errors, ≤ 10 Warnings | Any errors or > 10 warnings |
| Security | No Critical Vulnerabilities | Any critical vulnerability detected |

### Troubleshooting

**Pipeline failing on coverage:**
- Ensure you have sufficient test coverage for all code paths
- Run `npm run test:coverage` locally to identify uncovered code
- Review the HTML coverage report in `coverage/lcov-report/index.html`

**Pipeline failing on lint:**
- Run `npm run lint` locally to see all issues
- Use `npm run lint:fix` to auto-fix many issues
- Address remaining errors and warnings manually

**Pipeline failing on security:**
- Run `npm audit` to see vulnerabilities
- Use `npm audit fix` to automatically fix non-breaking issues
- For breaking changes, manually update vulnerable packages

## 📊 Project Evaluation Rubrics

The project evaluation follows the **Software Engineering Project Implementation Phase Evaluation Rubric**. Detailed rubrics and evaluation criteria are available in the [docs/rubrics/](docs/rubrics/) directory.

### Evaluation Criteria

The project is evaluated based on the following criteria (as per the rubric):

1. **Requirements Analysis & Documentation**
   - Completeness of requirements
   - Requirements traceability
   - Documentation quality

2. **System Design & Architecture**
   - Design completeness
   - Architecture appropriateness
   - Design patterns usage
   - UML diagrams and documentation

3. **Implementation & Code Quality**
   - Code organization and structure
   - Code quality and standards
   - Error handling
   - Code reusability

4. **Testing**
   - Test coverage (minimum 75%)
   - Unit tests
   - Integration tests
   - Test quality and effectiveness

5. **Documentation**
   - Code documentation
   - API documentation
   - User documentation
   - Developer documentation

6. **Deployment & DevOps**
   - CI/CD pipeline implementation
   - Deployment process
   - Environment configuration
   - Monitoring and logging

7. **Team Collaboration**
   - Version control usage
   - Code review process
   - Team communication
   - Project management

8. **Project Management**
   - Sprint planning
   - Task tracking
   - Progress reporting
   - Risk management

For detailed evaluation rubrics, please refer to:
- [Evaluation Rubrics Document](docs/rubrics/evaluation-rubrics.md)
- [Original Rubric PDF](Software%20Engineering%20Project%20Implementation%20Phase%20Evaluation%20Rubric%20(1).pdf)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is developed as part of the UE23CS341A course at PES University.

## 📞 Contact

For questions or support, please contact the development team or create an issue in the repository.

---

**Note:** This project is part of the Software Engineering course (UE23CS341A) at PES University. All evaluation criteria and rubrics are based on the official course requirements.

