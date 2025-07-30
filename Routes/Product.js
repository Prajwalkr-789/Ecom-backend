const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  productValidation,
  productQueryValidation
} = require('../Controllers/productController');
const { authenticate, authorize } = require('../Middlewares/auth');
const upload = require('../Middlewares/upload');

const router = express.Router();

router.get('/', productQueryValidation, getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize('admin'), upload.single('image'), productValidation, createProduct);
router.put('/:id', authenticate, authorize('admin'), upload.single('image'), productValidation, updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

module.exports = router;