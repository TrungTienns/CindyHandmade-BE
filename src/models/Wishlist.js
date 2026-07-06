const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Product = require('./Product');

const Wishlist = sequelize.define('Wishlist', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    }
}, {
    timestamps: true
});

// Associations
User.belongsToMany(Product, { through: Wishlist, as: 'wishlistedProducts', foreignKey: 'userId' });
Product.belongsToMany(User, { through: Wishlist, as: 'wishlistedBy', foreignKey: 'productId' });

module.exports = Wishlist;
