// Middleware to check if the user is an admin
const admin = (request, response, next) => {
    // Check if the user is authenticated and has the role of 'admin'
    if(request.user && request.user.role == 'admin')
    {
        next();
    }
    else
    {
        // If the user is not an admin, send a 403 Forbidden response
        response.status(403).json(
            {
                message: 'Not authorized as an admin'
            }
        );
    }
}

module.exports = {admin};