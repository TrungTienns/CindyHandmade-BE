const { sequelize } = require('../config/db');

// @desc    Get monthly revenue
// @route   GET /api/dashboard/revenue/monthly
// @access  Private (Admin)
const getMonthlyRevenue = async (req, res) => {
    try {
        const [results] = await sequelize.query(`SELECT * FROM vw_revenue_monthly ORDER BY yearMonth ASC`);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get yearly revenue
// @route   GET /api/dashboard/revenue/yearly
// @access  Private (Admin)
const getYearlyRevenue = async (req, res) => {
    try {
        const [results] = await sequelize.query(`SELECT * FROM vw_revenue_yearly ORDER BY year DESC`);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMonthlyRevenue,
    getYearlyRevenue
};
