const { Product, Subcategory, Category } = require('../models');
const { Op } = require('sequelize');
const sendEmail = require('../utils/mailer');
const emailQueue = require('../utils/queue');


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

const updateStock = async (productID, qty, action, io) => {
    if (!['add', 'remove'].includes(action)) {
      throw new Error('Invalid action. Use "add" or "remove".' );
    }

    if (isNaN(productID) || isNaN(qty) || qty <= 0) {
      throw new Error('Invalid product ID or quantity.' );
    }

    const product = await Product.findByPk(productID);
    if (!product) {
      throw new Error('Product not found');
    }

    if (action === 'remove') {
      if (product.stock < qty) {
        throw new Error('Insufficient stock' );
      }
      product.stock -= qty;
    } else {
      product.stock += qty;
    }

    if (product.stock === 0) {
      await sendStockAlert(product);
    }
    await product.save();
    if (io) io.emit('productUpdated', product);
    return product;
};

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

const sendStockAlert = async (product) => {
  console.log("inside stockalert");
  await emailQueue.add('email', {
    to: 'khawajarabeet@gmail.com',
    subject: `Stock Alert: ${product.name}`,
    text: `${product.name} is out of stock!`,
    html: '<b>Out of Stock</b>'
  });
  console.log("exiting stockalert");
};

module.exports = {
  getProducts,
  getProductById,
  updateStock
};
