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

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticate, authorize('admin'), categoryValidation, createCategory);
router.put('/:id', authenticate, authorize('admin'), categoryValidation, updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

module.exports = router;