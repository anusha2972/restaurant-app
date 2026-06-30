const mongoose = require('mongoose');

// Define the MenuItem schema
const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
        },

        category: {
            type: String,
            required: true,
            enum: ['Starters', 'Mains', 'Desserts', 'Beverages'],
        },

        image: {
            type: String,
            default: 'no-imag.jpg',
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);


// Create the MenuItem model
const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;