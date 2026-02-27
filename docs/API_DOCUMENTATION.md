# API Documentation
## Disaster Management System REST API

**Version:** 1.0.0  
**Base URL:** `https://yourdomain.com/api` or `http://localhost:3000/api`  
**Authentication:** Session-based (NextAuth.js)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Emergency Reports](#emergency-reports)
3. [Disasters](#disasters)
4. [Donations](#donations)
5. [Notifications](#notifications)
6. [Rescue Operations](#rescue-operations)
7. [Statistics](#statistics)
8. [Error Handling](#error-handling)

---

## Authentication

### Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "phone": "+94771234567",
  "role": "USER"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "User already exists"
}
```

### Login

**Endpoint:** `POST /api/auth/signin`

**Description:** Login with credentials (handled by NextAuth)

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123",
  "callbackUrl": "/dashboard"
}
```

**Response:** Redirects to dashboard with session cookie

### Logout

**Endpoint:** `POST /api/auth/signout`

**Description:** Logout and clear session

**Response:** Redirects to homepage

---

## Emergency Reports

### Get All Reports

**Endpoint:** `GET /api/reports`

**Description:** Get all emergency reports (paginated)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (PENDING, VERIFIED, RESOLVED)
- `severity` (optional): Filter by severity (LOW, MEDIUM, HIGH, CRITICAL)

**Authorization:** Authenticated users

**Response (200 OK):**
```json
{
  "reports": [
    {
      "id": 1,
      "title": "Flooding in Colombo",
      "description": "Heavy flooding on Galle Road",
      "location": "Colombo 03",
      "latitude": 6.9271,
      "longitude": 79.8612,
      "severity": "HIGH",
      "status": "PENDING",
      "reportedAt": "2026-02-27T10:30:00.000Z",
      "reporter": {
        "id": 2,
        "name": "John Doe",
        "phone": "+94771234567"
      }
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 3
}
```

### Get Report by ID

**Endpoint:** `GET /api/reports/:id`

**Description:** Get a specific emergency report

**Authorization:** Authenticated users

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Flooding in Colombo",
  "description": "Heavy flooding on Galle Road affecting multiple buildings",
  "location": "Colombo 03",
  "latitude": 6.9271,
  "longitude": 79.8612,
  "severity": "HIGH",
  "status": "PENDING",
  "reportedAt": "2026-02-27T10:30:00.000Z",
  "verifiedAt": null,
  "resolvedAt": null,
  "reporter": {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+94771234567"
  }
}
```

### Create Report

**Endpoint:** `POST /api/reports`

**Description:** Create a new emergency report

**Authorization:** Authenticated users (USER, VOLUNTEER, ADMIN)

**Request Body:**
```json
{
  "title": "Flooding in Colombo",
  "description": "Heavy flooding on Galle Road",
  "location": "Colombo 03",
  "latitude": 6.9271,
  "longitude": 79.8612,
  "severity": "HIGH"
}
```

**Response (201 Created):**
```json
{
  "message": "Emergency report created successfully",
  "report": {
    "id": 1,
    "title": "Flooding in Colombo",
    "status": "PENDING",
    "reportedAt": "2026-02-27T10:30:00.000Z"
  }
}
```

### Update Report Status

**Endpoint:** `PUT /api/reports/:id`

**Description:** Update report status (verify or resolve)

**Authorization:** ADMIN or VOLUNTEER only

**Request Body:**
```json
{
  "status": "VERIFIED"
}
```

**Response (200 OK):**
```json
{
  "message": "Report updated successfully",
  "report": {
    "id": 1,
    "status": "VERIFIED",
    "verifiedAt": "2026-02-27T11:00:00.000Z"
  }
}
```

### Delete Report

**Endpoint:** `DELETE /api/reports/:id`

**Description:** Delete an emergency report

**Authorization:** ADMIN only or report creator

**Response (200 OK):**
```json
{
  "message": "Report deleted successfully"
}
```

---

## Disasters

### Get All Disasters

**Endpoint:** `GET /api/disasters`

**Description:** Get all registered disasters

**Query Parameters:**
- `status` (optional): Filter by status (ACTIVE, RESOLVED)
- `type` (optional): Filter by type (FLOOD, EARTHQUAKE, LANDSLIDE, CYCLONE, FIRE, DROUGHT, OTHER)

**Authorization:** Public (no authentication required)

**Response (200 OK):**
```json
{
  "disasters": [
    {
      "id": 1,
      "name": "Colombo Flood 2026",
      "type": "FLOOD",
      "severity": "HIGH",
      "status": "ACTIVE",
      "affectedAreas": ["Colombo", "Gampaha", "Kalutara"],
      "startDate": "2026-02-20T00:00:00.000Z",
      "endDate": null,
      "description": "Severe flooding affecting Western Province",
      "estimatedAffected": 50000,
      "casualties": 5,
      "createdAt": "2026-02-20T08:00:00.000Z"
    }
  ]
}
```

### Get Disaster by ID

**Endpoint:** `GET /api/disasters/:id`

**Description:** Get detailed disaster information

**Authorization:** Public

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Colombo Flood 2026",
  "type": "FLOOD",
  "severity": "HIGH",
  "status": "ACTIVE",
  "affectedAreas": ["Colombo", "Gampaha", "Kalutara"],
  "startDate": "2026-02-20T00:00:00.000Z",
  "endDate": null,
  "description": "Severe flooding affecting Western Province due to heavy monsoon rains",
  "estimatedAffected": 50000,
  "casualties": 5,
  "createdAt": "2026-02-20T08:00:00.000Z",
  "updatedAt": "2026-02-27T10:00:00.000Z",
  "reports": [
    {
      "id": 1,
      "title": "Flooding in Colombo",
      "severity": "HIGH",
      "status": "VERIFIED"
    }
  ],
  "rescueOperations": [
    {
      "id": 1,
      "name": "Colombo Rescue Op 1",
      "status": "IN_PROGRESS"
    }
  ]
}
```

### Create Disaster

**Endpoint:** `POST /api/disasters`

**Description:** Register a new disaster event

**Authorization:** ADMIN only

**Request Body:**
```json
{
  "name": "Colombo Flood 2026",
  "type": "FLOOD",
  "severity": "HIGH",
  "affectedAreas": ["Colombo", "Gampaha", "Kalutara"],
  "startDate": "2026-02-20",
  "description": "Severe flooding affecting Western Province",
  "estimatedAffected": 50000,
  "casualties": 5
}
```

**Response (201 Created):**
```json
{
  "message": "Disaster created successfully",
  "disaster": {
    "id": 1,
    "name": "Colombo Flood 2026",
    "status": "ACTIVE"
  }
}
```

### Update Disaster

**Endpoint:** `PUT /api/disasters/:id`

**Description:** Update disaster information

**Authorization:** ADMIN only

**Request Body:**
```json
{
  "status": "RESOLVED",
  "endDate": "2026-02-27",
  "estimatedAffected": 55000,
  "casualties": 7
}
```

**Response (200 OK):**
```json
{
  "message": "Disaster updated successfully",
  "disaster": {
    "id": 1,
    "status": "RESOLVED",
    "endDate": "2026-02-27T00:00:00.000Z"
  }
}
```

### Delete Disaster

**Endpoint:** `DELETE /api/disasters/:id`

**Description:** Delete a disaster record

**Authorization:** ADMIN only

**Response (200 OK):**
```json
{
  "message": "Disaster deleted successfully"
}
```

---

## Donations

### Get All Donations

**Endpoint:** `GET /api/donations`

**Description:** Get all donation records

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, COMPLETED, FAILED)
- `disasterId` (optional): Filter by disaster

**Authorization:** Authenticated users (own donations) or ADMIN (all donations)

**Response (200 OK):**
```json
{
  "donations": [
    {
      "id": 1,
      "amount": 5000,
      "currency": "LKR",
      "donorName": "Anonymous",
      "donorEmail": "donor@example.com",
      "donorPhone": "+94771234567",
      "message": "Hope this helps",
      "status": "COMPLETED",
      "donatedAt": "2026-02-27T12:00:00.000Z",
      "disaster": {
        "id": 1,
        "name": "Colombo Flood 2026"
      }
    }
  ],
  "total": 125000,
  "count": 25
}
```

### Get Donation by ID

**Endpoint:** `GET /api/donations/:id`

**Description:** Get specific donation details

**Authorization:** Donor (own donation) or ADMIN

**Response (200 OK):**
```json
{
  "id": 1,
  "amount": 5000,
  "currency": "LKR",
  "donorName": "Anonymous",
  "donorEmail": "donor@example.com",
  "donorPhone": "+94771234567",
  "message": "Hope this helps",
  "status": "COMPLETED",
  "donatedAt": "2026-02-27T12:00:00.000Z",
  "disaster": {
    "id": 1,
    "name": "Colombo Flood 2026",
    "type": "FLOOD"
  }
}
```

### Create Donation

**Endpoint:** `POST /api/donations`

**Description:** Submit a new donation

**Authorization:** Public (no authentication required)

**Request Body:**
```json
{
  "amount": 5000,
  "donorName": "John Doe",
  "donorEmail": "john@example.com",
  "donorPhone": "+94771234567",
  "message": "Hope this helps the affected families",
  "disasterId": 1
}
```

**Response (201 Created):**
```json
{
  "message": "Donation submitted successfully",
  "donation": {
    "id": 1,
    "amount": 5000,
    "status": "PENDING",
    "donatedAt": "2026-02-27T12:00:00.000Z"
  }
}
```

### Update Donation Status

**Endpoint:** `PUT /api/donations/:id`

**Description:** Update donation status (process payment)

**Authorization:** ADMIN only

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

**Response (200 OK):**
```json
{
  "message": "Donation status updated successfully",
  "donation": {
    "id": 1,
    "status": "COMPLETED"
  }
}
```

---

## Notifications

### Get User Notifications

**Endpoint:** `GET /api/notifications`

**Description:** Get notifications for the authenticated user

**Query Parameters:**
- `unread` (optional): Filter unread notifications (true/false)

**Authorization:** Authenticated users

**Response (200 OK):**
```json
{
  "notifications": [
    {
      "id": 1,
      "title": "Report Verified",
      "message": "Your emergency report has been verified by an admin",
      "type": "REPORT_UPDATE",
      "read": false,
      "createdAt": "2026-02-27T11:00:00.000Z"
    }
  ],
  "unreadCount": 3
}
```

### Mark Notification as Read

**Endpoint:** `PUT /api/notifications/:id`

**Description:** Mark a notification as read

**Authorization:** Notification owner

**Response (200 OK):**
```json
{
  "message": "Notification marked as read",
  "notification": {
    "id": 1,
    "read": true
  }
}
```

### Delete Notification

**Endpoint:** `DELETE /api/notifications/:id`

**Description:** Delete a notification

**Authorization:** Notification owner

**Response (200 OK):**
```json
{
  "message": "Notification deleted successfully"
}
```

---

## Rescue Operations

### Get All Rescue Operations

**Endpoint:** `GET /api/rescue-operations`

**Description:** Get all rescue operations

**Query Parameters:**
- `status` (optional): Filter by status (PLANNED, IN_PROGRESS, COMPLETED, CANCELLED)
- `disasterId` (optional): Filter by disaster

**Authorization:** VOLUNTEER or ADMIN

**Response (200 OK):**
```json
{
  "operations": [
    {
      "id": 1,
      "name": "Colombo Rescue Op 1",
      "description": "Evacuation of flood-affected residents",
      "location": "Colombo 03",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "startTime": "2026-02-27T08:00:00.000Z",
      "endTime": null,
      "assignedTeam": "Team Alpha",
      "resourcesNeeded": ["Boats", "Life jackets", "First aid kits"],
      "disaster": {
        "id": 1,
        "name": "Colombo Flood 2026"
      }
    }
  ]
}
```

### Create Rescue Operation

**Endpoint:** `POST /api/rescue-operations`

**Description:** Create a new rescue operation

**Authorization:** ADMIN only

**Request Body:**
```json
{
  "name": "Colombo Rescue Op 1",
  "description": "Evacuation of flood-affected residents",
  "location": "Colombo 03",
  "priority": "HIGH",
  "startTime": "2026-02-27T08:00:00.000Z",
  "assignedTeam": "Team Alpha",
  "resourcesNeeded": ["Boats", "Life jackets", "First aid kits"],
  "disasterId": 1
}
```

**Response (201 Created):**
```json
{
  "message": "Rescue operation created successfully",
  "operation": {
    "id": 1,
    "name": "Colombo Rescue Op 1",
    "status": "PLANNED"
  }
}
```

### Update Rescue Operation

**Endpoint:** `PUT /api/rescue-operations/:id`

**Description:** Update rescue operation status/details

**Authorization:** ADMIN or assigned VOLUNTEER

**Request Body:**
```json
{
  "status": "COMPLETED",
  "endTime": "2026-02-27T16:00:00.000Z"
}
```

**Response (200 OK):**
```json
{
  "message": "Rescue operation updated successfully",
  "operation": {
    "id": 1,
    "status": "COMPLETED",
    "endTime": "2026-02-27T16:00:00.000Z"
  }
}
```

---

## Statistics

### Get Dashboard Statistics

**Endpoint:** `GET /api/stats`

**Description:** Get system-wide statistics

**Authorization:** Authenticated users

**Response (200 OK):**
```json
{
  "overview": {
    "totalReports": 156,
    "activeDisasters": 3,
    "totalDonations": 2500000,
    "activeRescueOps": 5
  },
  "reports": {
    "pending": 23,
    "verified": 89,
    "resolved": 44
  },
  "disasters": {
    "flood": 2,
    "landslide": 1,
    "fire": 0
  },
  "recentActivity": [
    {
      "type": "REPORT_CREATED",
      "title": "New emergency report",
      "timestamp": "2026-02-27T14:30:00.000Z"
    }
  ]
}
```

### Get Disaster Statistics

**Endpoint:** `GET /api/stats/disasters/:id`

**Description:** Get statistics for a specific disaster

**Authorization:** Authenticated users

**Response (200 OK):**
```json
{
  "disaster": {
    "id": 1,
    "name": "Colombo Flood 2026"
  },
  "statistics": {
    "totalReports": 45,
    "verifiedReports": 38,
    "affectedPeople": 50000,
    "casualties": 5,
    "totalDonations": 1500000,
    "donationCount": 150,
    "rescueOperations": 8,
    "completedRescues": 5
  }
}
```

---

## Error Handling

### Error Response Format

All API errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `405 Method Not Allowed` - HTTP method not supported
- `500 Internal Server Error` - Server error

### Common Error Messages

**401 Unauthorized:**
```json
{
  "error": "You must be logged in to access this resource"
}
```

**403 Forbidden:**
```json
{
  "error": "You do not have permission to perform this action"
}
```

**404 Not Found:**
```json
{
  "error": "Report not found"
}
```

**400 Bad Request:**
```json
{
  "error": "Missing required field: title"
}
```

**500 Internal Server Error:**
```json
{
  "error": "An unexpected error occurred. Please try again later."
}
```

---

## Rate Limiting

**General Endpoints:** 10 requests per second per IP  
**API Endpoints:** 30 requests per second per IP

When rate limit exceeded:
```json
{
  "error": "Too many requests. Please try again later."
}
```

---

## Data Types

### Enums

**User Role:**
- `USER` - Regular user
- `VOLUNTEER` - Volunteer responder
- `ADMIN` - System administrator

**Report Severity:**
- `LOW` - Minor issue
- `MEDIUM` - Moderate concern
- `HIGH` - Serious situation
- `CRITICAL` - Life-threatening emergency

**Report Status:**
- `PENDING` - Awaiting verification
- `VERIFIED` - Confirmed by admin
- `RESOLVED` - Issue resolved

**Disaster Type:**
- `FLOOD`
- `EARTHQUAKE`
- `LANDSLIDE`
- `CYCLONE`
- `FIRE`
- `DROUGHT`
- `OTHER`

**Disaster Status:**
- `ACTIVE` - Ongoing disaster
- `RESOLVED` - Disaster ended

**Donation Status:**
- `PENDING` - Payment processing
- `COMPLETED` - Payment successful
- `FAILED` - Payment failed

**Rescue Operation Status:**
- `PLANNED` - Scheduled
- `IN_PROGRESS` - Currently active
- `COMPLETED` - Successfully completed
- `CANCELLED` - Operation cancelled

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Response includes:**
- `total` - Total number of items
- `page` - Current page number
- `totalPages` - Total number of pages
- `data` - Array of items

---

## Authentication Flow

1. **Register:** `POST /api/auth/register`
2. **Login:** `POST /api/auth/signin`
3. **Session cookie automatically sent with subsequent requests**
4. **Access protected endpoints with valid session**
5. **Logout:** `POST /api/auth/signout`

---

## Testing the API

### Using cURL

```bash
# Get all disasters (public)
curl https://yourdomain.com/api/disasters

# Create emergency report (requires authentication)
curl -X POST https://yourdomain.com/api/reports \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "title": "Test Report",
    "description": "Test description",
    "location": "Colombo",
    "latitude": 6.9271,
    "longitude": 79.8612,
    "severity": "MEDIUM"
  }'
```

### Using Postman

1. Import the API endpoints
2. Set base URL to `http://localhost:3000/api`
3. For authenticated requests, first login and copy session cookie
4. Add cookie to subsequent requests

---

## Webhooks (Future Enhancement)

Planned webhook support for:
- New disaster alerts
- Report status changes
- Donation confirmations
- Rescue operation updates

---

**Last Updated:** February 27, 2026  
**API Version:** 1.0.0  
**Maintained by:** Disaster Management System Team
