# Stage 4: Backend API Development - Complete

## ✅ Implementation Summary

Stage 4 has been successfully completed with all REST API endpoints implemented and tested. The backend API provides comprehensive functionality for disaster management, emergency reporting, donations, notifications, and rescue operations.

---

## 📋 API Endpoints Created

### 1. Emergency Reports API

#### **POST** `/api/reports`
- **Description:** Create a new emergency report
- **Authentication:** Required (User, Volunteer, Admin)
- **Request Body:**
```json
{
  "latitude": 6.9271,
  "longitude": 79.8612,
  "description": "Building collapse, people trapped",
  "urgency": "critical",
  "disasterId": "optional-disaster-id"
}
```
- **Response:** `201 Created`
```json
{
  "id": "report-id",
  "userId": "user-id",
  "latitude": 6.9271,
  "longitude": 79.8612,
  "description": "Building collapse, people trapped",
  "urgency": "critical",
  "status": "pending",
  "createdAt": "2026-02-27T10:00:00Z",
  "user": { "name": "John Doe", "email": "john@example.com", "phone": "+94771234567" },
  "disaster": { "id": "disaster-id", "type": "Earthquake", "location": "Colombo" }
}
```

#### **GET** `/api/reports`
- **Description:** Get all emergency reports (filtered by user role)
- **Authentication:** Required
- **Query Parameters:**
  - `status` - Filter by status (pending/in-progress/resolved)
  - `disasterId` - Filter by disaster ID
- **Role-based Access:**
  - **USER:** Can only see their own reports
  - **VOLUNTEER/ADMIN:** Can see all reports
- **Response:** `200 OK` - Array of reports

#### **GET** `/api/reports/[id]`
- **Description:** Get single report details
- **Authentication:** Required
- **Response:** `200 OK` - Report object with user, disaster, and rescue operations

#### **PUT** `/api/reports/[id]`
- **Description:** Update report status
- **Authentication:** Required (Admin/Volunteer only)
- **Request Body:**
```json
{
  "status": "in-progress",
  "disasterId": "optional-disaster-id"
}
```

#### **DELETE** `/api/reports/[id]`
- **Description:** Delete a report
- **Authentication:** Required (Admin or report owner)

---

### 2. Disaster Management API

#### **POST** `/api/disasters`
- **Description:** Create a new disaster
- **Authentication:** Required (Admin only)
- **Request Body:**
```json
{
  "type": "Flood",
  "severity": "high",
  "location": "Gampaha District",
  "description": "Heavy rainfall causing severe flooding",
  "affectedAreas": ["Kelaniya", "Kaduwela", "Biyagama"],
  "startDate": "2026-02-27T00:00:00Z",
  "endDate": null,
  "status": "active"
}
```
- **Response:** `201 Created`

#### **GET** `/api/disasters`
- **Description:** Get all disasters (defaults to active disasters)
- **Authentication:** Not required (public access)
- **Query Parameters:**
  - `status` - Filter by status (active/resolved/monitoring)
  - `type` - Filter by disaster type
- **Response:** `200 OK`
```json
[
  {
    "id": "disaster-id",
    "type": "Flood",
    "severity": "high",
    "location": "Gampaha District",
    "description": "Heavy rainfall causing severe flooding",
    "affectedAreas": ["Kelaniya", "Kaduwela", "Biyagama"],
    "status": "active",
    "startDate": "2026-02-27T00:00:00Z",
    "reports": [...],
    "donations": [...],
    "_count": {
      "reports": 15,
      "donations": 8,
      "notifications": 3
    }
  }
]
```

#### **GET** `/api/disasters/[id]`
- **Description:** Get detailed disaster information
- **Authentication:** Not required
- **Response:** Disaster with all related reports, donations, and notifications

#### **PUT** `/api/disasters/[id]`
- **Description:** Update disaster information
- **Authentication:** Required (Admin only)

#### **DELETE** `/api/disasters/[id]`
- **Description:** Delete a disaster
- **Authentication:** Required (Admin only)

---

### 3. Donations API

#### **POST** `/api/donations`
- **Description:** Create a new donation
- **Authentication:** Optional (can be anonymous or authenticated)
- **Request Body:**
```json
{
  "donorName": "Sajith Perera",
  "donorContact": "+94771234567",
  "type": "food",
  "quantity": 50,
  "description": "Rice packets and water bottles",
  "disasterId": "optional-disaster-id"
}
```
- **Response:** `201 Created`

#### **GET** `/api/donations`
- **Description:** Get all donations
- **Authentication:** Required
- **Query Parameters:**
  - `status` - Filter by status (pending/distributed)
  - `disasterId` - Filter by disaster
  - `type` - Filter by donation type
- **Role-based Access:**
  - **USER:** Can only see their own donations
  - **VOLUNTEER/ADMIN:** Can see all donations

#### **GET** `/api/donations/[id]`
- **Description:** Get single donation details
- **Authentication:** Required

#### **PUT** `/api/donations/[id]`
- **Description:** Update donation status (e.g., mark as distributed)
- **Authentication:** Required (Admin/Volunteer only)
- **Request Body:**
```json
{
  "status": "distributed",
  "distributedAt": "2026-02-27T15:00:00Z"
}
```

#### **DELETE** `/api/donations/[id]`
- **Description:** Delete a donation
- **Authentication:** Required (Admin only)

---

### 4. Notifications API

#### **POST** `/api/notifications`
- **Description:** Create and send notification
- **Authentication:** Required (Admin only)
- **Request Body:**
```json
{
  "title": "Flood Alert - Gampaha",
  "message": "Heavy rainfall expected. Please evacuate low-lying areas.",
  "type": "alert",
  "disasterId": "optional-disaster-id",
  "targetAudience": "all"
}
```
- **Target Audiences:** `all`, `affected_area`, `volunteers`, `donors`
- **Response:** `201 Created`

#### **GET** `/api/notifications`
- **Description:** Get all notifications (limited to recent 50)
- **Authentication:** Not required
- **Query Parameters:**
  - `disasterId` - Filter by disaster
  - `type` - Filter by notification type
  - `targetAudience` - Filter by audience

---

### 5. Rescue Operations API

#### **POST** `/api/rescue-operations`
- **Description:** Create a new rescue operation
- **Authentication:** Required (Admin/Volunteer only)
- **Request Body:**
```json
{
  "reportId": "emergency-report-id",
  "assignedTeam": "Team Alpha - Fire Department",
  "priority": "high",
  "status": "assigned",
  "notes": "Building collapse rescue operation"
}
```
- **Response:** `201 Created`
- **Side Effects:** Updates associated report status to "in-progress"

#### **GET** `/api/rescue-operations`
- **Description:** Get all rescue operations (sorted by priority and date)
- **Authentication:** Required
- **Query Parameters:**
  - `status` - Filter by status (assigned/in-progress/completed)
  - `priority` - Filter by priority (low/medium/high/critical)
  - `reportId` - Get rescue ops for specific report

#### **GET** `/api/rescue-operations/[id]`
- **Description:** Get detailed rescue operation information
- **Authentication:** Required

#### **PUT** `/api/rescue-operations/[id]`
- **Description:** Update rescue operation status
- **Authentication:** Required (Admin/Volunteer only)
- **Request Body:**
```json
{
  "status": "completed",
  "notes": "All victims rescued successfully"
}
```
- **Side Effects:** When status is "completed", updates report status to "resolved"

#### **DELETE** `/api/rescue-operations/[id]`
- **Description:** Delete rescue operation
- **Authentication:** Required (Admin only)
- **Side Effects:** Resets associated report status to "pending"

---

### 6. Statistics API

#### **GET** `/api/stats`
- **Description:** Get dashboard statistics and analytics
- **Authentication:** Required
- **Response:** `200 OK`
```json
{
  "overview": {
    "totalDisasters": 10,
    "activeDisasters": 3,
    "totalReports": 145,
    "pendingReports": 12,
    "totalDonations": 87,
    "pendingDonations": 5,
    "totalRescueOps": 56,
    "activeRescueOps": 8,
    "totalUsers": 234
  },
  "recentActivity": {
    "reports": [...],
    "donations": [...]
  },
  "analytics": {
    "reportsByUrgency": {
      "low": 23,
      "medium": 45,
      "high": 56,
      "critical": 21
    },
    "donationsByType": [
      { "type": "food", "count": 34, "totalQuantity": 1250 },
      { "type": "clothing", "count": 28, "totalQuantity": 890 },
      { "type": "medical", "count": 25, "totalQuantity": 450 }
    ]
  }
}
```

---

## 🔐 Authentication & Authorization

### Authentication
All protected endpoints use **NextAuth.js** session-based authentication:
```javascript
const session = await getServerSession(authOptions)
if (!session) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

### Role-Based Access Control

| Endpoint | USER | VOLUNTEER | ADMIN |
|----------|------|-----------|-------|
| POST /api/reports | ✅ | ✅ | ✅ |
| GET /api/reports | ✅ (own only) | ✅ (all) | ✅ (all) |
| PUT /api/reports | ❌ | ✅ | ✅ |
| POST /api/disasters | ❌ | ❌ | ✅ |
| GET /api/disasters | ✅ | ✅ | ✅ |
| PUT /api/disasters | ❌ | ❌ | ✅ |
| POST /api/donations | ✅ | ✅ | ✅ |
| GET /api/donations | ✅ (own only) | ✅ (all) | ✅ (all) |
| PUT /api/donations | ❌ | ✅ | ✅ |
| POST /api/notifications | ❌ | ❌ | ✅ |
| POST /api/rescue-operations | ❌ | ✅ | ✅ |
| PUT /api/rescue-operations | ❌ | ✅ | ✅ |
| GET /api/stats | ✅ | ✅ | ✅ |

---

## 🛠️ Technical Implementation Details

### Database Integration
- **ORM:** Prisma 5.22.0
- **Database:** SQLite (development)
- **Connection:** Singleton pattern using `@/lib/db`

### Error Handling
All endpoints implement comprehensive error handling:
```javascript
try {
  // API logic
} catch (error) {
  console.error("Error description:", error)
  return NextResponse.json(
    { error: "User-friendly error message" }, 
    { status: 500 }
  )
}
```

### Input Validation
- Required field validation
- Type checking and parsing (e.g., `parseFloat` for coordinates)
- Existence checks for related entities
- Permission checks for ownership and roles

### Data Relationships
The API properly handles all Prisma relationships:
- `include` clauses for related data
- Cascade operations for data integrity
- Status updates across related entities

---

## 📝 API Testing Guide

### Using Test Credentials

Login first to get a session:
```bash
# Login as Admin
POST http://localhost:3000/api/auth/callback/credentials
{
  "email": "admin@dms.lk",
  "password": "admin123"
}
```

### Test Emergency Report Creation
```bash
# Login to your app first, then:
POST http://localhost:3000/api/reports
Content-Type: application/json

{
  "latitude": 6.9271,
  "longitude": 79.8612,
  "description": "Test emergency report",
  "urgency": "high"
}
```

### Test Disaster Creation (Admin only)
```bash
POST http://localhost:3000/api/disasters
Content-Type: application/json

{
  "type": "Flood",
  "severity": "medium",
  "location": "Colombo",
  "description": "Test flood",
  "affectedAreas": ["Colombo 1", "Colombo 2"],
  "startDate": "2026-02-27T00:00:00Z"
}
```

### Test Donation Submission
```bash
POST http://localhost:3000/api/donations
Content-Type: application/json

{
  "donorName": "Test Donor",
  "donorContact": "+94771234567",
  "type": "food",
  "quantity": 10,
  "description": "Rice and water"
}
```

---

## 🔄 Data Flow Examples

### Emergency Report Workflow
1. **User submits report** → POST `/api/reports`
   - Creates EmergencyReport with status "pending"
   
2. **Admin assigns rescue team** → POST `/api/rescue-operations`
   - Creates RescueOperation
   - Updates Report status to "in-progress"
   
3. **Rescue team completes operation** → PUT `/api/rescue-operations/[id]`
   - Updates RescueOperation status to "completed"
   - Sets completedAt timestamp
   - Updates Report status to "resolved"

### Disaster Management Workflow
1. **Admin creates disaster** → POST `/api/disasters`
   - Creates Disaster with status "active"
   
2. **Admin sends notification** → POST `/api/notifications`
   - Creates Notification linked to disaster
   
3. **Users submit reports** → POST `/api/reports`
   - Creates EmergencyReports linked to disaster
   
4. **Donors contribute** → POST `/api/donations`
   - Creates Donations linked to disaster
   
5. **Admin closes disaster** → PUT `/api/disasters/[id]`
   - Updates status to "resolved"
   - Sets endDate

---

## 🚀 Next Steps (Stage 5)

With the backend APIs complete, Stage 5 will focus on:

1. **Frontend Components** - Building React components to consume these APIs
2. **Forms** - Emergency report forms, donation forms
3. **Admin Dashboard** - Management interfaces for disasters, reports, donations
4. **Real-time Updates** - Implementing data refresh mechanisms
5. **Map Integration** - Displaying emergency reports on interactive maps
6. **Notification Display** - Showing alerts and updates to users

---

## 📊 API Endpoints Summary

| Category | Endpoints | Methods |
|----------|-----------|---------|
| Reports | `/api/reports`, `/api/reports/[id]` | GET, POST, PUT, DELETE |
| Disasters | `/api/disasters`, `/api/disasters/[id]` | GET, POST, PUT, DELETE |
| Donations | `/api/donations`, `/api/donations/[id]` | GET, POST, PUT, DELETE |
| Notifications | `/api/notifications` | GET, POST |
| Rescue Ops | `/api/rescue-operations`, `/api/rescue-operations/[id]` | GET, POST, PUT, DELETE |
| Statistics | `/api/stats` | GET |

**Total API Endpoints:** 15 endpoints across 6 categories

---

## ✅ Stage 4 Completion Checklist

- [x] Emergency Report API (POST, GET, PUT, DELETE)
- [x] Disaster Management API (POST, GET, PUT, DELETE)
- [x] Donation Management API (POST, GET, PUT, DELETE)
- [x] Notification API (POST, GET)
- [x] Rescue Operation API (POST, GET, PUT, DELETE)
- [x] Statistics API (GET)
- [x] Role-based authorization implemented
- [x] Error handling and validation
- [x] Database relationships properly handled
- [x] API documentation created
- [x] Development server tested

---

**Stage 4 Status:** ✅ **COMPLETE**  
**Date Completed:** February 27, 2026  
**Next Stage:** Stage 5 - Frontend Development  
**Server Status:** Running on http://localhost:3000
