const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams for :id from parent
const {
    getProductReviews,
    submitReview,
    getMyReviews,
    getMyReviewForProduct,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Mounted at /api/products/:id/reviews (via productRoutes)
router.route('/')
    .get(getProductReviews)
    .post(protect, submitReview);

router.route('/my-review')
    .get(protect, getMyReviewForProduct);

// Mounted at /api/reviews (via server.js)
router.route('/my-reviews')
    .get(protect, getMyReviews);

module.exports = router;
