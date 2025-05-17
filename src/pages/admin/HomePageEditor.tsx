
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { getFeaturedProducts, Product } from '@/services/productService';

type HomeContent = {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  featuredTitle: string;
  featuredDescription: string;
};

const HomePageEditor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [content, setContent] = useState<HomeContent>({
    heroTitle: 'Exquisite Silver Jewelry & Idols',
    heroDescription: 'Discover our handcrafted collection of pure silver articles and jewelry. Each piece tells a story of tradition, craftsmanship, and cultural heritage.',
    heroImage: 'https://images.unsplash.com/photo-1608538529405-91ce3607d333?q=80&w=2080&auto=format&fit=crop',
    featuredTitle: 'Featured Collection',
    featuredDescription: 'Explore our handpicked selection of exquisite silver artifacts and jewelry.',
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const storedContent = localStorage.getItem('homepage-content');
    if (storedContent) {
      setContent(JSON.parse(storedContent));
    } else {
      localStorage.setItem('homepage-content', JSON.stringify(content));
    }
    
    // Load featured products
    const loadFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error loading featured products:', error);
      }
    };
    loadFeaturedProducts();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent(prev => ({
          ...prev,
          heroImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('homepage-content', JSON.stringify(content));
      toast({
        title: 'Success',
        description: 'Homepage content has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save homepage content.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Homepage Editor</h1>
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full md:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input
              id="heroTitle"
              value={content.heroTitle}
              onChange={(e) => setContent(prev => ({ ...prev, heroTitle: e.target.value }))}
              placeholder="Enter hero title"
            />
          </div>
          
          <div>
            <Label htmlFor="heroDescription">Hero Description</Label>
            <Textarea
              id="heroDescription"
              value={content.heroDescription}
              onChange={(e) => setContent(prev => ({ ...prev, heroDescription: e.target.value }))}
              placeholder="Enter hero description"
              rows={4}
            />
          </div>
          
          <div>
            <Label>Hero Image</Label>
            <div className="mt-2">
              <Button
                variant="outline"
                onClick={() => document.getElementById('hero-image-upload')?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <input
                id="hero-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {content.heroImage && (
              <div className="mt-4">
                <img
                  src={content.heroImage}
                  alt="Hero Preview"
                  className="max-h-48 rounded-lg object-cover"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Featured Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="featuredTitle">Featured Title</Label>
            <Input
              id="featuredTitle"
              value={content.featuredTitle}
              onChange={(e) => setContent(prev => ({ ...prev, featuredTitle: e.target.value }))}
              placeholder="Enter featured section title"
            />
          </div>
          
          <div>
            <Label htmlFor="featuredDescription">Featured Description</Label>
            <Textarea
              id="featuredDescription"
              value={content.featuredDescription}
              onChange={(e) => setContent(prev => ({ ...prev, featuredDescription: e.target.value }))}
              placeholder="Enter featured section description"
              rows={3}
            />
          </div>

          <div className="mt-6">
            <Label>Featured Products Preview</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {featuredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.salePrice && (
                      <div className="absolute top-2 right-2 bg-brand-red text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex items-center mt-2">
                      {product.salePrice ? (
                        <>
                          <span className="text-brand-red font-medium">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-gray-500 line-through ml-2">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-900 font-medium">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Note: To manage featured products, please use the Products section in the admin panel.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePageEditor;
