
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Send
} from 'lucide-react';
import { getStoreInfo, StoreInfo, subscribeToStoreInfoChanges } from '@/utils/storeInfo';

const ContactPage = () => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(getStoreInfo());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent",
      description: "We've received your message and will get back to you soon!",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="section-container">
      <h1 className="page-title">Contact Us</h1>
      <p className="section-subtitle max-w-2xl">
        Have questions about our products or services? Get in touch with our team and we'll be happy to assist you.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-brand-gold p-6">
              <h2 className="text-white font-serif text-xl font-medium">Get In Touch</h2>
              <p className="text-white/80 mt-2">
                We're here to help and answer any questions you might have.
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-brand-gold/10 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-brand-gold" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Visit Us</h3>
                  <p className="text-gray-600 mt-1">
                    {storeInfo.address}
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-brand-gold/10 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-brand-gold" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Email Us</h3>
                  <a 
                    href={`mailto:${storeInfo.email}`}
                    className="text-gray-600 hover:text-brand-gold transition-colors mt-1 block"
                  >
                    {storeInfo.email}
                  </a>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-brand-gold/10 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-brand-gold" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Call Us</h3>
                  <a 
                    href={`tel:${storeInfo.phone}`}
                    className="text-gray-600 hover:text-brand-gold transition-colors mt-1 block"
                  >
                    {storeInfo.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-brand-gold/10 p-3 rounded-full">
                    <Clock className="h-5 w-5 text-brand-gold" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Business Hours</h3>
                  <p className="text-gray-600 mt-1 whitespace-pre-line">
                    {storeInfo.openingHours}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://m.facebook.com/100083351916984/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5 text-gray-600" />
                  </a>
                  <a 
                    href="https://www.instagram.com/lingam_aabharanam?igsh=MWR6dWs2dWRyc2NjdQ==" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5 text-gray-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-serif font-medium mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this regarding?"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                  className="min-h-[150px] resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-brand-gold hover:bg-brand-gold-dark flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-serif font-medium mb-4">Find Us</h2>
            <div className="bg-gray-200 rounded-lg h-72 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p>Store Location Map</p>
                <p className="text-sm text-gray-400">(Interactive map would be displayed here)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
