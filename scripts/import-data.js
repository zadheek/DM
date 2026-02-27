/**
 * Data Import Script for PostgreSQL Migration
 * Imports data from SQLite JSON exports to PostgreSQL
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function importData() {
  console.log('Starting data import to PostgreSQL...\n')

  try {
    // Read exported JSON files
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../migration_data/users.json'), 'utf8')
    )
    const disastersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../migration_data/disasters.json'), 'utf8')
    )
    const reportsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../migration_data/reports.json'), 'utf8')
    )
    const donationsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../migration_data/donations.json'), 'utf8')
    )

    console.log(`Found ${usersData.length} users to import`)
    console.log(`Found ${disastersData.length} disasters to import`)
    console.log(`Found ${reportsData.length} reports to import`)
    console.log(`Found ${donationsData.length} donations to import\n`)

    // Import Users
    console.log('Importing users...')
    for (const user of usersData) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          phone: user.phone,
          address: user.address,
          role: user.role,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      })
    }
    console.log(`✓ Imported ${usersData.length} users\n`)

    // Import Disasters
    console.log('Importing disasters...')
    for (const disaster of disastersData) {
      // Parse affectedAreas if it's a string
      let affectedAreas = []
      try {
        affectedAreas = disaster.affectedAreas 
          ? JSON.parse(disaster.affectedAreas) 
          : []
      } catch (e) {
        affectedAreas = disaster.affectedAreas 
          ? disaster.affectedAreas.split(',') 
          : []
      }

      await prisma.disaster.upsert({
        where: { id: disaster.id },
        update: {},
        create: {
          id: disaster.id,
          type: disaster.type,
          severity: disaster.severity,
          location: disaster.location,
          description: disaster.description,
          status: disaster.status,
          affectedAreas: affectedAreas,
          startDate: new Date(disaster.startDate),
          createdAt: new Date(disaster.createdAt),
        },
      })
    }
    console.log(`✓ Imported ${disastersData.length} disasters\n`)

    // Import Emergency Reports
    console.log('Importing emergency reports...')
    for (const report of reportsData) {
      await prisma.emergencyReport.upsert({
        where: { id: report.id },
        update: {},
        create: {
          id: report.id,
          userId: report.userId,
          disasterId: report.disasterId,
          latitude: parseFloat(report.latitude),
          longitude: parseFloat(report.longitude),
          description: report.description,
          urgency: report.urgency,
          status: report.status,
          createdAt: new Date(report.createdAt),
        },
      })
    }
    console.log(`✓ Imported ${reportsData.length} emergency reports\n`)

    // Import Donations
    console.log('Importing donations...')
    for (const donation of donationsData) {
      await prisma.donation.upsert({
        where: { id: donation.id },
        update: {},
        create: {
          id: donation.id,
          donorName: donation.donorName,
          donorContact: donation.donorContact,
          userId: donation.userId,
          disasterId: donation.disasterId,
          type: donation.type,
          quantity: parseInt(donation.quantity),
          description: donation.description,
          status: donation.status,
          createdAt: new Date(donation.createdAt),
        },
      })
    }
    console.log(`✓ Imported ${donationsData.length} donations\n`)

    console.log('✅ Data import completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Verify data in PostgreSQL using: npx prisma studio')
    console.log('2. Test application functionality')
    console.log('3. Update production environment variables')

  } catch (error) {
    console.error('❌ Error during import:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

importData()
