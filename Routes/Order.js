const express = require('express');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  orderValidation,
  statusValidation
} = require('../Controllers/orderController');
const { authenticate, authorize } = require('../Middlewares/auth');

const router = express.Router();

router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.post('/', authenticate, orderValidation, createOrder);
router.put('/:id/status', authenticate, authorize('admin'), statusValidation, updateOrderStatus);

module.exports = router; 