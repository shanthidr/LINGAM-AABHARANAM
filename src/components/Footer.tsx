
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Phone, 
  Mail, 
  MapPin,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getStoreInfo, StoreInfo, subscribeToStoreInfoChanges } from '@/utils/storeInfo';

const Footer = () => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(getStoreInfo());
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Initial load
    setStoreInfo(getStoreInfo());
    
    // Subscribe to store info changes using the new subscription function
    const unsubscribe = subscribeToStoreInfoChanges(() => {
      setStoreInfo(getStoreInfo());
    });
    
    // Continue listening to storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lingam-store-settings') {
        setStoreInfo(getStoreInfo());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <footer className="bg-brand-charcoal text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-2">
              <AvatarImage
                src="/lovable-uploads/cad02e43-afa0-4b15-807d-e6aeaa0b68c3.png"
                alt="Lingam Aabharanam Logo"
                className="object-cover"
              />
              <AvatarFallback>LA</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-serif font-bold text-lg">
                <span className="text-brand-red">LINGAM</span> <span className="text-brand-gold">Aabharanam</span>
              </h3>
            </div>
          </div>
          <p className="text-gray-300 mb-4 text-sm">
            Exquisite silver articles and jewelry crafted with tradition and elegance. Our collection includes handcrafted silver idols and beautiful jewelry pieces.
          </p>
          <div className="flex space-x-4">
            <a href="https://m.facebook.com/100083351916984/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-gold">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/lingam_aabharanam?igsh=MWR6dWs2dWRyc2NjdQ==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-gold">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-serif text-lg font-medium mb-4 text-brand-gold">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-gray-300 hover:text-brand-gold text-sm">Home</Link>
            </li>
            <li>
              <Link to="/products" className="text-gray-300 hover:text-brand-gold text-sm">Products</Link>
            </li>
            <li>
              <Link to="/appointment" className="text-gray-300 hover:text-brand-gold text-sm">Book Appointment</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-300 hover:text-brand-gold text-sm">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-300 hover:text-brand-gold text-sm">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif text-lg font-medium mb-4 text-brand-gold">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-start text-sm">
              <MapPin size={18} className="mr-2 text-brand-gold shrink-0 mt-0.5" />
              <span className="text-gray-300">{storeInfo.address}</span>
            </li>
            <li className="flex items-center text-sm">
              <Phone size={18} className="mr-2 text-brand-gold" />
              <a href={`tel:${storeInfo.phone}`} className="text-gray-300 hover:text-brand-gold">
                {storeInfo.phone}
              </a>
            </li>
            <li className="flex items-center text-sm">
              <Mail size={18} className="mr-2 text-brand-gold" />
              <a href={`mailto:${storeInfo.email}`} className="text-gray-300 hover:text-brand-gold">
                {storeInfo.email}
              </a>
            </li>
            <li className="flex items-start text-sm">
              <Clock size={18} className="mr-2 text-brand-gold shrink-0 mt-0.5" />
              <div className="text-gray-300 whitespace-pre-line">
                {storeInfo.openingHours}
              </div>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-serif text-lg font-medium mb-4 text-brand-gold">Newsletter</h3>
          <p className="text-gray-300 mb-4 text-sm">
            Subscribe to receive updates on new arrivals and special offers.
          </p>
          <form className="flex flex-col space-y-2">
            <Input
              type="email"
              placeholder="Your email"
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button className="bg-brand-gold hover:bg-brand-gold-dark flex items-center justify-center gap-2">
              Subscribe <ArrowRight size={16} />
            </Button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Lingam Aabharanam. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="text-sm text-gray-400 hover:text-brand-gold">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-brand-gold">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
