import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api, endpoints } from '../lib/api';

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
        
        try {
          const { filters } = get();
          const params: any = {};
          
          if (filters.category !== 'all') {
            params.category = filters.category;
          }
          if (filters.vegetarian) {
            params.vegetarian = 'true';
          }
          if (filters.spicy) {
            params.spicy = 'true';
          }
          if (filters.featured) {
            params.featured = 'true';
          }
          if (filters.search) {
            params.search = filters.search;
          }
          if (filters.sortBy) {
            params.sort = filters.sortBy;
          }

          const response = await api.get(endpoints.menu.list, { params });
          const menuItems = response.data.data.menu_items;
          
          set({ menuItems, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching menu items:', error);
          set({ 
            error: error.response?.data?.error || 'Failed to fetch menu items', 
            isLoading: false 
          });
        }
      },

      // Fetch categories
      fetchCategories: async () => {
        set({ isCategoriesLoading: true, categoriesError: null });
        
        try {
          const response = await api.get(endpoints.menu.categories);
          const categories = response.data.data.categories;
          
          set({ categories, isCategoriesLoading: false });
        } catch (error: any) {
          console.error('Error fetching categories:', error);
          set({ 
            categoriesError: error.response?.data?.error || 'Failed to fetch categories', 
            isCategoriesLoading: false 
          });
        }
      },

      // Add menu item (admin only)
      addMenuItem: async (item: Omit<MenuItem, 'id'>) => {
        try {
          const response = await api.post(endpoints.admin.addMenuItem, item);
          const newItem = response.data.data.menu_item;
          
          set(state => ({
            menuItems: [...state.menuItems, newItem]
          }));
        } catch (error: any) {
          console.error('Error adding menu item:', error);
          throw new Error(error.response?.data?.error || 'Failed to add menu item');
        }
      },

      // Update menu item (admin only)
      updateMenuItem: async (id: number, updates: Partial<MenuItem>) => {
        try {
          const response = await api.put(endpoints.admin.updateMenuItem(id.toString()), updates);
          const updatedItem = response.data.data.menu_item;
          
          set(state => ({
            menuItems: state.menuItems.map(item => 
              item.id === id ? updatedItem : item
            )
          }));
        } catch (error: any) {
          console.error('Error updating menu item:', error);
          throw new Error(error.response?.data?.error || 'Failed to update menu item');
        }
      },

      // Delete menu item (admin only)
      deleteMenuItem: async (id: number) => {
        try {
          await api.delete(endpoints.admin.deleteMenuItem(id.toString()));
          
          set(state => ({
            menuItems: state.menuItems.filter(item => item.id !== id)
          }));
        } catch (error: any) {
          console.error('Error deleting menu item:', error);
          throw new Error(error.response?.data?.error || 'Failed to delete menu item');
        }
      },

      // Set filters
      setFilters: (newFilters: Partial<MenuState['filters']>) => {
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
      clearError: () => set({ error: null }),

      // Clear categories error
      clearCategoriesError: () => set({ categoriesError: null }),
    }),
    {
      name: 'menu-store',
    }
  )
);
