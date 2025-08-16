import React, { useState, useEffect } from 'react';
import { useMenuStore } from '../../stores/menuStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit,
  Trash2,
  Eye,
  Star,
  DollarSign,
  Pizza,
  Utensils,
  Coffee,
  Tag,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import EditMenuItemModal from '../../components/EditMenuItemModal';
import AddMenuItemModal from '../../components/AddMenuItemModal';
import { MenuItem } from '../../stores/menuStore';

const AdminMenu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { 
    menuItems, 
    categories,
    isLoading, 
    isCategoriesLoading,
    error,
    categoriesError,
    fetchMenuItems, 
    fetchCategories,
    deleteMenuItem,
    clearError,
    clearCategoriesError
  } = useMenuStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  // Filter and sort menu items
  const filteredAndSortedItems = menuItems
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const uniqueCategories = [...new Set(menuItems.map(item => item.category))];

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pizzas':
        return <Pizza className="h-4 w-4" />;
      case 'sides':
        return <Utensils className="h-4 w-4" />;
      case 'drinks':
        return <Coffee className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditItem(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      await deleteMenuItem(itemId);
      toast.success('Menu item deleted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete menu item');
    }
  };

  const handleViewItem = (itemId: number) => {
    toast.success(`View item ${itemId} functionality coming soon!`);
  };

  const handleRefresh = () => {
    clearError();
    clearCategoriesError();
    fetchCategories();
    fetchMenuItems();
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Menu</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
              <p className="text-gray-600 mt-2">Manage your restaurant menu items</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleAddItem} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Menu items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueCategories.length}</div>
              <p className="text-xs text-muted-foreground">
                Menu categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Items</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {menuItems.filter(item => item.is_featured).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Featured on menu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per item
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search menu items by name, description, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="category">Sort by Category</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Items ({filteredAndSortedItems.length})</CardTitle>
            <CardDescription>All menu items with their details and options</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-12">
                <Pizza className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No menu items found matching your criteria.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Pizza';
                            }}
                          />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(item.category)}
                          <span className="text-sm">{item.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${item.price.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.is_vegetarian && (
                            <Badge variant="secondary" className="text-xs">Veg</Badge>
                          )}
                          {item.is_spicy && (
                            <Badge variant="destructive" className="text-xs">Spicy</Badge>
                          )}
                          {item.is_featured && (
                            <Badge className="text-xs bg-yellow-100 text-yellow-800">Featured</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewItem(item.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Edit Menu Item Modal */}
      <EditMenuItemModal
        item={editItem}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      />
      
      {/* Add Menu Item Modal */}
      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
      />
    </div>
  );
};

export default AdminMenu;
