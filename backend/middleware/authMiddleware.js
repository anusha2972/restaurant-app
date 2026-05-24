const jwt = require('jsonwebtoken');

// To find the user from the database using the id inside the JWT token
const User = require('../models/User');

// Middleware to protect routes and ensure that the user is authenticated
const protect = async(request, response, next) => {
    try{
        let token;

        // Check if the authorization header is present and starts with 'Bearer'
        if(request.headers.authorization && request.headers.authorzationstartsWith('Bearer'))
        {
            // Get the token from the authorization header
            token = request.headers.authorozation.split('')[1];

            // Verify the token and decode it
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by id from the decoded token and attach it to the request object, excluding the password field
            request.user = await User.findById(decoded.id).select('-password');

            // Call the next middleware or route handler
            next();
        }
        else
        {
            response.status(401).json({
                message: 'Not authorized, no token'
            });
        }
    }
    catch(error)
    {
        response.status(401).json({
            message: 'Not authorized, token failed'
        });
    }
}

module.exports = {protect};