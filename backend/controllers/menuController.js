const MenuItem = require('../models/menuItem');

// @desc Get all menu items
// @route GET /api/menu
// @access Public
const getMenuItems = async(request, response) => {
    try{
        // Fetch all menu items from the database
        const menuItems = await MenuItem.find({});

        // Return the menu items as a JSON response 200 OK
        response.status(200).json(menuItems);
    }
    catch(error)
    {
        response.status(500).json({message: error.message});
    }
}

// @desc Get a single menu item by ID
// @route GET /api/menu/:id
// @access Public
const getMenuItemById = async(request, response) => {
    try{

        // Fetch the menu item by ID from the database
        const menuItem = await MenuItem.findById(request.params.id);

        if(menuItem)
        {
            response.status(200).json(menuItem);
        }
        else
        {
            // If the menu item is not found, send a 404 Not Found response
            response.status(404).json(
                {message: 'Menu item not found'}
            );
        }
    }
    catch(error)
    {
        response.status(500).json({message: error.message});
    }
}

// @desc Create a new menu item
// @route POST /api/menu
// @access Private/ Admin
const createMenuItem = async(request, response) =>
{
    try
    {
        // Destructure the request body to get the menu item details
        const {name, description, price, category, image} = request.body;

        // Check if all required fields are provided
        if(!name || !description || !price || !category)
        {
            return response.status(400).json({message: 'Please provide all the required fields'});
        }

        // Create a new menu item in the database
        const menuItem = await MenuItem.create(
            {
                name,
                description,
                price,
                category,
                image,
            }
        )

        // Return the created menu item as a JSON response with 201 Created status
        response.status(201).json(menuItem);
    }
    catch(error)
    {
        response.status(500).json({message: error.message});
    }
}

// @desc Update an existing menu item
// @routte PUT /api/menu/:id
// @access Private/Admin
const updateMenuItem = async(request, response) =>
{
    try
    {
        // Fetch the menu item by ID from the database
        const menuItem = await MenuItem.findById(request.params.id);

        // If the menu item is not found, send a 404 Not Found response
        if(!menuItem)
        {
            return response.status(404).json({message: 'Menu item not found'});
        }

        // Update the menu item with the new data from the request body
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(
            request.params.id,
            request.body,
            {new: true} // Return the updated document
        );

        // Return the updated menu item as a JSON response with 200 OK status
        response.status(200).json(updatedMenuItem);
    }
    catch(error)
    {
        response.status(500).json({message: error.message});
    }
}

// @desc Delete a menu item
// @route DELETE /api/menu/:id
// @access Private/ Admin
const deleteMenuItem = async(request, response) =>
{
    try
    {
        // Fetch the menu item by ID from the database
        menuItem = await MenuItem.findById(request.params.id);

        // If the menu item is not found, send a 404 Not Found response
        if(!menuItem)
        {
            return response.status(404).json({message: 'Menu item not found'});
        }

        // Delete the menu item from the database
        await MenuItem.findByIdAndDelete(request.params.id);

        // Return a success message as a JSON response with 200 OK status
        response.status(200).json({message: 'Menu item deleted successfully'});

    }
    catch(error)
    {
        response.status(500).json({message: error.message});
    }
}

module.exports = { 
    getMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
};