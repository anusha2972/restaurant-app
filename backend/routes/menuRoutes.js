const express = require('express');
const router = express.Router();

// Import the controller functions for menu item operations
const {getMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem} = require('../controllers/menuController');

// Import the authentication and authorization middlewares
const {protect} = require('../middleware/authMiddleware');
const {admin} = require('../middleware/adminMiddleware');

// Define the routes for menu item operations with appropriate middlewares
router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);
router.post('/', protect, admin, createMenuItem);
router.put('/:id', protect, admin, updateMenuItem);
router.delete('/:id', protect, admin, deleteMenuItem);

// Export the router to be used in the main application
module.exports = router;