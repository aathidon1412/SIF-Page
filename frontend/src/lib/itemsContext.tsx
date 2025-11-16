import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loadData, saveData, type Item } from './dataManager';

// Equipment and Lab interfaces for component compatibility
interface Equipment {
  id: string;
  title: string;
  description: string;
  pricePerDay: number;
  image: string;
}

interface Lab {
  id: string;
  name: string;
  desc: string;
  image: string;
  capacity: string;
  pricePerHour: number;
}

interface ItemsContextType {
  equipments: Equipment[];
  labs: Lab[];
  addItem: (item: { title: string; type: 'lab' | 'equipment'; desc: string; pricePerDay?: number; pricePerHour?: number; capacity?: string; image?: string }) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<{ title: string; desc: string; pricePerDay?: number; pricePerHour?: number; capacity?: string; image?: string }>) => void;
  refreshItems: () => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};

interface ItemsProviderProps {
  children: ReactNode;
}

// Default placeholder images
const DEFAULT_EQUIPMENT_IMAGE = 'https://images.unsplash.com/photo-1581092918484-8313ead0b31f?w=800&h=520&fit=crop';
const DEFAULT_LAB_IMAGE = 'https://images.unsplash.com/photo-1581091122025-1c8b7b2b8a8e?w=800&h=520&fit=crop';

export const ItemsProvider: React.FC<ItemsProviderProps> = ({ children }) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);

  // Initialize data from JSON file on first load
  const initializeData = async () => {
    try {
      const items = await loadData();
      loadAndMergeItems(items);
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  // Load and separate items by type
  const loadAndMergeItems = (allItems?: Item[]) => {
    try {
      let items: Item[];
      if (allItems) {
        items = allItems;
      } else {
        const localData = localStorage.getItem('all_items');
        items = localData ? JSON.parse(localData) : [];
      }
      
      // Separate items by type
      const equipmentItems = items.filter(item => item.type === 'equipment');
      const labItems = items.filter(item => item.type === 'lab');
      
      // Convert to proper format
      const convertedEquipments: Equipment[] = equipmentItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || item.desc || '',
        pricePerDay: item.pricePerDay || 50.0,
        image: item.image || DEFAULT_EQUIPMENT_IMAGE
      }));

      const convertedLabs: Lab[] = labItems.map(item => ({
        id: item.id,
        name: item.name || item.title,
        desc: item.desc || item.description || '',
        image: item.image || DEFAULT_LAB_IMAGE,
        capacity: item.capacity || '4-8',
        pricePerHour: item.pricePerHour || 25
      }));

      setEquipments(convertedEquipments);
      setLabs(convertedLabs);

    } catch (error) {
      console.error('Error loading items:', error);
      setEquipments([]);
      setLabs([]);
    }
  };

  // Initial load
  useEffect(() => {
    initializeData();
  }, []);

  // Listen for storage changes (when items are modified)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'all_items') {
        loadAndMergeItems();
      }
    };

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Also check for changes periodically (for same-tab updates)
    const interval = setInterval(loadAndMergeItems, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const addItem = (item: { title: string; type: 'lab' | 'equipment'; desc: string; pricePerDay?: number; pricePerHour?: number; capacity?: string; image?: string }) => {
    try {
      const existingItems = JSON.parse(localStorage.getItem('all_items') || '[]');
      const newId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const newItem: Item = {
        id: newId,
        title: item.title,
        type: item.type,
        desc: item.desc,
        description: item.desc,
        ...(item.type === 'lab' && { name: item.title }),
        pricePerDay: item.pricePerDay,
        pricePerHour: item.pricePerHour,
        capacity: item.capacity,
        image: item.image || (item.type === 'equipment' ? DEFAULT_EQUIPMENT_IMAGE : DEFAULT_LAB_IMAGE)
      };

      const updatedItems = [...existingItems, newItem];
      saveData(updatedItems);
      
      // Trigger immediate update
      loadAndMergeItems(updatedItems);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const removeItem = (id: string) => {
    try {
      const allItems: Item[] = JSON.parse(localStorage.getItem('all_items') || '[]');
      const updatedItems = allItems.filter(item => item.id !== id);
      saveData(updatedItems);
      
      // Trigger immediate update
      loadAndMergeItems(updatedItems);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const updateItem = (id: string, updates: Partial<{ title: string; desc: string; pricePerDay?: number; pricePerHour?: number; capacity?: string; image?: string }>) => {
    try {
      const allItems: Item[] = JSON.parse(localStorage.getItem('all_items') || '[]');
      const updatedItems = allItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          // Sync title/name and desc/description fields
          if (updates.title) {
            updatedItem.name = updates.title;
          }
          if (updates.desc) {
            updatedItem.description = updates.desc;
          }
          return updatedItem;
        }
        return item;
      });
      
      saveData(updatedItems);
      
      // Trigger immediate update
      loadAndMergeItems(updatedItems);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const refreshItems = () => {
    loadAndMergeItems();
  };

  const value: ItemsContextType = {
    equipments,
    labs,
    addItem,
    removeItem,
    updateItem,
    refreshItems,
  };

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
};