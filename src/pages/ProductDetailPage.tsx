
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, Product } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight, Info, ShoppingCart, Heart, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if the product is in the cart
  const isProductInCart = () => {
    const cart = JSON.parse(localStorage.getItem('lingam-cart') || '[]');
    return cart.some((item: {id: string}) => item.id === id);
  };

  // Check if the product is in the wishlist
  useEffect(() => {
    const checkWishlist = () => {
      const wishlist = JSON.parse(localStorage.getItem('lingam-wishlist') || '[]');
      setIsInWishlist(wishlist.some((item: {id: string}) => item.id === id));
    };
    checkWishlist();
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!id) throw new Error('Product ID is required');
        const productData = await getProductById(id);
        if (!productData) throw new Error('Product not found');
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast({
          title: 'Error',
          description: err instanceof Error ? err.message : 'Failed to load product details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  // Format price in USD
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('lingam-cart') || '[]');
    
    // Check if product already exists in cart
    if (isProductInCart()) {
      toast({
        title: "Already in cart",
        description: "This product is already in your cart",
      });
      return;
    }
    
    // Add product to cart
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0],
      quantity: 1
    };
    
    cart.push(cartItem);
    localStorage.setItem('lingam-cart', JSON.stringify(cart));
    
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  // Handle toggle wishlist
  const handleToggleWishlist = () => {
    if (!product) return;
    
    const wishlist = JSON.parse(localStorage.getItem('lingam-wishlist') || '[]');
    
    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter((item: {id: string}) => item.id !== product.id);
      localStorage.setItem('lingam-wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
      
      // Dispatch event to update wishlist count in navbar
      window.dispatchEvent(new Event('wishlistUpdated'));
      
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist`,
      });
    } else {
      // Add to wishlist
      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images[0]
      };
      
      wishlist.push(wishlistItem);
      localStorage.setItem('lingam-wishlist', JSON.stringify(wishlist));
      setIsInWishlist(true);
      
      // Dispatch event to update wishlist count in navbar
      window.dispatchEvent(new Event('wishlistUpdated'));
      
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    }
  };

  // Handle WhatsApp chat
  const handleWhatsAppChat = () => {
    if (!product) return;
    
    const phoneNumber = "17734903951"; // Format: country code + number without spaces or dashes
    const message = encodeURIComponent(`I'm interested in ${product.name} (ID: ${product.id}). Can you provide more information?`);
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="section-container flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="section-container">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl text-red-800 font-medium mb-2">Product Not Found</h2>
          <p className="text-red-600 mb-4">The product you are looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate('/products')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Images */}
        <div>
          <div className="relative bg-gray-100 rounded-lg h-96">
            <img
              src={product.images[currentImageIndex]}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain rounded-lg"
            />
            
            {product.images.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
            
            {!product.inStock && (
              <div className="absolute top-4 right-4 bg-brand-red text-white px-3 py-1 rounded">
                Out of Stock
              </div>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                    currentImageIndex === index ? 'ring-2 ring-brand-gold' : 'opacity-70'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-1">
            <span className="text-sm text-brand-gold uppercase tracking-wider">
              {product.category === 'jewelry' ? 'Jewelry' : 'Silver Idol'} / {product.subcategory}
            </span>
          </div>
          
          <h1 className="text-3xl font-serif font-medium text-brand-charcoal mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center mb-6">
            {product.salePrice ? (
              <>
                <span className="text-brand-red font-medium text-2xl">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-gray-500 line-through ml-3 text-lg">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-gray-900 font-medium text-2xl">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <span className="font-medium w-28">Weight:</span>
              <span>{product.weight}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-28">Material:</span>
              <span>{product.material}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-2 text-gray-500">
                      <Info size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Certificate of authenticity available</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {product.dimensions && (
              <div className="flex items-center">
                <span className="font-medium w-28">Dimensions:</span>
                <span>{product.dimensions}</span>
              </div>
            )}
            <div className="flex items-center">
              <span className="font-medium w-28">Availability:</span>
              <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button
              disabled={!product.inStock}
              className="bg-brand-gold hover:bg-brand-gold-dark flex gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </Button>
            
            <Button
              variant="outline"
              className={`border-brand-gold flex gap-2 ${isInWishlist ? 'bg-brand-gold-light/20 text-brand-gold' : 'text-brand-gold hover:bg-brand-gold-light/20'}`}
              onClick={handleToggleWishlist}
            >
              <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
              {isInWishlist ? 'Saved' : 'Save for Later'}
            </Button>
          </div>

          <Button
            variant="outline"
            className="border-brand-gold text-brand-gold hover:bg-brand-gold-light/20 flex gap-2 w-full mb-8"
            onClick={() => navigate('/appointment')}
          >
            <Calendar size={18} />
            Book Visit
          </Button>
          
          {/* WhatsApp Assistant Button */}
          <Button
            variant="secondary"
            className="w-full bg-green-600 hover:bg-green-700 mb-8 flex gap-2"
            onClick={handleWhatsAppChat}
          >
            <MessageCircle size={18} />
            Chat with WhatsApp Assistant
          </Button>
          
          <Separator className="my-8" />
          
          <div>
            <h3 className="font-serif font-medium text-lg mb-4">Product Details</h3>
            <p className="text-gray-700 whitespace-pre-line">{product.details}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
