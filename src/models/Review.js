const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: { args: [1], msg: 'Rating must be at least 1' },
            max: { args: [5], msg: 'Rating cannot exceed 5' },
        },
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

// Associations
User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Product.hasMany(Review, { foreignKey: 'productId', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Order.hasMany(Review, { foreignKey: 'orderId', onDelete: 'SET NULL' });
Review.belongsTo(Order, { foreignKey: 'orderId', allowNull: true, as: 'order' });

module.exports = Review;
