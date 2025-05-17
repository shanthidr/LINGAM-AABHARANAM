
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, X, ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadCart = () => {
      setIsLoading(true);
      try {
        const cart = JSON.parse(localStorage.getItem('lingam-cart') || '[]');
        setCartItems(cart);
      } catch (error) {
        console.error('Error loading cart:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your cart items',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [toast]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('lingam-cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('lingam-cart', JSON.stringify(updatedCart));
    
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart',
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('lingam-cart', JSON.stringify([]));
    
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart',
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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
        <h1 className="text-3xl font-serif">Shopping Cart</h1>
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Button>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add items to your cart to see them here</p>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border border-gray-200 hidden md:grid grid-cols-12 text-sm font-medium text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Subtotal</div>
              </div>

              <div className="border border-t-0 border-gray-200 rounded-b-lg overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item.id} className="border-t border-gray-200 px-4 py-5 grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                    <div className="md:col-span-6 flex items-center">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 mr-4"
                        aria-label="Remove item"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain object-center"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          <button onClick={() => navigate(`/products/${item.id}`)}>
                            {item.name}
                          </button>
                        </h3>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 flex items-center md:justify-center">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    
                    <div className="md:col-span-2 flex items-center justify-center">
                      <div className="flex items-center border rounded-md border-gray-300">
                        <button
                          className="p-1 px-2 text-gray-600 hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="w-10 text-center border-none focus:ring-0 p-0 text-sm font-medium"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <button
                          className="p-1 px-2 text-gray-600 hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 flex items-center justify-end md:justify-center text-sm font-medium text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <div className="border border-gray-200 rounded-lg bg-gray-50 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">{formatCurrency(calculateSubtotal())}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Tax (estimated)</p>
                    <p className="font-medium">{formatCurrency(calculateSubtotal() * 0.18)}</p>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between text-lg font-medium">
                    <p>Total</p>
                    <p>{formatCurrency(calculateSubtotal() * 1.18)}</p>
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-brand-gold hover:bg-brand-gold-dark">
                  Proceed to Checkout
                </Button>
                
                <div className="mt-4 text-sm text-center text-gray-500">
                  Need help? Contact our customer support
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
