import fetch from 'node-fetch';
import { IProduct } from './models/Product';

const API_BASE_URL = 'http://localhost:5000/api/products';

const testProduct = {
  name: 'Silver Lakshmi Pendant',
  category: 'jewelry' as const,
  subcategory: 'pendants',
  price: 60,
  description: 'Handcrafted Silver Goddess Lakshmi Pendant with intricate detailing.',
  details: 'This exquisitely crafted Silver Lakshmi Pendant represents the Hindu goddess of wealth and prosperity.',
  images: ['https://example.com/lakshmi-pendant.jpg'],
  weight: '12 grams',
  material: '925 Sterling Silver',
  inStock: true,
  featured: true
};

async function testAPI() {
  try {
    // Test creating a product
    console.log('Testing product creation...');
    const createResponse = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testProduct)
    });
    
    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error('Error creating product:', {
        status: createResponse.status,
        statusText: createResponse.statusText,
        error: errorData
      });
      return;
    }
    
    const createdProduct = await createResponse.json() as IProduct;
    console.log('Created product:', createdProduct);

    // Test getting all products
    console.log('\nTesting get all products...');
    const allProducts = await fetch(API_BASE_URL).then((res) => res.json() as Promise<IProduct[]>);
    console.log('All products:', allProducts);

    // Test getting featured products
    console.log('\nTesting get featured products...');
    const featuredProducts = await fetch(`${API_BASE_URL}/featured`).then((res) => res.json() as Promise<IProduct[]>);
    console.log('Featured products:', featuredProducts);

    // Test getting products by category
    console.log('\nTesting get products by category...');
    const jewelryProducts = await fetch(`${API_BASE_URL}/category/jewelry`).then((res) => res.json() as Promise<IProduct[]>);
    console.log('Jewelry products:', jewelryProducts);

    // Test updating a product
    console.log('\nTesting product update...');
    const updateResponse = await fetch(`${API_BASE_URL}/${createdProduct._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 75 })
    });
    const updatedProduct = await updateResponse.json() as IProduct;
    console.log('Updated product:', updatedProduct);

    // Test getting a single product
    console.log('\nTesting get single product...');
    const singleProduct = await fetch(`${API_BASE_URL}/${createdProduct._id}`).then((res) => res.json() as Promise<IProduct>);
    console.log('Single product:', singleProduct);

    // Test deleting a product
    console.log('\nTesting product deletion...');
    const deleteResponse = await fetch(`${API_BASE_URL}/${createdProduct._id}`, {
      method: 'DELETE'
    });
    const deleteResult = await deleteResponse.json();
    console.log('Delete result:', deleteResult);

  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI(); 