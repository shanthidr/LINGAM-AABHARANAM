
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/services/productService';
import { getAppointments } from '@/services/appointmentService';
import { getAllCustomers } from '@/services/customerService';
import { getApprovedTestimonials } from '@/services/testimonialService';
import { 
  Package, 
  CalendarDays, 
  Clock, 
  Users, 
  Sparkles, 
  ChevronRight,
  CircleDollarSign,
  Star
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Simple Line Chart Component
const LineChart = ({ data, color }: { data: number[], color: string }) => {
  if (!data || data.length === 0) return <div className="h-16 flex items-center justify-center text-gray-400">No data available</div>;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="flex items-end h-16 gap-1">
      {data.map((value, index) => {
        const height = ((value - min) / range) * 100;
        return (
          <div
            key={index}
            className="flex-1"
            style={{ height: `${Math.max(5, height)}%` }}
          >
            <div 
              className="w-full h-full rounded-sm" 
              style={{ backgroundColor: color }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

// Activity Item component for cleaner code
const ActivityItem = ({ 
  icon: Icon, 
  bgColor, 
  iconColor, 
  title, 
  description, 
  time 
}: { 
  icon: any, 
  bgColor: string, 
  iconColor: string, 
  title: string, 
  description: string, 
  time: string 
}) => (
  <div className="flex items-center">
    <div className={`${bgColor} p-2 rounded-full mr-4`}>
      <Icon className={`h-4 w-4 ${iconColor}`} />
    </div>
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
    <div className="ml-auto text-xs text-gray-500">
      <Clock className="h-3 w-3 inline-block mr-1" />
      {time}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [products, setProducts] = useState<number>(0);
  const [appointments, setAppointments] = useState<number>(0);
  const [customers, setCustomers] = useState<number>(0);
  const [testimonials, setTestimonials] = useState<number>(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState<{name: string, percentage: number}[]>([]);
  const { toast } = useToast();
  
  // Data for visualizations - will be populated from actual data
  const [salesData, setSalesData] = useState<number[]>([]);
  const [appointmentsData, setAppointmentsData] = useState<number[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch real data
        const productsData = await getProducts();
        const appointmentsData = await getAppointments();
        const customersData = await getAllCustomers();
        const testimonialsData = await getApprovedTestimonials();
        
        // Update counts
        setProducts(productsData.length);
        setAppointments(appointmentsData.length);
        setCustomers(customersData.length);
        setTestimonials(testimonialsData.length);
        
        // Calculate category percentages based on actual products
        if (productsData.length > 0) {
          const categories = productsData.reduce((acc: Record<string, number>, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
          }, {});
          
          const total = Object.values(categories).reduce((sum, count) => sum + count, 0);
          
          const categoryData = Object.entries(categories).map(([name, count]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            percentage: Math.round((count / total) * 100)
          }));
          
          setCategoryCounts(categoryData);
        }
        
        // Create recent activities from actual data
        const activities = [];
        
        // Add recent appointments if any
        if (appointmentsData.length > 0) {
          const recentAppointment = appointmentsData
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          
          if (recentAppointment) {
            activities.push({
              icon: CalendarDays,
              bgColor: 'bg-green-100',
              iconColor: 'text-green-600',
              title: 'New appointment scheduled',
              description: `${recentAppointment.name} booked for ${new Date(recentAppointment.date).toLocaleDateString()}`,
              time: getTimeAgo(recentAppointment.createdAt)
            });
          }
        }
        
        // Add recent products if any
        if (productsData.length > 0) {
          const recentProduct = productsData
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          
          if (recentProduct) {
            activities.push({
              icon: Package,
              bgColor: 'bg-blue-100',
              iconColor: 'text-blue-600',
              title: `${recentProduct.name} added`,
              description: `New product in ${recentProduct.category} category`,
              time: getTimeAgo(recentProduct.createdAt)
            });
          }
        }
        
        // Add recent customer if any
        if (customersData.length > 0) {
          const recentCustomer = customersData
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          
          if (recentCustomer) {
            activities.push({
              icon: Users,
              bgColor: 'bg-indigo-100',
              iconColor: 'text-indigo-600',
              title: 'New customer registered',
              description: `${recentCustomer.name} created an account`,
              time: getTimeAgo(recentCustomer.createdAt)
            });
          }
        }
        
        // Add recent testimonial if any
        if (testimonialsData.length > 0) {
          const recentTestimonial = testimonialsData
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
          if (recentTestimonial) {
            activities.push({
              icon: Star,
              bgColor: 'bg-yellow-100',
              iconColor: 'text-yellow-600',
              title: 'New testimonial received',
              description: `${recentTestimonial.customerName} left a ${recentTestimonial.rating}-star review`,
              time: getTimeAgo(recentTestimonial.date)
            });
          }
        }
        
        setRecentActivities(activities);
        
        // Generate weekly data based on appointments
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toISOString().split('T')[0];
        });
        
        // Count appointments by day
        const appointmentsByDay = last7Days.map(day => {
          return appointmentsData.filter(apt => 
            new Date(apt.date).toISOString().split('T')[0] === day
          ).length;
        });
        setAppointmentsData(appointmentsByDay);
        
        // Generate mock sales data based on products and appointments
        // In a real app, this would come from actual sales data
        const mockSalesData = last7Days.map((_, index) => {
          return Math.max(10, (productsData.length * 10) + (appointmentsByDay[index] * 15) + Math.floor(Math.random() * 20));
        });
        setSalesData(mockSalesData);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Error loading dashboard data",
          description: "Please try refreshing the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Helper function to format time ago
  function getTimeAgo(date: Date) {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    
    return new Date(date).toLocaleDateString();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Today: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="w-12 h-7 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                products
              )}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {products > 0 ? `${products} products in inventory` : "No products added yet"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <CalendarDays className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="w-12 h-7 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                appointments
              )}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {appointments > 0 ? 
                `${appointments} total appointments` : 
                "No appointments scheduled"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="w-12 h-7 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                customers
              )}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {customers > 0 ? 
                `${customers} registered customers` : 
                "No registered customers yet"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <Star className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="w-12 h-7 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                testimonials
              )}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {testimonials > 0 ? 
                `${testimonials} approved testimonials` : 
                "No testimonials yet"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Weekly Sales Overview</CardTitle>
            <CardDescription>
              {salesData.length > 0 ? 
                "Total sales for the past week" : 
                "No sales data available yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={salesData} color="#D4AF37" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                return <div key={i}>{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>;
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Appointment Trends</CardTitle>
            <CardDescription>
              {appointmentsData.length > 0 ? 
                "Appointments scheduled in the past week" : 
                "No appointment data available yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={appointmentsData} color="#B22222" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                return <div key={i}>{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>;
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              // Loading state
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="flex items-center animate-pulse">
                  <div className="bg-gray-200 p-2 rounded-full mr-4 h-8 w-8"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : recentActivities.length > 0 ? (
              // Show actual activities
              recentActivities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))
            ) : (
              // No activities
              <div className="text-center py-6 text-gray-500">
                <p>No recent activities to display</p>
                <p className="text-sm mt-2">As you add products, customers, and receive appointments, activities will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
            <CardDescription>Top selling product categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              // Loading state
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex justify-between text-sm mb-1">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2"></div>
                </div>
              ))
            ) : categoryCounts.length > 0 ? (
              // Show actual categories
              categoryCounts.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category.name}</span>
                    <span>{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-brand-gold rounded-full h-2" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              // No categories
              <div className="text-center py-4 text-gray-500">
                <p>No product categories yet</p>
                <p className="text-sm mt-1">Add products to see categories</p>
              </div>
            )}
            
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/admin/products">
                View All Products <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
