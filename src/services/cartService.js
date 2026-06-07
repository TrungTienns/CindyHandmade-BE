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

const addToCart = async (userId, productId, quantity = 1) => {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
        cart = await Cart.create({ userId });
    }

    // Check if item already exists
    let cartItem = await CartItem.findOne({
        where: { cartId: cart.id, productId }
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
            quantity
        });
    }

    return getCart(userId);
};

const updateCartItem = async (userId, productId, quantity) => {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    const cartItem = await CartItem.findOne({
        where: { cartId: cart.id, productId }
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

const removeCartItem = async (userId, productId) => {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    await CartItem.destroy({
        where: { cartId: cart.id, productId }
    });

    return getCart(userId);
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem
};
