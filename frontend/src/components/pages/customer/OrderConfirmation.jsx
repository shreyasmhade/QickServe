import React, { useState, useEffect, useRef } from 'react';
import { 
  useParams, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiShoppingBag, 
  FiHome, 
  FiDownload,
  FiUser,
  FiPhone,
  FiMapPin,
  FiClock
} from 'react-icons/fi';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const receiptRef = useRef();

  // Load order data
  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
      const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
      const foundRestaurant = restaurants.find(r => r.id === location.state.order.restaurantId);
      setRestaurant(foundRestaurant);
      return;
    }

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find(o => o.orderDate === orderId);
    
    if (!foundOrder) {
      navigate('/restaurants');
      return;
    }

    setOrder(foundOrder);
    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const foundRestaurant = restaurants.find(r => r.id === foundOrder.restaurantId);
    setRestaurant(foundRestaurant);
  }, [orderId, navigate, location.state]);

  if (!order || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  // Format date and generate order number
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return date.toLocaleDateString(undefined, options);
  };

  const generateOrderNumber = () => {
    const date = new Date(order.orderDate);
    return `ORD-${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random() * 10000)).padStart(4,'0')}`;
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-200 w-full bg-white rounded-lg shadow-sm p-6">
        {/* Receipt content */}
        <div ref={receiptRef} className="p-4">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-2">
              <FiCheckCircle className="text-green-500 mr-2" size={60} />
              <h2 className="text-[2rem] font-bold text-black">Order Confirmed!</h2>
            </div>
            <h2 className="text-lg font-bold text-gray-700">Restaurant:-{restaurant.name}</h2>
            <p className="text-sm text-gray-500">Order Receipt</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Order #:</span>
              <span className="text-gray-700 font-medium">{generateOrderNumber()}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Date:</span>
              <span className="text-gray-700">{formatDate(order.orderDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order Type:</span>
              <span className="text-gray-700">{order.orderType}</span>
            </div>
          </div>

          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <FiUser className="text-gray-500 mr-2" size={16} />
              <span className="text-gray-700">{order.userDetails.name}</span>
            </div>
            <div className="flex items-center mb-2">
              <FiPhone className="text-gray-500 mr-2" size={16} />
              <span className="text-gray-700">{order.userDetails.phone}</span>
            </div>
            {order.deliveryAddress ? (
              <div className="flex items-start">
                <FiMapPin className="text-gray-500 mr-2 mt-0.5" size={16} />
                <span className="text-gray-700">{order.deliveryAddress}</span>
              </div>
            ) : (
              <div className="flex items-center">
                <FiMapPin className="text-gray-500 mr-2" size={16} />
                <span className="text-gray-700">Table: {order.tableNumber}</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Order Details:</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-700">
                    {item.quantity} × {item.name}
                    {item.specialInstructions && (
                      <p className="text-xs text-gray-500 mt-1">Note: {item.specialInstructions}</p>
                    )}
                  </span>
                  <span className="text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-700">₹{(order.totalAmount - (order.totalAmount * 0.05)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">GST (5%)</span>
              <span className="text-gray-700">₹{(order.totalAmount * 0.05).toFixed(2)}</span>
            </div>
            {order.orderType === 'Home Delivery' && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="text-gray-700">₹{order.totalAmount > 200 ? '0.00' : '40.00'}</span>
              </div>
            )}
            <div className="flex justify-between font-bold mt-3 pt-2 border-t border-gray-200">
              <span className="text-gray-700">Total:</span>
              <span className="text-indigo-600">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Your order has been placed successfully at {restaurant.name}.</p>
            <p className="mt-1 flex items-center justify-center">
              <FiClock className="mr-1" size={14} />
              Estimated {order.orderType === 'Home Delivery' ? 'delivery' : 'serving'} time: 15-20 mins
            </p>
          </div>
          
          {/* This will only appear when printing */}
          <div className="print-only hidden text-center mt-8 text-xs text-gray-500">
            <p>Thank you for your order!</p>
            <p className="mt-1">For any issues, please contact {restaurant.phone || 'the restaurant'}.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print mt-8 space-y-3">
          <button
            onClick={() => navigate(`/restaurant/${order.restaurantId}`)}
            className="w-full py-2.5 rounded-lg flex items-center justify-center bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            <FiShoppingBag className="mr-2" />
            Order Again
          </button>
          <button
            onClick={() => navigate('/restaurants')}
            className="w-full py-2.5 rounded-lg flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <FiHome className="mr-2" />
            Back to Restaurants
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;