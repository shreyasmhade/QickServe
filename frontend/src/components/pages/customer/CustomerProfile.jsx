import { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaCamera, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const CustomerProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    photo: null,
    photoPreview: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  // Load profile data on component mount
  useEffect(() => {
    // In a real app, you would fetch this from your backend
    const savedProfile = JSON.parse(localStorage.getItem('customerProfile')) || {
      name: 'John Doe',
      mobile: '9876543210',
      email: 'john@example.com',
      address: '123 Main St, City, Country',
      photo: null
    };
    setProfile(savedProfile);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would send this to your backend
      localStorage.setItem('customerProfile', JSON.stringify(profile));
      setIsLoading(false);
      setIsEditing(false);
    }, 1000);
  };

  return (
    <div className="font-sans min-h-screen min-w-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden mx-auto">
                {profile.photoPreview ? (
                  <img 
                    src={profile.photoPreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <FaUser className="text-gray-500 text-4xl" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer">
                  <FaCamera className="text-blue-600" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mt-4">
              {profile.name || 'Customer Name'}
            </h2>
            <p className="text-blue-100">{profile.mobile || 'Mobile Number'}</p>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Mobile Number</label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <span className="px-3 bg-gray-100">+91</span>
                      <input
                        type="tel"
                        name="mobile"
                        value={profile.mobile}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-2 focus:outline-none"
                        maxLength="10"
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-75 flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Full Name</h3>
                    <p className="text-gray-800 font-medium">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaPhone className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Mobile Number</h3>
                    <p className="text-gray-800 font-medium">+91 {profile.mobile}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaEnvelope className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Email</h3>
                    <p className="text-gray-800 font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full mt-1">
                    <FaMapMarkerAlt className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Address</h3>
                    <p className="text-gray-800 font-medium">{profile.address}</p>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <FaEdit /> <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;