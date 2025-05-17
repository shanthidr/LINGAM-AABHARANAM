
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  lastVisit?: Date;
  totalPurchases?: number;
};

// Local storage key for customers
const CUSTOMERS_STORAGE_KEY = 'lingam-customers';

// Initialize empty array for customers
let mockCustomers: Customer[] = [];

// Initialize from local storage if available
const initializeCustomers = () => {
  const storedData = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      // Convert string dates back to Date objects
      mockCustomers = parsedData.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        lastVisit: c.lastVisit ? new Date(c.lastVisit) : undefined
      }));
    } catch (error) {
      console.error('Error parsing customers from local storage:', error);
      mockCustomers = [];
    }
  }
};

// Save to local storage
const saveCustomers = () => {
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(mockCustomers));
};

// Initialize on module load
initializeCustomers();

// Get all customers
export const getAllCustomers = async (): Promise<Customer[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockCustomers];
};

// Get customer by ID
export const getCustomerById = async (id: string): Promise<Customer | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCustomers.find(customer => customer.id === id);
};

// Get customer by email
export const getCustomerByEmail = async (email: string): Promise<Customer | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCustomers.find(customer => customer.email.toLowerCase() === email.toLowerCase());
};

// Add new customer
export const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newCustomer: Customer = {
    ...customer,
    id: Date.now().toString(),
    createdAt: new Date(),
    totalPurchases: 0
  };
  
  mockCustomers.push(newCustomer);
  saveCustomers();
  return newCustomer;
};

// Update customer
export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<Customer | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const customerIndex = mockCustomers.findIndex(c => c.id === id);
  if (customerIndex === -1) return undefined;
  
  mockCustomers[customerIndex] = { ...mockCustomers[customerIndex], ...updates };
  saveCustomers();
  
  return mockCustomers[customerIndex];
};

// Delete customer
export const deleteCustomer = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const initialLength = mockCustomers.length;
  mockCustomers = mockCustomers.filter(c => c.id !== id);
  
  if (mockCustomers.length !== initialLength) {
    saveCustomers();
    return true;
  }
  return false;
};

// Record customer visit
export const recordCustomerVisit = async (id: string): Promise<Customer | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const customerIndex = mockCustomers.findIndex(c => c.id === id);
  if (customerIndex === -1) return undefined;
  
  mockCustomers[customerIndex] = { 
    ...mockCustomers[customerIndex], 
    lastVisit: new Date() 
  };
  saveCustomers();
  
  return mockCustomers[customerIndex];
};

// Record customer purchase
export const recordCustomerPurchase = async (id: string): Promise<Customer | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const customerIndex = mockCustomers.findIndex(c => c.id === id);
  if (customerIndex === -1) return undefined;
  
  const currentPurchases = mockCustomers[customerIndex].totalPurchases || 0;
  
  mockCustomers[customerIndex] = { 
    ...mockCustomers[customerIndex], 
    totalPurchases: currentPurchases + 1,
    lastVisit: new Date()
  };
  saveCustomers();
  
  return mockCustomers[customerIndex];
};
