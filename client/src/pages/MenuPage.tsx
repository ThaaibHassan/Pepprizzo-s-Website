import React, { useState, useEffect } from 'react';
import { PlusIcon, StarIcon } from '@heroicons/react/24/solid';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { useMenuStore } from '../stores/menuStore';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';

const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState({
    vegetarian: false,
    spicy: false,
    featured: false
  });

  const { addItem } = useCartStore();
  const { 
    menuItems, 
    categories, 
    isLoading, 
    isCategoriesLoading,
    error,
    categoriesError,
    fetchMenuItems, 
    fetchCategories,
    setFilters: setStoreFilters 
  } = useMenuStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Update store filters when local filters change
  useEffect(() => {
    setStoreFilters({
      category: selectedCategory,
      search: searchTerm,
      sortBy,
      vegetarian: filters.vegetarian,
      spicy: filters.spicy,
      featured: filters.featured
    });
  }, [selectedCategory, searchTerm, sortBy, filters, setStoreFilters]);

  // Fetch menu items when filters change
  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory, searchTerm, sortBy, filters.vegetarian, filters.spicy, filters.featured]);

  const handleAddToCart = (item: any) => {
    const cartItem = {
      menu_item_id: item.id,
      name: item.name,
      price: item.price,
      size: item.available_sizes?.[0] || 'Regular',
      crust: item.available_crusts?.[0] || 'Classic',
      toppings: [],
      quantity: 1
    };
    
    addItem(cartItem);
    toast.success(`${item.name} added to cart!`);
  };

  const filteredItems = menuItems.filter(item => {
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Show error if any
  if (error && menuItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Menu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchMenuItems()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h1>
          <p className="text-gray-600">Discover our delicious selection of pizzas, sides, and drinks</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={isCategoriesLoading}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Filter Toggles */}
          <div className="flex flex-wrap gap-4 mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.vegetarian}
                onChange={(e) => setFilters(prev => ({ ...prev, vegetarian: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Vegetarian</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.spicy}
                onChange={(e) => setFilters(prev => ({ ...prev, spicy: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Spicy</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.featured}
                onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">Featured</span>
            </label>
          </div>
        </div>

        {/* Menu Items */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={item.image_url || '/placeholder-pizza.svg'}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-pizza.svg'
                    }}
                    onLoad={(e) => {
                      e.currentTarget.style.opacity = '1'
                    }}
                    style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
                  />
                  {/* Fallback for when image fails to load */}
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center" style={{ display: 'none' }}>
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  {item.is_featured && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                  {item.is_spicy && (
                    <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Spicy
                    </div>
                  )}
                  {item.is_vegetarian && (
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Vegetarian
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-lg font-bold text-red-600">${item.price.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>4.5 (120 reviews)</span>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
