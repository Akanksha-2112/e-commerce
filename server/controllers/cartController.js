import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (cart) {
    res.json(cart);
  } else {
    res.json({ items: [], totalPrice: 0 });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size, color } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [],
      totalPrice: 0
    });
  }

  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId && item.size === size && item.color === color
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      size,
      color,
      price: product.price
    });
  }

  // Calculate total price
  cart.totalPrice = cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  await cart.save();
  await cart.populate('items.product');

  res.json(cart);
});

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.id(req.params.itemId);

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  item.quantity = quantity;

  // Recalculate total price
  cart.totalPrice = cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  await cart.save();
  await cart.populate('items.product');

  res.json(cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);

  // Recalculate total price
  cart.totalPrice = cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  await cart.save();
  await cart.populate('items.product');

  res.json(cart);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }

  res.json({ message: 'Cart cleared' });
});
