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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and checkout
 */
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for the authenticated user or all users (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order from the authenticated user's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty or validation failed
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update the status of an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status or validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (only admins can update status)
 *       404:
 *         description: Order not found
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         UserId:
 *           type: string
 *         totalAmount:
 *           type: number
 *         shippingAddress:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zipCode:
 *               type: string
 *             country:
 *               type: string
 *         status:
 *           type: string
 *           enum: [pending, confirmed, shipped, delivered, cancelled]
 *         OrderItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               priceAtTime:
 *                 type: number
 *               Product:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 */


router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.post('/', authenticate, orderValidation, createOrder);
router.put('/:id/status', authenticate, authorize('admin'), statusValidation, updateOrderStatus);

module.exports = router; 