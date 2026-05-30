const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const menuRoutes = require('./routes/menuRoutes')
const orderRoutes = require('./routes/orderRoutes');

// Load environment variables and connect to the database
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Use the authentication routes
app.use('/api/auth', authRoutes);

// Use the menu routes
app.use('/api/menu', menuRoutes);

// Use the order routes
app.use('/api/orders', orderRoutes);

// Define routes
app.get('/', (request, response) => {
    response.send('Restaurant API is running successfully!');
});

const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});