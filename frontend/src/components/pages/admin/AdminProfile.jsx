import React, { useState, useEffect } from 'react';
import { 
  FiHome, FiList, FiShoppingBag, FiGrid, FiUser, FiLogOut, FiMenu, FiX,
  FiEdit2, FiSave, FiArrowLeft, FiImage, FiPhone, FiMail, FiMapPin, FiLock,
  FiUpload, FiTrash2
} from 'react-icons/fi';
import { FaUtensils } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    restaurantName: '',
    address: '',
    cuisineType: '',
    phoneNumber: '',
    restaurantImage: null,
    imagePreview: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
  };

  // Load profile data
  useEffect(() => {
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    if (!currentAdmin) {
      navigate('/admin');
      return;
    }

    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const restaurant = restaurants.find(r => r.id === currentAdmin.restaurantId);
    
    if (restaurant) {
      setProfileData({
        username: currentAdmin.username,
        email: currentAdmin.email,
        restaurantName: restaurant.name,
        address: restaurant.address,
        cuisineType: restaurant.cuisine,
        phoneNumber: restaurant.phoneNumber,
        restaurantImage: null,
        imagePreview: restaurant.image || ''
      });
    }
  }, [navigate]);

  // Navigation functions
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Form handling
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'restaurantImage' && files && files[0]) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('Image size should be less than 2MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('Only JPEG, JPG, or PNG images are allowed');
        return;
      }
      
      setProfileData(prev => ({
        ...prev,
        restaurantImage: file,
        imagePreview: URL.createObjectURL(file)
      }));
      setError('');
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const removeImage = () => {
    setProfileData(prev => ({
      ...prev,
      restaurantImage: null,
      imagePreview: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!profileData.restaurantName || !profileData.address || !profileData.phoneNumber || !profileData.email) {
      setError('Please fill in all required fields');
      return;
    }

    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const admins = JSON.parse(localStorage.getItem('adminCredentials') || '[]');
    
    const restaurantIndex = restaurants.findIndex(r => r.id === currentAdmin.restaurantId);
    const adminIndex = admins.findIndex(a => a.username === currentAdmin.username);

    if (restaurantIndex === -1 || adminIndex === -1) {
      setError('Restaurant or admin not found!');
      return;
    }

    // Update admin email in credentials
    admins[adminIndex].email = profileData.email;
    localStorage.setItem('adminCredentials', JSON.stringify(admins));

    // Update current admin email in session
    currentAdmin.email = profileData.email;
    localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));

    // Prepare image data (convert to base64 if new image was uploaded)
    const updateRestaurantData = () => {
      const updatedRestaurant = {
        ...restaurants[restaurantIndex],
        name: profileData.restaurantName,
        address: profileData.address,
        cuisine: profileData.cuisineType,
        phoneNumber: profileData.phoneNumber,
        image: profileData.imagePreview // Will be updated if new image is processed
      };

      restaurants[restaurantIndex] = updatedRestaurant;
      localStorage.setItem('restaurants', JSON.stringify(restaurants));
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    };

    if (profileData.restaurantImage) {
      const reader = new FileReader();
      reader.readAsDataURL(profileData.restaurantImage);
      reader.onloadend = () => {
        profileData.imagePreview = reader.result;
        updateRestaurantData();
      };
      reader.onerror = () => {
        setError('Error processing image');
      };
    } else {
      updateRestaurantData();
    }
  };

  // Password change handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setError('');
    setSuccess('');

    // Validate passwords
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match!");
      return;
    }

    // Get current admin
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    const admins = JSON.parse(localStorage.getItem('adminCredentials') || '[]');
    const adminIndex = admins.findIndex(a => a.username === currentAdmin.username);

    if (adminIndex === -1) {
      setPasswordError('Admin not found!');
      return;
    }

    // Verify current password
    if (admins[adminIndex].password !== passwordData.currentPassword) {
      setPasswordError('Current password is incorrect!');
      return;
    }

    // Update password
    admins[adminIndex].password = passwordData.newPassword;
    localStorage.setItem('adminCredentials', JSON.stringify(admins));
    
    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setShowPasswordForm(false);
    setSuccess('Password changed successfully!');
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

        {/* Profile Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>Admin Profile</h2>
              <p className="text-lg" style={{ color: colors.textLight }}>Manage your account and restaurant details</p>
            </div>
            
            {!isEditing && !showPasswordForm ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg flex items-center gap-2 text-white hover:bg-indigo-700 transition-colors"
                style={{ backgroundColor: colors.primary }}
              >
                <FiEdit2 size={18} />
                Edit Profile
              </button>
            ) : (
              !showPasswordForm && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  style={{ color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  <FiArrowLeft size={18} />
                  Cancel
                </button>
              )
            )}
          </div>

          {/* Success and Error Messages */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Profile Form */}
          {!showPasswordForm && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Image */}
              <div className="lg:col-span-1">
                <div 
                  className="rounded-xl border p-6 h-full"
                  style={{ 
                    backgroundColor: colors.card,
                    borderColor: colors.border
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      {profileData.imagePreview ? (
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 relative" 
                          style={{ borderColor: colors.primaryLight }}>
                          <img 
                            src={profileData.imagePreview} 
                            alt="Restaurant" 
                            className="w-full h-full object-cover"
                          />
                          {isEditing && (
                            <button
                              onClick={removeImage}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="w-40 h-40 rounded-full border-4 border-dashed flex items-center justify-center"
                          style={{ borderColor: colors.primaryLight }}>
                          <FiImage size={32} style={{ color: colors.textLight }} />
                        </div>
                      )}
                      
                      {isEditing && (
                        <div className="mt-4">
                          <label className="px-4 py-2 rounded-lg flex items-center gap-2 text-white cursor-pointer mx-auto"
                            style={{ backgroundColor: colors.primary, width: 'fit-content' }}>
                            <FiUpload size={18} />
                            Upload Image
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={handleChange}
                              accept="image/*"
                              name="restaurantImage"
                            />
                          </label>
                          <p className="text-xs text-center mt-2" style={{ color: colors.textLight }}>
                            JPEG, PNG (max 2MB)
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-center" style={{ color: colors.text }}>
                      {profileData.restaurantName}
                    </h3>
                    <p className="text-center" style={{ color: colors.textLight }}>
                      {profileData.cuisineType}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Profile Details */}
              <div className="lg:col-span-2">
                <div 
                  className="rounded-xl border p-6 h-full"
                  style={{ 
                    backgroundColor: colors.card,
                    borderColor: colors.border
                  }}
                >
                  {isEditing ? (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 font-medium" style={{ color: colors.text }}>
                              Username *
                            </label>
                            <input
                              type="text"
                              name="username"
                              onChange={handleChange}
                              value={profileData.username}
                              className="w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2"
                              style={{ 
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                focusRingColor: colors.primaryLight
                              }}
                              required
                              disabled
                            />
                          </div>
                          
                          <div>
                            <label className="block mb-2 font-medium" style={{ color: colors.text }}>
                              Email *
                            </label>
                            <input
                              type="email"
                              name="email"
                              onChange={handleChange}
                              value={profileData.email}
                              className="w-full px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring-2"
                              style={{ 
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                focusRingColor: colors.primaryLight
                              }}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block mb-2 font-medium" style={{ color: colors.text }}>
                            Restaurant Name *
                          </label>
                          <input
                            type="text"
                            name="restaurantName"
                            value={profileData.restaurantName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring-2"
                            style={{ 
                              backgroundColor: colors.card,
                              borderColor: colors.border,
                              focusRingColor: colors.primaryLight
                            }}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 font-medium" style={{ color: colors.text }}>
                              Cuisine Type
                            </label>
                            <input
                              type="text"
                              name="cuisineType"
                              value={profileData.cuisineType}
                              onChange={handleChange}
                              className="w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2"
                              style={{ 
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                focusRingColor: colors.primaryLight
                              }}
                            />
                          </div>
                          
                          <div>
                            <label className="block mb-2 font-medium" style={{ color: colors.text }}>
                              Phone Number *
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-3" style={{ color: colors.textLight }}>
                                <FiPhone size={18} />
                              </span>
                              <input
                                type="tel"
                                name="phoneNumber"
                                value={profileData.phoneNumber}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2"
                                style={{ 
                                  backgroundColor: colors.card,
                                  borderColor: colors.border,
                                  focusRingColor: colors.primaryLight
                                }}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block mb-2 font-medium" style={{ color: colors.text }}>
                            Address *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-3" style={{ color: colors.textLight }}>
                              <FiMapPin size={18} />
                            </span>
                            <input
                              type="text"
                              name="address"
                              value={profileData.address}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2"
                              style={{ 
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                focusRingColor: colors.primaryLight
                              }}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="pt-4 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
                            style={{ color: colors.text, border: `1px solid ${colors.border}` }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg flex items-center gap-2 text-white hover:bg-emerald-600 transition-colors"
                            style={{ backgroundColor: colors.secondary }}
                          >
                            <FiSave size={18} />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium mb-1" style={{ color: colors.textLight }}>Username</h4>
                          <p className="text-lg" style={{ color: colors.text }}>{profileData.username}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1" style={{ color: colors.textLight }}>Email</h4>
                          <p className="text-lg" style={{ color: colors.text }}>{profileData.email}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1" style={{ color: colors.textLight }}>Restaurant Name</h4>
                        <p className="text-lg" style={{ color: colors.text }}>{profileData.restaurantName}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium mb-1" style={{ color: colors.textLight }}>Cuisine Type</h4>
                          <p className="text-lg" style={{ color: colors.text }}>{profileData.cuisineType || 'Not specified'}</p>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <FiPhone size={20} style={{ color: colors.textLight, marginTop: 2 }} />
                          <div>
                            <h4 className="text-sm font-medium mb-1" style={{ color: colors.textLight }}>Phone Number</h4>
                            <p className="text-lg" style={{ color: colors.text }}>{profileData.phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <FiMapPin size={20} style={{ color: colors.textLight, marginTop: 2 }} />
                        <div>
                          <h4 className="text-sm font-medium mb-1" style={{ color: colors.textLight }}>Address</h4>
                          <p className="text-lg" style={{ color: colors.text }}>{profileData.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Password Change Form */}
          {!isEditing && !showPasswordForm && (
            <div className="mt-8 pt-6 border-t" style={{ borderColor: colors.border }}>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 rounded-lg flex items-center gap-2 text-white hover:bg-amber-600 transition-colors"
                style={{ backgroundColor: colors.accent }}
              >
                <FiLock size={18} />
                Change Password
              </button>
            </div>
          )}

          {showPasswordForm && (
            <div 
              className="mt-8 p-6 rounded-xl border"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border
              }}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
                Change Password
              </h3>
              
              {passwordError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {passwordError}
                </div>
              )}
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium" style={{ color: colors.text }}>
                    Current Password *
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      focusRingColor: colors.primaryLight
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: colors.text }}>
                    New Password *
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      focusRingColor: colors.primaryLight
                    }}
                    required
                  />
                  <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                    Password must be at least 6 characters long
                  </p>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: colors.text }}>
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      focusRingColor: colors.primaryLight
                    }}
                    required
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;