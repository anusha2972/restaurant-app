const mongoose = require('mongoose');

// Define the schema for an order item, which includes a reference to a menu item, its name, price, and quantity.
const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the MenuItem model
        ref: 'MenuItem',
        required: true,
    },

    // Store the name of the menu item to maintain consistency even if the price or name of the menu item changes in the future. 
    name: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
        default: 1,
    },

});

// Define the schema for an order, which includes a reference to the user who placed the order, an array of order items, delivery address, total price, status, and payment status.
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true,
    },

    orderItems: [orderItemSchema], // An array of order items

    deliveryAddress: {
        street: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        zipCode: {type: String, required: true},
    },

    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },

    status: {
        type: String,
        enum: ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Placed',
    },

    isPaid: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
});

// Create the Order model using the orderSchema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;