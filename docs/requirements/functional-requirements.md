# Functional Requirements

## FR1: User Authentication and Authorization

### FR1.1: User Registration
- **Description:** Users should be able to register with email and password
- **Priority:** High
- **Acceptance Criteria:**
  - User can register with name, email, password
  - Email must be unique
  - Password must be at least 6 characters
  - User role defaults to 'employee' if not specified
  - System validates all input fields
  - Password is hashed before storage

### FR1.2: User Login
- **Description:** Users should be able to login with email and password
- **Priority:** High
- **Acceptance Criteria:**
  - User can login with valid credentials
  - System returns JWT token on successful login
  - System updates last login timestamp
  - Invalid credentials return error message
  - Inactive users cannot login

### FR1.3: Role-Based Access Control
- **Description:** System supports multiple user roles with different permissions
- **Priority:** High
- **Roles:**
  - **Employee:** Can apply for leave, view own leaves
  - **Manager:** Can approve/reject leaves, view team leaves
  - **HR:** Can view all leaves, manage leave policies
  - **Admin:** Full system access
- **Acceptance Criteria:**
  - Each role has appropriate permissions
  - Unauthorized access is prevented
  - Role is assigned during registration

## FR2: Leave Application

### FR2.1: Apply for Leave
- **Description:** Employees can apply for different types of leave
- **Priority:** High
- **Acceptance Criteria:**
  - Employee can select leave type (sick, casual, annual, etc.)
  - Employee can specify start and end dates
  - Employee must provide reason for leave
  - System calculates number of days automatically
  - System checks for overlapping leaves
  - System validates leave balance availability
  - Leave status is set to 'pending' on creation

### FR2.2: Leave Types
- **Description:** System supports multiple leave types
- **Priority:** High
- **Leave Types:**
  - Sick Leave
  - Casual Leave
  - Annual Leave
  - Maternity Leave
  - Paternity Leave
  - Unpaid Leave
  - Compensatory Leave
- **Acceptance Criteria:**
  - Each leave type has specific rules
  - Leave types are configurable
  - System tracks balance for each type

### FR2.3: View Leave History
- **Description:** Users can view their leave history
- **Priority:** Medium
- **Acceptance Criteria:**
  - Employee can view all their leave requests
  - System displays leave status, dates, type
  - System supports filtering by status, type, date range
  - System shows approval/rejection details

### FR2.4: Update Leave Request
- **Description:** Employees can update pending leave requests
- **Priority:** Medium
- **Acceptance Criteria:**
  - Only pending leaves can be updated
  - Employee can update dates, reason
  - System validates updated dates
  - System checks for overlaps with updated dates

### FR2.5: Cancel Leave Request
- **Description:** Employees can cancel their leave requests
- **Priority:** Medium
- **Acceptance Criteria:**
  - Pending leaves can be cancelled
  - Approved leaves can be cancelled if not started
  - System updates leave balance on cancellation
  - Cancelled leaves cannot be modified

## FR3: Leave Approval

### FR3.1: View Pending Approvals
- **Description:** Managers can view pending leave requests from their team
- **Priority:** High
- **Acceptance Criteria:**
  - Manager sees all pending leaves from direct reports
  - System displays employee details, leave dates, reason
  - System shows leave type and number of days
  - List is sorted by application date

### FR3.2: Approve Leave
- **Description:** Managers can approve leave requests
- **Priority:** High
- **Acceptance Criteria:**
  - Manager can approve pending leaves
  - System updates leave status to 'approved'
  - System records approval date and approver
  - System updates leave balance (deducts from available)
  - Employee receives notification

### FR3.3: Reject Leave
- **Description:** Managers can reject leave requests
- **Priority:** High
- **Acceptance Criteria:**
  - Manager can reject pending leaves
  - Manager must provide rejection reason
  - System updates leave status to 'rejected'
  - System records rejection date and approver
  - System restores leave balance
  - Employee receives notification

## FR4: Leave Balance Management

### FR4.1: View Leave Balance
- **Description:** Users can view their leave balance
- **Priority:** High
- **Acceptance Criteria:**
  - Employee can view balance for each leave type
  - System shows total, used, available, and pending leaves
  - Balance is calculated for current year
  - System supports viewing previous year balances

### FR4.2: Automatic Balance Updates
- **Description:** System automatically updates leave balance
- **Priority:** High
- **Acceptance Criteria:**
  - Balance decreases when leave is approved
  - Balance increases when leave is rejected/cancelled
  - Pending leaves are reserved from available balance
  - System handles balance updates correctly

### FR4.3: Balance Initialization
- **Description:** System initializes leave balance for new employees
- **Priority:** Medium
- **Acceptance Criteria:**
  - New employees get default balances
  - Defaults are configurable per leave type
  - System creates balance record on employee creation

## FR5: Reporting and Analytics

### FR5.1: Leave Reports
- **Description:** HR and managers can generate leave reports
- **Priority:** Medium
- **Acceptance Criteria:**
  - System generates reports by department, employee, date range
  - Reports show leave statistics
  - Reports can be filtered and exported
  - System provides dashboard with key metrics

### FR5.2: Leave Calendar
- **Description:** Users can view leave calendar
- **Priority:** Low
- **Acceptance Criteria:**
  - Calendar shows approved leaves
  - Calendar can be filtered by employee, department
  - Calendar shows leave type and duration

## FR6: Notifications

### FR6.1: Leave Status Notifications
- **Description:** System sends notifications for leave status changes
- **Priority:** Medium
- **Acceptance Criteria:**
  - Employee receives notification when leave is approved/rejected
  - Manager receives notification when new leave is requested
  - Notifications include relevant details

