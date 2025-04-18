import React, { useState, useEffect } from 'react';
import { 
  FiHome, FiList, FiShoppingBag, FiGrid, FiUser, FiLogOut, FiMenu, FiX,
  FiSearch, FiFilter, FiChevronDown, FiClock, FiDollarSign, FiInfo
} from 'react-icons/fi';
import { FaUtensils } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

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

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('completed');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Load order history from localStorage
  useEffect(() => {
    const loadOrderHistory = () => {
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      setOrders(orderHistory);
    };

    loadOrderHistory();

    // Set up an event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'orderHistory') {
        loadOrderHistory();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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

  // Filter orders by search term, type and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.userDetails?.name && order.userDetails.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.orderDate && order.orderDate.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = 
      typeFilter === 'all' || 
      (order.orderType === typeFilter) || 
      (order.type === typeFilter);
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (order.status === statusFilter);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sorting orders - newest first
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return new Date(b.orderDate || b.createdAt).getTime() - new Date(a.orderDate || a.createdAt).getTime();
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount).replace('₹', '₹');
  };

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
            <h2 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>Order History</h2>
            <p className="text-lg" style={{ color: colors.textLight }}>View all completed customer orders</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by order ID, customer name, or date"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                style={{ 
                  backgroundColor: colors.card,
                  borderColor: colors.border
                }}
              />
            </div>
            
            <div className="flex gap-2">
              {/* Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  style={{ 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                >
                  <option value="all">All Types</option>
                  <option value="eat-in">Eat-In</option>
                  <option value="pre-order">Pre-Order</option>
                  <option value="takeaway">Takeaway</option>
                  <option value="delivery">Delivery</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  style={{ 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Orders List */}
          {sortedOrders.length === 0 ? (
            <div 
              className="text-center py-12 rounded-lg"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: '1px'
              }}
            >
              <h2 className="text-xl font-medium mb-2" style={{ color: colors.text }}>No orders found</h2>
              <p style={{ color: colors.textLight }}>
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try different search terms or filters' 
                  : 'Completed orders will appear here after 1 minute'}
              </p>
            </div>
          ) : (
            <div 
              className="rounded-xl border overflow-hidden"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottomColor: colors.border }}>
                      <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: colors.text }}>Order ID</th>
                      <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: colors.text }}>Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: colors.text }}>Type</th>
                      <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: colors.text }}>Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: colors.text }}>Table</th>
                      <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: colors.text }}>Items</th>
                      <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: colors.text }}>Total</th>
                      <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: colors.text }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOrders.map((order) => (
                      <tr 
                        key={order.id || order.orderDate} 
                        style={{ borderBottomColor: colors.border }}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium" style={{ color: colors.text }}>
                          #{order.id ? order.id.split('-')[1] : order.orderDate.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium" style={{ color: colors.text }}>
                              {order.customerName || order.userDetails?.name || 'Customer'}
                            </div>
                            {order.customerContact && (
                              <div className="text-sm" style={{ color: colors.textLight }}>
                                {order.customerContact}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className="px-2 py-1 text-xs rounded-full"
                            style={{ 
                              backgroundColor: colors.primary + '10',
                              color: colors.primary,
                              border: `1px solid ${colors.primary}`
                            }}
                          >
                            {order.type === 'eat-in' ? 'Eat-In' : 
                             order.type === 'pre-order' ? 'Pre-Order' : 
                             order.type === 'takeaway' ? 'Takeaway' : 
                             order.orderType === 'eat-in' ? 'Eat-In' :
                             order.orderType === 'delivery' ? 'Delivery' : 
                             order.orderType === 'takeaway' ? 'Takeaway' : 'Order'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <OrderStatusBadge status={order.status || 'completed'} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                          {order.tableNumber ? `Table ${order.tableNumber}` : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                          {order.items ? order.items.length : 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                          {formatCurrency(order.totalAmount || order.total || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                          {formatDate(order.orderDate || order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
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
                  {formatDate(selectedOrder.orderDate || selectedOrder.createdAt)}
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
                  <h4 className="font-medium" style={{ color: colors.textLight }}>Customer</h4>
                  <p>{selectedOrder.customerName || selectedOrder.userDetails?.name || 'Customer'}</p>
                </div>
                <div>
                  <h4 className="font-medium" style={{ color: colors.textLight }}>Order Type</h4>
                  <p>
                    {selectedOrder.type === 'eat-in' ? 'Eat-In' : 
                     selectedOrder.type === 'pre-order' ? 'Pre-Order' : 
                     selectedOrder.type === 'takeaway' ? 'Takeaway' : 
                     selectedOrder.orderType === 'eat-in' ? 'Eat-In' :
                     selectedOrder.orderType === 'delivery' ? 'Delivery' : 
                     selectedOrder.orderType === 'takeaway' ? 'Takeaway' : 'Order'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium" style={{ color: colors.textLight }}>Status</h4>
                  <OrderStatusBadge status={selectedOrder.status || 'completed'} />
                </div>
                <div>
                  <h4 className="font-medium" style={{ color: colors.textLight }}>Total Amount</h4>
                  <p>{formatCurrency(selectedOrder.totalAmount || selectedOrder.total || 0)}</p>
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
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index} className="border-t" style={{ borderColor: colors.border }}>
                          <td className="px-4 py-2 text-sm">
                            {item.name}
                            {item.specialInstructions && (
                              <p className="text-xs mt-1" style={{ color: colors.textLight }}>Note: {item.specialInstructions}</p>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                      <tr className="border-t font-medium" style={{ borderColor: colors.border }}>
                        <td colSpan={2} className="px-4 py-2 text-right">Total:</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(selectedOrder.totalAmount || selectedOrder.total || 0)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Additional Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {selectedOrder.tableNumber && (
                    <>
                      <div style={{ color: colors.textLight }}>Table Number:</div>
                      <div>Table {selectedOrder.tableNumber}</div>
                    </>
                  )}
                  
                  {selectedOrder.customerContact && (
                    <>
                      <div style={{ color: colors.textLight }}>Contact:</div>
                      <div>{selectedOrder.customerContact}</div>
                    </>
                  )}
                  
                  {selectedOrder.deliveryAddress && (
                    <>
                      <div style={{ color: colors.textLight }}>Delivery Address:</div>
                      <div>{selectedOrder.deliveryAddress}</div>
                    </>
                  )}
                  
                  {selectedOrder.completionTime && (
                    <>
                      <div style={{ color: colors.textLight }}>Completed At:</div>
                      <div>{formatDate(selectedOrder.completionTime)}</div>
                    </>
                  )}
                </div>
              </div>
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
  );
};

export default OrderManagement;