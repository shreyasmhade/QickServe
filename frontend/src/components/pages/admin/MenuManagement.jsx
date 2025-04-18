import React, { useState, useEffect } from 'react';
import { 
  FiHome, FiList, FiShoppingBag, FiGrid, FiUser, FiLogOut, FiMenu, FiX,
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiSave,
  FiImage, FiDollarSign, FiInfo
} from 'react-icons/fi';
import { FaUtensils, FaLeaf, FaCheese } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const MenuManagement = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [newItemImage, setNewItemImage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Color palette
  const colors = {
    primary: '#4F46E5',
    primaryLight: '#6366F1',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#374151',
    textLight: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    error: '#EF4444'
  };

  // Load data from restaurants array in localStorage
  useEffect(() => {
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    if (!currentAdmin) {
      navigate('/admin');
      return;
    }

    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const adminRestaurant = restaurants.find(r => r.id === currentAdmin.restaurantId);
    
    if (adminRestaurant) {
      setCategories(adminRestaurant.categories || []);
      setMenuItems(adminRestaurant.menuItems || []);
    } else {
      // Initialize with empty arrays if no restaurant found
      setCategories([]);
      setMenuItems([]);
    }
  }, [navigate]);

  // Save data to restaurants array in localStorage
  const saveRestaurantData = (updatedCategories, updatedMenuItems) => {
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    
    const updatedRestaurants = restaurants.map(restaurant => {
      if (restaurant.id === currentAdmin.restaurantId) {
        return {
          ...restaurant,
          categories: updatedCategories || categories,
          menuItems: updatedMenuItems || menuItems
        };
      }
      return restaurant;
    });
    
    localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
  };

  // Navigation functions
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    if (path === '/logout') {
      navigate('/admin');
    } else {
      navigate(path);
    }
  };

  // Category management
  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: `cat-${Date.now()}`,
        name: newCategoryName,
        description: ''
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      setNewCategoryName('');
      saveRestaurantData(updatedCategories, menuItems);
    }
  };

  const deleteCategory = (categoryId) => {
    if (window.confirm('Delete this category and all its items?')) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      const updatedMenuItems = menuItems.filter(item => item.category !== categoryId);
      setCategories(updatedCategories);
      setMenuItems(updatedMenuItems);
      saveRestaurantData(updatedCategories, updatedMenuItems);
    }
  };

  // Item management
  const handleAddItem = (categoryId) => {
    const newItem = {
      id: `item-${Date.now()}`,
      name: 'New Item',
      description: 'Item description',
      price: 0,
      category: categoryId,
      isVeg: true,
      isAvailable: true,
      image: 'https://via.placeholder.com/150?text=New+Item'
    };
    const updatedMenuItems = [...menuItems, newItem];
    setMenuItems(updatedMenuItems);
    setEditingItemId(newItem.id);
    setNewItemImage(newItem.image);
    saveRestaurantData(categories, updatedMenuItems);
  };

  const handleItemChange = (itemId, field, value) => {
    const updatedMenuItems = menuItems.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    );
    setMenuItems(updatedMenuItems);
    saveRestaurantData(categories, updatedMenuItems);
  };

  const handleImageChange = (itemId, imageUrl) => {
    setNewItemImage(imageUrl);
    handleItemChange(itemId, 'image', imageUrl);
  };

  const deleteItem = (itemId) => {
    if (window.confirm('Delete this menu item?')) {
      const updatedMenuItems = menuItems.filter(item => item.id !== itemId);
      setMenuItems(updatedMenuItems);
      saveRestaurantData(categories, updatedMenuItems);
    }
  };

  const saveItem = (itemId) => {
    setEditingItemId(null);
    setNewItemImage('');
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setNewItemImage('');
  };

  // Filter items by search term
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
    { path: '/menu-management', label: 'Menu Management', icon: <FiList size={20} /> },
    { path: '/order-management', label: 'Orders', icon: <FiShoppingBag size={20} /> },
    { path: '/table-management', label: 'Table Management', icon: <FiGrid size={20} /> },
    { path: '/admin-profile', label: 'Profile', icon: <FiUser size={20} /> },
    { path: '/admin', label: 'Logout', icon: <FiLogOut size={20} /> }
  ];

  return (
    <div className="min-h-screen min-w-screen" style={{ backgroundColor: colors.background }}>
      {/* Sidebar */}
      <div className="hidden md:flex fixed h-screen w-64 bg-gray-800 text-white flex-col z-40">
        {/* Logo */}
        <div className="p-6 flex items-center cursor-pointer" onClick={() => navigate('/home')}>
          <FaUtensils className="text-blue-400 mr-2 text-2xl" />
          <span className="text-xl font-bold">QuickServe</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 mt-6 px-4">
          {navItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Mobile Navbar */}
        <nav className="md:hidden flex items-center justify-between px-6 py-4 shadow-sm sticky top-0 z-30 bg-white border-b">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold flex items-center">
              <FaUtensils className="text-blue-600 mr-2 text-2xl" />
              <span className="text-black">QuickServe</span>
            </h1>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className={`p-2 rounded-lg transition-all duration-300 focus:outline-none ${
              isMenuOpen ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
            }`}
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
          
          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-30 z-20" onClick={toggleMenu} />
          )}
          
          {/* Mobile Menu */}
          <div className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white z-30 transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-6 flex items-center border-b border-gray-700">
              <FaUtensils className="text-blue-400 mr-2 text-2xl" />
              <span className="text-xl font-bold">QuickServe</span>
            </div>
            
            <nav className="p-4">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    toggleMenu();
                  }}
                  className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                    location.pathname === item.path 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </nav>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>Menu Management</h2>
            <p className="text-lg" style={{ color: colors.textLight }}>Manage your restaurant's menu items and categories</p>
          </div>

          {/* Search and Add Category */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                style={{ 
                  backgroundColor: colors.card,
                  borderColor: colors.border
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="px-3 py-2.5 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                style={{ 
                  backgroundColor: colors.card,
                  borderColor: colors.border
                }}
              />
              <button
                onClick={addCategory}
                className="px-4 py-2.5 rounded-lg flex items-center gap-2 text-white hover:bg-emerald-600 transition-colors"
                style={{ backgroundColor: colors.secondary }}
              >
                <FiPlus size={18} />
                Add Category
              </button>
            </div>
          </div>

          {/* Menu Categories */}
          <div className="space-y-6">
            {categories.map(category => {
              const categoryItems = filteredItems.filter(item => item.category === category.id);
              if (categoryItems.length === 0 && searchTerm) return null;
              
              return (
                <div 
                  key={category.id} 
                  className="rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{ 
                    backgroundColor: colors.card,
                    borderColor: colors.border
                  }}
                >
                  <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: colors.border }}>
                    <div>
                      <h3 className="text-xl font-semibold" style={{ color: colors.text }}>{category.name}</h3>
                      <p className="text-sm" style={{ color: colors.textLight }}>{category.description}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddItem(category.id)}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600"
                      >
                        <FiPlus size={18} />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Horizontal Scrollable Items */}
                  <div className="relative p-4">
                    {categoryItems.length > 0 ? (
                      <>
                        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                          {categoryItems.map(item => (
                            <div 
                              key={item.id} 
                              className="flex-shrink-0 w-64 rounded-lg border overflow-hidden transition-transform hover:scale-105"
                              style={{ 
                                backgroundColor: colors.card,
                                borderColor: colors.border
                              }}
                            >
                              <div className="h-40 bg-gray-100 overflow-hidden relative">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                  }}
                                />
                                <div className="absolute top-2 left-2 flex gap-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {item.isAvailable ? 'Available' : 'Unavailable'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="p-4">
                                {editingItemId === item.id ? (
                                  <div className="space-y-3">
                                    {/* Image URL Input */}
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiImage className="text-gray-400" />
                                      </div>
                                      <input
                                        type="text"
                                        value={newItemImage}
                                        onChange={(e) => handleImageChange(item.id, e.target.value)}
                                        placeholder="Image URL"
                                        className="block w-full pl-10 pr-3 py-2 border text-black rounded-lg text-sm"
                                        style={{ 
                                          backgroundColor: colors.card,
                                          borderColor: colors.border
                                        }}
                                      />
                                    </div>
                                    
                                    {/* Name Input */}
                                    <input
                                      type="text"
                                      value={item.name}
                                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                      placeholder="Item name"
                                      className="w-full px-3 py-2 text-black border rounded-lg text-sm font-medium"
                                      style={{ 
                                        backgroundColor: colors.card,
                                        borderColor: colors.border
                                      }}
                                    />
                                    
                                    {/* Description Input */}
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiInfo className="text-gray-400" />
                                      </div>
                                      <textarea
                                        value={item.description}
                                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                        placeholder="Item description"
                                        rows="2"
                                        className="block w-full pl-10 pr-3 py-2 border text-black rounded-lg text-sm"
                                        style={{ 
                                          backgroundColor: colors.card,
                                          borderColor: colors.border
                                        }}
                                      />
                                    </div>
                                    
                                    {/* Price and Options */}
                                    <div className="flex items-center justify-between">
                                      <div className="relative w-32">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                          <FiDollarSign className="text-gray-400" />
                                        </div>
                                        <input
                                          type="number"
                                          value={item.price}
                                          onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value))}
                                          placeholder="Price"
                                          className="block w-full pl-10 pr-3 py-2 border text-black rounded-lg text-sm"
                                          style={{ 
                                            backgroundColor: colors.card,
                                            borderColor: colors.border
                                          }}
                                        />
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleItemChange(item.id, 'isVeg', !item.isVeg)}
                                          className={`p-1 rounded-full ${item.isVeg ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}
                                        >
                                          {item.isVeg ? <FaLeaf size={16} /> : <FaCheese size={16} />}
                                        </button>
                                        <button
                                          onClick={() => handleItemChange(item.id, 'isAvailable', !item.isAvailable)}
                                          className={`p-1 rounded-full ${item.isAvailable ? 'text-blue-500 bg-blue-50' : 'text-gray-500 bg-gray-50'}`}
                                        >
                                          {item.isAvailable ? 'ON' : 'OFF'}
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex justify-between pt-2">
                                      <button
                                        onClick={cancelEdit}
                                        className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50"
                                        style={{ 
                                          borderColor: colors.border
                                        }}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => saveItem(item.id)}
                                        className="px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 text-white"
                                        style={{ backgroundColor: colors.primary }}
                                      >
                                        <FiSave size={14} />
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-medium text-lg" style={{ color: colors.text }}>{item.name}</h4>
                                      <p className="text-indigo-600 font-bold">₹{item.price}</p>
                                    </div>
                                    <p className="text-sm mb-3" style={{ color: colors.textLight }}>{item.description}</p>
                                    <div className="flex justify-between items-center">
                                      <div className="flex gap-1">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                          item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                          {item.isVeg ? 'Veg' : 'Non-Veg'}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                          item.isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {item.isAvailable ? 'Available' : 'Unavailable'}
                                        </span>
                                      </div>
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => {
                                            setEditingItemId(item.id);
                                            setNewItemImage(item.image);
                                          }}
                                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                                        >
                                          <FiEdit2 size={16} />
                                        </button>
                                        <button
                                          onClick={() => deleteItem(item.id)}
                                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                                        >
                                          <FiTrash2 size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center" style={{ color: colors.textLight }}>
                        <p>No items in this category</p>
                        <button
                          onClick={() => handleAddItem(category.id)}
                          className="mt-2 px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 mx-auto text-white"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <FiPlus size={14} />
                          Add First Item
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;