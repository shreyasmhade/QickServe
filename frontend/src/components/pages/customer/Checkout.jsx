import React, { useState, useEffect } from 'react';
import { 
  FiArrowLeft, FiUser, FiPhone, FiMapPin, FiClock, FiMail 
} from 'react-icons/fi';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [orderType, setOrderType] = useState('Home Delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [availableTables, setAvailableTables] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

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
    error: '#EF4444',
    success: '#10B981'
  };

  // Load cart items, restaurant data, and tables
  useEffect(() => {
    if (!id) {
      navigate('/restaurants');
      return;
    }

    // Load restaurant data
    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const foundRestaurant = restaurants.find(r => r.id === id);
    
    if (!foundRestaurant) {
      console.error('Restaurant not found with ID:', id);
      navigate('/restaurants');
      return;
    }

    setRestaurant(foundRestaurant);

    // Load cart items
    let itemsToSet = [];
    if (location.state?.cartItems) {
      itemsToSet = location.state.cartItems;
    } else {
      const allCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      itemsToSet = allCartItems.filter(item => item.restaurantId === id);
    }

    if (itemsToSet.length === 0) {
      console.warn('No cart items found for restaurant:', id);
    }
    setCartItems(itemsToSet);

    // Load user details
    const user = JSON.parse(localStorage.getItem('user')) || {
      name: 'John Doe',
      phone: '9876543210',
      email: 'john@example.com'
    };
    setUserDetails(user);

    // Load available tables for this restaurant
    const tables = foundRestaurant.tables || [];
    setAvailableTables(tables.filter(table => table.status === 'free'));
  }, [id, navigate, location.state]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDeliveryFee = () => {
    return getCartTotal() > 200 ? 0 : 40;
  };

  const calculateGST = () => {
    return getCartTotal() * 0.05; // 5% GST
  };

  const getGrandTotal = () => {
    return getCartTotal() + calculateDeliveryFee() + calculateGST();
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (['Eat-in', 'Pre-order'].includes(orderType) && !selectedTable) {
      alert('Please select a table');
      return;
    }

    if (orderType === 'Home Delivery' && !deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }

    // Create order object
    const order = {
      restaurantId: id,
      restaurantName: restaurant?.name,
      items: cartItems,
      userDetails,
      orderType,
      deliveryAddress: orderType === 'Home Delivery' ? deliveryAddress : null,
      tableNumber: ['Eat-in', 'Pre-order'].includes(orderType) ? selectedTable : null,
      specialInstructions,
      totalAmount: getGrandTotal(),
      status: 'pending',
      orderDate: new Date().toISOString()
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...orders, order]));

    // Update table status if Eat-in or Pre-order
    if (['Eat-in', 'Pre-order'].includes(orderType)) {
      const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
      const updatedRestaurants = restaurants.map(r => {
        if (r.id === id) {
          const updatedTables = r.tables?.map(table => 
            table.id === selectedTable 
              ? { 
                  ...table, 
                  status: orderType === 'Eat-in' ? 'booked' : 'reserved' 
                } 
              : table
          ) || [];
          return { ...r, tables: updatedTables };
        }
        return r;
      });
      localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
    }

    // Clear cart for this restaurant
    const allCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const otherRestaurantItems = allCartItems.filter(item => item.restaurantId !== id);
    localStorage.setItem('cartItems', JSON.stringify(otherRestaurantItems));

    // Navigate to order confirmation with order data
    navigate(`/order-confirmation/${order.orderDate}`, { state: { order } });
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <h2 className="text-xl font-medium" style={{ color: colors.text }}>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div 
        className="h-40 bg-cover bg-center relative"
        style={{ 
          backgroundImage: `url(${restaurant.image || 'https://via.placeholder.com/800x400?text=Restaurant'})` 
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="p-6 w-full">
            <div className="flex justify-between items-end">
              <div>
                <button 
                  onClick={() => navigate(`/restaurant/${id}`)}
                  className="p-2 rounded-full mb-2" 
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <FiArrowLeft size={20} className="text-white" />
                </button>
                <h1 className="text-2xl font-bold text-white">Checkout</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-white opacity-90">{restaurant.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-6 lg:flex lg:gap-8">
        {/* Order Details Form - Left Side */}
        <div className="lg:w-2/3 mb-8 lg:mb-0">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ borderColor: colors.border }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center border-b pb-2" style={{ borderColor: colors.border }}>
                <FiUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="flex-1 text-black outline-none"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                  required
                />
              </div>
              <div className="flex items-center border-b pb-2" style={{ borderColor: colors.border }}>
                <FiPhone className="text-gray-500 mr-2" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="flex-1 text-black outline-none"
                  value={userDetails.phone}
                  onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                  required
                />
              </div>
              <div className="flex items-center border-b pb-2" style={{ borderColor: colors.border }}>
                <FiMail className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 text-black outline-none"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ borderColor: colors.border }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Order Type</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {['Home Delivery', 'Takeaway', 'Eat-in', 'Pre-order'].map((type) => (
                <button
                  key={type}
                  className={`py-2 px-4 rounded-lg border text-sm font-medium ${orderType === type ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'}`}
                  onClick={() => setOrderType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            {['Eat-in', 'Pre-order'].includes(orderType) && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2" style={{ color: colors.text }}>Select Table</h3>
                {availableTables.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableTables.map(table => (
                      <button
                        key={table.id}
                        className={`py-2 px-3 rounded-lg border text-sm ${selectedTable === table.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'}`}
                        onClick={() => setSelectedTable(table.id)}
                      >
                        Table {table.number} ({table.capacity} pax)
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-red-500 mt-2">No available tables. Please contact the restaurant.</p>
                )}
              </div>
            )}

            {orderType === 'Home Delivery' && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2" style={{ color: colors.text }}>Delivery Address</h3>
                <div className="flex items-center border rounded-lg p-3" style={{ borderColor: colors.border }}>
                  <FiMapPin className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Enter your full address"
                    className="flex-1 outline-none"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" style={{ borderColor: colors.border }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Special Instructions</h2>
            <textarea
              className="w-full border rounded-lg p-3" 
              style={{ borderColor: colors.border, minHeight: '100px' }}
              placeholder="Any special requests or instructions for the restaurant..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        </div>

        {/* Order Summary - Right Side */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4" style={{ borderColor: colors.border }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span style={{ color: colors.text }}>
                      {item.quantity} × {item.name}
                    </span>
                    <span style={{ color: colors.text }}>₹{item.price * item.quantity}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No items in cart</p>
              )}
            </div>

            <div className="border-t pt-3 mb-4" style={{ borderColor: colors.border }}>
              <div className="flex justify-between mb-1">
                <span style={{ color: colors.textLight }}>Subtotal</span>
                <span style={{ color: colors.text }}>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span style={{ color: colors.textLight }}>Delivery Fee</span>
                <span style={{ color: colors.text }}>₹{calculateDeliveryFee().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span style={{ color: colors.textLight }}>GST (5%)</span>
                <span style={{ color: colors.text }}>₹{calculateGST().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold mt-2">
                <span style={{ color: colors.text }}>Total</span>
                <span style={{ color: colors.primary }}>₹{getGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-4">
              <FiClock className="mr-2" />
              <span>Estimated {orderType === 'Home Delivery' ? 'delivery' : 'pickup'} time: 30-45 mins</span>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className={`w-full py-3 rounded-lg font-bold text-center ${cartItems.length === 0 || (['Eat-in', 'Pre-order'].includes(orderType) && !selectedTable) ? 'bg-gray-300 cursor-not-allowed' : ''}`}
              style={{ 
                backgroundColor: cartItems.length > 0 && !(['Eat-in', 'Pre-order'].includes(orderType) && !selectedTable) ? colors.primary : colors.border,
                color: 'white'
              }}
              disabled={cartItems.length === 0 || (['Eat-in', 'Pre-order'].includes(orderType) && !selectedTable)}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;