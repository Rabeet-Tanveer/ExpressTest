const express = require('express');
const app = express();
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const adminRoute = require('./routes/adminRoute');
const cartRoute = require('./routes/cartRoute');

app.use(cors());
app.use(express.json()); // Parse JSON bodies

app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/admin', adminRoute);
app.use('/api/cart', cartRoute)

module.exports = app;