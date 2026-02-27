# Maintenance & Operations Guide
## Disaster Management System

**For:** System Administrators, DevOps Engineers, IT Support  
**Version:** 1.0.0  
**Last Updated:** February 27, 2026

---

## Table of Contents

1. [System Monitoring](#system-monitoring)
2. [Backup & Recovery](#backup--recovery)
3. [Database Maintenance](#database-maintenance)
4. [Security Updates](#security-updates)
5. [Performance Tuning](#performance-tuning)
6. [Troubleshooting](#troubleshooting)
7. [Disaster Recovery](#disaster-recovery)
8. [Maintenance Schedules](#maintenance-schedules)

---

## System Monitoring

### Health Checks

**Health Check Endpoint:**
```bash
# Check application health
curl https://yourdomain.com/api/health

# Expected response:
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-02-27T10:00:00.000Z",
  "uptime": 86400,
  "environment": "production"
}
```

**Automated Health Monitoring:**

1. **Using UptimeRobot (Recommended)**
   - Add monitor: https://yourdomain.com/api/health
   - Check interval: 5 minutes
   - Alert channels: Email, SMS
   - Set up: https://uptimerobot.com

2. **Using Nagios/Zabbix**
   ```bash
   # Define HTTP check
   check_http -H yourdomain.com -u /api/health -s "healthy"
   ```

3. **Custom Monitoring Script**
   ```bash
   #!/bin/bash
   # health-monitor.sh
   
   HEALTH_URL="https://yourdomain.com/api/health"
   ALERT_EMAIL="admin@example.com"
   
   response=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)
   
   if [ $response != "200" ]; then
     echo "ALERT: Application health check failed!" | \
       mail -s "DMS Health Alert" $ALERT_EMAIL
   fi
   ```

   ```bash
   # Add to crontab (check every 5 minutes)
   */5 * * * * /path/to/health-monitor.sh
   ```

### Application Monitoring

**Docker Container Monitoring:**

```bash
# Check container status
docker ps

# View container logs
docker logs dms-app -f --tail=100

# Monitor resource usage
docker stats dms-app

# Check restart count
docker inspect dms-app | grep RestartCount
```

**Process Monitoring (PM2):**

```bash
# If using PM2
pm2 status

# View logs
pm2 logs dms

# Monitor real-time
pm2 monit

# Restart if needed
pm2 restart dms
```

### Database Monitoring

**PostgreSQL Health:**

```bash
# Check database connection
docker exec dms-postgres pg_isready

# View active connections
docker exec dms-postgres psql -U dms_user -d dms_production -c \
  "SELECT count(*) FROM pg_stat_activity;"

# Check database size
docker exec dms-postgres psql -U dms_user -d dms_production -c \
  "SELECT pg_size_pretty(pg_database_size('dms_production'));"

# Monitor slow queries
docker exec dms-postgres psql -U dms_user -d dms_production -c \
  "SELECT query, calls, total_time, mean_time 
   FROM pg_stat_statements 
   ORDER BY mean_time DESC 
   LIMIT 10;"
```

### Log Monitoring

**Application Logs:**

```bash
# Docker logs
docker logs dms-app --since 1h

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# System logs
journalctl -u docker -f
```

**Log Rotation:**

```bash
# Configure logrotate
cat > /etc/logrotate.d/dms << EOF
/var/log/nginx/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 \`cat /var/run/nginx.pid\`
    endscript
}
EOF
```

### Performance Metrics

**Key Metrics to Monitor:**

1. **Application Metrics:**
   - Response time (target: <500ms)
   - Request rate (requests/second)
   - Error rate (target: <1%)
   - CPU usage (target: <70%)
   - Memory usage (target: <80%)

2. **Database Metrics:**
   - Query execution time
   - Active connections (max: 100)
   - Cache hit ratio (target: >90%)
   - Database size growth

3. **Infrastructure Metrics:**
   - Disk usage (alert at >80%)
   - Network I/O
   - SSL certificate expiry
   - Backup completion status

---

## Backup & Recovery

### Automated Database Backups

**Using Provided Backup Script:**

```bash
# Script location: scripts/backup.sh

# Make executable
chmod +x scripts/backup.sh

# Test backup manually
./scripts/backup.sh

# Setup automated backups (cron)
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/scripts/backup.sh >> /var/log/dms-backup.log 2>&1
```

**Backup Script Configuration:**

```bash
# Environment variables in .env or docker-compose
POSTGRES_DB=dms_production
POSTGRES_USER=dms_user
POSTGRES_PASSWORD=your_password
BACKUP_DIR=/backups
RETENTION_DAYS=30
```

**Verify Backups:**

```bash
# List backups
ls -lh /backups/

# Check backup size (should be consistent)
du -sh /backups/dms_backup_*.sql.gz

# Test restoration (in test environment)
gunzip < /backups/dms_backup_20260227_020000.sql.gz | \
  docker exec -i dms-postgres psql -U dms_user -d dms_test
```

### Manual Backup

**Full Database Backup:**

```bash
# PostgreSQL dump
docker exec dms-postgres pg_dump \
  -U dms_user \
  -d dms_production \
  -F c \
  -f /backups/manual_backup_$(date +%Y%m%d).dump

# Or with compression
docker exec dms-postgres pg_dump \
  -U dms_user \
  -d dms_production \
  | gzip > manual_backup_$(date +%Y%m%d).sql.gz
```

**Application Files Backup:**

```bash
# Backup entire application directory
tar -czf dms_app_backup_$(date +%Y%m%d).tar.gz \
  /path/to/disaster-management-system/ \
  --exclude=node_modules \
  --exclude=.next
```

**Configuration Backup:**

```bash
# Backup environment and config files
tar -czf dms_config_backup_$(date +%Y%m%d).tar.gz \
  .env.production \
  docker-compose.production.yml \
  nginx/nginx.conf
```

### Backup to Cloud Storage

**Using AWS S3:**

```bash
# Install AWS CLI
apt install awscli

# Configure AWS credentials
aws configure

# Upload backup
aws s3 cp /backups/dms_backup_$(date +%Y%m%d).sql.gz \
  s3://your-bucket/dms-backups/

# Automated sync
0 3 * * * aws s3 sync /backups/ s3://your-bucket/dms-backups/
```

**Using rsync to Remote Server:**

```bash
# Sync backups to remote server
rsync -avz --delete /backups/ user@backup-server:/backups/dms/

# Add to cron
0 4 * * * rsync -avz /backups/ user@backup-server:/backups/dms/
```

### Database Restoration

**Restore from Backup:**

```bash
# Stop application first
docker-compose down app

# Restore database
docker exec -i dms-postgres pg_restore \
  -U dms_user \
  -d dms_production \
  -c \
  /backups/dms_backup_20260227.dump

# Or from gzip
gunzip < /backups/dms_backup_20260227.sql.gz | \
  docker exec -i dms-postgres psql -U dms_user -d dms_production

# Restart application
docker-compose up -d app
```

**Point-in-Time Recovery:**

```bash
# PostgreSQL WAL archiving (configure if needed)
# In postgresql.conf:
wal_level = replica
archive_mode = on
archive_command = 'cp %p /backups/wal/%f'
```

---

## Database Maintenance

### Routine Maintenance Tasks

**Weekly Tasks:**

```bash
# Vacuum database (reclaim space)
docker exec dms-postgres psql -U dms_user -d dms_production -c "VACUUM VERBOSE;"

# Analyze statistics
docker exec dms-postgres psql -U dms_user -d dms_production -c "ANALYZE VERBOSE;"

# Reindex (if needed)
docker exec dms-postgres psql -U dms_user -d dms_production -c "REINDEX DATABASE dms_production;"
```

**Automated Maintenance:**

```bash
# Create maintenance script
cat > /usr/local/bin/dms-db-maintenance.sh << 'EOF'
#!/bin/bash
docker exec dms-postgres psql -U dms_user -d dms_production << SQL
VACUUM VERBOSE;
ANALYZE VERBOSE;
SQL
EOF

chmod +x /usr/local/bin/dms-db-maintenance.sh

# Schedule weekly (Sunday 3 AM)
0 3 * * 0 /usr/local/bin/dms-db-maintenance.sh
```

### Database Optimization

**Check Table Sizes:**

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;
```

**Find Missing Indexes:**

```sql
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.1;
```

**Monitor Query Performance:**

```bash
# Enable pg_stat_statements
docker exec dms-postgres psql -U dms_user -d dms_production -c \
  "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"

# View slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;
```

### Database Migrations

**Apply New Migrations:**

```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy

# Docker environment
docker exec dms-app npx prisma migrate deploy
```

**Rollback Migration (if needed):**

```bash
# Manual rollback (be cautious!)
# Restore from backup before the migration

# Or manually reverse migration SQL
docker exec -i dms-postgres psql -U dms_user -d dms_production < rollback.sql
```

---

## Security Updates

### System Updates

**Update Operating System:**

```bash
# Update package lists
sudo apt update

# Upgrade packages
sudo apt upgrade -y

# Reboot if kernel updated
sudo reboot
```

**Update Docker:**

```bash
# Update Docker
sudo apt update
sudo apt upgrade docker-ce docker-ce-cli containerd.io

# Verify version
docker --version
```

### Application Updates

**Update Dependencies:**

```bash
# Check for outdated packages
npm outdated

# Update all to latest (use carefully!)
npm update

# Or update specific package
npm update next

# Audit security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

**Update Docker Images:**

```bash
# Pull latest base images
docker pull node:18-alpine
docker pull postgres:15-alpine
docker pull nginx:alpine

# Rebuild containers
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d
```

### SSL Certificate Renewal

**Let's Encrypt Auto-Renewal:**

```bash
# Certbot auto-renews via systemd timer
systemctl status certbot.timer

# Manual renewal
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Force renewal (if needed)
sudo certbot renew --force-renewal
```

**Check Certificate Expiry:**

```bash
# Check expiry date
echo | openssl s_client -servername yourdomain.com \
  -connect yourdomain.com:443 2>/dev/null | \
  openssl x509 -noout -dates

# Get days until expiry
echo | openssl s_client -servername yourdomain.com \
  -connect yourdomain.com:443 2>/dev/null | \
  openssl x509 -noout -enddate | cut -d= -f2
```

### Security Audits

**Regular Security Checks:**

```bash
# Check for rootkits
sudo rkhunter --check

# File integrity monitoring
sudo aide --check

# Review auth logs
sudo grep "Failed password" /var/log/auth.log

# Check open ports
sudo netstat -tuln

# Review firewall rules
sudo ufw status verbose
```

---

## Performance Tuning

### Application Performance

**Optimize Next.js Build:**

```bash
# Production build with optimization
npm run production:build

# Analyze bundle size
npm run build -- --analyze
```

**Node.js Tuning:**

```bash
# Increase memory limit if needed
NODE_OPTIONS="--max-old-space-size=4096" npm start

# In docker-compose.yml
environment:
  NODE_OPTIONS: "--max-old-space-size=2048"
```

### Database Performance

**PostgreSQL Tuning:**

```bash
# Edit PostgreSQL config
docker exec dms-postgres vi /var/lib/postgresql/data/postgresql.conf

# Recommended settings for 4GB RAM server:
shared_buffers = 1GB
effective_cache_size = 3GB
maintenance_work_mem = 256MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 10MB
min_wal_size = 1GB
max_wal_size = 4GB
```

**Connection Pooling:**

```javascript
// In Prisma schema or connection
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  pool_timeout = 20
  pool_size = 10
}
```

### Nginx Tuning

**Optimize nginx.conf:**

```nginx
# Worker processes (= CPU cores)
worker_processes auto;

# Worker connections
events {
    worker_connections 1024;
    use epoll;
}

# Gzip compression
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript;

# Buffer sizes
client_body_buffer_size 128k;
client_max_body_size 10m;
```

### Caching Strategy

**Implement Redis (Future Enhancement):**

```bash
# Add Redis container
docker run -d --name dms-redis -p 6379:6379 redis:alpine

# Use for session storage and caching
# Configure in application code
```

---

## Troubleshooting

### Common Issues

#### 1. Application Won't Start

**Symptoms:** Container exits immediately

**Diagnosis:**
```bash
# Check logs
docker logs dms-app

# Check container status
docker ps -a

# Inspect container
docker inspect dms-app
```

**Solutions:**
- Check environment variables
- Verify database connection
- Check port conflicts
- Review error logs

#### 2. Database Connection Error

**Symptoms:** "Can't reach database server"

**Diagnosis:**
```bash
# Check if database is running
docker ps | grep postgres

# Check database logs
docker logs dms-postgres

# Test connection
docker exec dms-postgres pg_isready
```

**Solutions:**
- Restart database container
- Verify DATABASE_URL
- Check network connectivity
- Regenerate Prisma Client

#### 3. High Memory Usage

**Symptoms:** Server slow, OOM errors

**Diagnosis:**
```bash
# Check memory usage
free -h
docker stats

# Check swap usage
swapon --show
```

**Solutions:**
- Restart containers
- Increase server RAM
- Optimize queries
- Enable swap if not present

#### 4. Slow Page Load

**Symptoms:** Pages take >5 seconds to load

**Diagnosis:**
```bash
# Check server load
top
htop

# Check network latency
ping yourdomain.com

# Check database performance
# See slow query logs
```

**Solutions:**
- Optimize database queries
- Add caching
- Enable CDN
- Optimize images

---

## Disaster Recovery

### Disaster Recovery Plan

**RTO (Recovery Time Objective):** 4 hours  
**RPO (Recovery Point Objective):** 24 hours (daily backups)

### Recovery Procedures

**Scenario 1: Complete Server Failure**

1. **Provision New Server**
   ```bash
   # Setup new Ubuntu server
   # Install Docker, Docker Compose
   ```

2. **Restore Application**
   ```bash
   # Clone repository
   git clone https://github.com/user/disaster-management-system.git
   cd disaster-management-system
   
   # Restore configuration
   scp backup-server:/backups/config/*.env .
   scp backup-server:/backups/config/docker-compose.yml .
   ```

3. **Restore Database**
   ```bash
   # Start PostgreSQL
   docker-compose up -d postgres
   
   # Restore from backup
   gunzip < /backups/latest.sql.gz | \
     docker exec -i dms-postgres psql -U dms_user -d dms_production
   ```

4. **Start Application**
   ```bash
   docker-compose up -d
   ```

5. **Verify**
   ```bash
   curl https://yourdomain.com/api/health
   ```

**Scenario 2: Database Corruption**

1. Stop application
2. Restore database from last good backup
3. Run migrations if needed
4. Restart application
5. Verify data integrity

**Scenario 3: Accidental Data Deletion**

1. Identify what was deleted
2. Restore from backup to temporary database
3. Export only needed data
4. Import to production database
5. Verify restoration

---

## Maintenance Schedules

### Daily Tasks (Automated)

- ✅ 2:00 AM - Database backup
- ✅ 3:00 AM - Sync backups to cloud
- ✅ Every 5 min - Health checks
- ✅ Continuous - Log monitoring

### Weekly Tasks

- 📅 Sunday 3:00 AM - Database vacuum/analyze
- 📅 Sunday 4:00 AM - Update system packages (if auto-update enabled)
- 📅 Monday 9:00 AM - Review logs and alerts
- 📅 Friday - Check backup integrity

### Monthly Tasks

- 📅 1st of month - Security audit
- 📅 1st of month - Review disk space
- 📅 1st of month - Update dependencies
- 📅 1st of month - Test disaster recovery
- 📅 15th of month - Performance review
- 📅 15th of month - Review and rotate logs

### Quarterly Tasks

- 📅 Every 3 months - Full security assessment
- 📅 Every 3 months - Capacity planning review
- 📅 Every 3 months - Documentation update
- 📅 Every 3 months - Disaster recovery drill

### Annual Tasks

- 📅 Yearly - Infrastructure review
- 📅 Yearly - Technology stack evaluation
- 📅 Yearly - Comprehensive penetration testing
- 📅 Yearly - Disaster recovery plan update

---

## Maintenance Checklist

### Pre-Maintenance

- [ ] Announce maintenance window to users
- [ ] Create full backup
- [ ] Test backup restoration
- [ ] Document current state
- [ ] Prepare rollback plan

### During Maintenance

- [ ] Put system in maintenance mode (if applicable)
- [ ] Perform updates/changes
- [ ] Monitor for errors
- [ ] Document changes made
- [ ] Test functionality

### Post-Maintenance

- [ ] Verify system functionality
- [ ] Check health endpoint
- [ ] Review logs
- [ ] Monitor performance
- [ ] Notify users of completion
- [ ] Update documentation

---

## Support & Escalation

### Support Tiers

**Tier 1: Basic Support**
- User account issues
- Password resets
- Basic questions
- Contact: support@dms.gov.lk

**Tier 2: Technical Support**
- Application errors
- Performance issues
- Integration problems
- Contact: tech-support@dms.gov.lk

**Tier 3: Critical Issues**
- System outages
- Security breaches
- Data loss
- Contact: emergency@dms.gov.lk
- Phone: +94 11 234 5678 (24/7)

### Escalation Procedure

1. **Issue Identified**
   - Log in ticketing system
   - Assess severity

2. **Initial Response**
   - Tier 1: Within 4 hours
   - Tier 2: Within 2 hours
   - Tier 3: Immediate

3. **Resolution**
   - Document steps taken
   - Notify stakeholders
   - Update documentation

4. **Post-Mortem**
   - Analyze root cause
   - Implement preventive measures
   - Update procedures

---

## Appendix: Useful Commands

### Docker

```bash
# View all containers
docker ps -a

# Restart all services
docker-compose restart

# View logs
docker-compose logs -f

# Clean up
docker system prune -a

# Update images
docker-compose pull
docker-compose up -d
```

### Database

```bash
# Connect to database
docker exec -it dms-postgres psql -U dms_user -d dms_production

# Backup
docker exec dms-postgres pg_dump -U dms_user dms_production > backup.sql

# Restore
docker exec -i dms-postgres psql -U dms_user dms_production < backup.sql
```

### System

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
top

# Check network
netstat -tuln
```

---

**Document Version:** 1.0.0  
**Last Updated:** February 27, 2026  
**For Support:** support@dms.gov.lk
