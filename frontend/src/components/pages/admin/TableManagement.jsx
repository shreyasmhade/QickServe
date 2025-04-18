import React, { useState, useEffect, useRef } from 'react';
import { 
  FiHome, FiList, FiShoppingBag, FiGrid, FiUser, FiLogOut, FiMenu, FiX,
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiSave
} from 'react-icons/fi';
import { FaUtensils } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();
  const location = useLocation();
  const lastUpdateRef = useRef(null);

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
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    error: '#EF4444'
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

  // Load tables from restaurant data
  const loadTables = () => {
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    if (!currentAdmin) {
      navigate('/admin');
      return;
    }

    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const adminRestaurant = restaurants.find(r => r.id === currentAdmin.restaurantId);
    
    if (adminRestaurant) {
      setTables(adminRestaurant.tables || []);
    } else {
      setTables([]);
    }
  };

  // Initialize and set up real-time updates
  useEffect(() => {
    loadTables();
    
    // Set up an event listener for storage changes to sync between tabs
    const handleStorageChange = (e) => {
      if (e.key === 'restaurants' || e.key === 'tablesUpdated') {
        loadTables();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Set up polling for same-tab updates (fallback)
    const intervalId = setInterval(() => {
      const lastUpdate = localStorage.getItem('tablesUpdated');
      if (lastUpdate !== lastUpdateRef.current) {
        lastUpdateRef.current = lastUpdate;
        loadTables();
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [navigate]);

  // Save tables to restaurant data
  const saveRestaurantData = (updatedTables) => {
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    
    const updatedRestaurants = restaurants.map(restaurant => {
      if (restaurant.id === currentAdmin.restaurantId) {
        return {
          ...restaurant,
          tables: updatedTables
        };
      }
      return restaurant;
    });
    
    localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
    localStorage.setItem('tablesUpdated', Date.now().toString());
    setTables(updatedTables);
  };

  // Navigation functions
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Filter tables based on search and status
  const filteredTables = tables.filter(table => {
    const searchTerm = searchQuery.toLowerCase();
    
    // Status filter
    if (filterStatus !== 'all' && table.status !== filterStatus) {
      return false;
    }
    
    return (
      table.number.toString().includes(searchTerm) ||
      table.capacity.toString().includes(searchTerm) ||
      table.status.toLowerCase().includes(searchTerm)
    );
  });

  // Table management functions
  const addTable = () => {
    if (newTableNumber && newTableCapacity) {
      const newTable = {
        id: `table-${Date.now()}`,
        number: parseInt(newTableNumber),
        capacity: parseInt(newTableCapacity),
        status: 'free'
      };
      
      // Check if table number already exists
      if (tables.some(table => table.number === newTable.number)) {
        alert('Table with this number already exists!');
        return;
      }
      
      const updatedTables = [...tables, newTable];
      saveRestaurantData(updatedTables);
      setIsAddDialogOpen(false);
      setNewTableNumber('');
      setNewTableCapacity('');
    }
  };

  const updateTableStatus = (tableId, status) => {
    const updatedTables = tables.map(table => 
      table.id === tableId ? { ...table, status } : table
    );
    saveRestaurantData(updatedTables);
  };

  const deleteTable = (tableId) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      const updatedTables = tables.filter(table => table.id !== tableId);
      saveRestaurantData(updatedTables);
    }
  };

  const getTableColor = (status) => {
    switch (status) {
      case 'free': return colors.success;
      case 'reserved': return colors.warning;
      case 'booked': return colors.error;
      default: return colors.border;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'free': return 'Free';
      case 'reserved': return 'Reserved';
      case 'booked': return 'Booked';
      default: return status;
    }
  };

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

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>Table Management</h2>
            <p className="text-lg" style={{ color: colors.textLight }}>Manage your restaurant's tables and their status</p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-6 rounded-xl shadow-sm p-4" style={{ backgroundColor: colors.card }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tables by number, capacity or status"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    focusRingColor: colors.primaryLight
                  }}
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block pl-3 pr-10 py-2 text-base border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    focusRingColor: colors.primaryLight
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="free">Free</option>
                  <option value="reserved">Reserved</option>
                  <option value="booked">Booked</option>
                </select>
                
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-white hover:bg-emerald-600 transition-colors"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <FiPlus size={18} />
                  Add Table
                </button>
              </div>
            </div>
          </div>

          {/* Tables Grid */}
          {filteredTables.length === 0 ? (
            <div className="text-center py-12 rounded-lg" style={{ backgroundColor: colors.card }}>
              <h2 className="text-xl font-medium mb-2" style={{ color: colors.text }}>
                {searchQuery || filterStatus !== 'all' ? "No matching tables found" : "No tables added yet"}
              </h2>
              <p className="mb-4" style={{ color: colors.textLight }}>
                {searchQuery || filterStatus !== 'all' 
                  ? "Try adjusting your search or filter criteria" 
                  : "Add tables to manage your restaurant's seating"}
              </p>
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="px-4 py-2 rounded-lg flex items-center gap-2 mx-auto text-white"
                style={{ backgroundColor: colors.primary }}
              >
                <FiPlus size={16} />
                Add Your First Table
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTables.sort((a, b) => a.number - b.number).map(table => (
                <div 
                  key={table.id} 
                  className="rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg relative"
                  style={{ 
                    backgroundColor: colors.card,
                    borderColor: colors.border
                  }}
                >
                  {/* Status indicator dot */}
                  <div 
                    className="absolute top-4 right-4 w-3 h-3 rounded-full"
                    style={{ backgroundColor: getTableColor(table.status) }}
                  />
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: colors.text }}>Table {table.number}</h3>
                        <p className="text-sm" style={{ color: colors.textLight }}>Capacity: {table.capacity} people</p>
                      </div>
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ 
                          backgroundColor: `${getTableColor(table.status)}20`,
                          color: getTableColor(table.status)
                        }}
                      >
                        {getStatusLabel(table.status)}
                      </span>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.border }}>
                      <h4 className="font-semibold mb-3" style={{ color: colors.text }}>Change Status</h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateTableStatus(table.id, 'free')}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            table.status === 'free' 
                              ? 'text-white' 
                              : 'hover:bg-gray-50'
                          }`}
                          style={{ 
                            backgroundColor: table.status === 'free' ? colors.success : 'transparent',
                            border: table.status === 'free' ? 'none' : `1px solid ${colors.success}`,
                            color: table.status === 'free' ? 'white' : colors.success
                          }}
                        >
                          Free
                        </button>
                        <button
                          onClick={() => updateTableStatus(table.id, 'reserved')}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            table.status === 'reserved' 
                              ? 'text-white' 
                              : 'hover:bg-gray-50'
                          }`}
                          style={{ 
                            backgroundColor: table.status === 'reserved' ? colors.warning : 'transparent',
                            border: table.status === 'reserved' ? 'none' : `1px solid ${colors.warning}`,
                            color: table.status === 'reserved' ? 'white' : colors.warning
                          }}
                        >
                          Reserved
                        </button>
                        <button
                          onClick={() => updateTableStatus(table.id, 'booked')}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            table.status === 'booked' 
                              ? 'text-white' 
                              : 'hover:bg-gray-50'
                          }`}
                          style={{ 
                            backgroundColor: table.status === 'booked' ? colors.error : 'transparent',
                            border: table.status === 'booked' ? 'none' : `1px solid ${colors.error}`,
                            color: table.status === 'booked' ? 'white' : colors.error
                          }}
                        >
                          Booked
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => deleteTable(table.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Status Guide */}
          <div className="mt-8 rounded-xl border p-6" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Table Status Guide</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.success }} />
                <span className="font-medium" style={{ color: colors.text }}>Free</span>
                <span className="text-sm" style={{ color: colors.textLight }}>- Table is available for customers</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.warning }} />
                <span className="font-medium" style={{ color: colors.text }}>Reserved</span>
                <span className="text-sm" style={{ color: colors.textLight }}>- Table is reserved for future use</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.error }} />
                <span className="font-medium" style={{ color: colors.text }}>Booked</span>
                <span className="text-sm" style={{ color: colors.textLight }}>- Table is currently occupied</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Table Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="rounded-xl p-6 w-full max-w-md"
            style={{ 
              backgroundColor: colors.card,
              borderColor: colors.border
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.text }}>Add New Table</h3>
              <button 
                onClick={() => setIsAddDialogOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: colors.text }}>
                  Table Number
                </label>
                <input
                  type="number"
                  min="1"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  className="w-full px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    focusRingColor: colors.primaryLight
                  }}
                  placeholder="e.g., 1, 2, 3"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: colors.text }}>
                  Capacity (seats)
                </label>
                <input
                  type="number"
                  min="1"
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(e.target.value)}
                  className="w-full px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    focusRingColor: colors.primaryLight
                  }}
                  placeholder="e.g., 2, 4, 6"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                style={{ 
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                Cancel
              </button>
              <button
                onClick={addTable}
                className="px-4 py-2 rounded-lg text-white hover:bg-emerald-600"
                style={{ backgroundColor: colors.secondary }}
              >
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagement;