const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = bcrypt.hashSync('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dms.lk' },
    update: {},
    create: {
      email: 'admin@dms.lk',
      name: 'System Administrator',
      password: adminPassword,
      phone: '+94771234567',
      role: 'ADMIN',
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create test user
  const userPassword = bcrypt.hashSync('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@dms.lk' },
    update: {},
    create: {
      email: 'user@dms.lk',
      name: 'Test User',
      password: userPassword,
      phone: '+94772345678',
      address: 'Colombo, Sri Lanka',
      role: 'USER',
    },
  })
  console.log('✅ Created test user:', user.email)

  // Create volunteer user
  const volunteerPassword = bcrypt.hashSync('volunteer123', 10)
  const volunteer = await prisma.user.upsert({
    where: { email: 'volunteer@dms.lk' },
    update: {},
    create: {
      email: 'volunteer@dms.lk',
      name: 'Volunteer User',
      password: volunteerPassword,
      phone: '+94773456789',
      address: 'Galle, Sri Lanka',
      role: 'VOLUNTEER',
    },
  })
  console.log('✅ Created volunteer user:', volunteer.email)

  // Create sample disaster
  const disaster = await prisma.disaster.create({
    data: {
      type: 'Flood',
      severity: 'high',
      location: 'Colombo and Gampaha Districts',
      description: 'Heavy rainfall causing flooding in low-lying areas',
      affectedAreas: JSON.stringify(['Colombo', 'Gampaha', 'Kalutara']),
      startDate: new Date('2024-11-15'),
      status: 'active',
    },
  })
  console.log('✅ Created sample disaster:', disaster.type, '-', disaster.location)

  // Create sample notification
  await prisma.notification.create({
    data: {
      title: 'Flood Warning',
      message: 'Heavy rainfall expected in Western Province. Please stay alert and follow safety guidelines.',
      type: 'alert',
      disasterId: disaster.id,
      targetAudience: 'all',
      sentAt: new Date(),
    },
  })
  console.log('✅ Created sample notification')

  // Create sample emergency report
  await prisma.emergencyReport.create({
    data: {
      userId: user.id,
      disasterId: disaster.id,
      latitude: 6.9271,
      longitude: 79.8612,
      description: 'Water level rising rapidly in our area. Need immediate assistance.',
      urgency: 'high',
      status: 'pending',
    },
  })
  console.log('✅ Created sample emergency report')

  // Create sample donation
  await prisma.donation.create({
    data: {
      donorName: 'John Doe',
      donorContact: '+94774567890',
      disasterId: disaster.id,
      type: 'food',
      quantity: 50,
      description: '50 packets of dry rations',
      status: 'pending',
    },
  })
  console.log('✅ Created sample donation')

  console.log('\n🎉 Database seed completed successfully!')
  console.log('\n📝 Test Credentials:')
  console.log('   Admin:     admin@dms.lk / admin123')
  console.log('   User:      user@dms.lk / user123')
  console.log('   Volunteer: volunteer@dms.lk / volunteer123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
