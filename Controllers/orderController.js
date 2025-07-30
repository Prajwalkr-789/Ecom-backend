const { validationResult, body } = require('express-validator');
const  {Order} = require('../Models/order');
const  {OrderItem} = require('../Models/order');
const  Cart = require('../Models/cart');
const  Product= require('../Models/product');
const User  = require('../Models/user');
const { sequelize } = require('../Models/index');

const getOrders = async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { UserId: req.user.id };
    
    const orders = await Order.findAll({
      where,
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        ...(req.user.role === 'admin' ? [{
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }] : [])
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const where = { id };
    
    if (req.user.role !== 'admin') {
      where.UserId = req.user.id;
    }

    const order = await Order.findOne({
      where,
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        ...(req.user.role === 'admin' ? [{
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }] : [])
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { shippingAddress } = req.body;

    // Get cart items
    const cartItems = await Cart.findAll({
      where: { UserId: req.user.id },
      include: [Product],
      transaction
    });

    if (cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.Product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.Product.name}` 
        });
      }
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.priceAtTime) * item.quantity);
    }, 0);

    // Create order
    const order = await Order.create({
      UserId: req.user.id,
      totalAmount,
      shippingAddress
    }, { transaction });

    // Create order items and update stock
    for (const item of cartItems) {
      await OrderItem.create({
        OrderId: order.id,
        ProductId: item.ProductId,
        quantity: item.quantity,
        priceAtTime: item.priceAtTime,
        productName: item.Product.name
      }, { transaction });

      // Update product stock
      await item.Product.update({
        stock: item.Product.stock - item.quantity
      }, { transaction });
    }

    // Clear cart
    await Cart.destroy({
      where: { UserId: req.user.id },
      transaction
    });

    await transaction.commit();

    // Fetch the complete order
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: completeOrder
    });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status });

    const updatedOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        include: [Product]
      }, {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Validation rules
const orderValidation = [
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.street').trim().isLength({ min: 5 }).withMessage('Street address is required'),
  body('shippingAddress.city').trim().isLength({ min: 2 }).withMessage('City is required'),
  body('shippingAddress.state').trim().isLength({ min: 2 }).withMessage('State is required'),
  body('shippingAddress.zipCode').trim().isLength({ min: 5 }).withMessage('ZIP code is required'),
  body('shippingAddress.country').trim().isLength({ min: 2 }).withMessage('Country is required')
];

const statusValidation = [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Status must be one of: pending, confirmed, shipped, delivered, cancelled')
];

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  orderValidation,
  statusValidation
};