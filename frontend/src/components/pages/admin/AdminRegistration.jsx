import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUtensils, FaArrowRight, FaArrowLeft, FaImage, FaUserShield, FaUser, FaQuestionCircle } from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';

const saveAdminCredentials = (username, password, restaurantId, profileData) => {
  const admins = JSON.parse(localStorage.getItem('adminCredentials') || '[]');
  if (admins.some(admin => admin.username === username)) {
    return false;
  }
  
  // Save complete profile data
  const adminProfile = {
    username,
    password,
    restaurantId,
    profileData: {
      ...profileData,
      image: profileData.coverImage ? 
        URL.createObjectURL(profileData.coverImage) : 
        'https://source.unsplash.com/random/300x200/?restaurant'
    }
  };
  
  admins.push(adminProfile);
  localStorage.setItem('adminCredentials', JSON.stringify(admins));
  return true;
};

const saveRestaurant = (restaurantData) => {
  const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
  restaurantData.id = Date.now().toString();
  restaurantData.categories = [];
  restaurantData.menuItems = [];
  restaurants.push(restaurantData);
  localStorage.setItem('restaurants', JSON.stringify(restaurants));
  return restaurantData.id;
};

const AdminRegistration = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    address: '',
    cuisineType: '',
    contactInfo: '',
    coverImage: null
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match!");
        return;
      }
      setStep(2);
    } else {
      const restaurantId = saveRestaurant({
        name: formData.restaurantName,
        cuisine: formData.cuisineType,
        rating: 0,
        deliveryTime: '30-45 min',
        minOrder: 200,
        address: formData.address,
        contact: formData.contactInfo,
        image: formData.coverImage ? 
          URL.createObjectURL(formData.coverImage) : 
          'https://source.unsplash.com/random/300x200/?restaurant',
        menuItems: []
      });
      
      const credentialsSaved = saveAdminCredentials(
        formData.username, 
        formData.password, 
        restaurantId,
        {
          restaurantName: formData.restaurantName,
          address: formData.address,
          cuisineType: formData.cuisineType,
          contactInfo: formData.contactInfo,
          coverImage: formData.coverImage
        }
      );
      
      if (!credentialsSaved) {
        setError('Username already exists!');
        return;
      }
      
      // Auto-login after registration
      localStorage.setItem('currentAdmin', JSON.stringify({
        username: formData.username,
        restaurantId: restaurantId
      }));
      
      navigate('/dashboard');
    }
  };

  const handleAdminLogin = () => navigate('/admin');
  const handleCustomerLogin = () => navigate('/customer');
  const handleHomeClick = () => navigate('/home');

  return (
    <div className="font-sans min-h-screen min-w-screen flex flex-col bg-gradient-to-br from-[#4361ee] to-[#3a0ca3]">
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
                    onClick={handleAdminLogin}
                    className="px-4 py-2 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
                  >
                    Admin Login
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleCustomerLogin}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                  >
                    Customer Login
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
                  onClick={handleAdminLogin}
                  className="w-full px-4 py-2 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium text-left flex items-center gap-2"
                >
                  <FaUserShield /> Admin Login
                </button>
                <button 
                  onClick={handleCustomerLogin}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium text-left flex items-center gap-2"
                >
                  <FaUser /> Customer Login
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-gray-800">Register Your Restaurant</h4>
            <div className="flex justify-center mt-4 mb-6">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <div className={`w-16 h-1 ${step === 1 ? 'bg-gray-300' : 'bg-blue-600'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Admin Account</h2>
                
                <div>
                  <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="•••••••"
                    className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    Continue <FaArrowRight />
                  </button>
                </div>
                
                <div className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{' '}
                  <Link to="/admin" className="text-blue-600 hover:underline">Log in</Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Restaurant Details</h2>
                
                <div>
                  <label htmlFor="restaurantName" className="block text-gray-700 mb-2">Restaurant Name</label>
                  <input
                    type="text"
                    id="restaurantName"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    placeholder="Enter restaurant name"
                    className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cuisineType" className="block text-gray-700 mb-2">Cuisine Type</label>
                  <input
                    type="text"
                    id="cuisineType"
                    name="cuisineType"
                    value={formData.cuisineType}
                    onChange={handleChange}
                    placeholder="e.g., Italian, Indian, Chinese"
                    className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="contactInfo" className="block text-gray-700 mb-2">Contact Info</label>
                  <input
                    type="text"
                    id="contactInfo"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    placeholder="Phone number or email"
                    className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="coverImage" className="block text-gray-700 mb-2">
                    Cover Image (optional)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaImage className="text-gray-400 text-xl mb-2" />
                        <p className="text-sm text-gray-500">
                          {formData.coverImage ? 
                            formData.coverImage.name : 
                            'Click to upload image'}
                        </p>
                      </div>
                      <input 
                        id="coverImage" 
                        name="coverImage" 
                        type="file" 
                        className="hidden" 
                        onChange={handleChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <FaArrowLeft /> Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Complete Registration
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminRegistration;