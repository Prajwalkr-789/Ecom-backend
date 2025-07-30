const { validationResult, body } = require('express-validator');
const Product = require('../Models/product');
const  Cart = require('../Models/cart');

const   getCart = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { UserId: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'imageUrl', 'stock']
      }]
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.priceAtTime) * item.quantity);
    }, 0);

    res.json({
      cartItems,
      total: total.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Check if item already in cart
    const existingCartItem = await Cart.findOne({
      where: {
        UserId: req.user.id,
        ProductId: productId
      }
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      
      await existingCartItem.update({ quantity: newQuantity });
      
      const updatedCartItem = await Cart.findByPk(existingCartItem.id, {
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price', 'imageUrl', 'stock']
        }]
      });
      
      return res.json({
        message: 'Cart updated successfully',
        cartItem: updatedCartItem
      });
    } else {
      // Create new cart item
      const cartItem = await Cart.create({
        UserId: req.user.id,
        ProductId: productId,
        quantity,
        priceAtTime: product.price
      });

      const cartItemWithProduct = await Cart.findByPk(cartItem.id, {
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price', 'imageUrl', 'stock']
        }]
      });

      res.status(201).json({
        message: 'Item added to cart successfully',
        cartItem: cartItemWithProduct
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findOne({
      where: {
        id,
        UserId: req.user.id
      },
      include: [Product]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (cartItem.Product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    await cartItem.update({ quantity });

    const updatedCartItem = await Cart.findByPk(cartItem.id, {
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'imageUrl', 'stock']
      }]
    });

    res.json({
      message: 'Cart item updated successfully',
      cartItem: updatedCartItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findOne({
      where: {
        id,
        UserId: req.user.id
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.destroy({
      where: { UserId: req.user.id }
    });

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Validation rules
const cartValidation = [
  body('productId').isUUID().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
];

const updateCartValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
];

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  cartValidation,
  updateCartValidation
};