const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Genereate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, 
        {
            expiresIn: '30d',
        }
    );
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async(request, response) => {
    try{
        // Destructure the request body
        const {name, email, password} = request.body;

        // Check if all the fields are provided
        if(!name || !email || !password)
        {
            return response.status(400).json({message: 'Please provide all the fields'});
        }

        // Check if the user already exists
        const userExists = await User.findOne({email});
        if(userExists)
        {
            return response.status(400).json(
                {message: 'User already exists'}
            )
        };

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // If user is created successfully, return the user data and token as response
        response.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    }
    catch(error)
    {
        response.status(500).json({message: error.message});
    }
};