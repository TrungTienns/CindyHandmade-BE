require('dotenv').config();
const { sequelize, connectDB } = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await connectDB();
    await sequelize.sync();
    
    // Check if admin exists
    const adminExists = await User.findOne({ where: { email: 'admin@admin.com' } });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@admin.com',
        password: 'admin',
        role: 'admin'
      });
      console.log('Admin user created: admin@admin.com / admin');
    } else {
      console.log('Admin user already exists.');
    }

    // Check if normal user exists
    const userExists = await User.findOne({ where: { email: 'user@user.com' } });
    if (!userExists) {
      await User.create({
        name: 'Normal User',
        email: 'user@user.com',
        password: 'user',
        role: 'customer'
      });
      console.log('Normal user created: user@user.com / user');
    } else {
      console.log('Normal user already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedAdmin();
