// Utility functions for handling JSON data storage
import itemsData from '../data/items.json';

export interface Item {
  id: string;
  title: string;
  description?: string;
  desc?: string;
  name?: string;
  image: string;
  type: 'equipment' | 'lab';
  pricePerDay?: number;
  pricePerHour?: number;
  capacity?: string;
}

const LOCAL_STORAGE_KEY = 'all_items';

// Load initial data from JSON file
export const loadInitialData = async (): Promise<Item[]> => {
  try {
    // Import the JSON data directly since it's now in src
    const data: Item[] = itemsData as Item[];
    return data;
  } catch (error) {
    console.error('Error loading initial data:', error);
    return [];
  }
};

// Get data from localStorage or initialize from JSON
export const loadData = async (): Promise<Item[]> => {
  try {
    // Check if we have data in localStorage
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      return JSON.parse(localData);
    }
    
    // If no local data, load from JSON and store locally
    const initialData = await loadInitialData();
    if (initialData.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
    }
    return initialData;
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
};

// Save data to localStorage
export const saveData = (items: Item[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('items_changed', { detail: items }));
    
    // Log for development - shows what should be in items.json
    console.log('Data saved to localStorage. Current items:', items.length);
    console.log('To update items.json file, copy this data:', JSON.stringify(items, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Export current data as downloadable JSON file
export const exportDataAsJson = async (): Promise<void> => {
  try {
    const currentData = await loadData();
    const dataStr = JSON.stringify(currentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'items.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('📥 JSON file downloaded. Replace /src/data/items.json with this file.');
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};

// Add a new item
export const addItem = (item: Omit<Item, 'id'>): void => {
  loadData().then(currentItems => {
    const newItem: Item = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    
    const updatedItems = [...currentItems, newItem];
    saveData(updatedItems);
  }).catch(error => {
    console.error('Error adding item:', error);
  });
};

// Remove an item
export const removeItem = (id: string): void => {
  loadData().then(currentItems => {
    const updatedItems = currentItems.filter(item => item.id !== id);
    saveData(updatedItems);
  }).catch(error => {
    console.error('Error removing item:', error);
  });
};

// Update an item
export const updateItem = (id: string, updates: Partial<Item>): void => {
  loadData().then(currentItems => {
    const updatedItems = currentItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates };
        // Sync title/name and desc/description fields
        if (updates.title) {
          updatedItem.name = updates.title;
        }
        if (updates.desc) {
          updatedItem.description = updates.desc;
        }
        if (updates.description) {
          updatedItem.desc = updates.description;
        }
        return updatedItem;
      }
      return item;
    });
    
    saveData(updatedItems);
  }).catch(error => {
    console.error('Error updating item:', error);
  });
};

// Get current data statistics
export const getDataStats = async () => {
  try {
    const items = await loadData();
    const equipments = items.filter(item => item.type === 'equipment');
    const labs = items.filter(item => item.type === 'lab');
    
    return {
      total: items.length,
      equipments: equipments.length,
      labs: labs.length,
      hasUnsavedChanges: localStorage.getItem(LOCAL_STORAGE_KEY) !== null
    };
  } catch (error) {
    console.error('Error getting data stats:', error);
    return { total: 0, equipments: 0, labs: 0, hasUnsavedChanges: false };
  }
};

// In a real application, you might want to sync data back to server
// export const syncToServer = async (items: Item[]): Promise<void> => {
//   try {
//     await fetch('/api/items', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(items),
//     });
//   } catch (error) {
//     console.error('Error syncing to server:', error);
//   }
// };