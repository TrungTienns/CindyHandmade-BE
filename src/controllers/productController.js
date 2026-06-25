const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        // Lấy toàn bộ danh sách sản phẩm kèm theo Category
        const products = await Product.findAll({
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }]
        });
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
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }]
        });
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
        const { name, description, price, categoryId, stock } = req.body;
        let images = req.body.images ? JSON.parse(req.body.images) : [];
        let sizes = req.body.sizes ? req.body.sizes.split(',').map(s => s.trim()).filter(s => s) : [];

        if (!name || !description || price === undefined) {
            return res.status(400).json({ message: 'Please add all product fields' });
        }

        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(file => file.path);
            images = [...images, ...uploadedImages];
        } else if (images.length === 0) {
            images = ['https://via.placeholder.com/500'];
        }

        let translations = {};
        if (req.body.translations) {
            try {
                translations = JSON.parse(req.body.translations);
            } catch (e) {
                console.error("Failed to parse translations", e);
            }
        }

        const product = await Product.create({
            name,
            description,
            price,
            images,
            sizes,
            categoryId,
            stock: stock || 0,
            userId: req.user.id,
            translations,
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

        // Make sure the logged in user matches the product user or is an admin
        if (product.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updateData = { ...req.body };
        if (updateData.translations && typeof updateData.translations === 'string') {
            try {
                updateData.translations = JSON.parse(updateData.translations);
            } catch (e) {
                console.error("Failed to parse translations", e);
            }
        }

        if (updateData.sizes && typeof updateData.sizes === 'string') {
            updateData.sizes = updateData.sizes.split(',').map(s => s.trim()).filter(s => s);
        }

        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(file => file.path);
            updateData.images = uploadedImages; // Replace old images with newly uploaded ones
        } else if (req.body.images) {
            updateData.images = JSON.parse(req.body.images);
        }

        const updatedProduct = await product.update(updateData);

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

        // Make sure the logged in user matches the product user or is an admin
        if (product.userId !== req.user.id && req.user.role !== 'admin') {
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
