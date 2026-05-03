const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password:{
            type: String,
            required: true,
            minLength: 6,
        },
        role:{
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },  
    },
    {
        timestamps: true,
    }
);

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;