
import { useState, useEffect } from 'react';
import { getHomepageTestimonials, Testimonial } from '@/services/testimonialService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star, StarHalf } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export const TestimonialsSection = () => {
  // Use React Query for better data fetching and caching
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['homepage-testimonials'],
    queryFn: getHomepageTestimonials,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Render star ratings
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    return <div className="flex">{stars}</div>;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border border-brand-gold">
                    {testimonial.image ? (
                      <AvatarImage src={testimonial.image} alt={testimonial.customerName} />
                    ) : null}
                    <AvatarFallback className="bg-brand-gold/10 text-brand-gold">
                      {testimonial.customerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.customerName}</p>
                    <div className="mt-1">
                      {renderRating(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
