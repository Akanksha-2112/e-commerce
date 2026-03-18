import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Product from '../models/product.js';
import Category from '../models/Category.js';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { category, subcategory, minPrice, maxPrice, size, color, search } = req.query;

  // FIX: Pagination support
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  let query = {};

  if (category) {
    if (mongoose.isValidObjectId(category)) {
      query.category = category;
    } else {
      const categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        return res.json({ success: true, count: 0, products: [], total: 0, page, pages: 0 });
      }
    }
  }

  if (subcategory) {
    query.subcategory = { $regex: new RegExp(`^${subcategory}$`, 'i') };
  }
  if (size) query.sizes = size;
  if (color) query.colors = color;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // FIX: Run count and find in parallel for better performance
  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(query)
  ]);

  res.json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, subcategory, sizes, colors, images, stock, sku } = req.body;

  const product = new Product({
    name,
    description,
    price,
    category,
    subcategory,
    sizes,
    colors,
    images,
    stock,
    sku
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.price = req.body.price ?? product.price;
    product.category = req.body.category ?? product.category;
    product.subcategory = req.body.subcategory ?? product.subcategory;
    product.sizes = req.body.sizes ?? product.sizes;
    product.colors = req.body.colors ?? product.colors;
    product.images = req.body.images ?? product.images;
    // FIX: Use ?? instead of || so that stock=0 (sold out) is saved correctly.
    // With ||, setting stock to 0 would fallback to the old value because 0 is falsy.
    product.stock = req.body.stock ?? product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8);
  res.json(products);
});
