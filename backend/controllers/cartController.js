const Cart = require("../models/Cart")
const MenuItem = require("../models/MenuItem")

// @desc: Get logged into user's cart
// @route: GET /api/cart
// @access: Private/ Protected
const getCart = async(request, response) =>
{
    try{
        // Find the cart for the logged-in user and populate the menu item details
        let cart = await Cart.findOne({user: request.user._id})
        .populate('items.menuItem', 'name price image');

        // If the cart doesn't exist, create a new one for the user
        if(!cart)
        {
            cart = await Cart.create({
                user: request.user._id,
                items: [],
            });

        }
        // Return the cart to the client
        response.status(200).json(cart);
    
    }
    catch(error)
    {
        response.status(500).json({message: error.message});
    }
}

// @desc: Add an item to the cart
// @route: POST /api/cart
// @access: Private/ Protected
const addToCart = async(request, response) =>
{
    try{
        // Extract the menu item ID and quantity from the request body
        const {menuItemId, quantity} = request.body;

        // Validate that a menu item ID was provided
        if(!menuItemId)
        {
            return response.status(400).json({
                message: 'Please provide a menu item ID to add to the cart.'
            });
        }

        const menuItem = await MenuItem.findById(menuItemId);

        // If the menu item doesn't exist, return a 404 error
        if(!menuItem)
        {
            return response.status(404).json({
                message: 'Menu item not found.'
            }
            );
        }

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({
            user: request.user._id
        })

        if(!cart)
        {
            cart = await Cart.create({
                user: request.user._id,
                items: [{
                    menuItem: menuItemId,
                    quantity: quantity || 1,
                }],
            });
        }
        else
        {
            // Check if the menu item already exists in the cart
            const itemIndex = cart.items.findIndex(
                (item) => item.menuItem.toString() === menuItemId
            );

            // If the item exists, update the quantity; otherwise, add it to the cart
            if(itemIndex > -1)
            {
                cart.items[itemIndex].quantity += quantity || 1;
            }
            else
            {
                cart.items.push({
                    menuItem: menuItemId,
                    quantity: quantity || 1,
                });
            }
            // Save the updated cart to the database
            await cart.save();
        }
        // Populate the menu item details in the updated cart before sending the response
        const updatedCart = await Cart.findOne({user: request.user._id})
            .populate('items.menuItem', 'name price image')
        

        // Return the updated cart to the client
        response.status(200).json(updatedCart);
    }
    catch(error)
    {
        response.status(500).json({message: error.message});
    }
}

// @desc: Update an item quantity in the cart
// @route: PUT /api/cart/:itemId
// @access: Private/ Protected
const updateCartItem = async(request, response) =>
{
    try{
        // Extract the quantity from the request body
        const {quantity} = request.body;

        // Validate that the quantity is at least 1
        if(!quantity || quantity < 1)
        {
            return response.status(400).json({
                message: 'Quantity must be atleast 1.'
            });
        }

        // Find the user's cart
        const cart = await Cart.findOne({user: request.user._id});

        // If the cart doesn't exist, return a 404 error
        if(!cart)
        {
            return response.status(404).json({
                message: 'Cart not found.'
            });
        }

        // Find the index of the item in the cart based on the item ID from the request parameters
        const itemIndex = cart.items.findIndex(
            (item) => item._id.toString() === request.params.itemId
        )

        // If the item is not found in the cart, return a 404 error
        if(itemIndex == -1)
        {
            return response.status(404).json({
                message: 'Item not found in the cart.'
            });
        }

        // Update the quantity of the item in the cart
        cart.items[itemIndex].quantity = quantity;

        // Save the updated cart to the database
        await cart.save();

        // Populate the menu item details in the updated cart before sending the response
        const updatedCart = await Cart.findOne({user: request.user._id})
        .populate('items.menuItem', 'name price image');

        // Return the updated cart to the client
        response.status(200).json(updatedCart)

    }
    catch(error)
    {
        response.status(500).json({message: error.message});
    }
}

// @desc: Remove an item from the cart
// @route: DELETE /api/cart/:itemId
// @access: Private/ Protected
const removeFromCart = async(request, response) =>
{
    try{

        // Find the user's cart
        const cart = await Cart.findOne({user: request.user._id});
        
        // If the cart doesn't exist, return a 404 error
        if(!cart)
        {
            return response.status(404).json({
                message: 'Cart not found.'
            })
        }

        // Filter out the item to be removed from the cart based on the item ID from the request parameters
        cart.items = cart.items.filter(
            (item) => item._id.toString() !== request.params.itemId
        );

        // Save the updated cart to the database
        await cart.save();

        // Populate the menu item details in the updated cart before sending the response
        const updatedCart = await Cart.findOne({user: request.user._id})
            .populate('items.menuItem', 'name price image')

        // Return the updated cart to the client
        response.status(200).json(updatedCart);
        
    }
    catch(error)
    {
        response.status(500).json({error: error.message});
    }
}

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
};