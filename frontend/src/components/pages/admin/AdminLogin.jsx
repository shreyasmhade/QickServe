import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserShield, FaUser, FaUtensils, FaQuestionCircle } from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';

const AdminLogin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const admins = JSON.parse(localStorage.getItem('adminCredentials') || '[]');
    const admin = admins.find(a => a.username === username);
    
    if (admin && admin.password === password) {
      localStorage.setItem('currentAdmin', JSON.stringify({
        username,
        restaurantId: admin.restaurantId
      }));
      
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleHomeClick = () => navigate('/home');
  const handleAdminLogin = () => navigate('/admin');
  const handleCustomerLogin = () => navigate('/customer');
  const handleAdminRegistration = () => navigate('/register');

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
              <ul className="flex space-x-4 items-center">
                <li>
                  <button 
                    onClick={handleCustomerLogin}
                    className="px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium
                               bg-blue-600 text-white border border-blue-600 hover:bg-blue-700
                               shadow-sm hover:shadow-md active:scale-95"
                  >
                    Customer Login
                  </button>
                </li>
              </ul>
            </nav>

            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200
                         text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenuAlt3 className="text-2xl" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-3 pb-3 space-y-2">
              <button 
                onClick={handleAdminLogin}
                className="w-full px-4 py-3 rounded-lg transition-all duration-200 font-medium
                           bg-blue-600 text-white hover:bg-blue-700
                           flex items-center gap-3 active:scale-95"
              >
                <FaUserShield className="text-lg" />
                Admin Login
              </button>
              <button 
                onClick={handleCustomerLogin}
                className="w-full px-4 py-3 rounded-lg transition-all duration-200 font-medium
                           bg-white text-gray-800 border border-gray-300 hover:bg-gray-50
                           flex items-center gap-3 active:scale-95"
              >
                <FaUser className="text-lg" />
                Customer Login
              </button>
              <button 
                onClick={handleAdminRegistration}
                className="w-full px-4 py-3 rounded-lg transition-all duration-200 font-medium
                           text-blue-600 hover:bg-blue-50
                           flex items-center gap-3 active:scale-95"
              >
                Register Restaurant
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <FaUserShield className="text-blue-600" />
              Admin Login
            </h2>
            <p className="text-gray-600 mt-2">Enter your admin credentials</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md 
                           transition-all duration-200 hover:shadow-md active:scale-95"
              >
                Login
              </button>
            </div>

            <div className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Register your restaurant
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;