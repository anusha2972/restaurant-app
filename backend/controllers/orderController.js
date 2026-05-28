const Order = require('../models/Order');
const MenuItem = require('../models/menuItem');

// @desc Place a new order
// @route POST /api/orders
// @access Protected
const placeOrder = async(request, response) => {
    try{
        // Destructure the request body to get order items and delivery address
        const {orderItems, deliveryAddress} = request.body;
     
        // Validate that order items and delivery address are provided
        if(!orderItems || orderItems.length === 0)
        {
            return response.status(400).json({
                message: 'No order items'
            });
        }

        if(!deliveryAddress)
        {
            return response.status(400).json(
                {
                    message: 'Please provide delivery address'
                }
            );
        }

        // Calculate total price
        let totalPrice = 0;
        // Create an array to hold the populated order items
        const populatedOrderItems = [];

        // Loop through each order item to validate and populate the order items with menu item details
        for(const item of orderItems)
        {
            const menuItem = await MenuItem.findById(item.menuItem);
            
            // If the menu item is not found, return a 404 Not Found response
            if(!menuItem)
            {
                return response.status(404).json({
                    message: `Menu item with ID: ${item.menuItem} not found`
                });
            }

            // Check if the menu item is available
            if(!menuItem.isAvailable)
            {
                response.status(400).json({
                    message: `${menuItem.name} is not available`
                });
            }

            // Calculate the total price by multiplying the menu item price with the quantity ordered
            totalPrice += menuItem.price * item.quantity;

            // Populate the order item with menu item details and add it to the populated order items array
            populatedOrderItems.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity,
            });
        }
            
        // Create a new order in the database with the user ID, populated order items, delivery address, and total price
        const order = await Order.create(
            {
                user: request.user._id,
                orderItems: populatedOrderItems,
                deliveryAddress,
                totalPrice,
            }
        );

        // Send a 201 Created response with the newly created order
        response.status(201).json(order);
    }
    catch(error)
    {
        response.status(500).json({message: error.message});
    }

}

// @desc Get logged in user's orders
// @route GET /api/orders/my-orders
// @access Protected
const getMyOrders = async(request, response) => 
{
    try
    {
        // Fetch all orders for the logged-in user from the database
        const orders = await Order.find({user: request.user._id});
        // Send a 200 OK response with the user's orders
        response.status(200).json(orders);
    }
    catch(error)
    {
        response.status(500).json({
            message: error.message
        });
    }
}

// @desc Get single order by ID
// @route GET /api/orders/:id
// @access Protected
const getOrderById = async(request, response) =>
{
    try{
        // Fetch the order by ID from the database
        const order = await Order.findById(request.params.id);

        // If the order is not found, send a 404 Not Found response
        if(!order)
        {
            return response.status(404).json({
                message: 'Order not found'
            });
        }

        // Send a 200 OK response with the order details if found
        response.status(200).json(order);
    }
    catch(error)
    {
        response.status(500).json({
            message: error.message
        });
    }
}

// @desc Get all orders (Admin only)
// @route GET /api/orders
// @access Private/Admin
const getAllOrders = async(request, response) =>
{
    try{
        // Fetch all orders from the database and populate the user field with name and email
        const orders = await Order.find({}).populate('user', 'name email');
        // Send a 200 OK response with all orders
        response.status(200).json(orders);
    }
    catch(error)
    {
        response.status(500).json({
            message: error.message
        });
    }
}

// @desc Update order status (Admin only)
// @route PUT /api/orders/:id/status
// @access Private/Admin
const updateOrderStatus = async(request, response) =>
{
    try{
        // Destructure the request body to get the new status for the order
        const status = request.body.status;

        // Fetch the order by ID from the database
        const order = await Order.findById(request.params.id);

        // If the order is not found, send a 404 Not Found response
        if(!order)
        {
            response.status(404).json({
                message: 'Order not found'
            });
        }

        // Update the order status and save the changes to the database
        order.status = status;
        const updatedOrder = await order.save();

        // Send a 200 OK response with the updated order details
        response.status(200).json(updatedOrder);

    }
    catch(error)
    {
        response.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
};