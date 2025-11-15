# Design Documentation

This directory contains the system design and architecture documentation for the Automated Leave Management System.

## Contents

- System Architecture
- Database Design
- API Design
- UML Diagrams
  - Class Diagrams
  - Sequence Diagrams
  - Use Case Diagrams
  - Deployment Diagrams
  - Activity Diagrams
- Design Patterns
- Technology Stack

## System Architecture

### Architecture Pattern
- **Pattern:** MVC (Model-View-Controller) / Layered Architecture
- **Style:** RESTful API with Express.js

### Components
1. **Presentation Layer:** REST API endpoints
2. **Business Logic Layer:** Services and controllers
3. **Data Access Layer:** Models and database interactions
4. **Infrastructure Layer:** Configuration, utilities, middleware

## Database Design

### Entity Relationship Diagram
- Users (Employees, Managers, HR, Admins)
- Leave Requests
- Leave Types
- Leave Balances
- Approvals
- Notifications

### Database Schema
Detailed schema documentation will be added here.

## API Design

### RESTful Endpoints
- `/api/auth` - Authentication endpoints
- `/api/users` - User management
- `/api/leaves` - Leave management
- `/api/approvals` - Approval workflow
- `/api/reports` - Reporting endpoints

### API Documentation
Detailed API documentation with request/response examples will be added here.

## UML Diagrams

Detailed UML diagrams are available in [UML Diagrams Document](uml-diagrams.md), including:

### Class Diagram
Shows the structure of classes, their attributes, methods, and relationships for:
- User model
- Leave model
- LeaveBalance model
- LeaveType model

### Sequence Diagram
Illustrates the interaction between objects in a time sequence:
- Leave application flow
- Leave approval process

### Use Case Diagram
Represents the functional requirements and actors:
- Employee use cases
- Manager use cases
- HR use cases
- Admin use cases

### Deployment Diagram
Shows the physical deployment of the system:
- Client layer
- Load balancer
- Application servers
- Database layer

### Activity Diagram
Describes the workflow and business processes:
- Leave approval process
- Leave application workflow

### Component Diagram
Shows the system components and their relationships:
- Auth Module
- Leave Module
- Approval Module
- Balance Module
- Database Layer

### State Diagram
Shows the state transitions for leave requests:
- Pending → Approved
- Pending → Rejected
- Pending → Cancelled

## Design Patterns

- **Repository Pattern:** For data access abstraction
- **Service Layer Pattern:** For business logic separation
- **Middleware Pattern:** For cross-cutting concerns
- **Factory Pattern:** For object creation
- **Singleton Pattern:** For configuration management

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Testing:** Jest, Supertest
- **Linting:** ESLint
- **CI/CD:** GitHub Actions

