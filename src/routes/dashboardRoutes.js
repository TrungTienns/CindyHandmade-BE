const express = require('express');
const router = express.Router();
const { getMonthlyRevenue, getYearlyRevenue } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.route('/revenue/monthly').get(protect, getMonthlyRevenue);
router.route('/revenue/yearly').get(protect, getYearlyRevenue);

module.exports = router;
