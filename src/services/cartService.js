const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

const getCart = async (userId) => {
    // Tìm giỏ hàng hoặc tạo mới nếu chưa có
    let cart = await Cart.findOne({
        where: { userId },
        include: [{
            model: CartItem,
            as: 'items',
            include: [{ model: Product, as: 'product' }]
        }]
    });

    if (!cart) {
        cart = await Cart.create({ userId });
        cart.items = []; // Giỏ hàng rỗng
    }

    return cart;
};

const addToCart = async (userId, productId, quantity = 1, size = null, color = null) => {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
        cart = await Cart.create({ userId });
    }

    // Check if item already exists
    let cartItem = await CartItem.findOne({
        where: { cartId: cart.id, productId, size, color }
    });

    if (cartItem) {
        // Tăng số lượng
        cartItem.quantity += quantity;
        await cartItem.save();
    } else {
        // Tạo mới
        cartItem = await CartItem.create({
            cartId: cart.id,
            productId,
            quantity,
            size,
            color
        });
    }

    return getCart(userId);
};

const updateCartItem = async (userId, productId, quantity, size = null, color = null) => {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    const cartItem = await CartItem.findOne({
        where: { cartId: cart.id, productId, size, color }
    });

    if (!cartItem) throw new Error('Item not found in cart');

    if (quantity <= 0) {
        await cartItem.destroy();
    } else {
        cartItem.quantity = quantity;
        await cartItem.save();
    }

    return getCart(userId);
};

const removeCartItem = async (userId, productId, size = null, color = null) => {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    // Mệnh đề where cần bao gồm size và color để xóa chính xác
    const whereClause = { cartId: cart.id, productId };
    if (size !== undefined) {
        whereClause.size = size;
    }
    if (color !== undefined) {
        whereClause.color = color;
    }

    await CartItem.destroy({
        where: whereClause
    });

    return getCart(userId);
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem
};
