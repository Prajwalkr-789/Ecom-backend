const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryValidation
} = require('../Controllers/categoryController');
const { authenticate, authorize } = require('../Middlewares/auth');

const  router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management (Admin only for write operations)
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all active categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Server error
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 example: "All electronic items"
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Validation error or duplicate category
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, authorize('admin'), categoryValidation, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Fashion"
 *               description:
 *                 type: string
 *                 example: "All clothing and accessories"
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Validation or duplicate error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticate, authorize('admin'), categoryValidation, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Soft delete a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */


router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticate, authorize('admin'), categoryValidation, createCategory);
router.put('/:id', authenticate, authorize('admin'), categoryValidation, updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

module.exports = router;