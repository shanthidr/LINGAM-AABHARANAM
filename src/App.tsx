
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/auth";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AppointmentPage from "./pages/AppointmentPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminAppointments from "./pages/admin/Appointments";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminCustomers from "./pages/admin/Customers";
import AdminSettings from "./pages/admin/Settings";
import HomePageEditor from "./pages/admin/HomePageEditor";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import SignupPage from './pages/SignupPage';
import AdminProductRequests from './pages/admin/ProductRequests';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';

// Configure to use HashRouter for better static hosting support
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HashRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="appointment" element={<AppointmentPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="wishlist" element={<WishlistPage />} />

              <Route path="admin" element={<ProtectedRoute allowedRole="admin" />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="homepage" element={<HomePageEditor />} />
                <Route path="product-requests" element={<AdminProductRequests />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </HashRouter>
  </QueryClientProvider>
);

export default App;
