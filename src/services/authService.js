const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (userData) => {
    const { name, email, password } = userData;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    if (!user) {
        throw new Error('Invalid user data');
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
    };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        };
    } else {
        throw new Error('Invalid credentials');
    }
};

const getProfile = async (userId) => {
    const Order = require('../models/Order');
    const Review = require('../models/Review');

    const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'role'] // Exclude password
    });

    if (!user) {
        throw new Error('User not found');
    }

    const totalOrders = await Order.count({ where: { userId } });
    const totalReviews = await Review.count({ where: { userId } });
    const totalPoints = totalOrders * 10; // 10 điểm mỗi đơn hàng

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        totalOrders,
        totalReviews,
        totalPoints,
    };
};

const updateProfile = async (userId, newName) => {
    const Order = require('../models/Order');
    const Review = require('../models/Review');

    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    user.name = newName;
    await user.save();

    const totalOrders = await Order.count({ where: { userId } });
    const totalReviews = await Review.count({ where: { userId } });
    const totalPoints = totalOrders * 10;
    
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        totalOrders,
        totalReviews,
        totalPoints,
    };
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
};
