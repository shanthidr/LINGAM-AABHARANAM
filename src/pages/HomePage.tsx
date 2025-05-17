import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFeaturedProducts, Product } from '@/services/productService';
import Testimonials from '@/components/Testimonials';

type HomeContent = {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  featuredTitle: string;
  featuredDescription: string;
};

const defaultContent = {
  heroTitle: 'Exquisite Silver Jewelry & Idols',
  heroDescription: 'Discover our handcrafted collection of pure silver articles and jewelry. Each piece tells a story of tradition, craftsmanship, and cultural heritage.',
  heroImage: 'https://media-hosting.imagekit.io/632976b295fe4b4c/homepage.jpg?Expires=1840299901&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=cxTZ~xAxCIg2jqHoPzZhIYkeHFaOa1UJrMUCrHOOiIgycSYdRxII7KysSokgbqpcvgIkW~qZM5WKG8P8lj9GGMR7hjnAPZrZAQ9P7ER4LdieB3gYch5o6AXT8guCsF7Gk-KnMlku5lPneIsKTd5yagiOCS8Z2ltZKYKR4jwn6KUh18V3DgdF2HHPzq-slGbS~KTUZ8EBDE6f73GtlbHI4MmSlfsoRjawTtXaJVnzBI4agx88VSzkKEfUT5xQCeE2k4CKmDEULqQYFEyncg-aQmJfrHI7IBSAiw~FY~vxO5RdLGNJP4QV6nj~llhm~fEh6nZm7navDVakGH~9BkwpDA__',
  featuredTitle: 'Featured Collection',
  featuredDescription: 'Explore our handpicked selection of exquisite silver artifacts and jewelry.',
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [homeContent, setHomeContent] = useState<HomeContent>(defaultContent);
  const navigate = useNavigate();

  useEffect(() => {
    const loadContent = () => {
      const storedContent = localStorage.getItem('homepage-content');
      if (storedContent) {
        setHomeContent(JSON.parse(storedContent));
      }
    };

    loadContent();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-brand-cream">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center py-12 lg:py-24 gap-8">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-brand-charcoal leading-tight">
                {homeContent.heroTitle}
              </h1>
              <p className="text-lg text-gray-700">
                {homeContent.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/products')}
                  className="bg-brand-gold hover:bg-brand-gold-dark text-white px-8 py-6 text-lg"
                >
                  View Collection
                </Button>
                <Button 
                  onClick={() => navigate('/appointment')}
                  variant="outline"
                  className="border-brand-gold text-brand-gold hover:bg-brand-gold-light/20 px-8 py-6 text-lg"
                >
                  Book Appointment
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-gold/20 rounded-full -z-10"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-red/10 rounded-full -z-10"></div>
                <img
                  src={homeContent.heroImage}
                  alt="Silver Jewelry and Idols"
                  className="rounded-lg shadow-xl object-cover w-full h-80 sm:h-96"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-brand-charcoal mb-2">{homeContent.featuredTitle}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{homeContent.featuredDescription}</p>
          </div>

          {isLoading ? (
            <div className="product-grid">
              {[1, 2, 3, 4].map((item) => (
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
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
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

          <div className="text-center mt-10">
            <Button 
              onClick={() => navigate('/products')}
              variant="outline" 
              className="border-brand-gold text-brand-gold hover:bg-brand-gold-light/20"
            >
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Visit Information */}
      <section className="py-12 bg-brand-charcoal text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3 space-y-4">
              <h2 className="text-3xl font-serif font-medium">Visit Our Store</h2>
              <p className="text-gray-300">
                Book an appointment to explore our complete collection in person. Our experts will guide you through our exquisite pieces and help you find the perfect silver article or jewelry.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="text-brand-gold mr-2 h-5 w-5" />
                  <span>Personalized shopping experience</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-brand-gold mr-2 h-5 w-5" />
                  <span>Detailed product information</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-brand-gold mr-2 h-5 w-5" />
                  <span>Custom design consultation</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-brand-gold mr-2 h-5 w-5" />
                  <span>Appointments only</span>
                </li>
              </ul>
            </div>
            <div>
              <Button 
                onClick={() => navigate('/appointment')}
                className="bg-brand-gold hover:bg-brand-gold-dark text-white px-8 py-6 text-lg flex items-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
