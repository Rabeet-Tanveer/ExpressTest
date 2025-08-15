const { Cart, Product } = require('../models');
const {updateStock} = require('../controllers/productController.js');

const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid product or quantity' });
  }

  try {
    const updatedProduct = await updateStock(productId, quantity, 'remove', req.app.get('io'));
    const existingItem = await Cart.findOne({ where: { userId, productId } });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      await Cart.create({ userId, productId, quantity });
    }

    return res.status(200).json({ message: 'Item added to cart', product: updatedProduct });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    console.log(userId);
    const cartItems = await Cart.findAll({
      where: { userId },
      include: { model: Product, as: 'product' }
    });
    res.status(200).json({cartItems});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch cart items', details: err.message, err });
  }
};

const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Product ID and valid quantity are required' });
  }

  try {
    const item = await Cart.findOne({ where: { userId, productId } });

    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    let qtyToRemove = quantity;
    if (qtyToRemove >= item.quantity) {
        qtyToRemove = item.quantity;
        await item.destroy();
    } else {
        item.quantity -= qtyToRemove;
        await item.save();
    }

    await updateStock(productId, qtyToRemove, 'add', req.app.get('io'));
    return res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const items = await Cart.findAll({ where: { userId } });

    for (const item of items) {
      await updateStock(item.productId, item.quantity, 'add', req.app.get('io'));
    }

    await Cart.destroy({ where: { userId } });

    return res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to clear cart' });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart
};
