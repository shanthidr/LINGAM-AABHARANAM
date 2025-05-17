
import { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon, MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { getAvailableTimeSlots, createAppointment } from '@/services/appointmentService';
import { useToast } from '@/components/ui/use-toast';

const AppointmentPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');
  const [purpose, setPurpose] = useState<'general-viewing' | 'specific-item' | 'custom-order'>('general-viewing');
  const [message, setMessage] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (date) {
      const fetchTimes = async () => {
        try {
          const slots = await getAvailableTimeSlots(date);
          setAvailableTimes(slots);
          setTime('');
        } catch (error) {
          console.error('Error fetching time slots:', error);
          toast({
            title: 'Error',
            description: 'Failed to load available time slots',
            variant: 'destructive',
          });
        }
      };

      fetchTimes();
    }
  }, [date, toast]);

  const sendEmail = async (appointmentData: any) => {
    try {
      const emailBody = `
        New Appointment Request:
        
        Name: ${appointmentData.name}
        Email: ${appointmentData.email}
        Phone: ${appointmentData.phone}
        Date: ${format(appointmentData.date, 'PPPP')}
        Time: ${appointmentData.time}
        Purpose: ${appointmentData.purpose.replace('-', ' ')}
        Message: ${appointmentData.message || 'No additional message'}
      `;

      // Use mailto protocol to open default email client
      window.open(`mailto:lingamaabharanamllc@gmail.com?subject=New Appointment Request&body=${encodeURIComponent(emailBody)}`);
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };

  const sendWhatsApp = async (appointmentData: any) => {
    try {
      const whatsappBody = `
New Appointment Request:

Name: ${appointmentData.name}
Email: ${appointmentData.email}
Phone: ${appointmentData.phone}
Date: ${format(appointmentData.date, 'PPPP')}
Time: ${appointmentData.time}
Purpose: ${appointmentData.purpose.replace('-', ' ')}
Message: ${appointmentData.message || 'No additional message'}
      `;

      // Use WhatsApp API to open WhatsApp with pre-filled message
      window.open(`https://wa.me/17734903951?text=${encodeURIComponent(whatsappBody)}`, '_blank');
      
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast({
        title: 'Missing information',
        description: 'Please select both date and time for your appointment',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const appointmentData = {
        name,
        email,
        phone,
        date,
        time,
        purpose,
        message,
      };
      
      // Create appointment in the system
      await createAppointment(appointmentData);

      // Send email notification
      const emailSent = await sendEmail(appointmentData);

      // Send WhatsApp notification
      const whatsappSent = await sendWhatsApp(appointmentData);
      
      toast({
        title: 'Appointment Booked!',
        description: `Your appointment is scheduled for ${format(date, 'PPPP')} at ${time}`,
      });
      
      // Show additional toast for email and WhatsApp status
      if (emailSent && whatsappSent) {
        toast({
          title: 'Notifications Sent',
          description: 'Appointment details have been sent via email and WhatsApp',
        });
      }
      
      setName('');
      setEmail('');
      setPhone('');
      setDate(undefined);
      setTime('');
      setPurpose('general-viewing');
      setMessage('');
    } catch (error) {
      toast({
        title: 'Booking failed',
        description: 'There was an error booking your appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-container">
      <h1 className="page-title">Book an Appointment</h1>
      <p className="section-subtitle max-w-2xl">
        Schedule a visit to our store to explore our collection in person or discuss a custom design. Our team will provide personalized assistance during your visit.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-medium">Personal Information</h2>
              
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-medium">Appointment Details</h2>
              
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const maxDate = new Date();
                        maxDate.setDate(today.getDate() + 30);
                        return date < today || date > maxDate;
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>Time</Label>
                <Select
                  value={time}
                  onValueChange={setTime}
                  disabled={!date || availableTimes.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.length === 0 ? (
                      <SelectItem value="no-slots" disabled>No available times</SelectItem>
                    ) : (
                      availableTimes.map((slot) => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {date && availableTimes.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    No available time slots for selected date. Please choose another date.
                  </p>
                )}
              </div>
              
              <div>
                <Label>Purpose of Visit</Label>
                <RadioGroup value={purpose} onValueChange={(value: any) => setPurpose(value)}>
                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="general-viewing" id="general-viewing" />
                    <Label htmlFor="general-viewing">General Collection Viewing</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="specific-item" id="specific-item" />
                    <Label htmlFor="specific-item">Specific Item Interest</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="custom-order" id="custom-order" />
                    <Label htmlFor="custom-order">Custom Order Discussion</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="message">Additional Information (Optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please share any specific items you're interested in or details about your custom order requirements..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-brand-gold hover:bg-brand-gold-dark flex items-center justify-center gap-2"
              disabled={isSubmitting || !date || !time}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Booking Appointment...
                </span>
              ) : (
                <>
                  Book Appointment
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <MessageSquare className="h-4 w-4" />
                  </div>
                </>
              )}
            </Button>
          </form>
        </div>
        
        <div>
          <div className="bg-brand-cream rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-serif font-medium mb-4">Visit Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg">Location</h3>
                <p className="text-gray-700">Illinois, Chicago</p>
                <div className="mt-2 h-48 bg-gray-200 rounded-md">
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    Store Location Map
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg">Store Hours</h3>
                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <span>Monday - Sunday</span>
                  <span>Appointments Only</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg">What to Expect</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Personal consultation with our jewelry experts</li>
                  <li>Up-close viewing of our silver collection</li>
                  <li>Detailed information about craftsmanship and materials</li>
                  <li>Custom design discussion if requested</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg">Need Help?</h3>
                <p className="text-gray-700">
                  Call us at <a href="tel:+17734903951" className="text-brand-gold hover:underline">+1 (773) 490-3951</a> or email 
                  <a href="mailto:lingamaabharanamllc@gmail.com" className="text-brand-gold hover:underline"> lingamaabharanamllc@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
