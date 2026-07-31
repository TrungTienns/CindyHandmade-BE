const orderService = require('../services/orderService');

// @desc    Checkout and create order
// @route   POST /api/orders/checkout
// @access  Private
const checkout = async (req, res) => {
    try {
        const { fullName, phone, province, district, ward, address, paymentMethod } = req.body;

        // Basic validation
        if (!fullName || !phone || !province || !district || !ward || !address) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin giao hàng (Tên, SĐT, Tỉnh, Huyện, Xã, Địa chỉ cụ thể).' });
        }

        const order = await orderService.checkout(req.user.id, {
            fullName,
            phone,
            province,
            district,
            ward,
            address,
            paymentMethod
        });

        res.status(201).json({
            message: 'Đặt hàng thành công!',
            order
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await orderService.getMyOrders(req.user.id);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái' });
        }
        const order = await orderService.updateOrderStatus(req.params.id, status);
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update payment status (Admin)
// @route   PUT /api/orders/:id/payment-status
// @access  Private/Admin
const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        if (!paymentStatus) {
            return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái thanh toán' });
        }
        const order = await orderService.updatePaymentStatus(req.params.id, paymentStatus);
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Cancel order (User)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await orderService.cancelOrder(req.user.id, req.params.id);
        res.status(200).json({ message: 'Hủy đơn hàng thành công', order });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    cancelOrder,
    checkout,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus
};
