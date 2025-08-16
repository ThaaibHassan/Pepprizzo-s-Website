import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '../lib/api';
import { mockMenuItems, mockCategories } from '../data/mockData';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_vegetarian: boolean;
  is_spicy: boolean;
  is_featured: boolean;
  available_sizes: string[];
  available_crusts: string[];
  available_toppings: string[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

interface MenuState {
  // Data
  menuItems: MenuItem[];
  categories: Category[];
  
  // Loading states
  isLoading: boolean;
  isCategoriesLoading: boolean;
  
  // Error states
  error: string | null;
  categoriesError: string | null;
  
  // Filters and search
  filters: {
    category: string;
    search: string;
    vegetarian: boolean;
    spicy: boolean;
    featured: boolean;
    sortBy: string;
  };
  
  // Actions
  fetchMenuItems: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: number, updates: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: number) => Promise<void>;
  setFilters: (filters: Partial<MenuState['filters']>) => void;
  clearFilters: () => void;
  clearError: () => void;
  clearCategoriesError: () => void;
}

export const useMenuStore = create<MenuState>()(
  devtools(
    (set, get) => ({
      // Initial state
      menuItems: [],
      categories: [],
      isLoading: false,
      isCategoriesLoading: false,
      error: null,
      categoriesError: null,
      filters: {
        category: 'all',
        search: '',
        vegetarian: false,
        spicy: false,
        featured: false,
        sortBy: 'name'
      },

      // Fetch menu items
      fetchMenuItems: async () => {
        set({ isLoading: true, error: null });
        
        // For demo purposes, use mock data directly instead of API calls
        const { filters } = get();
        let filteredItems = mockMenuItems;
        
        // Apply filters to mock data
        if (filters.category !== 'all') {
          filteredItems = filteredItems.filter(item => item.category === filters.category);
        }
        if (filters.search) {
          filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.description.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        if (filters.vegetarian) {
          filteredItems = filteredItems.filter(item => item.is_vegetarian);
        }
        if (filters.spicy) {
          filteredItems = filteredItems.filter(item => item.is_spicy);
        }
        if (filters.featured) {
          filteredItems = filteredItems.filter(item => item.is_featured);
        }
        
        // Apply sorting
        if (filters.sortBy === 'price') {
          filteredItems.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === 'name') {
          filteredItems.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        set({ menuItems: filteredItems, isLoading: false });
      },

      // Fetch categories
      fetchCategories: async () => {
        set({ isCategoriesLoading: true, categoriesError: null });
        
        // For demo purposes, use mock data directly instead of API calls
        set({ categories: mockCategories, isCategoriesLoading: false });
      },

      // Add menu item
      addMenuItem: async (item) => {
        try {
          const response = await api.post('/admin/menu', item);
          const newItem = response.data.data.menu_item;
          set(state => ({
            menuItems: [...state.menuItems, newItem]
          }));
        } catch (error: any) {
          console.error('Error adding menu item:', error);
          throw error;
        }
      },

      // Update menu item
      updateMenuItem: async (id, updates) => {
        try {
          const response = await api.put(`/admin/menu/${id}`, updates);
          const updatedItem = response.data.data.menu_item;
          set(state => ({
            menuItems: state.menuItems.map(item => 
              item.id === id ? { ...item, ...updatedItem } : item
            )
          }));
        } catch (error: any) {
          console.error('Error updating menu item:', error);
          throw error;
        }
      },

      // Delete menu item
      deleteMenuItem: async (id) => {
        try {
          await api.delete(`/admin/menu/${id}`);
          set(state => ({
            menuItems: state.menuItems.filter(item => item.id !== id)
          }));
        } catch (error: any) {
          console.error('Error deleting menu item:', error);
          throw error;
        }
      },

      // Set filters
      setFilters: (newFilters) => {
        set(state => ({
          filters: { ...state.filters, ...newFilters }
        }));
      },

      // Clear filters
      clearFilters: () => {
        set({
          filters: {
            category: 'all',
            search: '',
            vegetarian: false,
            spicy: false,
            featured: false,
            sortBy: 'name'
          }
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Clear categories error
      clearCategoriesError: () => {
        set({ categoriesError: null });
      }
    }),
    {
      name: 'menu-store'
    }
  )
);
