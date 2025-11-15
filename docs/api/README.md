# API Documentation

This directory contains the API documentation for the Automated Leave Management System.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "employee",
  "employeeId": "EMP001",
  "department": "Engineering"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "employee",
    "employeeId": "EMP001",
    "department": "Engineering"
  },
  "token": "jwt_token_here"
}
```

**Error Responses:**
- `400` - Validation error
- `409` - User already exists

#### POST /api/auth/login
Login and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "employee"
  },
  "token": "jwt_token_here"
}
```

**Error Responses:**
- `401` - Invalid credentials

#### GET /api/auth/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "employee",
    "employeeId": "EMP001",
    "department": "Engineering"
  }
}
```

**Error Responses:**
- `401` - Unauthorized

### Leave Management

#### POST /api/leaves
Create a new leave request.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "leaveType": "casual",
  "startDate": "2025-12-01",
  "endDate": "2025-12-03",
  "reason": "Personal work",
  "attachments": []
}
```

**Response (201):**
```json
{
  "message": "Leave request created successfully",
  "leave": {
    "_id": "leave_id",
    "employeeId": "user_id",
    "leaveType": "casual",
    "startDate": "2025-12-01T00:00:00.000Z",
    "endDate": "2025-12-03T00:00:00.000Z",
    "numberOfDays": 3,
    "reason": "Personal work",
    "status": "pending",
    "appliedDate": "2025-11-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation error or insufficient balance
- `401` - Unauthorized
- `409` - Overlapping leave dates

#### GET /api/leaves
Get all leave requests for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional) - Filter by status (pending, approved, rejected, cancelled)
- `leaveType` (optional) - Filter by leave type
- `startDate` (optional) - Filter by start date (ISO format)
- `endDate` (optional) - Filter by end date (ISO format)

**Response (200):**
```json
{
  "count": 2,
  "leaves": [
    {
      "_id": "leave_id",
      "employeeId": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "user@example.com"
      },
      "leaveType": "casual",
      "startDate": "2025-12-01T00:00:00.000Z",
      "endDate": "2025-12-03T00:00:00.000Z",
      "numberOfDays": 3,
      "reason": "Personal work",
      "status": "approved",
      "appliedDate": "2025-11-15T10:30:00.000Z",
      "approvedBy": {
        "_id": "manager_id",
        "name": "Jane Manager"
      },
      "approvedDate": "2025-11-16T09:00:00.000Z"
    }
  ]
}
```

#### GET /api/leaves/:id
Get a specific leave request by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "leave": {
    "_id": "leave_id",
    "employeeId": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "leaveType": "casual",
    "startDate": "2025-12-01T00:00:00.000Z",
    "endDate": "2025-12-03T00:00:00.000Z",
    "numberOfDays": 3,
    "reason": "Personal work",
    "status": "approved"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied
- `404` - Leave not found

#### PUT /api/leaves/:id
Update a leave request (only if pending).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "startDate": "2025-12-05",
  "endDate": "2025-12-07",
  "reason": "Updated reason"
}
```

**Response (200):**
```json
{
  "message": "Leave request updated successfully",
  "leave": {
    "_id": "leave_id",
    "startDate": "2025-12-05T00:00:00.000Z",
    "endDate": "2025-12-07T00:00:00.000Z",
    "numberOfDays": 3,
    "reason": "Updated reason",
    "status": "pending"
  }
}
```

**Error Responses:**
- `400` - Validation error or leave cannot be updated
- `401` - Unauthorized
- `403` - Access denied
- `404` - Leave not found

#### DELETE /api/leaves/:id
Cancel a leave request.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Leave request cancelled successfully",
  "leave": {
    "_id": "leave_id",
    "status": "cancelled"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied
- `404` - Leave not found
- `400` - Leave cannot be cancelled

### Approval Management

#### GET /api/leaves/approvals/pending
Get all pending approvals for managers.

**Headers:**
```
Authorization: Bearer <token>
```

**Required Role:** manager, hr, or admin

**Response (200):**
```json
{
  "count": 3,
  "leaves": [
    {
      "_id": "leave_id",
      "employeeId": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "user@example.com",
        "department": "Engineering"
      },
      "leaveType": "casual",
      "startDate": "2025-12-01T00:00:00.000Z",
      "endDate": "2025-12-03T00:00:00.000Z",
      "numberOfDays": 3,
      "reason": "Personal work",
      "status": "pending",
      "appliedDate": "2025-11-15T10:30:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied (not a manager)

#### POST /api/leaves/:id/approve
Approve a leave request.

**Headers:**
```
Authorization: Bearer <token>
```

**Required Role:** manager, hr, or admin

**Response (200):**
```json
{
  "message": "Leave request approved successfully",
  "leave": {
    "_id": "leave_id",
    "status": "approved",
    "approvedBy": "manager_id",
    "approvedDate": "2025-11-16T09:00:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied or not authorized to approve
- `404` - Leave not found
- `400` - Leave cannot be approved

#### POST /api/leaves/:id/reject
Reject a leave request.

**Headers:**
```
Authorization: Bearer <token>
```

**Required Role:** manager, hr, or admin

**Request Body:**
```json
{
  "rejectionReason": "Insufficient team coverage"
}
```

**Response (200):**
```json
{
  "message": "Leave request rejected",
  "leave": {
    "_id": "leave_id",
    "status": "rejected",
    "approvedBy": "manager_id",
    "approvedDate": "2025-11-16T09:00:00.000Z",
    "rejectionReason": "Insufficient team coverage"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Unauthorized
- `403` - Access denied or not authorized to reject
- `404` - Leave not found

### Leave Balance

#### GET /api/leave-balance
Get leave balance for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `year` (optional) - Year for balance (default: current year)

**Response (200):**
```json
{
  "balance": {
    "_id": "balance_id",
    "employeeId": "user_id",
    "year": 2025,
    "balances": {
      "sick": {
        "total": 12,
        "used": 2,
        "available": 8,
        "pending": 2
      },
      "casual": {
        "total": 10,
        "used": 3,
        "available": 5,
        "pending": 2
      },
      "annual": {
        "total": 15,
        "used": 5,
        "available": 8,
        "pending": 2
      }
    }
  }
}
```

**Error Responses:**
- `401` - Unauthorized

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

- `AUTH_REQUIRED` - Authentication required
- `INVALID_TOKEN` - Invalid or expired token
- `ACCESS_DENIED` - Insufficient permissions
- `VALIDATION_ERROR` - Validation failed
- `NOT_FOUND` - Resource not found
- `INTERNAL_ERROR` - Internal server error

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

API requests are rate-limited to prevent abuse. Current limits:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Versioning

Current API version: v1

Future versions will be accessible via `/api/v2/`, etc.

## Example Usage

### Complete Flow: Apply and Approve Leave

1. **Register/Login:**
```bash
POST /api/auth/login
{
  "email": "employee@example.com",
  "password": "password123"
}
```

2. **Apply for Leave:**
```bash
POST /api/leaves
Authorization: Bearer <token>
{
  "leaveType": "casual",
  "startDate": "2025-12-01",
  "endDate": "2025-12-03",
  "reason": "Personal work"
}
```

3. **Manager Approves:**
```bash
POST /api/leaves/<leave_id>/approve
Authorization: Bearer <manager_token>
```

4. **Check Balance:**
```bash
GET /api/leave-balance
Authorization: Bearer <token>
```

