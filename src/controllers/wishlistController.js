const User = require('../models/User');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{
                model: Product,
                as: 'wishlistedProducts',
                through: { attributes: [] } // don't include junction table fields
            }]
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user.wishlistedProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Toggle product in wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if already in wishlist
        const existing = await Wishlist.findOne({
            where: { userId, productId }
        });

        if (existing) {
            await existing.destroy();
            return res.status(200).json({ message: 'Product removed from wishlist', isWishlisted: false });
        } else {
            await Wishlist.create({ userId, productId });
            return res.status(200).json({ message: 'Product added to wishlist', isWishlisted: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
