const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const { sequelize } = require('../config/db');

const checkout = async (userId, checkoutData) => {
    const { fullName, phone, province, district, ward, address, paymentMethod } = checkoutData;

    // 1. Fetch Cart with Items
    const cart = await Cart.findOne({
        where: { userId },
        include: [{
            model: CartItem,
            as: 'items',
            include: [{ model: Product, as: 'product' }]
        }]
    });

    if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty. Cannot checkout.');
    }

    // Use transaction to ensure data integrity
    const transaction = await sequelize.transaction();

    try {
        // 2. Calculate Total Amount
        let totalAmount = 0;
        cart.items.forEach(item => {
            totalAmount += item.quantity * item.product.price;
        });

        // 3. Create Order
        const order = await Order.create({
            userId,
            totalAmount,
            fullName,
            phone,
            province,
            district,
            ward,
            address,
            paymentMethod: paymentMethod || 'COD',
            status: 'pending'
        }, { transaction });

        // 4. Create Order Items & Deduct Stock
        for (const item of cart.items) {
            // Check stock
            if (item.product.stock < item.quantity) {
                throw new Error(`Product ${item.product.name} is out of stock.`);
            }

            // Create Order Item
            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: item.product.price
            }, { transaction });

            // Deduct Stock
            item.product.stock -= item.quantity;
            await item.product.save({ transaction });
        }

        // 5. Clear Cart
        await CartItem.destroy({
            where: { cartId: cart.id },
            transaction
        });

        // Commit transaction
        await transaction.commit();

        return order;

    } catch (error) {
        // Rollback on error
        await transaction.rollback();
        throw error;
    }
};

const getMyOrders = async (userId) => {
    return await Order.findAll({
        where: { userId },
        include: [{
            model: OrderItem,
            as: 'items',
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'images']
            }]
        }],
        order: [['createdAt', 'DESC']]
    });
};

const getAllOrders = async () => {
    return await Order.findAll({
        include: [{
            model: OrderItem,
            as: 'items',
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'images']
            }]
        }],
        order: [['createdAt', 'DESC']]
    });
};

const updateOrderStatus = async (orderId, status) => {
    const order = await Order.findByPk(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    
    order.status = status;
    await order.save();
    return order;
};

const updatePaymentStatus = async (orderId, paymentStatus) => {
    const order = await Order.findByPk(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    
    order.paymentStatus = paymentStatus;
    await order.save();
    return order;
};

const getOrderById = async (orderId) => {
    return await Order.findByPk(orderId, {
        include: [{
            model: OrderItem,
            as: 'items',
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'images']
            }]
        }]
    });
};

module.exports = {
    checkout,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus
};
