import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiShoppingBag, 
  FiHome, 
  FiUser,
  FiPhone,
  FiMapPin,
  FiClock,
  FiArrowLeft,
  FiSearch,
  FiDollarSign,
  FiActivity,
  FiList, 
  FiGrid, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiChevronLeft, 
  FiChevronRight, 
  FiSave,
  FiImage, 
  FiInfo
} from 'react-icons/fi';
import { FaUtensils, FaLeaf, FaCheese } from 'react-icons/fa';

const OrderStatusBadge = ({ status }) => {
  const statusClasses = {
    pending: 'bg-amber-100 text-amber-800',
    preparing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    delivered: 'bg-purple-100 text-purple-800'
  };

  const statusText = {
    pending: 'Pending',
    preparing: 'Preparing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    delivered: 'Delivered'
  };

  return (
    <div className="flex items-center">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [metrics, setMetrics] = useState({
    activeOrders: 0,
    todaysRevenue: 0,
    totalOrders: 0,
    todaysOrders: 0
  });
  const lastUpdateRef = useRef(null);

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

  // Navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
    { path: '/menu-management', label: 'Menu Management', icon: <FiList size={20} /> },
    { path: '/order-management', label: 'Orders', icon: <FiShoppingBag size={20} /> },
    { path: '/table-management', label: 'Table Management', icon: <FiGrid size={20} /> },
    { path: '/admin-profile', label: 'Profile', icon: <FiUser size={20} /> },
    { path: '/logout', label: 'Logout', icon: <FiLogOut size={20} /> }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Calculate dashboard metrics including both active orders and order history
  const calculateMetrics = (activeOrders, historyOrders) => {
    const today = new Date().toDateString();
    const allOrders = [...activeOrders, ...historyOrders];
    
    // Filter today's orders from both active and history
    const todayOrders = allOrders.filter(order => 
      new Date(order.orderDate || order.createdAt).toDateString() === today
    );
    
    const activeOrdersCount = activeOrders.filter(order => 
      ['pending', 'preparing'].includes(order.status)
    ).length;
    
    const todaysRevenue = todayOrders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0);
    
    return {
      activeOrders: activeOrdersCount,
      todaysRevenue,
      totalOrders: allOrders.length,
      todaysOrders: todayOrders.length
    };
  };

  // Function to move completed orders to order history after 1 minute
  const moveCompletedOrders = (ordersList) => {
    const now = new Date();
    const updatedOrders = ordersList.filter(order => {
      if (order.status === 'completed') {
        const completionTime = new Date(order.completionTime || order.orderDate);
        const timeDiff = now - completionTime;
        return timeDiff < 60000; // Keep in dashboard if less than 1 minute
      }
      return true;
    });

    // Get orders that need to be moved to history
    const ordersToMove = ordersList.filter(order => 
      order.status === 'completed' && 
      (now - new Date(order.completionTime || order.orderDate)) >= 60000
    );

    // Add to order history if there are orders to move
    if (ordersToMove.length > 0) {
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const updatedHistory = [...orderHistory, ...ordersToMove];
      localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
      setOrderHistory(updatedHistory);
      
      // Calculate metrics including the moved orders before they're removed
      const metricsBeforeMove = calculateMetrics(ordersList, updatedHistory);
      setMetrics(metricsBeforeMove);
    }

    return updatedOrders;
  };

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      
      // Load active orders
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const filteredOrders = moveCompletedOrders(storedOrders);
      
      // Sort orders by date (newest first)
      const sortedOrders = filteredOrders.sort((a, b) => 
        new Date(b.orderDate) - new Date(a.orderDate)
      );
      
      setOrders(sortedOrders);
      
      // Save the filtered orders back to localStorage
      localStorage.setItem('orders', JSON.stringify(sortedOrders));
      
      // Load order history
      const storedHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      setOrderHistory(storedHistory);
      
      // Update metrics based on all orders (active + history)
      const newMetrics = calculateMetrics(sortedOrders, storedHistory);
      setMetrics(newMetrics);
      
      // Load restaurants
      const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
      setRestaurants(storedRestaurants);
      
      // Load current admin and restaurant name
      const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
      if (currentAdmin) {
        const restaurant = storedRestaurants.find(r => r.id === currentAdmin.restaurantId);
        if (restaurant) {
          setRestaurantName(restaurant.name);
        }
      }
      
      setIsLoading(false);
    };

    loadData();
    
    // Set up an event listener for storage changes to sync between tabs
    const handleStorageChange = (e) => {
      if (e.key === 'orders' || e.key === 'orderHistory' || e.key === 'orderStatusUpdated') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Set up polling for same-tab updates (fallback)
    const intervalId = setInterval(() => {
      const lastUpdate = localStorage.getItem('orderStatusUpdated');
      if (lastUpdate !== lastUpdateRef.current) {
        lastUpdateRef.current = lastUpdate;
        loadData();
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // Get restaurant by ID
  const getRestaurantById = (id) => {
    return restaurants.find(restaurant => restaurant.id === id);
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const restaurant = getRestaurantById(order.restaurantId);
    const searchTerm = searchQuery.toLowerCase();
    
    // Status filter
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }
    
    // Create searchable date strings
    const orderDate = new Date(order.orderDate);
    const dateString = orderDate.toLocaleDateString();
    const timeString = orderDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const orderMonth = orderDate.toLocaleString('default', { month: 'long' }).toLowerCase();
    const orderDay = orderDate.getDate().toString();
    const orderYear = orderDate.getFullYear().toString();

    return (
      (restaurant?.name?.toLowerCase().includes(searchTerm)) ||
      dateString.includes(searchTerm) ||
      timeString.includes(searchTerm) ||
      orderMonth.includes(searchTerm) ||
      orderDay.includes(searchTerm) ||
      orderYear.includes(searchTerm) ||
      order.id?.toLowerCase().includes(searchTerm) ||
      (order.userDetails?.name?.toLowerCase().includes(searchTerm)) ||
      order.totalAmount.toString().includes(searchTerm)
    );
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.orderDate === orderId || order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        if (newStatus === 'completed') {
          updatedOrder.completionTime = new Date().toISOString();
        }
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    localStorage.setItem('orderStatusUpdated', Date.now().toString());
    
    // Recalculate metrics after status update
    const newMetrics = calculateMetrics(updatedOrders, orderHistory);
    setMetrics(newMetrics);
  };

  // Get next status in progression
  const getNextStatus = (currentStatus) => {
    switch(currentStatus) {
      case 'pending':
        return 'preparing';
      case 'preparing':
        return 'completed';
      default:
        return currentStatus;
    }
  };

  // Handle status update button click
  const handleStatusUpdate = (order) => {
    const nextStatus = getNextStatus(order.status || 'pending');
    updateOrderStatus(order.orderDate || order.id, nextStatus);
  };

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
            <div className="mb-8">
    <h2 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
      {restaurantName ? `Welcome, ${restaurantName}` : 'Admin Dashboard'}
    </h2>
    <p className="text-lg" style={{ color: colors.textLight }}>
      View and manage restaurant operations, menus, and customer data
    </p>
  </div>
          
          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="rounded-lg shadow-sm p-4" style={{ backgroundColor: colors.card }}>
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                  <FiActivity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Active Orders</p>
                  <p className="text-2xl font-semibold" style={{ color: colors.text }}>{metrics.activeOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg shadow-sm p-4" style={{ backgroundColor: colors.card }}>
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>
                  <FiDollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Today's Revenue</p>
                  <p className="text-2xl font-semibold" style={{ color: colors.text }}>₹{metrics.todaysRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg shadow-sm p-4" style={{ backgroundColor: colors.card }}>
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: `${colors.info}20`, color: colors.info }}>
                  <FiShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Today's Orders</p>
                  <p className="text-2xl font-semibold" style={{ color: colors.text }}>{metrics.todaysOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg shadow-sm p-4" style={{ backgroundColor: colors.card }}>
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: `${colors.primaryLight}20`, color: colors.primaryLight }}>
                  <FiCheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Total Orders</p>
                  <p className="text-2xl font-semibold" style={{ color: colors.text }}>{metrics.totalOrders}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Orders Section */}
          <div className="rounded-xl shadow-sm overflow-hidden mb-6" style={{ backgroundColor: colors.card }}>
            <div className="p-4 border-b" style={{ borderColor: colors.border }}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search orders by restaurant, date, customer, or amount"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      focusRingColor: colors.primaryLight
                    }}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      focusRingColor: colors.primaryLight
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="completed">Completed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 rounded-lg shadow-sm" style={{ backgroundColor: colors.card }}>
              <h2 className="text-xl font-medium mb-2" style={{ color: colors.text }}>
                {searchQuery || filterStatus !== 'all' ? "No matching orders found" : "No orders yet"}
              </h2>
              <p className="mb-4" style={{ color: colors.textLight }}>
                {searchQuery || filterStatus !== 'all' 
                  ? "Try adjusting your search or filter criteria" 
                  : "No orders have been placed yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-sm" style={{ backgroundColor: colors.card }}>
              <table className="min-w-full divide-y" style={{ borderColor: colors.border }}>
                <thead style={{ backgroundColor: colors.background }}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Order</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Restaurant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: colors.border }}>
                  {filteredOrders.map((order) => {
                    const restaurant = getRestaurantById(order.restaurantId);
                    const canUpdateStatus = ['pending', 'preparing'].includes(order.status);
                    
                    return (
                      <tr key={order.orderDate} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: colors.text }}>
                          #{order.id || order.orderDate.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.text }}>
                          {restaurant?.name || "Restaurant"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.text }}>
                          {order.userDetails?.name || "Customer"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.text }}>
                          {formatDate(order.orderDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.text }}>
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.text }}>
                          <OrderStatusBadge status={order.status || 'completed'} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleStatusUpdate(order)}
                            disabled={!canUpdateStatus}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              canUpdateStatus 
                                ? 'text-white hover:bg-indigo-700' 
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                            style={{ 
                              backgroundColor: canUpdateStatus ? colors.primary : colors.border
                            }}
                          >
                            {canUpdateStatus ? 'Next Status' : 'Completed'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Order Details Modal */}
        {selectedOrder && showOrderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: colors.card }}>
              <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
                <div>
                  <h3 className="text-lg font-medium" style={{ color: colors.text }}>
                    Order #{selectedOrder.id || selectedOrder.orderDate.slice(0, 8)}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                    {formatDate(selectedOrder.orderDate)}
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  style={{ color: colors.textLight }}
                  className="hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 space-y-4" style={{ color: colors.text }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium" style={{ color: colors.textLight }}>Restaurant</h4>
                    <p>{getRestaurantById(selectedOrder.restaurantId)?.name || "Restaurant"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: colors.textLight }}>Customer</h4>
                    <p>{selectedOrder.userDetails?.name || "Customer"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: colors.textLight }}>Order Type</h4>
                    <p>{selectedOrder.orderType}</p>
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: colors.textLight }}>Total Amount</h4>
                    <p>₹{selectedOrder.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Items</h4>
                  <div className="border rounded-lg overflow-hidden" style={{ borderColor: colors.border }}>
                    <table className="w-full">
                      <thead style={{ backgroundColor: colors.background }}>
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium" style={{ color: colors.textLight }}>Item</th>
                          <th className="px-4 py-2 text-left text-sm font-medium" style={{ color: colors.textLight }}>Qty</th>
                          <th className="px-4 py-2 text-right text-sm font-medium" style={{ color: colors.textLight }}>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index} className="border-t" style={{ borderColor: colors.border }}>
                            <td className="px-4 py-2 text-sm">
                              {item.name}
                              {item.specialInstructions && (
                                <p className="text-xs mt-1" style={{ color: colors.textLight }}>Note: {item.specialInstructions}</p>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr className="border-t font-medium" style={{ borderColor: colors.border }}>
                          <td colSpan={2} className="px-4 py-2 text-right">Total:</td>
                          <td className="px-4 py-2 text-right">₹{selectedOrder.totalAmount.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <div className="flex items-center space-x-4">
                    <OrderStatusBadge status={selectedOrder.status || 'pending'} />
                    <button
                      onClick={() => {
                        const nextStatus = getNextStatus(selectedOrder.status || 'pending');
                        if (['pending', 'preparing'].includes(selectedOrder.status)) {
                          updateOrderStatus(selectedOrder.orderDate || selectedOrder.id, nextStatus);
                          setSelectedOrder({
                            ...selectedOrder,
                            status: nextStatus
                          });
                        }
                      }}
                      disabled={!['pending', 'preparing'].includes(selectedOrder.status)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        ['pending', 'preparing'].includes(selectedOrder.status)
                          ? 'text-white hover:bg-indigo-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      style={{ 
                        backgroundColor: ['pending', 'preparing'].includes(selectedOrder.status) 
                          ? colors.primary 
                          : colors.border
                      }}
                    >
                      {['pending', 'preparing'].includes(selectedOrder.status) 
                        ? 'Mark as ' + getNextStatus(selectedOrder.status)
                        : 'Completed'}
                    </button>
                  </div>
                </div>
                
                {selectedOrder.userDetails && (
                  <div>
                    <h4 className="font-medium mb-2">Customer Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div style={{ color: colors.textLight }}>Name:</div>
                      <div>{selectedOrder.userDetails.name}</div>
                      
                      {selectedOrder.userDetails.phone && (
                        <>
                          <div style={{ color: colors.textLight }}>Phone:</div>
                          <div>{selectedOrder.userDetails.phone}</div>
                        </>
                      )}
                      
                      {selectedOrder.tableNumber && (
                        <>
                          <div style={{ color: colors.textLight }}>Table:</div>
                          <div>{selectedOrder.tableNumber}</div>
                        </>
                      )}
                      
                      {selectedOrder.deliveryAddress && (
                        <>
                          <div style={{ color: colors.textLight }}>Address:</div>
                          <div>{selectedOrder.deliveryAddress}</div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t flex justify-end" style={{ borderColor: colors.border }}>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.text
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;