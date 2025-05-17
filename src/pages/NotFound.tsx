
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-brand-charcoal">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/">
            <Button className="bg-brand-gold hover:bg-brand-gold-dark w-full sm:w-auto flex items-center gap-2">
              <Home size={18} />
              Return Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
