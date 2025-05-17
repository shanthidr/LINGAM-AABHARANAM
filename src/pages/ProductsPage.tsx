
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, Product } from '@/services/productService';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const allProducts = await getProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Apply filters and sorting when products, search, category, or sort changes
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => {
        if (selectedCategory === 'jewelry') return product.category === 'jewelry';
        if (selectedCategory === 'idol') return product.category === 'idol';
        return true;
      });
    }
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(lowerSearchTerm) || 
        product.description.toLowerCase().includes(lowerSearchTerm) ||
        product.subcategory.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply sorting
    if (selectedSort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (selectedSort === 'price-low') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (selectedSort === 'price-high') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, selectedSort]);

  // Format price in USD
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="section-container">
      <h1 className="page-title">Our Collection</h1>
      <p className="section-subtitle">Explore our handcrafted silver jewelry and idols.</p>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="jewelry">Jewelry</SelectItem>
              <SelectItem value="idol">Idols & Articles</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Products Grid */}
      {isLoading ? (
        <div className="product-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3 mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedSort('newest');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="relative h-64">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.salePrice && (
                  <div className="absolute top-4 right-4 bg-brand-red text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-xs text-brand-gold uppercase tracking-wider mb-1">
                  {product.category === 'jewelry' ? 'Jewelry' : 'Silver Idol'}
                </div>
                <h3 className="font-serif text-lg font-medium mb-2">{product.name}</h3>
                <div className="flex items-center">
                  {product.salePrice ? (
                    <>
                      <span className="text-brand-red font-medium text-lg">
                        {formatPrice(product.salePrice)}
                      </span>
                      <span className="text-gray-500 line-through ml-2">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-900 font-medium text-lg">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
