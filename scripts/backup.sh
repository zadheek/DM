#!/bin/bash
# Database Backup Script for Disaster Management System
# This script creates automated backups of the PostgreSQL database

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}
POSTGRES_HOST=${POSTGRES_HOST:-postgres}
POSTGRES_PORT=${POSTGRES_PORT:-5432}
POSTGRES_USER=${POSTGRES_USER:-dms_user}
POSTGRES_DB=${POSTGRES_DB:-dms_production}

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup filename
BACKUP_FILE="$BACKUP_DIR/dms_backup_$TIMESTAMP.sql"
COMPRESSED_FILE="$BACKUP_FILE.gz"

echo "Starting database backup at $(date)"

# Create backup
PGPASSWORD=$POSTGRES_PASSWORD pg_dump \
  -h $POSTGRES_HOST \
  -p $POSTGRES_PORT \
  -U $POSTGRES_USER \
  -d $POSTGRES_DB \
  -F c \
  -f $BACKUP_FILE

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Database backup created successfully: $BACKUP_FILE"
    
    # Compress backup
    gzip $BACKUP_FILE
    echo "Backup compressed: $COMPRESSED_FILE"
    
    # Remove old backups
    find $BACKUP_DIR -name "dms_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
    echo "Old backups older than $RETENTION_DAYS days removed"
    
    echo "Backup completed successfully at $(date)"
else
    echo "ERROR: Database backup failed!" >&2
    exit 1
fi

# List current backups
echo "Current backups:"
ls -lh $BACKUP_DIR/dms_backup_*.sql.gz 2>/dev/null || echo "No backups found"

exit 0
