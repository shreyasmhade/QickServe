import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiShoppingBag, 
  FiHome, 
  FiDownload,
  FiUser,
  FiPhone,
  FiMapPin,
  FiClock,
  FiEye,
  FiArrowLeft,
  FiSearch,
  FiRefreshCw
} from 'react-icons/fi';

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

const OrdersHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const lastUpdateRef = useRef(null);

  // Load orders and restaurants from localStorage
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
      
      // Ensure storedOrders is an array
      const ordersArray = Array.isArray(storedOrders) ? storedOrders : [];
      
      // Sort orders by date (newest first)
      const sortedOrders = ordersArray.sort((a, b) => 
        new Date(b.orderDate) - new Date(a.orderDate)
        .filter(order => order.userDetails)); // Ensure we only show orders with userDetails
      
      setOrders(sortedOrders);
      setRestaurants(storedRestaurants);
      setIsLoading(false);
    };

    loadData();
    
    // Set up an event listener for storage changes to sync between tabs
    const handleStorageChange = (e) => {
      if (e.key === 'orders' || e.key === 'orderStatusUpdated') {
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
    return restaurants.find(restaurant => restaurant.id === id) || {};
  };

  // Filter by search query and status
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
      order.userDetails?.name?.toLowerCase().includes(searchTerm) ||
      order.totalAmount?.toString().includes(searchTerm)
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

  // Handle download receipt
  const handleDownloadReceipt = (order) => {
    if (!order) return;
    
    const restaurant = getRestaurantById(order.restaurantId);
    if (!restaurant) return;

    // Generate receipt content
    const receiptContent = `
      <html>
        <head>
          <title>Receipt #${order.orderDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .receipt { max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 15px; }
            .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .table th, .table td { padding: 5px; text-align: left; }
            .total { text-align: right; margin-top: 10px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>${restaurant.name || 'Restaurant'}</h2>
              <p>Receipt #${order.id || order.orderDate}</p>
              <p>${formatDate(order.orderDate)}</p>
            </div>
            
            <div>
              <p><strong>Customer:</strong> ${order.userDetails?.name || 'Customer'}</p>
              <p><strong>Order Type:</strong> ${order.orderType}</p>
              ${order.tableNumber ? `<p><strong>Table:</strong> ${order.tableNumber}</p>` : ''}
              <p><strong>Status:</strong> ${order.status || 'completed'}</p>
            </div>
            
            <table class="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total">
              <p>Total: ₹${order.totalAmount?.toFixed(2) || '0.00'}</p>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
              <p>Thank you for your order!</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Create and trigger download
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${order.id || order.orderDate}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const refreshOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const sortedOrders = storedOrders.sort((a, b) => 
      new Date(b.orderDate) - new Date(a.orderDate)
      .filter(order => order.userDetails));
    setOrders(sortedOrders);
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <button 
              onClick={() => navigate('/restaurants')}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              <span className="hidden sm:inline">Back to Restaurants</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshOrders}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Refresh orders"
            >
              <FiRefreshCw className={`text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by restaurant, date, time, name, or amount"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="flex space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base text-black border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-medium text-gray-600 mb-2">
              {searchQuery || filterStatus !== 'all' ? "No matching orders found" : "No orders yet"}
            </h2>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterStatus !== 'all' 
                ? "Try adjusting your search or filter criteria" 
                : "You haven't placed any orders yet. Start exploring restaurants!"}
            </p>
            <button 
              onClick={() => navigate('/restaurants')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Explore Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const restaurant = getRestaurantById(order.restaurantId);
              
              return (
                <div key={order.id || order.orderDate} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {restaurant?.name || "Restaurant"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status || 'completed'} />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium text-black">{order.id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Items:</span>
                      <span className="text-black">{order.items.length}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium mb-3">
                      <span className="text-gray-600">Total:</span>
                      <span className="text-black">₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                    
                    <div className="flex justify-between space-x-3 mt-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowReceipt(true);
                        }}
                        className="flex-1 flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                      >
                        <FiEye className="mr-2" />
                        View Details
                      </button>
                      
                      <button
                        onClick={() => handleDownloadReceipt(order)}
                        className="flex-1 flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                      >
                        <FiDownload className="mr-2" />
                        Receipt
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Order Details Modal */}
      {selectedOrder && showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Order from {getRestaurantById(selectedOrder.restaurantId)?.name || "Restaurant"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(selectedOrder.orderDate)}
                </p>
              </div>
              <button
                onClick={() => setShowReceipt(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 space-y-4 text-black">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Status</h4>
                <OrderStatusBadge status={selectedOrder.status || 'completed'} />
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Item</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Qty</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="px-4 py-2 text-sm">
                            {item.name}
                            {item.specialInstructions && (
                              <p className="text-xs text-black mt-1">Note: {item.specialInstructions}</p>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-gray-200 font-medium">
                        <td colSpan={2} className="px-4 py-2 text-right">Total:</td>
                        <td className="px-4 py-2 text-right">₹{selectedOrder.totalAmount?.toFixed(2) || '0.00'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Customer Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Name:</div>
                  <div>{selectedOrder.userDetails?.name || 'N/A'}</div>
                  
                  <div className="text-gray-500">Phone:</div>
                  <div>{selectedOrder.userDetails?.phone || 'N/A'}</div>
                  
                  <div className="text-gray-500">Order Type:</div>
                  <div>{selectedOrder.orderType}</div>
                  
                  {selectedOrder.tableNumber && (
                    <>
                      <div className="text-gray-500">Table:</div>
                      <div>{selectedOrder.tableNumber}</div>
                    </>
                  )}
                  
                  {selectedOrder.deliveryAddress && (
                    <>
                      <div className="text-gray-500">Address:</div>
                      <div>{selectedOrder.deliveryAddress}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowReceipt(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              
              <button
                onClick={() => {
                  handleDownloadReceipt(selectedOrder);
                  setShowReceipt(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <FiDownload className="mr-2" />
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersHistory;