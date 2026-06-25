const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Cart = require('./Cart');
const Product = require('./Product');

const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['cartId', 'productId', 'size']
        }
    ]
});

// A CartItem belongs to a Cart
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// A CartItem belongs to a Product
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = CartItem;
