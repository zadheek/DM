# Disaster Management System - Quick Deployment Guide

This guide provides quick deployment instructions for different platforms.

## 🚀 Quick Start - Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free)
- PostgreSQL database (Supabase free tier or Vercel Postgres)

### Steps

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/disaster-management-system.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure environment variables:
     - `DATABASE_URL` - Your PostgreSQL connection string
     - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - Click "Deploy"

3. **Run Migrations**
   ```bash
   # After first deployment
   vercel env pull .env.production.local
   npx prisma migrate deploy
   ```

4. **Done!** Your app is live at `https://your-project.vercel.app`

---

## 🐳 Quick Start - Docker

### Prerequisites
- Docker and Docker Compose installed
- PostgreSQL database

### Steps

1. **Configure Environment**
   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with your values
   ```

2. **Deploy**
   ```bash
   docker-compose -f docker-compose.production.yml up -d
   ```

3. **Run Migrations**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

4. **Access** at `http://localhost:3000`

---

## 🌐 Quick Start - Traditional Server

### Prerequisites
- Ubuntu 22.04 server
- Domain name
- Root access

### Steps

1. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib -y
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Setup Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/disaster-management-system.git
   cd disaster-management-system
   
   # Install dependencies
   npm install
   
   # Configure environment
   cp .env.production.example .env.production
   # Edit .env.production
   
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # Build application
   npm run production:build
   ```

3. **Setup PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "dms" -- start
   pm2 startup
   pm2 save
   ```

4. **Configure Nginx**
   ```bash
   sudo cp nginx/nginx.conf /etc/nginx/sites-available/dms
   sudo ln -s /etc/nginx/sites-available/dms /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Setup SSL**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🔐 Environment Variables

**Required:**
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-here"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## 📊 Database Setup

### Option 1: Supabase (Free)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings → Database
4. Use as `DATABASE_URL`

### Option 2: Vercel Postgres
1. In Vercel project, go to Storage
2. Create PostgreSQL database
3. Copy `DATABASE_URL` from .env.local

### Option 3: Self-Hosted
```bash
# Create database
sudo -u postgres psql
CREATE DATABASE dms_production;
CREATE USER dms_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE dms_production TO dms_user;
\q

# Connection string
DATABASE_URL="postgresql://dms_user:your_password@localhost:5432/dms_production"
```

---

## ✅ Post-Deployment Checklist

- [ ] Application accessible via HTTPS
- [ ] Database connected
- [ ] User registration working
- [ ] Login functional
- [ ] Emergency report submission works
- [ ] GPS location capture functional
- [ ] Admin panel accessible
- [ ] Donations page working
- [ ] All API endpoints responding
- [ ] Backups configured

---

## 🆘 Quick Troubleshooting

**Build fails:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Database connection error:**
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Regenerate Prisma Client
npx prisma generate
```

**502 Bad Gateway:**
```bash
# Check if app is running
pm2 status
# or
docker ps

# Restart
pm2 restart dms
# or
docker-compose restart
```

**SSL issues:**
```bash
# Renew certificate
sudo certbot renew

# Verify
curl -I https://yourdomain.com
```

---

## 📞 Support

- **Documentation:** See STAGE7_DEPLOYMENT_DOCUMENTATION.md
- **Issues:** Create GitHub issue
- **Email:** [Your support email]

---

**Good luck with your deployment! 🎉**
