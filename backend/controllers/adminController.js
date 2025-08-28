const { Category, Subcategory, Product } = require('../models');

// ==========================
//        Category
// ==========================

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const category = await Category.create({ name });
    res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    console.error('createCategory error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    category.name = name || category.name;
    await category.save();

    res.json({ message: 'Category updated', category });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==========================
//        Subcategory
// ==========================

const createSubcategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Name and categoryId are required' });
    }

    const subcategory = await Subcategory.create({ name, categoryId });
    res.status(201).json({ message: 'Subcategory created', subcategory });
  } catch (err) {
    console.error('createSubcategory error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    const subcategory = await Subcategory.findByPk(id);
    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });

    subcategory.name = name || subcategory.name;
    subcategory.categoryId = categoryId || subcategory.categoryId;
    await subcategory.save();

    res.json({ message: 'Subcategory updated', subcategory });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await Subcategory.findByPk(id);
    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });

    await subcategory.destroy();
    res.json({ message: 'Subcategory deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==========================
//        Product
// ==========================

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, subcategoryId } = req.body;

    if (!name || !price || !stock || !subcategoryId) {
      return res.status(400).json({ error: 'Missing required product fields' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      subcategoryId
    });

    const io = req.app.get('io');
    io.emit('productCreated', product);
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    console.error('createProduct error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, subcategoryId } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock ?? product.stock;
    product.subcategoryId = subcategoryId || product.subcategoryId;

    await product.save();
    const io = req.app.get('io');
    io.emit('productUpdated', product);
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.destroy();
    const io = req.app.get('io');
    console.log('before');
    io.emit('productDeleted', id);
    console.log('after');
    res.json({ message: 'Product deleted' });
    console.log('after after');
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  createProduct,
  updateProduct,
  deleteProduct
};
