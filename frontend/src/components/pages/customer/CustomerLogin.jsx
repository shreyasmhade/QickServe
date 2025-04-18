import { useState } from 'react';
import { FaBars, FaUserShield, FaUser, FaQuestionCircle, FaUtensils, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaMobileAlt, FaClock, FaTools, FaSearch } from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';

const CustomerLogin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (mobileNumber.length === 10) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setShowOtpSection(true);
        setIsLoading(false);
      }, 1000);
    } else {
      alert('Please enter a valid 10-digit mobile number');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      setIsLoading(true);
      // Simulate verification
      setTimeout(() => {
        setIsLoading(false);
        navigate('/restaurants');
      }, 1000);
    } else {
      alert('Please enter a valid 6-digit OTP');
    }
  };

  const handleHomeClick = () => navigate('/home');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (showOtpSection) {
      handleVerifyOtp(e);
    } else {
      handleSendOtp(e);
    }
  };

  return (
    <div className="font-sans min-h-screen min-w-screen flex flex-col bg-gradient-to-br from-[#4361ee] to-[#3a0ca3]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            <h1 
              className="text-2xl font-bold flex items-center cursor-pointer group"
              onClick={handleHomeClick}
            >
              <FaUtensils className="text-blue-600 mr-2 text-2xl transition-transform duration-200 group-hover:rotate-12" />
              <span className="text-black text-2xl text-[2rem] md:text-3xl">QuickServe</span>
            </h1>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-white hover:text-blue-600 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
              >
                <FaQuestionCircle /> Guide
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md text-white hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-3 pb-3 space-y-2">
              <button 
                onClick={() => setShowModal(true)}
                className="w-full px-4 py-3 text-white hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium text-left flex items-center gap-3"
              >
                <FaQuestionCircle className="text-lg" /> Guide
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center p-4 sm:p-6">
        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-blue-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Customer Login
            </h2>
            <p className="text-gray-600 mt-2">Enter your mobile number to receive OTP</p>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="mb-5">
              <label htmlFor="mobile" className="block text-gray-700 mb-2 font-medium">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">+91</span>
                </div>
                <input
                  type="tel"
                  id="mobile"
                  value={mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setMobileNumber(value);
                  }}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                />
              </div>
            </div>

            {showOtpSection && (
              <div className="mb-5 animate-fadeIn">
                <label htmlFor="otp" className="block text-gray-700 mb-2 font-medium">OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  pattern="[0-9]{6}"
                  maxLength={6}
                  inputMode="numeric"
                />
                <p className="text-xs text-gray-500 mt-1">Demo OTP: 123456</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 ${
                  showOtpSection 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {showOtpSection ? 'Verifying...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    {showOtpSection ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Verify OTP & Login
                      </>
                    ) : (
                      <>
                        <FaMobileAlt className="w-4 h-4" />
                        Send OTP
                      </>
                    )}
                  </>
                )}
              </button>

              {showOtpSection && (
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpSection(false);
                    setOtp('');
                  }}
                  className="w-full py-2.5 px-4 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  Change Mobile Number
                </button>
              )}
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>By continuing, you agree to our Terms of Service</p>
            </div>
          </form>
        </div>
      </main>

      {/* Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fadeIn">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close guide"
            >
              <HiOutlineX size={24} className="text-gray-500 hover:text-gray-700" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
              <FaQuestionCircle className="text-blue-600 text-xl" /> QuickServe Guide
            </h2>
            
            <div className="space-y-5">
              {[
                { 
                  title: "1. Login", 
                  content: "Enter your mobile number and verify with OTP (use any 10-digit number and '123456' for demo)",
                  icon: <FaUser className="text-blue-500 text-lg" />
                },
                { 
                  title: "2. Choose Restaurant", 
                  content: "Browse available restaurants and select one to view their menu",
                  icon: <FaSearch className="text-blue-500 text-lg" />
                },
                { 
                  title: "3. Order Food", 
                  content: "Add items to your cart by clicking the '+' button and adjust quantities as needed",
                  icon: <FaUtensils className="text-blue-500 text-lg" />
                },
                { 
                  title: "4. Checkout", 
                  content: "Click the cart icon to review your order and proceed to checkout",
                  icon: <FaClock className="text-blue-500 text-lg" />
                },
                { 
                  title: "5. Complete Order", 
                  content: "Select order type (Eat-in, Pre-Order, Takeaway, or Delivery) and provide necessary details",
                  icon: <FaTools className="text-blue-500 text-lg" />
                },
                { 
                  title: "6. Confirmation", 
                  content: "Review your order summary and download receipt",
                  icon: <FaHome className="text-blue-500 text-lg" />
                }
              ].map((step, index) => (
                <div key={index} className="pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full mt-1">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-blue-600 font-medium">{step.title}</h3>
                      <p className="text-gray-600 mt-1">{step.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLogin;