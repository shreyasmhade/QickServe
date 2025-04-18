import React, { useState, useEffect } from 'react';
import { FaStar, FaSearch, FaBars, FaUserShield, FaUser, FaQuestionCircle, FaUtensils } from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const RestaurantList = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const savedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    setRestaurants(savedRestaurants);
  }, []);

  const cuisineTypes = ['all', ...new Set(restaurants.map(r => r.cuisine.toLowerCase()))];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || restaurant.cuisine.toLowerCase() === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleOrderHistory = () => navigate('/orders-history');
  const handleHomeClick = () => navigate('/home');
  const handleCustomerProfile = () => navigate('/customer-profile')


  return (
    <div className="font-sans min-h-screen min-w-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            <h1 
              className="text-2xl font-bold flex items-center cursor-pointer group"
              onClick={handleHomeClick}
            >
              <FaUtensils className="text-blue-600 mr-2 text-2xl transition-transform duration-200 group-hover:rotate-12" />
              <span className="text-black text-[2rem]">QuickServe</span>
            </h1>
            
            <nav className="hidden md:block">
              <ul className="flex space-x-4">
                <li>
                  <button 
                    onClick={handleOrderHistory}
                    className="px-4 py-2 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
                  >
                    My Orders
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 text-white hover:text-blue-600 transition-colors duration-200 text-sm font-medium flex items-center gap-1"
                  >
                    <FaQuestionCircle /> Guide
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleCustomerProfile(true)}
                    className="px-4 py-2 text-white hover:text-blue-600 transition-colors duration-200 text-sm font-medium flex items-center gap-1"
                  >
                    <FaUser /> Profile
                  </button>
                </li>
              </ul>
            </nav>

            <button 
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-3 pb-3">
              <div className="flex flex-col space-y-2">
              <button 
                    onClick={handleOrderHistory}
                    className="px-4 py-2 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
                  >
                    My Orders
                  </button>
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm font-medium text-left flex items-center gap-2"
                >
                  <FaQuestionCircle /> Guide
                </button>
                  <button 
                    onClick={() => handleCustomerProfile(true)}
                    className="px-4 py-2 text-white hover:text-blue-600 transition-colors duration-200 text-sm font-medium flex items-center gap-1"
                  >
                    <FaUser /> Profile
                  </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Discover Amazing Restaurants</h1>
          <p className="text-gray-600">Order from your favorite local eateries</p>
        </div>

        <div className="mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
            {cuisineTypes.map(type => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-4 py-2 rounded-full whitespace-nowrap capitalize text-sm font-medium ${
                  activeFilter === type 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {type === 'all' ? 'All Cuisines' : type}
              </button>
            ))}
          </div>
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map(restaurant => (
      <div 
        key={restaurant.id}
        className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={() => {
          console.log('Navigating to:', restaurant.id); // Debug log
          navigate(`/restaurant/${restaurant.id}`);
        }}
              >
                <div className="relative h-48">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {restaurant.deliveryTime}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 truncate">{restaurant.name}</h3>
                    <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-sm min-w-[60px] justify-center">
                      <FaStar className="mr-1" />
                      {restaurant.rating}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">{restaurant.cuisine}</span>
                    <span className="text-gray-500 text-sm">Min. ₹{restaurant.minOrder}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaSearch size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No restaurants found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white/90 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <HiOutlineX size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <FaQuestionCircle className="text-blue-600" /> QuickServe Guide
            </h2>
            <div className="space-y-4">
              {[
                { title: "1. Login", content: "Enter your mobile number and verify with OTP (use any 10-digit number and '123456' for demo)" },
                { title: "2. Choose Restaurant", content: "Browse available restaurants and select one to view their menu" },
                { title: "3. Order Food", content: "Add items to your cart by clicking the '+' button and adjust quantities as needed" },
                { title: "4. Checkout", content: "Click the cart icon to review your order and proceed to checkout" },
                { title: "5. Complete Order", content: "Select order type (Eat-in, Pre-Order, Takeaway, or Delivery) and provide necessary details" },
                { title: "6. Confirmation", content: "Review your order summary and download receipt" }
              ].map((step, index) => (
                <div key={index} className="pb-4 border-b border-gray-200 last:border-b-0">
                  <h3 className="text-blue-600 font-medium flex items-center gap-2">{step.title}</h3>
                  <p className="text-gray-600 ml-7 mt-1">{step.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;