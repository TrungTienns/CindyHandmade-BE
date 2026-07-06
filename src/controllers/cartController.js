const cartService = require('../services/cartService');

const getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity, size, color } = req.body;
        if (!productId) return res.status(400).json({ message: 'Product ID is required' });
        
        const cart = await cartService.addToCart(req.user.id, productId, quantity || 1, size || null, color || null);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity, size, color } = req.body;
        if (!productId || quantity === undefined) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }
        
        const cart = await cartService.updateCartItem(req.user.id, productId, quantity, size || null, color || null);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { size, color } = req.query; // Size/Color might be needed to uniquely identify the item
        const cart = await cartService.removeCartItem(req.user.id, productId, size || null, color || null);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem
};
