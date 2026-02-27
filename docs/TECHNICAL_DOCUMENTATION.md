# Technical Documentation
## Disaster Management System - Architecture & Implementation

**Project:** Disaster Management System (PUSL3190)  
**Developer:** Liyana Kulathilake (10952376)  
**Supervisor:** Ms. Dulanjali Wijesekara  
**Version:** 1.0.0  
**Last Updated:** February 27, 2026

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Design](#database-design)
5. [API Architecture](#api-architecture)
6. [Authentication & Authorization](#authentication--authorization)
7. [Frontend Architecture](#frontend-architecture)
8. [Security Implementation](#security-implementation)
9. [Performance Optimization](#performance-optimization)
10. [Development Workflow](#development-workflow)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Architecture](#deployment-architecture)

---

## System Overview

### Purpose

The Disaster Management System (DMS) is a web-based platform designed to facilitate emergency response and disaster coordination in Sri Lanka. It enables citizens to report emergencies, authorities to manage disasters, and donors to contribute to relief efforts.

### Key Features

1. **Emergency Reporting**
   - Real-time emergency report submission
   - GPS location capture
   - Severity classification
   - Status tracking

2. **Disaster Management**
   - Disaster event tracking
   - Affected area management
   - Casualty and impact monitoring
   - Status updates and notifications

3. **Donation Management**
   - Online donation processing
   - Transaction tracking
   - Financial reporting
   - Transparency and accountability

4. **Rescue Operations**
   - Operation planning and coordination
   - Resource allocation
   - Team assignment
   - Progress tracking

5. **User Management**
   - Role-based access control
   - Profile management
   - Activity tracking
   - Notification preferences

### System Requirements

**Client-Side:**
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- Internet connection
- GPS capability (optional, for location features)

**Server-Side:**
- Node.js 18.x or higher
- PostgreSQL 15.x (production) or SQLite (development)
- Minimum 1GB RAM
- 20GB storage
- Ubuntu 22.04 LTS (recommended for production)

---

## Technology Stack

### Frontend

**Framework:**
- **Next.js 16.1.6** - React framework with SSR and App Router
- **React 19.0.0** - Component-based UI library

**Styling:**
- **Tailwind CSS 4.0.0** - Utility-first CSS framework
- **DaisyUI 5.5.19** - Component library for Tailwind
- **PostCSS** - CSS processing

**Form Management:**
- **React Hook Form 7.71.2** - Performant form validation
- **Client-side validation** - Real-time error feedback

**Icons:**
- **Lucide React** - Modern icon library

### Backend

**Runtime:**
- **Node.js 18+** - JavaScript runtime

**Framework:**
- **Next.js API Routes** - Serverless API endpoints

**Database:**
- **Prisma 5.22.0** - Modern ORM
- **SQLite** - Development database
- **PostgreSQL 15** - Production database

**Authentication:**
- **NextAuth.js 4.24.13** - Authentication library
- **bcryptjs 3.0.3** - Password hashing

### Development Tools

**Testing:**
- **Jest 29.7.0** - Testing framework
- **React Testing Library 16.1.0** - Component testing
- **@testing-library/jest-dom** - Custom matchers

**Code Quality:**
- **ESLint** - Code linting
- **Prettier** - Code formatting (optional)

**Version Control:**
- **Git** - Source control
- **GitHub** - Repository hosting

### Deployment

**Containerization:**
- **Docker** - Container platform
- **Docker Compose** - Multi-container orchestration

**Web Server:**
- **Nginx** - Reverse proxy, load balancing, SSL termination

**Cloud Platforms:**
- **Vercel** - Serverless deployment (recommended)
- **DigitalOcean/AWS** - VPS hosting

---

## System Architecture

### Architecture Pattern

The system follows a **three-tier architecture**:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Next.js Frontend + Server Components) │
└──────────────┬──────────────────────────┘
               │
               ├─ HTTP/HTTPS
               │
┌──────────────▼──────────────────────────┐
│         Application Layer               │
│   (Next.js API Routes + Business Logic) │
└──────────────┬──────────────────────────┘
               │
               ├─ Prisma ORM
               │
┌──────────────▼──────────────────────────┐
│          Data Layer                     │
│  (PostgreSQL Database + File Storage)   │
└─────────────────────────────────────────┘
```

### Component Architecture

```
disaster-management-system/
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.js           # Root layout
│   │   ├── page.js             # Homepage
│   │   │
│   │   ├── api/                # API Routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── reports/        # Emergency reports API
│   │   │   ├── disasters/      # Disasters API
│   │   │   ├── donations/      # Donations API
│   │   │   ├── notifications/  # Notifications API
│   │   │   ├── rescue-operations/ # Rescue ops API
│   │   │   ├── stats/          # Statistics API
│   │   │   └── health/         # Health check endpoint
│   │   │
│   │   ├── auth/               # Auth pages (login, register)
│   │   ├── dashboard/          # User dashboard
│   │   ├── disasters/          # Disaster pages
│   │   ├── donate/             # Donation page
│   │   └── admin/              # Admin panel
│   │
│   └── components/             # Reusable components
│       ├── DonationForm.js
│       ├── EmergencyReportForm.js
│       ├── DisasterCard.js
│       └── ...
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   └── seed.js                 # Seed data
│
├── __tests__/                  # Test suites
│   ├── api/                    # API unit tests
│   ├── components/             # Component tests
│   └── integration/            # Integration tests
│
├── public/                     # Static assets
├── scripts/                    # Deployment scripts
├── nginx/                      # Nginx configuration
└── docs/                       # Documentation
```

### Request Flow

1. **Client Request**
   - User accesses page or submits form
   - Browser sends HTTP request

2. **Next.js Routing**
   - App Router handles route
   - Server components render on server
   - Client components hydrate on client

3. **API Processing**
   - API route receives request
   - Validates authentication/authorization
   - Processes business logic

4. **Database Operations**
   - Prisma ORM translates queries
   - Database executes operations
   - Returns data to API

5. **Response Generation**
   - API formats response (JSON)
   - Next.js renders page (HTML)
   - Client receives response

6. **Client Update**
   - React updates UI
   - User sees result

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ├─────┬─────────────┬──────────────┬─────────────┐
       │     │             │              │             │
       │     │             │              │             │
┌──────▼─────▼───┐  ┌──────▼──────┐  ┌───▼────────┐  ┌▼───────────┐
│ EmergencyReport│  │  Donation   │  │Notification│  │RescueOp    │
└────────┬────────┘  └──────┬──────┘  └────────────┘  └─┬──────────┘
         │                  │                            │
         │                  │                            │
         └──────────┬───────┴────────────────────────────┘
                    │
             ┌──────▼──────┐
             │  Disaster   │
             └─────────────┘
```

### Database Schema

#### User Model

```prisma
model User {
  id                Int                 @id @default(autoincrement())
  name              String
  email             String              @unique
  password          String
  phone             String?
  role              Role                @default(USER)
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  
  // Relations
  reports           EmergencyReport[]
  donations         Donation[]
  notifications     Notification[]
  assignedOperations RescueOperation[]
}

enum Role {
  USER
  VOLUNTEER
  ADMIN
}
```

#### EmergencyReport Model

```prisma
model EmergencyReport {
  id           Int        @id @default(autoincrement())
  title        String
  description  String
  location     String
  latitude     Float?
  longitude    Float?
  severity     Severity
  status       ReportStatus @default(PENDING)
  reportedAt   DateTime   @default(now())
  verifiedAt   DateTime?
  resolvedAt   DateTime?
  
  reporterId   Int
  reporter     User       @relation(fields: [reporterId], references: [id])
  
  disasterId   Int?
  disaster     Disaster?  @relation(fields: [disasterId], references: [id])
}

enum Severity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum ReportStatus {
  PENDING
  VERIFIED
  RESOLVED
}
```

#### Disaster Model

```prisma
model Disaster {
  id                Int               @id @default(autoincrement())
  name              String
  type              DisasterType
  severity          Severity
  status            DisasterStatus    @default(ACTIVE)
  affectedAreas     String[]
  startDate         DateTime
  endDate           DateTime?
  description       String
  estimatedAffected Int?
  casualties        Int?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  // Relations
  reports           EmergencyReport[]
  donations         Donation[]
  rescueOperations  RescueOperation[]
}

enum DisasterType {
  FLOOD
  EARTHQUAKE
  LANDSLIDE
  CYCLONE
  FIRE
  DROUGHT
  OTHER
}

enum DisasterStatus {
  ACTIVE
  RESOLVED
}
```

#### Donation Model

```prisma
model Donation {
  id          Int            @id @default(autoincrement())
  amount      Float
  currency    String         @default("LKR")
  donorName   String
  donorEmail  String
  donorPhone  String?
  message     String?
  status      DonationStatus @default(PENDING)
  donatedAt   DateTime       @default(now())
  
  userId      Int?
  user        User?          @relation(fields: [userId], references: [id])
  
  disasterId  Int?
  disaster    Disaster?      @relation(fields: [disasterId], references: [id])
}

enum DonationStatus {
  PENDING
  COMPLETED
  FAILED
}
```

#### Notification Model

```prisma
model Notification {
  id        Int      @id @default(autoincrement())
  title     String
  message   String
  type      String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}
```

#### RescueOperation Model

```prisma
model RescueOperation {
  id              Int                   @id @default(autoincrement())
  name            String
  description     String
  location        String
  status          RescueOperationStatus @default(PLANNED)
  priority        Severity
  startTime       DateTime
  endTime         DateTime?
  assignedTeam    String?
  resourcesNeeded String[]
  createdAt       DateTime              @default(now())
  updatedAt       DateTime              @updatedAt
  
  disasterId      Int
  disaster        Disaster              @relation(fields: [disasterId], references: [id])
  
  coordinatorId   Int?
  coordinator     User?                 @relation(fields: [coordinatorId], references: [id])
}

enum RescueOperationStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

### Database Indexes

**Optimized queries with indexes on:**
- `User.email` (unique index)
- `EmergencyReport.reporterId`
- `EmergencyReport.disasterId`
- `EmergencyReport.status`
- `Disaster.status`
- `Donation.disasterId`
- `Notification.userId`
- `RescueOperation.disasterId`

---

## API Architecture

### RESTful API Design

**API follows REST principles:**
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Stateless communication
- Standard HTTP status codes

### API Endpoint Structure

```
/api
├── /auth
│   ├── POST /register          # User registration
│   ├── POST /signin            # User login (NextAuth)
│   └── POST /signout           # User logout
│
├── /reports
│   ├── GET    /reports         # List all reports
│   ├── GET    /reports/:id     # Get single report
│   ├── POST   /reports         # Create report
│   ├── PUT    /reports/:id     # Update report
│   └── DELETE /reports/:id     # Delete report
│
├── /disasters
│   ├── GET    /disasters       # List disasters
│   ├── GET    /disasters/:id   # Get disaster
│   ├── POST   /disasters       # Create disaster (Admin)
│   ├── PUT    /disasters/:id   # Update disaster (Admin)
│   └── DELETE /disasters/:id   # Delete disaster (Admin)
│
├── /donations
│   ├── GET    /donations       # List donations
│   ├── GET    /donations/:id   # Get donation
│   ├── POST   /donations       # Submit donation
│   └── PUT    /donations/:id   # Update status (Admin)
│
├── /notifications
│   ├── GET    /notifications   # User notifications
│   ├── PUT    /notifications/:id # Mark as read
│   └── DELETE /notifications/:id # Delete notification
│
├── /rescue-operations
│   ├── GET    /rescue-operations    # List operations
│   ├── POST   /rescue-operations    # Create (Admin)
│   └── PUT    /rescue-operations/:id # Update
│
├── /stats
│   ├── GET /stats              # Dashboard statistics
│   └── GET /stats/disasters/:id # Disaster statistics
│
└── /health
    └── GET /health             # Health check
```

### API Implementation Pattern

**Example API Route Structure:**

```javascript
// src/app/api/reports/route.js

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/reports
export async function GET(request) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    // 3. Build query conditions
    const where = {};
    if (status) where.status = status;

    // 4. Database query
    const reports = await prisma.emergencyReport.findMany({
      where,
      include: { reporter: true, disaster: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { reportedAt: 'desc' }
    });

    // 5. Get total count
    const total = await prisma.emergencyReport.count({ where });

    // 6. Return response
    return Response.json({
      reports,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reports
export async function POST(request) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const { title, description, location, latitude, longitude, severity } = body;

    if (!title || !description || !location || !severity) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 3. Create report
    const report = await prisma.emergencyReport.create({
      data: {
        title,
        description,
        location,
        latitude,
        longitude,
        severity,
        reporterId: session.user.id
      }
    });

    // 4. Return success response
    return Response.json(
      { message: 'Report created successfully', report },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating report:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Error Handling

**Consistent error responses:**

```javascript
// 400 Bad Request
{ "error": "Missing required field: title" }

// 401 Unauthorized
{ "error": "You must be logged in" }

// 403 Forbidden
{ "error": "You don't have permission" }

// 404 Not Found
{ "error": "Report not found" }

// 500 Internal Server Error
{ "error": "An unexpected error occurred" }
```

---

## Authentication & Authorization

### NextAuth.js Implementation

**Configuration:**

```javascript
// src/app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error('No user found');
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Return user (stored in session)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Role-Based Access Control

**Authorization middleware:**

```javascript
// Utility function to check user role
export async function requireRole(request, requiredRole) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  if (session.user.role !== requiredRole && 
      session.user.role !== 'ADMIN') {
    return Response.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }
  
  return null; // Authorized
}

// Usage in API routes
export async function POST(request) {
  // Only ADMIN can create disasters
  const authError = await requireRole(request, 'ADMIN');
  if (authError) return authError;
  
  // Proceed with logic...
}
```

### Password Security

**Password hashing with bcrypt:**

```javascript
import bcrypt from 'bcryptjs';

// Registration
const hashedPassword = await bcrypt.hash(password, 10);

// Login verification
const isValid = await bcrypt.compare(password, user.password);
```

---

## Frontend Architecture

### Component Structure

**Component Hierarchy:**

```
App Layout
├── Navigation
├── Page Content
│   ├── Emergency Report Form
│   │   ├── Input Fields
│   │   ├── Location Picker
│   │   └── Submit Button
│   │
│   ├── Disaster List
│   │   └── Disaster Card (repeated)
│   │       ├── Disaster Info
│   │       └── Action Buttons
│   │
│   └── Dashboard
│       ├── Statistics Cards
│       ├── Recent Reports
│       └── Activity Feed
│
└── Footer
```

### State Management

**Using React Hooks:**

```javascript
// useState for component state
const [reports, setReports] = useState([]);
const [loading, setLoading] = useState(true);

// useEffect for side effects
useEffect(() => {
  async function fetchReports() {
    const response = await fetch('/api/reports');
    const data = await response.json();
    setReports(data.reports);
    setLoading(false);
  }
  fetchReports();
}, []);

// React Hook Form for forms
const { register, handleSubmit, formState: { errors } } = useForm();
```

### Data Fetching

**Client-side fetching:**

```javascript
async function submitReport(data) {
  try {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit');
    }
    
    const result = await response.json();
    alert('Report submitted successfully!');
  } catch (error) {
    alert('Error: ' + error.message);
  }
}
```

### Styling Architecture

**Tailwind CSS utility classes:**

```jsx
<div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold text-gray-900 mb-6">
    Emergency Reports
  </h1>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {reports.map(report => (
      <div key={report.id} className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{report.title}</h2>
          <p>{report.description}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">View Details</button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## Security Implementation

### Security Measures

1. **Input Validation**
   - Client-side validation with React Hook Form
   - Server-side validation in API routes
   - SQL injection prevention via Prisma ORM

2. **Authentication**
   - Session-based authentication
   - Secure password hashing (bcrypt)
   - JWT tokens for session management

3. **Authorization**
   - Role-based access control
   - Protected API routes
   - Middleware checks

4. **HTTPS/SSL**
   - SSL certificates (Let's Encrypt)
   - HTTPS enforcement
   - Secure cookies

5. **Security Headers**
   - Content Security Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - Referrer Policy

6. **Rate Limiting**
   - Nginx rate limiting (10 req/s general, 30 req/s API)
   - Prevents brute force attacks
   - DDoS protection

7. **Data Protection**
   - Environment variables for secrets
   - Database credential encryption
   - No sensitive data in client code

---

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**
   - Next.js automatic code splitting
   - Dynamic imports for large components
   - Lazy loading

2. **Image Optimization**
   - Next.js Image component
   - Automatic WebP conversion
   - Responsive images

3. **Caching**
   - Browser caching
   - Static asset caching (365 days)
   - API response caching

### Backend Optimization

1. **Database Optimization**
   - Indexed queries
   - Efficient Prisma queries
   - Connection pooling

2. **API Optimization**
   - Pagination for large datasets
   - Selective field inclusion
   - Query result caching

3. **Server Optimization**
   - Gzip compression
   - CDN for static assets
   - Load balancing (production)

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

### Git Workflow

1. Create feature branch
2. Make changes
3. Test locally
4. Commit with descriptive message
5. Push to GitHub
6. Merge to main

### Code Quality

- ESLint for code linting
- Consistent code formatting
- Code reviews (if team)
- Documentation

---

## Testing Strategy

### Test Coverage

- **Unit Tests:** API routes, utility functions
- **Component Tests:** React components
- **Integration Tests:** User workflows
- **Manual Testing:** Complete checklist

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## Deployment Architecture

### Production Stack

```
┌─────────────────────────────────────────┐
│        Load Balancer / CDN              │
│           (Cloudflare)                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Nginx Reverse Proxy            │
│     (SSL termination, rate limiting)    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Docker Container (App)             │
│         Next.js Application             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      PostgreSQL Database                │
│      (Managed or Self-hosted)           │
└─────────────────────────────────────────┘
```

### Deployment Options

See [STAGE7_DEPLOYMENT_DOCUMENTATION.md](STAGE7_DEPLOYMENT_DOCUMENTATION.md) for detailed deployment guides.

---

## Conclusion

The Disaster Management System is built with modern web technologies following industry best practices for security, performance, and scalability. The architecture is designed to be maintainable, testable, and deployable across multiple platforms.

---

**Document Version:** 1.0.0  
**Last Updated:** February 27, 2026  
**Maintained by:** Liyana Kulathilake
