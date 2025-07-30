const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  cartValidation,
  updateCartValidation
} = require('../Controllers/cartController');
const { authenticate } = require('../Middlewares/auth');

const router = express.Router();

router.get('/', authenticate, getCart);
router.post('/', authenticate, cartValidation, addToCart);
router.put('/:id', authenticate, updateCartValidation, updateCartItem);
router.delete('/:id', authenticate, removeFromCart);
router.delete('/', authenticate, clearCart);

module.exports = router;