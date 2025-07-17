const express = require('express');
const app = express();
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const adminRoute = require('./routes/adminRoute'); 
require('dotenv').config();

app.use(cors());
app.use(express.json()); // Parse JSON bodies


app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/admin', adminRoute);

module.exports = app;