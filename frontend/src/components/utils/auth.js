// utils/auth.js
export const getCurrentAdmin = () => {
    return JSON.parse(localStorage.getItem('currentAdmin'));
  };
  
  export const isAdminLoggedIn = () => {
    return !!getCurrentAdmin();
  };
  
  export const logoutAdmin = () => {
    localStorage.removeItem('currentAdmin');
  };
  
  export const getAdminRestaurant = () => {
    const currentAdmin = getCurrentAdmin();
    if (!currentAdmin) return null;
    
    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    return restaurants.find(r => r.id === currentAdmin.restaurantId);
  };