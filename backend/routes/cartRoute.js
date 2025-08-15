const express = require('express');
const router = express.Router();

const CartController = require('../controllers/cartController');
const { authenticateToken, isAdmin } = require('../middleware/authmiddleware');


router.get('/', authenticateToken, CartController.getCart);
router.post('/add', authenticateToken, CartController.addToCart);
router.post('/remove', authenticateToken, CartController.removeFromCart);
router.post('/clear', authenticateToken, CartController.clearCart);

module.exports = router;