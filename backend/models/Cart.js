const mongoose = require("mongoose");

// Each cart item will reference a menu item and have a quantity
const cartItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1, // Default quantity is 1, it cant be negative or zero
        min: 1,
    },
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Each user can have only one cart
    },

    items: [cartItemSchema],
},
{
    timestamps: true, // Automatically adds createdAt and updatedAt fields
}
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;