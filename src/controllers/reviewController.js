const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const User = require('../models/User');
const { sequelize } = require('../config/db');

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { productId: req.params.id },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name'],
            }],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit a review for a product
// @route   POST /api/products/:id/reviews
// @access  Private
const submitReview = async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        const userId = req.user.id;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ where: { userId, productId } });
        if (existingReview) {
            return res.status(409).json({ message: 'You have already reviewed this product' });
        }

        // Check the product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create the review
        const review = await Review.create({
            rating,
            comment: comment || null,
            userId,
            productId,
        });

        // Return with user info
        const fullReview = await Review.findByPk(review.id, {
            include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
        });

        res.status(201).json(fullReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews written by the logged-in user
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'images', 'price'],
            }],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if the current user has already reviewed a product
// @route   GET /api/products/:id/reviews/my-review
// @access  Private
const getMyReviewForProduct = async (req, res) => {
    try {
        const review = await Review.findOne({
            where: { userId: req.user.id, productId: req.params.id },
        });
        res.status(200).json(review || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProductReviews,
    submitReview,
    getMyReviews,
    getMyReviewForProduct,
};
