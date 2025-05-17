
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft, X, ShoppingBag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadWishlist = () => {
      setIsLoading(true);
      try {
        const wishlist = JSON.parse(localStorage.getItem('lingam-wishlist') || '[]');
        setWishlistItems(wishlist);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your wishlist items',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [toast]);

  const removeItem = (id: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('lingam-wishlist', JSON.stringify(updatedWishlist));
    
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your wishlist',
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.setItem('lingam-wishlist', JSON.stringify([]));
    
    toast({
      title: 'Wishlist cleared',
      description: 'All items have been removed from your wishlist',
    });
  };

  const addToCart = (item: WishlistItem) => {
    try {
      const cart = JSON.parse(localStorage.getItem('lingam-cart') || '[]');
      const existingItemIndex = cart.findIndex((cartItem: {id: string}) => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        toast({
          title: 'Already in cart',
          description: 'This item is already in your cart',
        });
        return;
      }
      
      const cartItem = {
        ...item,
        quantity: 1
      };
      
      cart.push(cartItem);
      localStorage.setItem('lingam-cart', JSON.stringify(cart));
      
      toast({
        title: 'Added to cart',
        description: `${item.name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="section-container flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="section-container pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif">My Wishlist</h1>
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Button>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-medium text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love to your wishlist and find them all in one place</p>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              onClick={clearWishlist}
            >
              Clear Wishlist
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div 
                key={item.id} 
                className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 z-10"
                    aria-label="Remove from wishlist"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>

                  <div
                    onClick={() => navigate(`/products/${item.id}`)}
                    className="h-64 w-full overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="h-full w-full object-contain object-center p-4"
                    />
                  </div>
                </div>

                <div className="p-4">
                  <h3 
                    className="text-sm font-medium text-gray-900 truncate cursor-pointer"
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    {item.name}
                  </h3>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-medium text-gray-900">{formatCurrency(item.price)}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-brand-gold text-brand-gold hover:bg-brand-gold-light/20"
                      onClick={() => addToCart(item)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;
