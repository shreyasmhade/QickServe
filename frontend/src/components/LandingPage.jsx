import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaMobileAlt, 
  FaClock, 
  FaSearch, 
  FaUtensils,
  FaRegClock,
  FaRegSmile,
  FaRegCreditCard,
  FaQuoteLeft
} from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { MdDeliveryDining, MdTableRestaurant } from 'react-icons/md';
import { IoRestaurantSharp } from 'react-icons/io5';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Navigation handlers
  const navigateTo = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };
  
  const routes = {
    customer: '/customer',
    admin: '/admin',
    home: '/'
  };

  // Feature cards data
  const features = [
    {
      title: 'Easy Ordering',
      desc: 'Browse menus, add items to cart, and checkout with just a few taps.',
      icon: <FaMobileAlt className="text-blue-600" size={24} />,
    },
    {
      title: 'Table Management',
      desc: 'Easily book tables, view availability, and manage your restaurant visits.',
      icon: <MdTableRestaurant className="text-blue-600" size={24} />,
    },
    {
      title: 'Restaurant Tools',
      desc: 'Powerful dashboard to manage your menu, tables, and incoming orders.',
      icon: <IoRestaurantSharp className="text-blue-600" size={24} />,
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Customers', icon: <FaRegSmile className="text-blue-500" size={20} /> },
    { value: '500+', label: 'Partner Restaurants', icon: <IoRestaurantSharp className="text-blue-500" size={20} /> },
    { value: '30 min', label: 'Avg. Delivery Time', icon: <FaRegClock className="text-blue-500" size={20} /> },
    { value: 'Secure', label: 'Payment Options', icon: <FaRegCreditCard className="text-blue-500" size={20} /> },
  ];

  const steps = [
    {
      title: "Browse Restaurants",
      desc: "Discover local restaurants with detailed menus and reviews",
      icon: <FaSearch className="text-blue-600" size={20} />
    },
    {
      title: "Place Your Order",
      desc: "Add items to cart and checkout with secure payment options",
      icon: <FaMobileAlt className="text-blue-600" size={20} />
    },
    {
      title: "Enjoy Your Meal",
      desc: "Pick up your order or get it delivered to your table",
      icon: <FaUtensils className="text-blue-600" size={20} />
    }
  ];

  const testimonials = [
    {
      quote: "QuickServe has transformed how we manage our restaurant. Orders come in digitally and we can focus on food quality.",
      author: "Sarah Johnson",
      role: "Restaurant Owner"
    },
    {
      quote: "I love how easy it is to order from my favorite restaurants. The interface is intuitive and delivery is always prompt.",
      author: "Michael Chen",
      role: "Regular Customer"
    },
    {
      quote: "As someone who dines out often, the table reservation feature has saved me so much time and hassle.",
      author: "Emily Rodriguez",
      role: "Food Enthusiast"
    }
  ];

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => navigateTo(routes.home)}
            >
              <FaUtensils className="text-blue-600 mr-2 text-2xl transition-transform duration-200 group-hover:rotate-12" />
              <span className="text-2xl font-bold text-gray-900">QuickServe</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <button 
                    onClick={() => navigateTo(routes.customer)}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Customer Login
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo(routes.admin)}
                    className="px-5 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    For Restaurants
                  </button>
                </li>
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-3 pb-3 space-y-2">
              <button 
                onClick={() => navigateTo(routes.customer)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md"
              >
                Customer Login
              </button>
              <button 
                onClick={() => navigateTo(routes.admin)}
                className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
              >
                For Restaurants
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-200">
                  QuickServe
                </span>{' '}
                - Your Smart Restaurant Ordering Solution
              </h1>
              <p className="text-lg text-blue-100 max-w-lg">
                Skip the line, order on the go. Discover restaurants, browse menus, place orders, and reserve tables - all in one seamless platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigateTo(routes.customer)}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <MdDeliveryDining size={18} />
                  Order Now
                </button>
                <button 
                  onClick={() => navigateTo(routes.admin)}
                  className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <IoRestaurantSharp size={18} />
                  For Restaurants
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 relative mt-8 lg:mt-0">
              <div className="relative rounded-xl shadow-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
                  alt="Delicious food selection on table"
                  className="w-full object-cover h-64 sm:h-80 md:h-96"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="absolute -bottom-4 right-4 bg-white p-3 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FaClock className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Average delivery time</p>
                    <p className="font-bold text-gray-900 text-sm">25-30 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 md:p-6 text-center hover:shadow-md transition-shadow duration-300">
                  <div className="flex justify-center mb-2 md:mb-3">
                    {stat.icon}
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose QuickServe?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                We provide the best experience for both customers and restaurant owners with our innovative platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {features.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100 group"
                >
                  <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors duration-300">
                    {React.cloneElement(item.icon, { className: "group-hover:scale-110 transition-transform duration-300" })}
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-gray-900 text-center">{item.title}</h3>
                  <p className="text-gray-600 text-center">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Simple steps to enjoy your dining experience with QuickServe
              </p>
            </div>
            <div className="relative">
              {/* Timeline */}
              <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-blue-200 transform -translate-x-1/2"></div>
              
              {/* Steps */}
              <div className="space-y-12 md:space-y-0">
                {steps.map((step, index) => (
                  <div key={index} className="relative md:flex md:items-center md:justify-between md:odd:flex-row-reverse">
                    {/* Content */}
                    <div className={`md:w-5/12 p-6 rounded-xl bg-gray-50 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                          {step.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                    
                    {/* Timeline dot */}
                    <div className="hidden md:block absolute left-1/2 w-6 h-6 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow-md"></div>
                    
                    {/* Number (mobile only) */}
                    <div className="md:hidden flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full text-white font-bold mb-4 mx-auto">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Don't just take our word for it - hear from our satisfied customers and partners
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="mb-4 text-blue-500 opacity-50">
                    <FaQuoteLeft size={24} />
                  </div>
                  <p className="text-gray-700 mb-6">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your dining experience?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of satisfied customers and restaurant partners already using QuickServe.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigateTo(routes.customer)}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <MdDeliveryDining size={20} />
                Start Ordering
              </button>
              <button 
                onClick={() => navigateTo(routes.admin)}
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <IoRestaurantSharp size={20} />
                Register Restaurant
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div>
              <div className="flex items-center mb-4">
                <FaUtensils className="text-blue-400 mr-2" size={20} />
                <h4 className="text-xl font-bold">QuickServe</h4>
              </div>
              <p className="text-gray-400 mb-4">Revolutionizing the dining experience for customers and restaurants alike.</p>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={social}
                  >
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold">{social[0]}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">For Customers</h5>
              <ul className="space-y-2">
                {['Browse Restaurants', 'How It Works', 'Pricing', 'FAQs'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">For Restaurants</h5>
              <ul className="space-y-2">
                {['Get Started', 'Features', 'Pricing', 'Partner Benefits'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Company</h5>
              <ul className="space-y-2">
                {['About Us', 'Careers', 'Contact', 'Blog'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} QuickServe. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;