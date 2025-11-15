# Developer Guide

This directory contains developer documentation for contributing to the Automated Leave Management System.

## Contents

- Setup Instructions
- Development Workflow
- Code Standards
- Testing Guidelines
- Contribution Guidelines
- Architecture Overview

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (v6 or higher)
- Git

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

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branching Strategy
- `main` - Production code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Making Changes

1. Create a feature branch from `develop`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Write tests for your changes

4. Run tests and linting
   ```bash
   npm test
   npm run lint
   ```

5. Commit your changes
   ```bash
   git commit -m "feat: Add your feature description"
   ```

6. Push and create Pull Request
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Standards

### JavaScript Style
- Use ES6+ features
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions

### File Structure
- Controllers in `src/controllers/`
- Models in `src/models/`
- Routes in `src/routes/`
- Services in `src/services/`
- Middleware in `src/middleware/`
- Utils in `src/utils/`

### Naming Conventions
- Files: `camelCase.js`
- Classes: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

## Testing Guidelines

### Writing Tests
- Write unit tests for all functions
- Write integration tests for API endpoints
- Maintain ≥ 75% code coverage
- Use descriptive test names

### Running Tests
```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# With coverage
npm run test:coverage
```

## Contribution Guidelines

1. Follow the code standards
2. Write tests for new features
3. Update documentation
4. Ensure all tests pass
5. Ensure linting passes
6. Create meaningful commit messages
7. Request code review before merging

## Architecture Overview

### MVC Pattern
- **Models:** Data models and database interactions
- **Views:** API responses (JSON)
- **Controllers:** Request handling and business logic

### Service Layer
Business logic is separated into service classes for better organization and testability.

### Middleware
- Authentication middleware
- Error handling middleware
- Validation middleware
- Logging middleware

## API Development

### Adding New Endpoints

1. Create route file in `src/routes/`
2. Create controller in `src/controllers/`
3. Create service if needed in `src/services/`
4. Add validation middleware
5. Write tests
6. Update API documentation

## Database

### Models
- Use Mongoose for MongoDB
- Define schemas in `src/models/`
- Add validation and indexes

### Migrations
Database migrations will be handled as needed.

## Security

- Always validate input
- Use parameterized queries
- Implement authentication and authorization
- Follow OWASP guidelines
- Keep dependencies updated

