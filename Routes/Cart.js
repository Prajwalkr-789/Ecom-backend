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
/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all cart items for the authenticated user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartItems:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *                 total:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Cart item ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       404:
 *         description: Cart item not found
 */
/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Remove a specific item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Cart item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       404:
 *         description: Cart item not found
 */
/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear the cart for the authenticated user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         quantity:
 *           type: integer
 *         priceAtTime:
 *           type: string
 *         Product:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             price:
 *               type: string
 *             imageUrl:
 *               type: string
 *             stock:
 *               type: integer
 */


router.get('/', authenticate, getCart);
router.post('/', authenticate, cartValidation, addToCart);
router.put('/:id', authenticate, updateCartValidation, updateCartItem);
router.delete('/:id', authenticate, removeFromCart);
router.delete('/', authenticate, clearCart);

module.exports = router;