const express = require('express');
const app = express();
const userRoute = require('./routes/userRoute');
require('dotenv').config();

app.use(express.json()); // Parse JSON bodies
app.use('/api/users', userRoute); // Mount user routes

module.exports = app;