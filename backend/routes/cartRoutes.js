const express = require('express');
const router = express.Router();

// Import controller functions for cart operations
const 
{
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart
} = require('../controllers/cartController');

// Import the authentication middleware to protect routes
const {protect} = require('../middleware/authMiddleware');

// Define routes for cart operations with appropriate HTTP methods and middleware
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:itemId', protect, updateCartItem);
router.delete('/:itemId', protect, removeFromCart);

module.exports = router;