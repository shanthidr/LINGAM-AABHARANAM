
export interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  openingHours: string;
}

export const defaultStoreInfo: StoreInfo = {
  name: 'LINGAM Aabharanam',
  address: 'Illinois, Chicago, USA',
  phone: '+1 (773) 490-3951',
  email: 'lingamaabharanamllc@gmail.com',
  website: 'www.lingamaabharanam.com',
  openingHours: 'Monday to Sunday (appointments only)'
};

// Create a custom event for store info changes
const STORE_INFO_UPDATED_EVENT = 'store-info-updated';

export const getStoreInfo = (): StoreInfo => {
  try {
    const stored = localStorage.getItem('lingam-store-settings');
    return stored ? JSON.parse(stored) : defaultStoreInfo;
  } catch (e) {
    console.error('Error loading store settings:', e);
    return defaultStoreInfo;
  }
};

export const saveStoreInfo = (settings: StoreInfo): void => {
  localStorage.setItem('lingam-store-settings', JSON.stringify(settings));
  
  // Dispatch a custom event to notify components that store info has changed
  window.dispatchEvent(new CustomEvent(STORE_INFO_UPDATED_EVENT));
};

// Function to subscribe to store info changes
export const subscribeToStoreInfoChanges = (callback: () => void): () => void => {
  const handleChange = () => {
    callback();
  };
  
  window.addEventListener(STORE_INFO_UPDATED_EVENT, handleChange);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener(STORE_INFO_UPDATED_EVENT, handleChange);
  };
};
