const express = require('express');
const router = express.Router();
const { checkout, getMyOrders, getAllOrders, getOrderById, updateOrderStatus, updatePaymentStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Quản lý Đơn hàng
 */

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Thanh toán / Đặt hàng
 *     description: Chuyển toàn bộ sản phẩm trong giỏ hàng thành đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *               - province
 *               - district
 *               - ward
 *               - address
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *               ward:
 *                 type: string
 *               address:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, PAYPAL, VNPAY, MOMO, BANK_TRANSFER]
 *                 default: COD
 *     responses:
 *       201:
 *         description: Đặt hàng thành công
 *       400:
 *         description: Lỗi (Ví dụ giỏ hàng trống, hết hàng, thiếu thông tin)
 */
router.post('/checkout', protect, checkout);

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Lấy danh sách đơn hàng của tôi
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách đơn hàng
 */
router.get('/myorders', protect, getMyOrders);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy tất cả đơn hàng (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách đơn hàng
 */
router.get('/', protect, admin, getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Lấy thông tin đơn hàng theo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trả về thông tin đơn hàng
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.get('/:id', getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id/status', protect, admin, updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}/payment-status:
 *   put:
 *     summary: Cập nhật trạng thái thanh toán (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [UNPAID, PAID]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id/payment-status', protect, admin, updatePaymentStatus);

module.exports = router;
