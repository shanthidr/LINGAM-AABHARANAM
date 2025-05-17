
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  CalendarClock,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Star,
  X,
  LayoutTemplate
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  
  // Close mobile menu when changing routes
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname]);
  
  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);
  
  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/admin/dashboard',
    },
    {
      icon: Package,
      label: 'Products',
      href: '/admin/products',
    },
    {
      icon: CalendarClock,
      label: 'Appointments',
      href: '/admin/appointments',
    },
    {
      icon: Star,
      label: 'Testimonials',
      href: '/admin/testimonials',
    },
    {
      icon: Users,
      label: 'Customers',
      href: '/admin/customers',
    },
    {
      icon: LayoutTemplate,
      label: 'Homepage',
      href: '/admin/homepage',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/admin/settings',
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar for desktop */}
      <aside
        className={`bg-white shadow-md hidden md:flex flex-col transition-all duration-300 z-20 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          {!collapsed && (
            <Link to="/" className="flex items-center">
              <div className="relative h-8 w-8 mr-2">
                <img
                  src="/lovable-uploads/cad02e43-afa0-4b15-807d-e6aeaa0b68c3.png"
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-serif font-bold">Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={collapsed ? 'mx-auto' : 'ml-auto'}
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        <Separator />
        
        <ScrollArea className="flex-1 py-4">
          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 hover:bg-gray-100 transition-colors ${
                      location.pathname === item.href ? 'bg-gray-100 text-brand-gold' : 'text-gray-700'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
        
        <div className="p-4 mt-auto">
          <Button
            variant="ghost"
            onClick={logout}
            className={`flex items-center w-full ${collapsed ? 'justify-center' : 'justify-start'}`}
          >
            <LogOut className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile overlay when menu is open */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile slide-in menu */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="relative h-8 w-8 mr-2">
              <img
                src="/lovable-uploads/cad02e43-afa0-4b15-807d-e6aeaa0b68c3.png"
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-serif font-bold">Admin</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Separator />
        
        <ScrollArea className="h-[calc(100%-8rem)]">
          <nav className="py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 hover:bg-gray-100 transition-colors ${
                      location.pathname === item.href ? 'bg-gray-100 text-brand-gold' : 'text-gray-700'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            onClick={logout}
            className="flex items-center w-full justify-start"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-20 h-16">
        <div className="flex items-center justify-between p-4 h-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center">
            <div className="relative h-8 w-8 mr-2">
              <img
                src="/lovable-uploads/cad02e43-afa0-4b15-807d-e6aeaa0b68c3.png"
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-serif font-medium">
              {navItems.find(item => item.href === location.pathname)?.label || 'Admin'}
            </span>
          </div>
          
          <div className="w-5">
            {/* Empty div to balance the layout */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="md:p-8 p-4 pt-20 md:pt-8">
            <ScrollArea className="h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] pr-4">
              {children}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
