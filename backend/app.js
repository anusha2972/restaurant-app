const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get('/', (request, response) => {
    response.send('Restaurant API is running successfully!');
});

const PORT = 8000;

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});