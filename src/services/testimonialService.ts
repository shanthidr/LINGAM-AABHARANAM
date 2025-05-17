
export type Testimonial = {
  id: string;
  customerName: string;
  content: string;
  rating: number;
  image?: string;
  date: Date;
  isApproved: boolean;
  showOnHomepage: boolean;
};

// Local storage key for testimonials
const TESTIMONIALS_STORAGE_KEY = 'lingam-testimonials';

// Initial empty array for testimonials
let mockTestimonials: Testimonial[] = [];

// Initialize from local storage if available
const initializeTestimonials = () => {
  const storedData = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      // Convert string dates back to Date objects
      mockTestimonials = parsedData.map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
    } catch (error) {
      console.error('Error parsing testimonials from local storage:', error);
      mockTestimonials = [];
    }
  }
};

// Save to local storage
const saveTestimonials = () => {
  localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(mockTestimonials));
};

// Initialize on module load
initializeTestimonials();

// Get all testimonials (for admin)
export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockTestimonials];
};

// Get approved testimonials (for public display)
export const getApprovedTestimonials = async (): Promise<Testimonial[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTestimonials.filter(testimonial => testimonial.isApproved);
};

// Get testimonials for homepage (approved and selected for homepage)
export const getHomepageTestimonials = async (): Promise<Testimonial[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTestimonials.filter(testimonial => testimonial.isApproved && testimonial.showOnHomepage);
};

// Toggle testimonial approval status (for admin)
export const toggleTestimonialApproval = async (id: string): Promise<Testimonial | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const testimonialIndex = mockTestimonials.findIndex(t => t.id === id);
  if (testimonialIndex === -1) return undefined;
  
  mockTestimonials[testimonialIndex].isApproved = !mockTestimonials[testimonialIndex].isApproved;
  
  // If a testimonial is unapproved, it shouldn't be shown on homepage
  if (!mockTestimonials[testimonialIndex].isApproved) {
    mockTestimonials[testimonialIndex].showOnHomepage = false;
  }
  
  saveTestimonials();
  return mockTestimonials[testimonialIndex];
};

// Toggle homepage display status (for admin)
export const toggleHomepageDisplay = async (id: string): Promise<Testimonial | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const testimonialIndex = mockTestimonials.findIndex(t => t.id === id);
  if (testimonialIndex === -1) return undefined;
  
  // Only approved testimonials can be shown on homepage
  if (mockTestimonials[testimonialIndex].isApproved) {
    mockTestimonials[testimonialIndex].showOnHomepage = !mockTestimonials[testimonialIndex].showOnHomepage;
    saveTestimonials();
  }
  
  return mockTestimonials[testimonialIndex];
};

// Add new testimonial (for customers)
export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'date' | 'isApproved' | 'showOnHomepage'>): Promise<Testimonial> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newTestimonial: Testimonial = {
    ...testimonial,
    id: Date.now().toString(),
    date: new Date(),
    isApproved: false, // Requires admin approval
    showOnHomepage: false // Not shown on homepage by default
  };
  
  mockTestimonials.push(newTestimonial);
  saveTestimonials();
  return newTestimonial;
};

// Delete testimonial (for admin)
export const deleteTestimonial = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const initialLength = mockTestimonials.length;
  mockTestimonials = mockTestimonials.filter(t => t.id !== id);
  
  if (mockTestimonials.length !== initialLength) {
    saveTestimonials();
    return true;
  }
  return false;
};

// Clear all testimonials (for admin/testing)
export const clearAllTestimonials = async (): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  mockTestimonials = [];
  saveTestimonials();
  return true;
};
