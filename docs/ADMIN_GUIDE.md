# Admin Guide
## Disaster Management System

**For:** System Administrators, Emergency Coordinators, Government Officials  
**Access Level:** ADMIN Role  
**Version:** 1.0.0  
**Last Updated:** February 27, 2026

---

## Table of Contents

1. [Admin Role Overview](#admin-role-overview)
2. [Accessing Admin Panel](#accessing-admin-panel)
3. [Managing Emergency Reports](#managing-emergency-reports)
4. [Managing Disasters](#managing-disasters)
5. [Coordinating Rescue Operations](#coordinating-rescue-operations)
6. [Managing Donations](#managing-donations)
7. [User Management](#user-management)
8. [Notifications System](#notifications-system)
9. [Analytics & Reporting](#analytics-reporting)
10. [System Configuration](#system-configuration)
11. [Security Best Practices](#security-best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Admin Role Overview

### Responsibilities

As a system administrator, you are responsible for:

✅ **Emergency Response**
- Review and verify emergency reports
- Assess severity and prioritize responses
- Coordinate with emergency services
- Update report statuses

✅ **Disaster Management**
- Declare and track disaster events
- Manage affected areas
- Monitor disaster progression
- Close resolved disasters

✅ **Resource Coordination**
- Create and manage rescue operations
- Assign teams and resources
- Track operation progress
- Coordinate volunteers

✅ **Financial Oversight**
- Monitor donations
- Process payments
- Generate financial reports
- Ensure transparency

✅ **System Administration**
- Manage user accounts
- Configure system settings
- Monitor system health
- Generate analytics reports

### Admin Permissions

Admins can:
- ✅ View all emergency reports
- ✅ Verify or reject reports
- ✅ Create, edit, and delete disasters
- ✅ Manage rescue operations
- ✅ View all donation records
- ✅ Access user accounts
- ✅ Send system notifications
- ✅ Generate reports and analytics
- ✅ Configure system settings

---

## Accessing Admin Panel

### Login as Admin

1. **Navigate to Login Page**
   ```
   https://yourdomain.com/auth/login
   ```

2. **Enter Admin Credentials**
   - Default admin account created during setup
   - Use secure password (change default immediately!)

3. **Access Dashboard**
   - After login, you'll see the admin dashboard
   - Overview of system statistics
   - Quick access to all admin functions

### Admin Dashboard Sections

**📊 Overview Cards:**
- Total Emergency Reports (with status breakdown)
- Active Disasters
- Pending Rescue Operations
- Total Donations Received

**📈 Recent Activity:**
- Latest emergency reports
- New donations
- Status changes
- System alerts

**🗺️ Interactive Map:**
- Visual display of all active disasters
- Emergency report locations
- Rescue operation areas

---

## Managing Emergency Reports

### Viewing All Reports

1. **Navigate to Reports Management**
   - Dashboard → Reports
   - Or `/admin/reports`

2. **Filter Reports**
   - By status: PENDING, VERIFIED, RESOLVED
   - By severity: LOW, MEDIUM, HIGH, CRITICAL
   - By date range
   - By location

3. **Sort Options**
   - Most recent first
   - Highest severity first
   - By status

### Reviewing Individual Reports

1. **Click on Report**
   - View full details:
     - Title and description
     - Location (with map)
     - GPS coordinates
     - Severity level
     - Reported by (user details)
     - Timestamp
     - Current status

2. **Verify Information**
   - Cross-reference with other reports
   - Check location accuracy
   - Assess severity appropriately
   - Contact reporter if needed

### Verifying Reports

**When to Verify:**
- Report appears genuine
- Location and details are accurate
- Severity matches description
- Reporter seems credible

**How to Verify:**

1. Open the report
2. Click "Verify Report" button
3. Optionally add admin comment
4. Confirm verification

**Result:**
- Report status → VERIFIED
- Reporter receives notification
- Report visible to all users
- Can trigger rescue operations

### Rejecting False Reports

**When to Reject:**
- Obvious spam or joke
- Duplicate report
- Outdated/already resolved
- Insufficient information

**How to Reject:**

1. Open the report
2. Click "Reject Report"
3. Select reason:
   - Spam/False information
   - Duplicate
   - Already resolved
   - Insufficient details
4. Add explanation (sent to reporter)
5. Confirm rejection

**Result:**
- Report marked as rejected
- Reporter notified with reason
- Report hidden from public view
- Account flagged if repeated offenses

### Resolving Reports

**When to Resolve:**
- Emergency situation handled
- No longer requires action
- Issue completely addressed

**How to Resolve:**

1. Open verified report
2. Click "Mark as Resolved"
3. Add resolution notes
4. Confirm

**Best Practices:**
- Only resolve after confirmation from field teams
- Document resolution actions taken
- Notify reporter of resolution

### Bulk Actions

**Managing Multiple Reports:**

1. Select multiple reports (checkboxes)
2. Choose bulk action:
   - Verify selected
   - Resolve selected
   - Assign to disaster
   - Export data
3. Confirm action

---

## Managing Disasters

### Creating a New Disaster

**When to Declare a Disaster:**
- Multiple related emergency reports
- Significant event affecting large area
- Official disaster declaration from authorities
- Requires coordinated response

**Steps to Create Disaster:**

1. **Navigate to Disasters**
   - Dashboard → Disasters → New Disaster

2. **Fill in Details**
   - **Name:** Descriptive name (e.g., "Colombo Flood February 2026")
   - **Type:** Select disaster type
     - Flood
     - Earthquake
     - Landslide
     - Cyclone
     - Fire
     - Drought
     - Other
   - **Severity:** LOW, MEDIUM, HIGH
   - **Affected Areas:** Districts/cities affected (comma-separated or multi-select)
   - **Start Date:** When disaster began
   - **Description:** Detailed information about the disaster
   - **Estimated Affected:** Number of people affected
   - **Casualties:** Number of deaths/injuries

3. **Associate Reports**
   - Link related emergency reports
   - Auto-suggest based on location/time

4. **Set Status**
   - ACTIVE (ongoing)
   - RESOLVED (ended)

5. **Save Disaster**
   - Click "Create Disaster"
   - Disaster now visible to public

### Updating Disasters

**Regular Updates Required:**
- Casualty count changes
- More areas affected
- Severity increases/decreases
- Status changes

**How to Update:**

1. Go to Disasters list
2. Click on disaster to edit
3. Modify relevant fields
4. Click "Save Changes"

**Automatic Notifications:**
- Users in affected areas notified of updates
- Donors receive progress updates
- Volunteers alerted to changes

### Closing Disasters

**When to Close:**
- Emergency phase ended
- All rescue operations complete
- Area safe and stable
- Recovery phase beginning

**How to Close:**

1. Open disaster
2. Change status to RESOLVED
3. Set end date
4. Add final summary
5. Save changes

**Effects:**
- Disaster marked as historical
- No longer shows as "Active"
- Still viewable for reference
- Donations may continue for recovery

### Disaster Analytics

**View Statistics for Each Disaster:**
- Total emergency reports received
- Number of verified reports
- People affected
- Casualties
- Total donations received
- Number of donors
- Active rescue operations
- Completed rescues

---

## Coordinating Rescue Operations

### Creating Rescue Operations

**When to Create:**
- Verified emergency requiring response
- Multiple people need evacuation
- Coordinated effort needed
- Resources must be deployed

**Steps:**

1. **Navigate to Rescue Operations**
   - Dashboard → Rescue Ops → New Operation

2. **Operation Details**
   - **Name:** Descriptive name (e.g., "Galle Road Evacuation")
   - **Description:** What needs to be done
   - **Location:** Where operation takes place
   - **Associated Disaster:** Link to disaster event
   - **Priority:** LOW, MEDIUM, HIGH, CRITICAL
   - **Start Time:** When operation begins
   - **Assigned Team:** Team name or volunteer group
   - **Resources Needed:** List required resources
     - Vehicles (boats, trucks, helicopters)
     - Equipment (ropes, life jackets, medical supplies)
     - Personnel count

3. **Set Status**
   - PLANNED (scheduled)
   - IN_PROGRESS (active)
   - COMPLETED (finished)
   - CANCELLED (aborted)

4. **Create Operation**
   - Click "Create Rescue Operation"
   - Team members notified

### Managing Active Operations

**Monitoring Operations:**

1. View all operations on dashboard
2. Filter by status, priority, disaster
3. See real-time status updates

**Updating Operations:**

1. Click on operation
2. Update status as it progresses:
   - PLANNED → IN_PROGRESS (when team deployed)
   - IN_PROGRESS → COMPLETED (when mission successful)
3. Add progress notes
4. Update resources used
5. Save changes

**Completing Operations:**

1. Open completed operation
2. Set status to COMPLETED
3. Add end time
4. Document:
   - People rescued
   - Resources used
   - Challenges faced
   - Lessons learned
5. Save final report

### Assigning Volunteers

**Volunteer Management:**

1. View registered volunteers
2. Check availability and skills
3. Assign to rescue operations
4. Notify volunteers via SMS/email
5. Track volunteer participation

---

## Managing Donations

### Viewing Donations

**Access Donations Dashboard:**
- Dashboard → Donations
- View all donations with details:
  - Amount and currency
  - Donor information
  - Associated disaster (if any)
  - Date/time
  - Payment status
  - Transaction ID

### Donation Filters

Filter by:
- Status (PENDING, COMPLETED, FAILED)
- Date range
- Amount range
- Specific disaster
- Payment method

### Processing Donations

**Pending Donations:**

1. Review pending payments
2. Verify payment received
3. Update status to COMPLETED
4. Generate receipt
5. Send confirmation email to donor

**Failed Donations:**

1. Identify failed payments
2. Contact donor if needed
3. Offer alternative payment method
4. Update status accordingly

### Donation Reports

**Generate Financial Reports:**

1. Go to Donations → Reports
2. Select criteria:
   - Date range
   - Disaster
   - Payment status
3. Generate report (PDF/Excel)
4. View statistics:
   - Total amount raised
   - Number of donors
   - Average donation
   - Top donors
   - Disaster-wise breakdown

### Transparency

**Public Disclosure:**
- Total donations displayed publicly
- Fund allocation reports
- Impact statements
- Audit compliance

---

## User Management

### Viewing Users

**Access User Management:**
- Dashboard → Users
- View all registered users

**User Information:**
- Name and email
- Phone number
- Role (USER, VOLUNTEER, ADMIN)
- Registration date
- Last login
- Activity summary

### Managing User Roles

**Promoting to Volunteer:**

1. Find user account
2. Click "Edit User"
3. Change role to VOLUNTEER
4. Save changes
5. User gains volunteer permissions

**Promoting to Admin:**

1. Find user account
2. Click "Edit User"
3. Change role to ADMIN
4. Confirm action (requires your password)
5. New admin receives notification

⚠️ **Caution:** Admin role has full system access

### Deactivating Accounts

**When to Deactivate:**
- Multiple false reports
- Abusive behavior
- Violation of terms
- User request

**How to Deactivate:**

1. Open user account
2. Click "Deactivate Account"
3. Select reason
4. Confirm action
5. User cannot login until reactivated

### User Activity Logs

**Monitor User Actions:**
- Emergency reports submitted
- Donations made
- Login history
- Location data (for reports)

---

## Notifications System

### Sending System Notifications

**Types of Notifications:**

1. **Disaster Alerts**
   - New disaster declared
   - Evacuation notices
   - Disaster updates

2. **System Announcements**
   - Maintenance schedules
   - New features
   - Important updates

3. **Targeted Notifications**
   - Users in specific areas
   - Users with specific roles
   - Individual users

### Creating Notification

1. **Navigate to Notifications**
   - Dashboard → Notifications → Send New

2. **Compose Notification**
   - **Title:** Brief subject line
   - **Message:** Detailed content
   - **Type:** ALERT, INFO, WARNING
   - **Recipients:** Choose audience:
     - All users
     - Users in specific areas
     - Specific role (VOLUNTEER, USER)
     - Individual users

3. **Delivery Methods**
   - In-app notification
   - Email
   - SMS (if configured)
   - Push notification

4. **Schedule or Send**
   - Send immediately
   - Schedule for later
   - Recurring (for regular updates)

### Automated Notifications

**System sends automatic notifications for:**
- Report verified → Notifies reporter
- Report resolved → Notifies reporter
- New disaster → Notifies users in area
- Rescue operation created → Notifies assigned team
- Donation received → Notifies donor

**Configure in Settings:**
- Enable/disable automated notifications
- Customize notification templates
- Set delivery preferences

---

## Analytics & Reporting

### Dashboard Analytics

**Real-Time Statistics:**
- Total reports (all time)
- Active disasters count
- Today's reports
- Pending verifications
- Total donations
- Active rescue operations

**Trends:**
- Reports by day/week/month
- Disaster frequency by type
- Donation patterns
- User growth

### Custom Reports

**Generate Reports:**

1. Dashboard → Analytics → Custom Report
2. Select report type:
   - Emergency Reports Summary
   - Disaster Impact Report
   - Financial Report
   - User Activity Report
   - Rescue Operations Summary

3. Configure parameters:
   - Date range
   - Filters
   - Group by options

4. Generate (PDF, Excel, CSV)

### Map Analytics

**Geographic Insights:**
- Heat map of emergency reports
- Disaster-prone areas
- Response time by region
- Resource distribution

### Performance Metrics

**Track System Performance:**
- Average report verification time
- Average rescue operation response time
- User engagement metrics
- Donation conversion rates

---

## System Configuration

### General Settings

**Access Settings:**
- Dashboard → Settings → General

**Configure:**
- System name and logo
- Contact information
- Supported languages
- Time zone
- Date format

### Email Configuration

**Setup Email Service:**

1. Settings → Email Settings
2. Enter SMTP details:
   - Server address
   - Port
   - Username/password
   - From address
3. Test configuration
4. Save settings

### SMS Configuration

**Setup SMS Service (Twilio):**

1. Settings → SMS Settings
2. Enter Twilio credentials:
   - Account SID
   - Auth Token
   - Phone number
3. Test SMS
4. Save settings

### Security Settings

**Configure Security:**
- Password requirements
- Session timeout
- Two-factor authentication
- IP whitelist (optional)
- Rate limiting

### Backup Configuration

**Automated Backups:**
- Settings → Backup
- Configure schedule (daily, weekly)
- Retention period
- Backup location
- Test restore

---

## Security Best Practices

### Account Security

✅ **DO:**
- Use strong, unique passwords
- Change default admin password immediately
- Enable two-factor authentication
- Limit admin access to trusted personnel
- Log out when not in use

❌ **DON'T:**
- Share admin credentials
- Use simple passwords
- Login from public computers
- Access from unsecured networks

### Data Protection

- Regular backups
- Secure database access
- Encrypt sensitive data
- Comply with data protection laws
- Audit access logs regularly

### Incident Response

**If Security Breach Suspected:**

1. Change all admin passwords immediately
2. Review access logs
3. Check for unauthorized changes
4. Notify technical support
5. Document incident
6. Implement additional security measures

---

## Troubleshooting

### Common Issues

**Users Cannot Login:**
- Check if account is active
- Verify email/password correct
- Reset password if needed
- Check system status

**Reports Not Showing:**
- Verify database connection
- Check report status (may be pending/rejected)
- Clear cache
- Refresh page

**Emails Not Sending:**
- Verify email configuration
- Check SMTP credentials
- Test email service
- Check spam folders

**Slow Performance:**
- Check server resources
- Optimize database queries
- Clear application cache
- Contact technical support

### Getting Help

**Technical Support:**
- Email: tech-support@dms.gov.lk
- Phone: +94 11 234 5678
- Emergency: 24/7 hotline

**Documentation:**
- Technical Documentation
- API Documentation
- Deployment Guide

---

## Appendix: Admin Quick Reference

### Keyboard Shortcuts

- `Ctrl + N` - New report/disaster
- `Ctrl + S` - Save changes
- `Ctrl + F` - Search
- `Esc` - Close modal

### Status Colors

- 🔴 **Red** - Critical/Urgent
- 🟠 **Orange** - High priority
- 🟡 **Yellow** - Medium/Pending
- 🟢 **Green** - Low/Resolved
- ⚫ **Gray** - Inactive/Cancelled

### Quick Actions Menu

Right-click on reports/disasters for quick actions:
- Verify
- Resolve
- Assign
- Delete
- Export

---

**Document Version:** 1.0.0  
**Last Updated:** February 27, 2026  
**For Admin Support:** admin-support@dms.gov.lk
