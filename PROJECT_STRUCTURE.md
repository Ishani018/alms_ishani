# Project Structure Overview

This document provides an overview of the Automated Leave Management System project structure and how it aligns with the evaluation rubrics.

## Directory Structure

```
alms_final/
├── src/                          # Source code
│   ├── controllers/              # Request handlers (MVC Controllers)
│   ├── models/                   # Database models (Mongoose schemas)
│   ├── routes/                   # API route definitions
│   ├── middleware/               # Custom middleware (auth, validation, etc.)
│   ├── services/                 # Business logic layer
│   ├── utils/                    # Utility functions and helpers
│   ├── config/                   # Configuration files
│   └── app.js                    # Application entry point
│
├── docs/                         # Documentation
│   ├── requirements/             # Requirements documentation
│   ├── design/                   # Design documents and UML diagrams
│   ├── api/                      # API documentation
│   ├── user-guide/               # End-user documentation
│   ├── developer-guide/           # Developer documentation
│   └── rubrics/                  # Evaluation rubrics
│
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
│
├── .github/                      # GitHub configuration
│   ├── workflows/                # CI/CD pipeline workflows
│   └── ISSUE_TEMPLATE/           # Issue templates
│
├── coverage/                     # Test coverage reports (generated)
├── logs/                         # Application logs
├── public/                       # Static files
│
├── package.json                  # Project dependencies and scripts
├── jest.config.js                # Jest testing configuration
├── eslint.config.mjs             # ESLint configuration
├── .gitignore                    # Git ignore rules
├── .env.example                  # Environment variables template
├── README.md                     # Main project documentation
└── PROJECT_STRUCTURE.md          # This file
```

## Alignment with Evaluation Rubrics

### 1. Requirements Analysis & Documentation (20 points)
**Location:** `docs/requirements/`
- Requirements documentation
- User stories
- Use cases
- Acceptance criteria
- Requirements traceability matrix

### 2. System Design & Architecture (20 points)
**Location:** `docs/design/`
- System architecture documentation
- Database design
- API design
- UML diagrams (class, sequence, use case, deployment)
- Design patterns documentation

### 3. Implementation & Code Quality (25 points)
**Location:** `src/`
- Well-organized code structure
- Separation of concerns (MVC pattern)
- Code quality standards enforced by ESLint
- Error handling and validation
- Modular and reusable code

### 4. Testing (20 points)
**Location:** `tests/`
- Unit tests in `tests/unit/`
- Integration tests in `tests/integration/`
- E2E tests in `tests/e2e/`
- Coverage reports in `coverage/`
- Minimum 75% coverage requirement

### 5. Documentation (10 points)
**Location:** `docs/`
- Code documentation (JSDoc comments)
- API documentation in `docs/api/`
- User guide in `docs/user-guide/`
- Developer guide in `docs/developer-guide/`
- README.md with comprehensive information

### 6. Deployment & DevOps (10 points)
**Location:** `.github/workflows/`
- CI/CD pipeline in `.github/workflows/ci-cd.yml`
- Automated testing, coverage, linting, security scanning
- Deployment automation
- Environment configuration with `.env.example`

### 7. Team Collaboration (10 points)
**Location:** Repository structure
- Git branching strategy (main, develop, feature/*, bugfix/*)
- Code review process
- Issue templates in `.github/ISSUE_TEMPLATE/`
- Commit message conventions

### 8. Project Management (5 points)
**Location:** Repository and documentation
- Sprint planning and tracking
- Progress reporting
- Task management through issues and PRs

## Key Files

### Configuration Files
- `package.json` - Dependencies and npm scripts
- `jest.config.js` - Test configuration with 75% coverage threshold
- `eslint.config.mjs` - Code quality rules (0 errors, ≤10 warnings)
- `.env.example` - Environment variables template
- `.gitignore` - Files to exclude from version control

### Documentation Files
- `README.md` - Main project documentation
- `docs/rubrics/evaluation-rubrics.md` - Detailed evaluation criteria
- `docs/requirements/README.md` - Requirements documentation
- `docs/design/README.md` - Design documentation
- `docs/api/README.md` - API documentation
- `docs/user-guide/README.md` - User guide
- `docs/developer-guide/README.md` - Developer guide

### Source Code
- `src/app.js` - Main application entry point
- `src/controllers/` - Request handlers
- `src/models/` - Database models
- `src/routes/` - API routes
- `src/middleware/` - Custom middleware
- `src/services/` - Business logic
- `src/utils/` - Utility functions

### Testing
- `tests/unit/app.test.js` - Sample unit test
- Test coverage reports generated in `coverage/`

### CI/CD
- `.github/workflows/ci-cd.yml` - Complete CI/CD pipeline with 6 stages:
  1. Build
  2. Test
  3. Coverage
  4. Lint
  5. Security
  6. Deploy

## Quality Gates

The project enforces the following quality gates (as per rubrics):

1. **Build:** Must complete successfully
2. **Tests:** All tests must pass
3. **Coverage:** ≥ 75% for all metrics
4. **Lint:** 0 errors, ≤ 10 warnings
5. **Security:** No critical vulnerabilities

## Next Steps

1. Implement the actual application code in `src/`
2. Add database models in `src/models/`
3. Create API routes in `src/routes/`
4. Implement business logic in `src/services/`
5. Add more comprehensive tests
6. Complete UML diagrams in `docs/design/`
7. Fill in detailed requirements in `docs/requirements/`
8. Complete API documentation with actual endpoints

## Notes

- All directories are created and ready for development
- Configuration files are set up with appropriate settings
- CI/CD pipeline is configured and ready to use
- Documentation structure is in place
- Test framework is configured with coverage thresholds
- Linting is configured with quality gates

This structure ensures the project meets all evaluation criteria outlined in the Software Engineering Project Implementation Phase Evaluation Rubric.

