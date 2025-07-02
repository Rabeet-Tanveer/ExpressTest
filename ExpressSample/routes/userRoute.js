const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authmiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.delete('/:id', authenticateToken, userController.deleteUser);
router.put('/:id', authenticateToken, userController.changePassword);

module.exports = router;