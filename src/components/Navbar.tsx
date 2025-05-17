
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  User,
  Heart
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update cart and wishlist count
  useEffect(() => {
    const updateCounts = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('lingam-cart') || '[]');
        const wishlist = JSON.parse(localStorage.getItem('lingam-wishlist') || '[]');
        
        setCartCount(cart.length);
        setWishlistCount(wishlist.length);
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
    };
    
    // Call on initial load
    updateCounts();
    
    // Set up event listener for localStorage changes from other tabs
    window.addEventListener('storage', updateCounts);
    
    // Custom event for when we update cart/wishlist in this tab
    window.addEventListener('cartUpdated', updateCounts);
    window.addEventListener('wishlistUpdated', updateCounts);
    
    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('cartUpdated', updateCounts);
      window.removeEventListener('wishlistUpdated', updateCounts);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Appointment', path: '/appointment' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Avatar className="h-10 w-10 mr-2 border-2 border-brand-gold rounded-full overflow-hidden">
              <AvatarImage
                src="/lovable-uploads/cad02e43-afa0-4b15-807d-e6aeaa0b68c3.png"
                alt="Lingam Aabharanam Logo"
                className="h-full w-full object-cover"
              />
              <AvatarFallback className="bg-brand-gold text-white">LA</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-serif font-bold text-lg sm:text-xl tracking-tight">
                <span className="text-brand-red">LINGAM</span> <span className="text-brand-gold">Aabharanam</span>
              </h1>
              <p className="hidden sm:block text-xs text-brand-gold/80 -mt-1">PURE SILVER ARTICLES AND JEWELRY</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium text-sm hover:text-brand-gold transition-colors ${
                  location.pathname === link.path ? 'text-brand-gold' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex gap-2 items-center">
                  <User size={16} />
                  Login
                </Button>
              </Link>
            )}
            
            {/* Cart and Wishlist */}
            <div className="flex items-center space-x-3">
              <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-brand-gold">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-brand-gold">
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Cart and Wishlist */}
            <Link to="/wishlist" className="relative p-1 text-gray-700">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative p-1 text-gray-700">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <Link to="/appointment">
              <Button size="sm" className="bg-brand-gold hover:bg-brand-gold-dark">
                Appointment
              </Button>
            </Link>
            
            <button
              className="p-2 text-gray-600 hover:text-brand-gold"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-6 space-y-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block font-medium text-lg ${
                  location.pathname === link.path ? 'text-brand-gold' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Authentication */}
            <div className="pt-4 border-t">
              {isAuthenticated ? (
                <div className="space-y-4">
                  {user?.role === 'admin' && (
                    <Link to="/admin/dashboard">
                      <Button className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" className="w-full" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="outline" className="w-full flex gap-2 items-center justify-center">
                    <User size={16} />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
