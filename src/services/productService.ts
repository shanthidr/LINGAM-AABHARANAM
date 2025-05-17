export type Product = {
  id: string;
  name: string;
  category: 'jewelry' | 'idol';
  subcategory: string;
  price: number;
  salePrice?: number;
  description: string;
  details: string;
  images: string[];
  weight: string;
  material: string;
  dimensions?: string;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
};

const API_BASE_URL = 'http://localhost:5000/api';

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products/featured`);
  if (!response.ok) {
    throw new Error('Failed to fetch featured products');
  }
  return response.json();
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

// Get products by category
export const getProductsByCategory = async (category: 'jewelry' | 'idol'): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products by category');
  }
  return response.json();
};

// Create a new product (for admin)
export const createProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
  console.log('Creating product with data:', product);
  
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error creating product:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    throw new Error(errorData.message || 'Failed to create product');
  }
  
  const createdProduct = await response.json();
  console.log('Successfully created product:', createdProduct);
  return createdProduct;
};

// Update a product (for admin)
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | undefined> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error('Failed to update product');
  }
  return response.json();
};

// Delete a product (for admin)
export const deleteProduct = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    if (response.status === 404) {
      return false;
    }
    throw new Error('Failed to delete product');
  }
  return true;
};
