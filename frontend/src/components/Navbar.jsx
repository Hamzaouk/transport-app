import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken');
      const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
      setToken(authToken);
      setIsLoggedIn(loginStatus && authToken);
    };
    
    checkAuth();
    
    // Listen for storage changes (for logout from other tabs)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    setToken(null);
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href={isLoggedIn && token ? "/home" : "/"} 
              className="flex items-center text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Transport<span className="text-indigo-700">Connect</span>
              </span>
            </a>
          </div>
          
          {/* Navigation Links */}
          {isLoggedIn && token ? (
            // Authenticated Navigation
            <div className="hidden md:flex items-center space-x-4">
              <a 
                href="/home" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  Dashboard
                </span>
              </a>
              <a 
                href="/announcements" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                  </svg>
                  Announces
                </span>
              </a>
              <a 
                href="/profil" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Profile
                </span>
              </a>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-5 py-2 rounded-lg transition-colors duration-300 font-medium shadow-md hover:shadow-lg hover:from-red-500 hover:to-pink-500"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Logout
                </span>
              </button>
            </div>
          ) : (
            // Public Navigation
            <div className="hidden md:flex items-center space-x-4">
              <a 
                href="/" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  Home
                </span>
              </a>
              <a 
                href="/announcements" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                  </svg>
                  Announces
                </span>
              </a>
              <a 
                href="#about" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  About
                </span>
              </a>
              <a 
                href="/login" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  Sign In
                </span>
              </a>
              <a 
                href="/register" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg transition-colors duration-300 font-medium shadow-md hover:shadow-lg hover:from-blue-500 hover:to-indigo-500"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Get Started
                </span>
              </a>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-blue-600 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {(isLoggedIn && token) && (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
          <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-200">
            <div className="flex justify-around">
              <a 
                href="/home" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-center flex flex-col items-center p-2 rounded-lg hover:bg-blue-50"
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <div className="text-xs font-medium">Dashboard</div>
              </a>
              <a 
                href="/announcements" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-center flex flex-col items-center p-2 rounded-lg hover:bg-blue-50"
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                </svg>
                <div className="text-xs font-medium">Announces</div>
              </a>
              <a 
                href="/profil" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-center flex flex-col items-center p-2 rounded-lg hover:bg-blue-50"
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <div className="text-xs font-medium">Profile</div>
              </a>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-center flex flex-col items-center p-2 rounded-lg hover:bg-blue-50"
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <div className="text-xs font-medium">Logout</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;