import express from 'express';
import Product, { IProduct } from '../models/Product';
import { Error as MongooseError } from 'mongoose';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: (error as Error).message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Error fetching featured products', error: (error as Error).message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: (error as Error).message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Error fetching products by category', error: (error as Error).message });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    console.log('Received product data:', req.body);
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'subcategory', 'price', 'description', 'details', 'images', 'weight', 'material'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields
      });
    }

    // Validate category
    if (!['jewelry', 'idol'].includes(req.body.category)) {
      return res.status(400).json({
        message: 'Invalid category. Must be either "jewelry" or "idol"'
      });
    }

    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof MongooseError.ValidationError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Error creating product', error: (error as Error).message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof MongooseError.ValidationError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Error updating product', error: (error as Error).message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: (error as Error).message });
  }
});

export default router; 