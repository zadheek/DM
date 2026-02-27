# Stage 7: Deployment Documentation
## Disaster Management System - Production Deployment Guide

**Project:** Disaster Management System (DMS)  
**Student:** Liyana Kulathilake (Index: 10952376)  
**Supervisor:** Ms. Dulanjali Wijesekara  
**Stage:** 7 - Deployment (Week 21-22)  
**Completed:** February 27, 2026

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Database Migration (SQLite to PostgreSQL)](#database-migration)
4. [Deployment Option 1: Vercel (Recommended)](#vercel-deployment)
5. [Deployment Option 2: Docker + VPS](#docker-vps-deployment)
6. [Deployment Option 3: Traditional VPS](#traditional-vps-deployment)
7. [SSL/TLS Configuration](#ssl-tls-configuration)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [Rollback Procedures](#rollback-procedures)
11. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Code Preparation

- [x] All tests passing (`npm test`)
- [x] No console errors or warnings
- [x] Code reviewed and approved
- [x] Dependencies up to date (`npm audit`)
- [x] Environment variables documented
- [x] Git repository clean (all changes committed)

### Security Checks

- [ ] Strong NEXTAUTH_SECRET generated (minimum 32 characters)
- [ ] Database credentials secured
- [ ] API keys stored as environment variables
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified (using Prisma)
- [ ] XSS protection enabled

### Performance Optimization

- [ ] Production build tested locally
- [ ] Images optimized
- [ ] Unused dependencies removed
- [ ] Database queries optimized
- [ ] Caching strategy implemented

---

## Environment Configuration

### 1. Create Production Environment File

Copy the example file and fill in actual values:

```bash
cp .env.production.example .env.production
```

### 2. Generate Secure NEXTAUTH_SECRET

```bash
# Using OpenSSL (Linux/Mac)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 3. Required Environment Variables

**Critical Variables:**
```env
# Database (PostgreSQL for production)
DATABASE_URL="postgresql://username:password@hostname:5432/database_name"

# Authentication
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your_generated_secret_here"

# Application
NODE_ENV="production"
```

**Optional but Recommended:**
```env
# Email notifications
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@yourdomain.com"

# SMS notifications (Twilio)
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"

# Monitoring
SENTRY_DSN="your_sentry_dsn"
```

---

## Database Migration

### SQLite to PostgreSQL Migration

The application currently uses SQLite for development. For production, migrate to PostgreSQL:

#### Step 1: Setup PostgreSQL

**Option A: Managed Database (Recommended)**
- [Supabase](https://supabase.com/) - Free tier available
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Railway](https://railway.app/) - Database + Hosting
- [DigitalOcean Managed Databases](https://www.digitalocean.com/products/managed-databases)

**Option B: Self-Hosted**
```bash
# Using Docker
docker run -d \
  --name dms-postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=dms_production \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

#### Step 2: Update Prisma Schema

The schema is already configured for PostgreSQL. Verify in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Already set
  url      = env("DATABASE_URL")
}
```

#### Step 3: Run Migration Script

```bash
# Make script executable (Linux/Mac)
chmod +x scripts/migrate-to-postgres.sh

# Run migration
./scripts/migrate-to-postgres.sh

# Or manually:
# 1. Update DATABASE_URL in .env to PostgreSQL
# 2. Run migrations
npx prisma migrate deploy

# 3. Import data
node scripts/import-data.js
```

#### Step 4: Verify Migration

```bash
# Open Prisma Studio to verify data
npx prisma studio

# Check record counts
psql $DATABASE_URL -c "SELECT 
  (SELECT COUNT(*) FROM \"User\") as users,
  (SELECT COUNT(*) FROM \"Disaster\") as disasters,
  (SELECT COUNT(*) FROM \"EmergencyReport\") as reports,
  (SELECT COUNT(*) FROM \"Donation\") as donations;"
```

---

## Vercel Deployment

### Why Vercel?

- ✅ Optimized for Next.js (same company)
- ✅ Automatic SSL certificates
- ✅ Global CDN
- ✅ Automatic deployments from Git
- ✅ Free tier available
- ✅ Environment variable management
- ✅ Preview deployments for branches

### Deployment Steps

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Configure Project

The `vercel.json` configuration is already created. Review it:

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "regions": ["sin1"]  // Singapore region (closest to Sri Lanka)
}
```

#### 4. Setup Database

**Option 1: Vercel Postgres (Recommended)**
```bash
# In Vercel dashboard:
# Storage → Create Database → Postgres
# Copy DATABASE_URL to environment variables
```

**Option 2: External PostgreSQL**
- Use Supabase, Neon, or other provider
- Add DATABASE_URL to Vercel environment variables

#### 5. Configure Environment Variables

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.production`:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (auto-set by Vercel)
   - `NEXTAUTH_SECRET`
   - Other optional variables

#### 6. Deploy

**Initial Deployment:**
```bash
vercel
```

**Production Deployment:**
```bash
vercel --prod
```

#### 7. Run Database Migrations

```bash
# After first deployment, run migrations
vercel env pull .env.production.local
npx prisma migrate deploy
```

#### 8. Custom Domain (Optional)

In Vercel Dashboard:
1. Settings → Domains
2. Add custom domain: `dms.yourdomain.com`
3. Update DNS records as instructed
4. Vercel handles SSL automatically

### Vercel Deployment URL

After deployment, your app will be available at:
- Preview: `https://your-project-git-branch.vercel.app`
- Production: `https://your-project.vercel.app`
- Custom: `https://dms.yourdomain.com`

---

## Docker + VPS Deployment

### Recommended VPS Providers

- **DigitalOcean** - $6/month droplet sufficient for testing
- **AWS Lightsail** - $5/month instance
- **Linode** - $5/month shared instance
- **Vultr** - $6/month cloud compute

### Prerequisites

- Ubuntu 22.04 LTS server
- Minimum 1GB RAM, 1 CPU core
- Root or sudo access
- Domain name pointed to server IP

### Deployment Steps

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Create non-root user
sudo useradd -m -s /bin/bash dmsapp
sudo usermod -aG docker dmsapp
```

#### 2. Upload Application

**Option A: Git Clone (Recommended)**
```bash
# Switch to app user
sudo su - dmsapp

# Clone repository
git clone https://github.com/yourusername/disaster-management-system.git
cd disaster-management-system
```

**Option B: Upload Files**
```bash
# From local machine
scp -r disaster-management-system dmsapp@your-server-ip:~/
```

#### 3. Configure Environment

```bash
# Create production environment file
cp .env.production.example .env.production

# Edit with actual values
nano .env.production
```

#### 4. Deploy with Docker Compose

```bash
# Build and start services
docker-compose -f docker-compose.production.yml up -d

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Check status
docker-compose -f docker-compose.production.yml ps
```

#### 5. Run Database Migrations

```bash
# Run migrations in app container
docker-compose -f docker-compose.production.yml exec app npx prisma migrate deploy

# Seed initial data if needed
docker-compose -f docker-compose.production.yml exec app npm run db:seed
```

#### 6. Configure Nginx (if not using Docker nginx)

```bash
# Install Nginx
sudo apt install nginx -y

# Copy nginx configuration
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## SSL/TLS Configuration

### Option 1: Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

### Option 2: Cloudflare (Free SSL + CDN)

1. Add domain to Cloudflare
2. Update nameservers
3. Enable "Full (Strict)" SSL mode
4. Enable automatic HTTPS rewrites
5. Configure firewall rules

### Option 3: Manual SSL Certificate

```bash
# Generate SSL certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/privkey.pem \
  -out /etc/nginx/ssl/fullchain.pem
```

---

## Post-Deployment Verification

### 1. Health Check

```bash
# Check health endpoint
curl https://yourdomain.com/api/health

# Expected response:
# {"status":"healthy","database":"connected","timestamp":"..."}
```

### 2. Functionality Tests

- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login successful
- [ ] Dashboard displays properly
- [ ] Emergency report submission works
- [ ] GPS location capture functions
- [ ] Donation form submits successfully
- [ ] Admin panel accessible (ADMIN role only)
- [ ] Database queries return data
- [ ] API endpoints respond correctly

### 3. Performance Tests

```bash
# Test response times
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com

# Load testing (optional)
npx artillery quick --count 10 --num 100 https://yourdomain.com
```

### 4. Security Verification

- [ ] HTTPS enabled (SSL certificate valid)
- [ ] HTTP redirects to HTTPS
- [ ] Security headers present
- [ ] CORS configured correctly
- [ ] Rate limiting working
- [ ] No sensitive data in client-side code
- [ ] Database credentials secure

---

## Monitoring and Maintenance

### 1. Application Monitoring

**Recommended Tools:**
- **Sentry** - Error tracking
- **New Relic** - APM monitoring
- **Vercel Analytics** - If using Vercel
- **UptimeRobot** - Uptime monitoring

**Setup Sentry:**
```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

### 2. Database Backups

**Automated Backups:**
```bash
# Using provided backup script
chmod +x scripts/backup.sh

# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/scripts/backup.sh >> /var/log/dms-backup.log 2>&1
```

**Manual Backup:**
```bash
# PostgreSQL
pg_dump -U username -d dms_production -F c -f backup_$(date +%Y%m%d).dump

# Restore
pg_restore -U username -d dms_production -c backup_20260227.dump
```

### 3. Log Management

**View Docker Logs:**
```bash
# All services
docker-compose -f docker-compose.production.yml logs -f

# Specific service
docker-compose -f docker-compose.production.yml logs -f app

# Last 100 lines
docker-compose -f docker-compose.production.yml logs --tail=100 app
```

**Nginx Logs:**
```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

### 4. Performance Monitoring

```bash
# Docker stats
docker stats

# Database performance
docker-compose exec postgres psql -U dms_user -d dms_production -c "
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

---

## Rollback Procedures

### Vercel Rollback

```bash
# List deployments
vercel list

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Docker Rollback

```bash
# Stop current deployment
docker-compose -f docker-compose.production.yml down

# Checkout previous version
git checkout [previous-commit-hash]

# Rebuild and deploy
docker-compose -f docker-compose.production.yml up -d --build
```

### Database Rollback

```bash
# Restore from backup
pg_restore -U username -d dms_production -c backup_file.dump

# Or using Docker
docker-compose exec postgres pg_restore -U dms_user -d dms_production -c /backups/backup_file.dump
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Symptom:** "Can't reach database server"

**Solutions:**
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Verify Prisma client
npx prisma generate
```

#### 2. Build Failures

**Symptom:** "Build failed" on deployment

**Solutions:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build

# Check for TypeScript errors (if applicable)
npm run lint
```

#### 3. 502 Bad Gateway

**Symptom:** Nginx shows 502 error

**Solutions:**
```bash
# Check if app is running
docker ps

# Check app logs
docker-compose logs app

# Restart services
docker-compose restart
```

#### 4. SSL Certificate Issues

**Symptom:** "Your connection is not private"

**Solutions:**
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Verify certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check Nginx configuration
sudo nginx -t
```

#### 5. High Memory Usage

**Symptom:** Server becomes slow or crashes

**Solutions:**
```bash
# Check memory usage
docker stats

# Increase container memory limit
# In docker-compose.production.yml
services:
  app:
    mem_limit: 1g

# Optimize database queries
# Add indexes to frequently queried fields
```

---

## Security Best Practices

### 1. Environment Variables

- ✅ Never commit .env files to Git
- ✅ Use different credentials for dev/prod
- ✅ Rotate secrets regularly
- ✅ Use strong passwords (16+ characters)

### 2. Database Security

```sql
-- Create read-only user for analytics
CREATE USER analytics_user WITH PASSWORD 'strong_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_user;

-- Restrict admin user
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
```

### 3. Network Security

```bash
# Configure firewall (UFW)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

### 4. Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js dependencies
npm audit
npm audit fix

# Update Docker images
docker-compose pull
docker-compose up -d
```

---

## Cost Estimation

### Vercel Deployment

- **Free Tier:** Suitable for testing and low traffic
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Custom domains

- **Pro Tier:** $20/month
  - 1 TB bandwidth/month
  - Commercial use
  - Team collaboration

### VPS Deployment

**Monthly Costs:**
- VPS Server: $5-10
- Domain Name: $10-15/year (~$1/month)
- SSL Certificate: Free (Let's Encrypt)
- PostgreSQL Database: $0 (self-hosted) or $7-15 (managed)

**Total:** ~$15-30/month

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Database migrated to PostgreSQL
- [ ] SSL certificate obtained
- [ ] Domain DNS configured
- [ ] Backup strategy in place

### During Deployment

- [ ] Deploy application
- [ ] Run database migrations
- [ ] Verify all services running
- [ ] Test critical functionality
- [ ] Monitor error logs

### Post-Deployment

- [ ] Verify HTTPS working
- [ ] Test all user flows
- [ ] Configure monitoring
- [ ] Setup automated backups
- [ ] Document deployment process
- [ ] Notify team/stakeholders

---

## Support Resources

### Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Production](https://www.prisma.io/docs/guides/deployment)
- [Docker Documentation](https://docs.docker.com/)

### Community
- Next.js Discord: https://discord.gg/nextjs
- Prisma Slack: https://slack.prisma.io/
- Stack Overflow: [nextjs] tag

---

## Conclusion

Stage 7 deployment provides multiple deployment options:

1. **Vercel (Recommended):** Easiest, optimized for Next.js, free tier available
2. **Docker + VPS:** Full control, cost-effective for production
3. **Traditional VPS:** Maximum flexibility, requires more setup

Choose based on your requirements:
- **For testing/demo:** Vercel Free Tier
- **For production (government/commercial):** VPS with managed database
- **For learning/development:** Docker on local VPS

---

**Deployment Completed:** February 27, 2026  
**Next Stage:** Stage 8 - Documentation and Finalization (Week 23-24)
