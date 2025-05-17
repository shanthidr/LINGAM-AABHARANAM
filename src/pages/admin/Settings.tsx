import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { 
  Store, 
  BellRing, 
  ShieldAlert, 
  Palette, 
  Smartphone,
  Save, 
  Key,
  Mail,
  Building,
  MapPin,
  Phone,
  Globe,
  Clock,
  Check
} from 'lucide-react';

import { getStoreInfo, saveStoreInfo, StoreInfo } from '@/utils/storeInfo';

// Settings Interfaces
interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  openingHours: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  orderNotifications: boolean;
  appointmentNotifications: boolean;
  marketingEmails: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  showBranding: boolean;
}

// Default settings
const defaultStoreSettings: StoreSettings = {
  name: 'LINGAM Aabharanam',
  address: 'Illinois, Chicago, USA',
  phone: '+1 (773) 490-3951',
  email: 'lingamaabharanamllc@gmail.com',
  website: 'www.lingamaabharanam.com',
  openingHours: 'Monday to Sunday (appointments only)'
};

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  orderNotifications: true,
  appointmentNotifications: true,
  marketingEmails: false
};

const defaultAppearanceSettings: AppearanceSettings = {
  theme: 'light',
  accentColor: '#D4AF37',
  showBranding: true
};

// Load settings from localStorage or use defaults
const loadSettings = <T extends object>(key: string, defaultSettings: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultSettings;
  } catch (e) {
    console.error(`Error loading settings for ${key}:`, e);
    return defaultSettings;
  }
};

// Save settings to localStorage
const saveSettings = <T extends object>(key: string, settings: T): void => {
  localStorage.setItem(key, JSON.stringify(settings));
};

const AdminSettings = () => {
  const [storeSettings, setStoreSettings] = useState<StoreInfo>(getStoreInfo());

  useEffect(() => {
    const savedSettings = getStoreInfo();
    setStoreSettings(savedSettings);
  }, []);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    loadSettings('lingam-notification-settings', defaultNotificationSettings)
  );
  
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(
    loadSettings('lingam-appearance-settings', defaultAppearanceSettings)
  );
  
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  const { toast } = useToast();
  
  // Store settings handlers
  const handleStoreSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const saveStoreSettings = () => {
    saveStoreInfo(storeSettings);
    toast({
      title: "Store settings saved",
      description: "Your store details have been updated successfully across the website.",
      duration: 3000
    });
  };
  
  // Notification settings handlers
  const handleNotificationSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const saveNotificationSettings = () => {
    saveSettings('lingam-notification-settings', notificationSettings);
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated successfully.",
      duration: 3000
    });
  };
  
  // Appearance settings handlers
  const handleThemeChange = (value: string) => {
    setAppearanceSettings(prev => ({ ...prev, theme: value as 'light' | 'dark' | 'system' }));
  };
  
  const handleAccentColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppearanceSettings(prev => ({ ...prev, accentColor: e.target.value }));
  };
  
  const handleBrandingChange = (value: boolean) => {
    setAppearanceSettings(prev => ({ ...prev, showBranding: value }));
  };
  
  const saveAppearanceSettings = () => {
    saveSettings('lingam-appearance-settings', appearanceSettings);
    toast({
      title: "Appearance settings saved",
      description: "Your appearance preferences have been updated successfully.",
      duration: 3000
    });
    
    // Apply theme changes
    if (appearanceSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (appearanceSettings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Password change handler
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!passwordCurrent) {
      toast({
        title: "Error",
        description: "Current password is required",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordNew !== passwordConfirm) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordNew.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would call an API to change the password
    // For demo purposes, we'll just show a success message
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
      duration: 3000
    });
    
    // Clear form
    setPasswordCurrent('');
    setPasswordNew('');
    setPasswordConfirm('');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="store">
        <TabsList className="mb-6">
          <TabsTrigger value="store">
            <Store className="h-4 w-4 mr-2" />
            Store
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellRing className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>
        
        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Manage your store details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Store Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={storeSettings.name}
                        onChange={handleStoreSettingChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={storeSettings.phone}
                        onChange={handleStoreSettingChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      name="address"
                      value={storeSettings.address}
                      onChange={handleStoreSettingChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        value={storeSettings.email}
                        onChange={handleStoreSettingChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        name="website"
                        value={storeSettings.website}
                        onChange={handleStoreSettingChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="openingHours">Opening Hours</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="openingHours"
                      name="openingHours"
                      value={storeSettings.openingHours}
                      onChange={handleStoreSettingChange}
                      className="min-h-20 pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={saveStoreSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(value) => 
                      handleNotificationSettingChange('emailNotifications', value)
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-notifications">Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new orders are placed
                    </p>
                  </div>
                  <Switch
                    id="order-notifications"
                    checked={notificationSettings.orderNotifications}
                    onCheckedChange={(value) => 
                      handleNotificationSettingChange('orderNotifications', value)
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="appointment-notifications">Appointment Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new appointments are scheduled
                    </p>
                  </div>
                  <Switch
                    id="appointment-notifications"
                    checked={notificationSettings.appointmentNotifications}
                    onCheckedChange={(value) => 
                      handleNotificationSettingChange('appointmentNotifications', value)
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional emails and special offers
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(value) => 
                      handleNotificationSettingChange('marketingEmails', value)
                    }
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={saveNotificationSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how your admin dashboard looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme Mode</Label>
                  <Select 
                    value={appearanceSettings.theme} 
                    onValueChange={handleThemeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="accentColor"
                      type="color"
                      value={appearanceSettings.accentColor}
                      onChange={handleAccentColorChange}
                      className="w-16 h-8 p-1"
                    />
                    <span className="text-sm text-muted-foreground">
                      {appearanceSettings.accentColor}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-branding">Show Branding</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your store's logo and branding throughout the site
                    </p>
                  </div>
                  <Switch
                    id="show-branding"
                    checked={appearanceSettings.showBranding}
                    onCheckedChange={handleBrandingChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={saveAppearanceSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordCurrent}
                      onChange={(e) => setPasswordCurrent(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordNew}
                      onChange={(e) => setPasswordNew(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Check className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm">Password requirements:</p>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                    <li>At least 6 characters long</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </div>
              </form>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
                
                <div className="flex justify-start">
                  <Button variant="outline" className="mt-2">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Setup 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
