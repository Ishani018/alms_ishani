# Automated Leave Management System (ALMS)

**Project ID:** P12  
**Course:** UE23CS341A  
**Academic Year:** 2025  
**Semester:** 5th Sem  
**Campus:** RR  
**Branch:** CSE  
**Section:** E  
**Team:** ALMS

## 📋 Project Description

A leave management system - manage applying/approving leaves and different types of leave.

This repository contains the source code and documentation for the Automated Leave Management System project, developed as part of the UE23CS341A course at PES University.

## 🧑‍💻 Development Team (ALMS)

- [@JastiTheCoder](https://github.com/JastiTheCoder) - Scrum Master
- [@Ishani018](https://github.com/Ishani018) - Developer Team
- [@jahnvi1504](https://github.com/jahnvi1504) - Developer Team
- [@kakarlachaithanya](https://github.com/kakarlachaithanya) - Developer Team

## 👨‍🏫 Teaching Assistant

- [@RakshithKakunje9](https://github.com/RakshithKakunje9)
- [@Thaman-N](https://github.com/Thaman-N)
- [@v-s-v-i-s-h-w-a-s](https://github.com/v-s-v-i-s-h-w-a-s)

## 👨‍⚖️ Faculty Supervisor

- [@rbanginwar](https://github.com/rbanginwar)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MySQL** (v8.0 or higher) - [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download Git](https://git-scm.com/downloads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pestechnology/PESU_RR_CSE_E_P12_Automated_Leave_Management_System_ALMS.git
   cd PESU_RR_CSE_E_P12_Automated_Leave_Management_System_ALMS
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (or configure your environment) with the following variables:

   ```env
   DB_HOST=localhost
   DB_USER=your_database_username
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

   Alternatively, you can modify the default values in [`config/db.js`](config/db.js) for local development.

4. **Set up the database**

   Create a MySQL database and run any necessary migration scripts (if available).

5. **Run the application**

   ```bash
   # Production mode
   npm start

   # Development mode (with auto-reload)
   npm run dev
   ```

   The server will start on `http://localhost:3000` (or the port specified in your environment variables).

## 📁 Project Structure

```
PESU_RR_CSE_E_P12_Automated_Leave_Management_System_ALMS/
├── config/              # Configuration files
│   └── db.js           # Database connection configuration
├── controllers/         # Business logic controllers
│   ├── authController.js
│   ├── leaveController.js
│   └── userController.js
├── models/              # Data models
│   ├── leaveModel.js
│   └── userModel.js
├── routes/              # API route definitions
│   ├── authRoutes.js
│   ├── leaveRoutes.js
│   └── userRoutes.js
├── public/              # Static files and frontend
│   ├── admin/          # Admin dashboard
│   ├── employee/       # Employee dashboard
│   ├── manager/        # Manager dashboard
│   ├── css/            # Stylesheets
│   ├── js/             # Client-side JavaScript
│   ├── index.html      # Home page
│   ├── login.html      # Login page
│   └── register.html   # Registration page
├── server/              # Server-side routes
│   └── routes/
│       └── admin.js
├── tests/               # Test files
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/            # End-to-end tests
├── coverage/            # Test coverage reports
├── app.js              # Express app configuration
├── server.js            # Server entry point
├── package.json         # Project dependencies
├── jest.config.js      # Jest test configuration
├── eslint.config.mjs    # ESLint configuration
└── README.md           # This file
```

## 🛠️ Development Guidelines

### Branching Strategy

- **main**: Production-ready code
- **develop**: Development branch
- **feature/***: Feature branches
- **bugfix/***: Bug fix branches

### Commit Messages

Follow conventional commit format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test-related changes
- `chore:` Maintenance tasks

### Code Review Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Create Pull Request to `develop`
4. Request review from team members
5. Merge after approval

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage

The project maintains a minimum code coverage of 75% (lines, statements, branches, and functions). Coverage reports are generated in the `coverage/` directory and can be viewed by opening `coverage/lcov-report/index.html` in a browser.

### Test Structure

- **Unit Tests**: Located in `tests/unit/` - Test individual functions and modules
- **Integration Tests**: Located in `tests/integration/` - Test component interactions
- **E2E Tests**: Located in `tests/e2e/` - Test complete user workflows

## 🛠️ CI/CD Pipeline

This project uses GitHub Actions for continuous integration (CI) and continuous delivery (CD). The pipeline is triggered on every `push` and `pull_request` to the `main` and `develop` branches.

It consists of 5 required stages as per the project rubric:

1. **Build:** Installs all `npm` dependencies using `npm ci` to ensure a clean and repeatable build.
2. **Test:** Runs the full Jest test suite (unit and integration tests) against a live MySQL test database service.
3. **Coverage:** Generates a code coverage report during the test stage. The pipeline **enforces a quality gate of 75%** global coverage (lines, statements, branches, and functions).
4. **Lint:** Performs static code analysis using ESLint. The pipeline will **fail if any ESLint errors** are found.
5. **Security:** Runs `npm audit` to scan for high-severity vulnerabilities in project dependencies.

### Deployment Artifact

After all 5 CI stages pass, a final job packages the following into a `deployment-package.zip` file:
* Project source code (controllers, models, routes, public, etc.)
* `README.md` and `package.json`
* All CI/CD reports (Coverage, Lint, and Security)

### How to Run Checks Locally

You can run the same checks locally before pushing:

```bash
# Run tests and generate coverage
npm test -- --coverage

# Check linting
npm run lint

# Run security scan
npm audit --audit-level=high
```

## 📚 Documentation

### API Documentation

API documentation is available in the codebase. Key endpoints include:

- **Authentication**: `/auth/*` - User registration, login, and JWT token management
- **Leave Management**: `/leave/*` - Leave application, approval, and management
- **User Management**: `/user/*` - User profile and information management

### User Guide

- **Employee**: Access the employee dashboard at `/employee/dashboard.html` to apply for leaves and view leave status
- **Manager**: Access the manager dashboard at `/manager/dashboard.html` to approve/reject leave requests
- **Admin**: Access the admin dashboard at `/admin/dashboard.html` for system administration

### Developer Guide

For developers contributing to this project:

1. Follow the [Development Guidelines](#-development-guidelines) section
2. Ensure all tests pass before submitting a PR
3. Maintain code coverage above 75%
4. Follow ESLint rules and fix any linting errors
5. Write meaningful commit messages following conventional commits

## 📄 License

This project is developed for educational purposes as part of the PES University UE23CS341A curriculum.

**Course:** UE23CS341A  
**Institution:** PES University  
**Academic Year:** 2025  
**Semester:** 5th Sem

---

## 🔗 Quick Links

- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development Guidelines](#-development-guidelines)
- [Testing](#-testing)
- [CI/CD Pipeline](#-cicd-pipeline)
