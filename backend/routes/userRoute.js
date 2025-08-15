const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authmiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAllUsers);
router.post('/delete/:id', authenticateToken, userController.deleteUser);
router.post('/update-password/:id', authenticateToken, userController.changePassword);

module.exports = router;
