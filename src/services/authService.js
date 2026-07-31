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
    const OrderItem = require('../models/OrderItem');

    const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'role'] // Exclude password
    });

    if (!user) {
        throw new Error('User not found');
    }

    const totalOrders = await Order.count({ where: { userId } });
    const userReviews = await Review.findAll({ where: { userId } });
    const totalReviews = userReviews.length;
    
    // Tính điểm: 10 điểm cho mỗi sản phẩm trong đơn hàng delivered, 20 điểm cho mỗi review
    const deliveredOrders = await Order.findAll({
        where: { userId, status: 'delivered' },
        include: [{ model: OrderItem, as: 'items' }]
    });
    
    let totalProductsDelivered = 0;
    let pointsHistory = [];

    deliveredOrders.forEach(order => {
        if (order.items && order.items.length > 0) {
            let itemsCount = 0;
            order.items.forEach(item => {
                itemsCount += item.quantity;
            });
            totalProductsDelivered += itemsCount;
            
            pointsHistory.push({
                id: `order_${order.id}`,
                icon: 'cart.fill',
                title: `Order #${order.id}`,
                points: itemsCount * 10,
                date: order.updatedAt,
                isEarned: true
            });
        }
    });

    userReviews.forEach(review => {
        pointsHistory.push({
            id: `review_${review.id}`,
            icon: 'star.fill',
            title: `Product Review`,
            points: 20,
            date: review.createdAt,
            isEarned: true
        });
    });

    // Sort history by date descending
    pointsHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Format date for response
    pointsHistory = pointsHistory.map(entry => ({
        ...entry,
        date: new Date(entry.date).toLocaleDateString('vi-VN')
    }));

    const totalPoints = (totalProductsDelivered * 10) + (totalReviews * 20);

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        totalOrders,
        totalReviews,
        totalPoints,
        pointsHistory,
    };
};

const updateProfile = async (userId, newName) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    user.name = newName;
    await user.save();

    return await getProfile(userId);
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
};
