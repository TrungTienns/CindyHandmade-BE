const Product = require('../models/Product');

// @desc    Get products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
    try {
        // Lấy toàn bộ danh sách sản phẩm
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set product
// @route   POST /api/products
// @access  Private
const setProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;

        if (!name || !description || price === undefined) {
            return res.status(400).json({ message: 'Please add all product fields' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            imageUrl, // Thêm dòng này để lưu link ảnh
            userId: req.user.id,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the product user
        if (product.userId !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedProduct = await product.update(req.body);

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the product user
        if (product.userId !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await product.destroy();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    setProduct,
    updateProduct,
    deleteProduct,
};
