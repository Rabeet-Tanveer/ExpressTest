const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authmiddleware');

router.get('/products', authenticateToken, productController.getProducts);
router.get('/products/:id', authenticateToken, productController.getProductById);
router.post('/products/update-stock/:productId', authenticateToken, productController.updateStock);

module.exports = router;
