const express = require('express');
const router = express.Router();

const { placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,} = require('../controllers/orderController')

const {protect} = require('../middleware/authMiddleware');

const {admin} = require('../middleware/adminMiddleware');

router.post('/', protect, placeOrder); // Place a new order (Protected route)
router.get('/my-orders', protect, getMyOrders); // Get logged-in user's orders (Protected route)
router.get('/:id', protect, getOrderById); // Get a single order by ID (Protected route)
router.get('/', protect, admin, getAllOrders); // Get all orders (Admin only, Protected route)
router.put('/:id/status', protect, admin, updateOrderStatus); // Update order status (Admin only, Protected route)

module.exports = router;
