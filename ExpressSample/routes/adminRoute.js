const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authmiddleware');

// Categories
router.post('/category', authenticateToken, isAdmin, adminController.createCategory);
router.post('/category/:id/update', authenticateToken, isAdmin, adminController.updateCategory);
router.post('/category/:id/delete', authenticateToken, isAdmin, adminController.deleteCategory);

// Subcategories
router.post('/admin/subcategory', authenticateToken, isAdmin, adminController.createSubcategory);
router.post('/admin/subcategory/:id/update', authenticateToken, isAdmin, adminController.updateSubcategory);
router.post('/admin/subcategory/:id/delete', authenticateToken, isAdmin, adminController.deleteSubcategory);

// Products
router.post('/admin/product', authenticateToken, isAdmin, adminController.createProduct);
router.post('/admin/product/:id/update', authenticateToken, isAdmin, adminController.updateProduct);
router.post('/admin/product/:id/delete', authenticateToken, isAdmin, adminController.deleteProduct);

module.exports = router;
