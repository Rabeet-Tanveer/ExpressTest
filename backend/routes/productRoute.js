const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authmiddleware');

router.get('/', authenticateToken, productController.getProducts);
router.get('/:id', authenticateToken, productController.getProductById);

module.exports = router;
