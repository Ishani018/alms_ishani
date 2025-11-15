# UML Diagrams

This document contains UML diagrams for the Automated Leave Management System.

## Class Diagram

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ - _id: ObjectId     │
│ - name: String      │
│ - email: String     │
│ - password: String  │
│ - role: String      │
│ - employeeId: String│
│ - department: String│
│ - managerId: ObjectId│
│ - isActive: Boolean │
│ - lastLogin: Date   │
│ - createdAt: Date   │
│ - updatedAt: Date   │
├─────────────────────┤
│ + comparePassword() │
│ + toJSON()          │
└─────────────────────┘
         │
         │ 1
         │
         │ *
┌─────────────────────┐
│       Leave         │
├─────────────────────┤
│ - _id: ObjectId     │
│ - employeeId: ObjectId│
│ - leaveType: String │
│ - startDate: Date   │
│ - endDate: Date     │
│ - numberOfDays: Number│
│ - reason: String    │
│ - status: String    │
│ - appliedDate: Date │
│ - approvedBy: ObjectId│
│ - approvedDate: Date│
│ - rejectionReason: String│
│ - attachments: Array│
│ - createdAt: Date   │
│ - updatedAt: Date   │
├─────────────────────┤
│ + checkOverlap()    │
└─────────────────────┘
         │
         │ 1
         │
         │ 1
┌─────────────────────┐
│   LeaveBalance      │
├─────────────────────┤
│ - _id: ObjectId     │
│ - employeeId: ObjectId│
│ - year: Number      │
│ - balances: Object  │
│ - createdAt: Date   │
│ - updatedAt: Date   │
├─────────────────────┤
│ + updateBalance()   │
│ + getAvailable()    │
└─────────────────────┘

┌─────────────────────┐
│    LeaveType        │
├─────────────────────┤
│ - _id: ObjectId     │
│ - name: String      │
│ - description: String│
│ - maxDays: Number   │
│ - requiresApproval: Boolean│
│ - isActive: Boolean │
│ - carryForward: Boolean│
│ - maxCarryForward: Number│
└─────────────────────┘
```

## Sequence Diagram: Leave Application Flow

```
Employee          System          LeaveBalance      Manager
   │                 │                 │              │
   │ 1. Apply Leave  │                 │              │
   │───────────────>│                 │              │
   │                 │ 2. Check Balance│              │
   │                 │───────────────>│              │
   │                 │<───────────────│              │
   │                 │ 3. Check Overlap│              │
   │                 │─────────────────              │
   │                 │<────────────────              │
   │                 │ 4. Create Leave │              │
   │                 │─────────────────              │
   │                 │ 5. Update Balance│             │
   │                 │───────────────>│              │
   │ 6. Leave Created│                 │              │
   │<───────────────│                 │              │
   │                 │ 7. Notify Manager│             │
   │                 │──────────────────────────────>│
   │                 │                 │              │
   │                 │                 │  8. Review  │
   │                 │                 │<────────────│
   │                 │                 │              │
   │                 │                 │  9. Approve │
   │                 │                 │────────────>│
   │                 │ 10. Update Status│             │
   │                 │─────────────────              │
   │                 │ 11. Update Balance│             │
   │                 │───────────────>│              │
   │ 12. Notification│                 │              │
   │<───────────────│                 │              │
```

## Use Case Diagram

```
                    Automated Leave Management System
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │Employee │          │ Manager │          │   HR    │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                     │                     │
        │ Apply Leave         │ Approve Leave       │ View Reports
        │ View Leaves         │ Reject Leave        │ Manage Policies
        │ Cancel Leave        │ View Team Leaves    │ View All Leaves
        │ View Balance        │                     │
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              │
                         ┌────▼────┐
                         │  Admin  │
                         └────┬────┘
                              │
                              │ Manage Users
                              │ System Configuration
                              │ Full Access
```

## Activity Diagram: Leave Approval Process

```
[Start] → [Employee Applies for Leave]
    ↓
[System Validates Input]
    ↓
[Check Leave Balance]
    ↓
{Sufficient Balance?}
    ├─ No → [Return Error] → [End]
    └─ Yes ↓
[Check for Overlapping Leaves]
    ↓
{Overlap Found?}
    ├─ Yes → [Return Error] → [End]
    └─ No ↓
[Create Leave Request]
    ↓
[Update Balance (Reserve Days)]
    ↓
[Notify Manager]
    ↓
[Manager Reviews Request]
    ↓
{Decision}
    ├─ Approve → [Update Status to Approved]
    │              ↓
    │         [Deduct from Balance]
    │              ↓
    │         [Notify Employee]
    │              ↓
    │         [End]
    │
    └─ Reject → [Update Status to Rejected]
                 ↓
            [Restore Balance]
                 ↓
            [Notify Employee]
                 ↓
            [End]
```

## Deployment Diagram

```
                    ┌──────────────┐
                    │   Client     │
                    │  (Browser)   │
                    └──────┬───────┘
                           │
                           │ HTTP/HTTPS
                           │
        ┌──────────────────▼──────────────────┐
        │         Load Balancer                │
        └──────────────────┬──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐        ┌────▼────┐       ┌────▼────┐
   │  Node.js│        │  Node.js│       │  Node.js│
   │  Server │        │  Server │       │  Server │
   │   (App) │        │   (App) │       │   (App) │
   └────┬────┘        └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐
                    │   MongoDB   │
                    │  (Database) │
                    └─────────────┘
```

## Component Diagram

```
┌─────────────────────────────────────────────────┐
│           Leave Management System                │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐           │
│  │  Auth Module │  │ Leave Module │           │
│  │              │  │              │           │
│  │ - Register   │  │ - Create     │           │
│  │ - Login      │  │ - Update     │           │
│  │ - Profile    │  │ - Cancel     │           │
│  └──────────────┘  └──────────────┘           │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ Approval     │  │ Balance      │           │
│  │ Module       │  │ Module       │           │
│  │              │  │              │           │
│  │ - Approve    │  │ - View       │           │
│  │ - Reject     │  │ - Update     │           │
│  │ - Pending    │  │ - Initialize │           │
│  └──────────────┘  └──────────────┘           │
│                                                  │
│  ┌──────────────────────────────────────┐      │
│  │         Database Layer                │      │
│  │  - User Model                         │      │
│  │  - Leave Model                        │      │
│  │  - LeaveBalance Model                 │      │
│  └──────────────────────────────────────┘      │
└─────────────────────────────────────────────────┘
```

## State Diagram: Leave Request States

```
[Initial State]
      │
      ▼
  [Pending] ────────┐
      │            │
      │            │
      ├─Approve───► [Approved]
      │            │
      │            │
      ├─Reject────► [Rejected]
      │            │
      │            │
      └─Cancel────► [Cancelled]
                    │
                    │
                    ▼
              [End State]
```

