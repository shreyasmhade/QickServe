import React, { useState, useEffect } from 'react';
import { 
  FiHome, FiSearch, FiShoppingCart, FiPlus, FiMinus, 
  FiArrowLeft, FiX, FiTrash2, FiClock, FiStar, 
  FiInfo, FiCheck, FiFilter
} from 'react-icons/fi';
import { FaStar, FaUtensils, FaLeaf, FaCheese, FaHamburger } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    veg: false,
    nonVeg: false,
    available: true
  });

  // Color palette
  const colors = {
    primary: '#4F46E5',
    primaryLight: '#6366F1',
    secondary: '#10B981',
    accent: '#FF914D',
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#333333',
    textLight: '#666666',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    veg: '#10B981',
    nonVeg: '#EF4444'
  };

  // Load restaurant and menu data
  useEffect(() => {
    if (!id) {
      navigate('/restaurants');
      return;
    }
  
    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const foundRestaurant = restaurants.find(r => r.id === id);
    
    if (!foundRestaurant) {
      navigate('/restaurants');
      return;
    }
  
    setRestaurant(foundRestaurant);
    setMenuItems(foundRestaurant.menuItems || []);
    setCategories(foundRestaurant.categories || []);
  
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const restaurantCartItems = savedCartItems.filter(item => item.restaurantId === id);
    setCartItems(restaurantCartItems);
  }, [id, navigate]);
  
  // Sync cart items to localStorage
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const otherRestaurantItems = savedCartItems.filter(item => item.restaurantId !== id);
      localStorage.setItem('cartItems', JSON.stringify(otherRestaurantItems));
    }
  }, [cartItems, id]);

  // Toggle filters
  const toggleFilter = (filter) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  // Filter menu items based on search and active filters
  const filteredItems = menuItems.filter(item => {
    // Search filter
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Veg/Non-veg filters
    let matchesVegFilter = true;
    if (activeFilters.veg && !activeFilters.nonVeg) {
      matchesVegFilter = item.isVeg;
    } else if (activeFilters.nonVeg && !activeFilters.veg) {
      matchesVegFilter = !item.isVeg;
    }
    
    // Availability filter
    const matchesAvailability = activeFilters.available ? item.isAvailable : true;
    
    return matchesSearch && matchesVegFilter && matchesAvailability;
  });

  // Categorize menu items with proper category names
  const categorizedMenu = filteredItems.reduce((acc, item) => {
    // Find the category name by matching the category ID
    const category = categories.find(cat => cat.id === item.category);
    const categoryName = category ? category.name : 'Uncategorized';
    
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {});

  // Cart functions
  const addToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { 
        ...item, 
        quantity: 1, 
        restaurantId: id,
        isVeg: item.isVeg
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(i => 
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const removeItemCompletely = (itemId) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateGST = () => {
    return getCartTotal() * 0.05;
  };

  const getGrandTotal = () => {
    return getCartTotal() + calculateGST();
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <h2 className="text-xl font-medium" style={{ color: colors.text }}>Loading restaurant...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen flex" style={{ backgroundColor: colors.background }}>
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCartOpen ? 'mr-80' : ''}`}>
        {/* Restaurant Header */}
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `url(${restaurant.image || 'https://via.placeholder.com/800x400?text=Restaurant'})` 
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="p-6 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <button 
                    onClick={() => navigate('/restaurants')}
                    className="p-2 rounded-full mb-2" 
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <FiArrowLeft size={20} className="text-white" />
                  </button>
                  <h1 className="text-2xl font-bold text-white">{restaurant.name}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
                      <FaStar size={12} className="mr-1" />
                      <span>{restaurant.rating || '4.5'}</span>
                    </div>
                    <span className="text-sm text-white opacity-90">{restaurant.cuisine}</span>
                    <span className="text-sm text-white opacity-90 flex items-center gap-1">
                      <FiClock size={12} />
                      {restaurant.deliveryTime || '30-45 min'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="relative p-2 rounded-full" 
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <FiShoppingCart size={20} className="text-white" />
                    {getTotalItems() > 0 && (
                      <span 
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: colors.secondary, color: 'white' }}
                      >
                        {getTotalItems()}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Content */}
        <div className="p-4 max-w-6xl mx-auto">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search menu items..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  focusRingColor: colors.primaryLight
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleFilter('veg')}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 border transition-colors ${activeFilters.veg ? 'bg-green-50 border-green-200 text-green-800' : 'bg-white border-gray-200 text-gray-700'}`}
              >
                <FaLeaf size={14} className={activeFilters.veg ? 'text-green-600' : 'text-gray-500'} />
                Veg
              </button>
              <button
                onClick={() => toggleFilter('nonVeg')}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 border transition-colors ${activeFilters.nonVeg ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white border-gray-200 text-gray-700'}`}
              >
                <FaHamburger size={14} className={activeFilters.nonVeg ? 'text-red-600' : 'text-gray-500'} />
                Non-Veg
              </button>
              <button
                onClick={() => toggleFilter('available')}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 border transition-colors ${activeFilters.available ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-white border-gray-200 text-gray-700'}`}
              >
                <FiCheck size={14} className={activeFilters.available ? 'text-blue-600' : 'text-gray-500'} />
                Available Only
              </button>
            </div>
          </div>

          {/* Menu Categories */}
          {Object.keys(categorizedMenu).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(categorizedMenu).map(([categoryName, items]) => (
                <div key={categoryName} className="mb-8">
                  <h2 className="text-2xl font-bold mb-6 pb-2 border-b" style={{ 
                    color: colors.text, 
                    borderColor: colors.border 
                  }}>
                    {categoryName}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                      <div 
                        key={item.id} 
                        className="rounded-xl p-4 transition-all hover:shadow-lg"
                        style={{ 
                          backgroundColor: colors.card,
                          border: `1px solid ${colors.border}`,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          width: '100%',
                          maxWidth: '350px',
                          margin: '0 auto'
                        }}
                      >
                        {/* Food Image */}
                        <div className="w-full h-48 rounded-lg overflow-hidden relative">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/350x180?text=No+Image';
                            }}
                          />
                          {/* Veg/Non-Veg Badge */}
                          <span className={`absolute top-3 left-3 p-1.5 rounded-full ${item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.isVeg ? (
                              <FaLeaf size={14} />
                            ) : (
                              <FaHamburger size={14} />
                            )}
                          </span>
                          {/* Availability Badge */}
                          {!item.isAvailable && (
                            <span className="absolute top-3 right-3 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                              Unavailable
                            </span>
                          )}
                        </div>

                        {/* Food Details */}
                        <div className="mt-4 flex flex-col gap-2">
                          <h3 className="text-xl font-semibold" style={{ color: colors.text }}>
                            {item.name}
                          </h3>
                          
                          {item.description && (
                            <p 
                              className="text-sm" 
                              style={{ 
                                color: colors.textLight,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                          
                          <div className="mt-3 flex justify-between items-center">
                            <p className="text-lg font-bold" style={{ color: colors.primary }}>
                              ₹{item.price}
                            </p>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item);
                              }}
                              className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50"
                              style={{ 
                                backgroundColor: item.isAvailable ? colors.accent : colors.border,
                                color: 'white',
                                minWidth: '100px'
                              }}
                              disabled={!item.isAvailable}
                            >
                              {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FiSearch size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium mb-2" style={{ color: colors.text }}>No menu items found</h3>
              <p className="text-sm" style={{ color: colors.textLight }}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-10
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ borderLeft: `1px solid ${colors.border}` }}
      >
        <div className="h-full flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>Your Order</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div 
                    key={item.id} 
                    className="rounded-lg border p-3 flex items-start gap-3"
                    style={{ 
                      backgroundColor: colors.background,
                      borderColor: colors.border
                    }}
                  >
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                      <span className={`absolute top-1 left-1 p-1 rounded-full ${item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.isVeg ? (
                          <FaLeaf size={10} />
                        ) : (
                          <FaHamburger size={10} />
                        )}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium" style={{ color: colors.text }}>{item.name}</h3>
                        <span className="font-medium" style={{ color: colors.primary }}>₹{item.price * item.quantity}</span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center gap-2 border rounded-full px-2 py-1" style={{ borderColor: colors.border }}>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-1"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span style={{ color: colors.text }} className="text-sm">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="p-1"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItemCompletely(item.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FiShoppingCart size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors.text }}>Your cart is empty</h3>
                <p className="text-sm" style={{ color: colors.textLight }}>Add items to get started</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border-t p-4" style={{ borderColor: colors.border }}>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{ color: colors.textLight }}>Subtotal</span>
                <span style={{ color: colors.text }}>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: colors.textLight }}>GST (5%)</span>
                <span style={{ color: colors.text }}>₹{calculateGST().toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span style={{ color: colors.text }}>Total</span>
                <span style={{ color: colors.primary }}>₹{getGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                if (cartItems.length > 0) {
                  localStorage.setItem('cartItems', JSON.stringify(cartItems));
                  navigate(`/checkout/${restaurant.id}`);
                }
              }}
              className="w-full py-3 rounded-lg font-bold text-center transition-all hover:scale-[1.01]"
              style={{ 
                backgroundColor: cartItems.length > 0 ? colors.primary : colors.border,
                color: 'white'
              }}
              disabled={cartItems.length === 0}
            >
              {cartItems.length > 0 ? `Place Order (₹${getGrandTotal().toFixed(2)})` : 'Add Items to Order'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cart Summary (Fixed at bottom) */}
      {!isCartOpen && getTotalItems() > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 border-t shadow-lg" style={{ 
          backgroundColor: colors.card,
          borderColor: colors.border
        }}>
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold" style={{ color: colors.primary }}>
                ₹{getGrandTotal().toFixed(2)}
              </span>
              <span className="block text-xs" style={{ color: colors.textLight }}>
                {getTotalItems()} items • {restaurant.deliveryTime || '30-45 min'}
              </span>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
              style={{ 
                backgroundColor: colors.primary,
                color: 'white'
              }}
            >
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;