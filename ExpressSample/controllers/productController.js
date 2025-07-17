const { Product, Subcategory, Category } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /products
 * Fetch products with pagination and optional filters.
 */
const getProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const whereCondition = buildCondition(req);

    const includeCondition = [
      {
        model: Subcategory,
        as: 'subcategory',
        include: [
          {
            model: Category,
            as: 'category',
            where: {}
          }
        ]
      }
    ];

    // Category filter (join-based)
    if (req.query.categoryId) {
      const categoryId = parseInt(req.query.categoryId);
      if (!isNaN(categoryId)) {
        includeCondition[0].include[0].where.id = categoryId;
      }
    } else {
      delete includeCondition[0].include[0].where;
    }

    const { rows: products, count: total } = await Product.findAndCountAll({
      where: whereCondition,
      include: includeCondition,
      limit,
      offset,
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('getProducts error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /products/:id
 * Fetch detailed view of a single product.
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await Product.findOne({
      where: { id: productId },
      include: [
        {
          model: Subcategory,
          as: 'subcategory',
          include: [
            {
              model: Category,
              as: 'category'
            }
          ]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({ product });
  } catch (err) {
    console.error('getProductById error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /products/:productId/stock
 * Update product stock based on cart action.
 */
const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, action } = req.body;

    const productID = parseInt(productId);
    const qty = parseInt(quantity);

    if (!['add', 'remove'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Use "add" or "remove".' });
    }

    if (isNaN(productID) || isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Invalid product ID or quantity.' });
    }

    const product = await Product.findByPk(productID);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (action === 'remove') {
      if (product.stock < qty) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      product.stock -= qty;
    } else {
      product.stock += qty;
    }

    await product.save();

    return res.status(200).json({ message: 'Stock updated', stock: product.stock });
  } catch (err) {
    console.error('updateStock error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Builds Sequelize where conditions based on query params.
 */
const buildCondition = (req) => {
  const whereCondition = {};

  if (req.query.keyword) {
    const keyword = req.query.keyword.trim();
    if (keyword.length > 0) {
      whereCondition[Op.or] = [
        { name: { [Op.iLike]: `%${keyword}%` } },
        { description: { [Op.iLike]: `%${keyword}%` } }
      ];
    }
  }

  if (req.query.subcategoryId) {
    let subcategoryArray = req.query.subcategoryId;

    if (typeof subcategoryArray === 'string') {
      try {
        subcategoryArray = JSON.parse(subcategoryArray);
      } catch (e) {
        subcategoryArray = [subcategoryArray]; // fallback if single
      }
    }

    if (Array.isArray(subcategoryArray) && subcategoryArray.length > 0) {
      const parsed = subcategoryArray.map(id => parseInt(id)).filter(id => !isNaN(id));
      if (parsed.length > 0) {
        whereCondition.subcategoryId = { [Op.in]: parsed };
      }
    }
  }

  if (req.query.minPrice || req.query.maxPrice) {
    whereCondition.price = {};
    const min = parseFloat(req.query.minPrice);
    const max = parseFloat(req.query.maxPrice);
    if (!isNaN(min)) whereCondition.price[Op.gte] = min;
    if (!isNaN(max)) whereCondition.price[Op.lte] = max;
  }

  if (req.query.inStock !== undefined) {
    if (req.query.inStock === 'true') {
      whereCondition.stock = { [Op.gt]: 0 };
    } else if (req.query.inStock === 'false') {
      whereCondition.stock = 0;
    }
  }

  return whereCondition;
};

module.exports = {
  getProducts,
  getProductById,
  updateStock
};
