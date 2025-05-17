
export type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  purpose: 'general-viewing' | 'specific-item' | 'custom-order';
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
};

// Local storage key for appointments
const APPOINTMENTS_STORAGE_KEY = 'lingam-appointments';

// Initialize empty array for appointments
let mockAppointments: Appointment[] = [];

// Initialize from local storage if available
const initializeAppointments = () => {
  const storedData = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      // Convert string dates back to Date objects
      mockAppointments = parsedData.map((a: any) => ({
        ...a,
        date: new Date(a.date),
        createdAt: new Date(a.createdAt)
      }));
    } catch (error) {
      console.error('Error parsing appointments from local storage:', error);
      mockAppointments = [];
    }
  }
};

// Save to local storage
const saveAppointments = () => {
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(mockAppointments));
};

// Initialize on module load
initializeAppointments();

// Get all appointments
export const getAppointments = async (): Promise<Appointment[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockAppointments];
};

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAppointments.find(appointment => appointment.id === id);
};

// Create a new appointment
export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Promise<Appointment> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newAppointment: Appointment = {
    ...appointment,
    id: Date.now().toString(),
    status: 'pending',
    createdAt: new Date()
  };
  
  // Actually save the appointment - this line was commented out before
  mockAppointments.push(newAppointment);
  saveAppointments();
  
  return newAppointment;
};

// Update an appointment status
export const updateAppointmentStatus = async (id: string, status: Appointment['status']): Promise<Appointment | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const appointmentIndex = mockAppointments.findIndex(a => a.id === id);
  if (appointmentIndex === -1) return undefined;
  
  // Actually update the appointment - this was commented out before
  mockAppointments[appointmentIndex] = { 
    ...mockAppointments[appointmentIndex], 
    status 
  };
  saveAppointments();
  
  return mockAppointments[appointmentIndex];
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = async (date: Date): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Business hours: 10 AM to 6 PM with 30-minute slots
  const allTimeSlots = [
    '10:00', '10:30',
    '11:00', '11:30',
    '12:00', '12:30',
    '13:00', '13:30',
    '14:00', '14:30',
    '15:00', '15:30',
    '16:00', '16:30',
    '17:00', '17:30'
  ];
  
  // Filter out time slots that are already booked
  const dateString = date.toISOString().split('T')[0];
  const bookedSlots = mockAppointments
    .filter(appt => 
      appt.date.toISOString().split('T')[0] === dateString &&
      appt.status !== 'cancelled'
    )
    .map(appt => appt.time);
  
  return allTimeSlots.filter(slot => !bookedSlots.includes(slot));
};

// Delete an appointment (for admin)
export const deleteAppointment = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const initialLength = mockAppointments.length;
  mockAppointments = mockAppointments.filter(a => a.id !== id);
  
  if (mockAppointments.length !== initialLength) {
    saveAppointments();
    return true;
  }
  return false;
};
