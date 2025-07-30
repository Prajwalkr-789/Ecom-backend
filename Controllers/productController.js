const { body, query, validationResult } = require('express-validator');
const  Product = require('../Models/product');
const Category = require('../Models/category');
const uploadToCloudinary = require('../utils/cloudinaryUpload')

const { Op } = require('sequelize');

const getAllProducts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { isActive: true };

    // Filter by category
    if (category) {
      where.CategoryId = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    // Search by name
    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`
      };
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }]
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, stock, categoryId } = req.body;
    let imageUrl = null;

    // Handle image upload
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'products');
        imageUrl = result.secure_url;
      } catch (uploadError) {
        return res.status(400).json({ message: 'Image upload failed', error: uploadError.message });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      CategoryId: categoryId,
      imageUrl
    });

    const productWithCategory = await Product.findByPk(product.id, {
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }]
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: productWithCategory
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, price, stock, categoryId } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let imageUrl = product.imageUrl;

    // Handle image upload
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'products');
        imageUrl = result.secure_url;
      } catch (uploadError) {
        return res.status(400).json({ message: 'Image upload failed', error: uploadError.message });
      }
    }

    await product.update({
      name,
      description,
      price,
      stock,
      CategoryId: categoryId,
      imageUrl
    });

    const updatedProduct = await Product.findByPk(product.id, {
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }]
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.update({ isActive: false });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Validation rules
const productValidation = [
  body('name').trim().isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
  body('description').optional().trim(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('categoryId').isUUID().withMessage('Valid category ID is required')
];

const productQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('category').optional().isUUID().withMessage('Category must be a valid UUID'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search term must not exceed 100 characters')
];

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  productValidation,
  productQueryValidation
};