const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authmiddleware');

// Categories
router.post('/category', authenticateToken, isAdmin, adminController.createCategory);
router.post('/category/:id/update', authenticateToken, isAdmin, adminController.updateCategory);
router.post('/category/:id/delete', authenticateToken, isAdmin, adminController.deleteCategory);

// Subcategories
router.post('/subcategory', authenticateToken, isAdmin, adminController.createSubcategory);
router.post('/subcategory/:id/update', authenticateToken, isAdmin, adminController.updateSubcategory);
router.post('/subcategory/:id/delete', authenticateToken, isAdmin, adminController.deleteSubcategory);

// Products
router.post('/product', authenticateToken, isAdmin, adminController.createProduct);
router.post('/product/:id/update', authenticateToken, isAdmin, adminController.updateProduct);
router.post('/product/:id/delete', authenticateToken, isAdmin, adminController.deleteProduct);

module.exports = router;
