
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Star, StarHalf, StarOff } from 'lucide-react';
import { addTestimonial, getApprovedTestimonials } from '@/services/testimonialService';

// Star Rating component
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="text-brand-gold w-4 h-4 fill-brand-gold" />
      ))}
      {hasHalfStar && <StarHalf className="text-brand-gold w-4 h-4 fill-brand-gold" />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarOff key={`empty-${i}`} className="text-gray-300 w-4 h-4" />
      ))}
    </div>
  );
};

type DisplayTestimonial = {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: Date;
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<DisplayTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    location: '',
    rating: 5,
    comment: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadTestimonials = async () => {
      setIsLoading(true);
      try {
        const data = await getApprovedTestimonials();
        // Map testimonials from service to component format
        const displayData: DisplayTestimonial[] = data.map(t => ({
          id: t.id,
          name: t.customerName,
          location: '', // Location not included in the service testimonials
          rating: t.rating,
          comment: t.content,
          date: t.date
        }));
        setTestimonials(displayData);
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const handleSubmitTestimonial = async () => {
    // Validate input
    if (!newTestimonial.name || !newTestimonial.comment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add new testimonial to the service
      await addTestimonial({
        customerName: newTestimonial.name,
        content: newTestimonial.comment,
        rating: newTestimonial.rating,
      });
      
      setIsDialogOpen(false);
      
      // Reset form
      setNewTestimonial({
        name: '',
        location: '',
        rating: 5,
        comment: ''
      });

      // Show success message
      toast({
        title: "Thank You!",
        description: "Your testimonial has been submitted for review.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your testimonial.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="section-title">Customer Testimonials</h2>
          <p className="section-subtitle">What our customers say about us</p>
        </div>

        <div className="flex justify-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-gold hover:bg-brand-gold-dark">
                Share Your Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Share Your Experience</DialogTitle>
                <DialogDescription>
                  We value your feedback! Please share your experience with our products and service.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input 
                      id="name" 
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Your Location</Label>
                    <Input 
                      id="location" 
                      value={newTestimonial.location}
                      onChange={(e) => setNewTestimonial({...newTestimonial, location: e.target.value})}
                      placeholder="City, State"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="rating">Rating *</Label>
                  <div className="flex items-center mt-2 space-x-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <Button 
                        key={rating}
                        type="button"
                        variant={newTestimonial.rating === rating ? "default" : "outline"}
                        className="h-8 w-8 p-0"
                        onClick={() => setNewTestimonial({...newTestimonial, rating})}
                      >
                        {rating}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="comment">Your Experience *</Label>
                  <Textarea 
                    id="comment" 
                    value={newTestimonial.comment}
                    onChange={(e) => setNewTestimonial({...newTestimonial, comment: e.target.value})}
                    placeholder="Share your experience with our products or service..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-brand-gold hover:bg-brand-gold-dark"
                  onClick={handleSubmitTestimonial}
                >
                  Submit Testimonial
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={`star-${i}`} className="w-4 h-4 bg-gray-200 rounded-full" />
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 mt-2 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))
          ) : testimonials.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No testimonials available yet. Be the first to share your experience!</p>
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                <StarRating rating={testimonial.rating} />
                <p className="mt-4 text-gray-700 italic">"{testimonial.comment}"</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-medium">{testimonial.name}</p>
                  {testimonial.location && (
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
