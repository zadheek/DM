#!/bin/bash
# Database Migration Script: SQLite to PostgreSQL
# This script helps migrate data from development SQLite to production PostgreSQL

echo "========================================="
echo "DMS Database Migration: SQLite → PostgreSQL"
echo "========================================="
echo ""

# Check if source SQLite database exists
SQLITE_DB="./prisma/dev.db"
if [ ! -f "$SQLITE_DB" ]; then
    echo "ERROR: SQLite database not found at $SQLITE_DB"
    exit 1
fi

echo "Step 1: Export data from SQLite"
echo "--------------------------------"

# Create migration directory
mkdir -p ./migration_data

# Export tables to JSON using Prisma Studio or pg_dump equivalent
echo "Exporting User data..."
sqlite3 $SQLITE_DB "SELECT json_group_array(json_object(
    'id', id,
    'name', name,
    'email', email,
    'password', password,
    'phone', phone,
    'address', address,
    'role', role,
    'createdAt', createdAt,
    'updatedAt', updatedAt
)) FROM User;" > ./migration_data/users.json

echo "Exporting Disaster data..."
sqlite3 $SQLITE_DB "SELECT json_group_array(json_object(
    'id', id,
    'type', type,
    'severity', severity,
    'location', location,
    'description', description,
    'status', status,
    'startDate', startDate,
    'createdAt', createdAt
)) FROM Disaster;" > ./migration_data/disasters.json

echo "Exporting EmergencyReport data..."
sqlite3 $SQLITE_DB "SELECT json_group_array(json_object(
    'id', id,
    'userId', userId,
    'disasterId', disasterId,
    'latitude', latitude,
    'longitude', longitude,
    'description', description,
    'urgency', urgency,
    'status', status,
    'createdAt', createdAt
)) FROM EmergencyReport;" > ./migration_data/reports.json

echo "Exporting Donation data..."
sqlite3 $SQLITE_DB "SELECT json_group_array(json_object(
    'id', id,
    'donorName', donorName,
    'donorContact', donorContact,
    'userId', userId,
    'disasterId', disasterId,
    'type', type,
    'quantity', quantity,
    'description', description,
    'status', status,
    'createdAt', createdAt
)) FROM Donation;" > ./migration_data/donations.json

echo ""
echo "Step 2: Update DATABASE_URL in .env"
echo "------------------------------------"
echo "Update your .env file to point to PostgreSQL:"
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/dms_production\""
echo ""
read -p "Press Enter after updating .env file..."

echo ""
echo "Step 3: Run Prisma migrations on PostgreSQL"
echo "--------------------------------------------"
npx prisma migrate deploy

echo ""
echo "Step 4: Import data to PostgreSQL"
echo "----------------------------------"
echo "Run the import script: node scripts/import-data.js"
echo ""
echo "Migration preparation complete!"
echo "Data exported to ./migration_data/"
echo ""
echo "Next steps:"
echo "1. Verify PostgreSQL connection"
echo "2. Run: node scripts/import-data.js"
echo "3. Verify data integrity"
echo "4. Update production .env with PostgreSQL URL"
