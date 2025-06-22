import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    confirmationPassword: ''
  });
  const [errors, setErrors] = useState({});

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Token:', token); // Debug log
      
      if (!token) {
        console.log('No token found');
        window.location.href = '/login';
        return;
      }

      console.log('Fetching profile from:', 'http://localhost:8000/api/users/profile/me');
      
      const response = await fetch('http://localhost:8000/api/users/profile/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const userData = await response.json();
        console.log('User data received:', userData);
        setUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          confirmationPassword: ''
        });
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        setMessage(`Failed to load profile: ${response.status} ${response.statusText}`);
        
        if (response.status === 401) {
          console.log('Unauthorized - clearing auth data');
          localStorage.removeItem('authToken');
          localStorage.removeItem('isLoggedIn');
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Network error fetching profile:', error);
      setMessage(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 3) {
      newErrors.firstName = 'First name must be at least 3 characters';
    } else if (formData.firstName.length > 20) {
      newErrors.firstName = 'First name must be less than 20 characters';
    }
    
    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 3) {
      newErrors.lastName = 'Last name must be at least 3 characters';
    } else if (formData.lastName.length > 20) {
      newErrors.lastName = 'Last name must be less than 20 characters';
    }
    
    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone Number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (formData.phoneNumber.length !== 10) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must contain only digits';
    }
    
    // Confirmation Password validation (required for updates)
    if (!formData.confirmationPassword) {
      newErrors.confirmationPassword = 'Please enter your current password to confirm changes';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setUpdateLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/users/edit-info/${user._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setUser(result.updatedUser);
        setIsEditing(false);
        setFormData(prev => ({ ...prev, confirmationPassword: '' }));
        // Refresh user data
        fetchUserProfile();
      } else {
        setMessage(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setMessage('');
    // Reset form data to original user data
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      confirmationPassword: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Failed to load profile</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Primary floating orbs */}
        <div className="absolute top-16 left-16 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-16 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-75"></div>
        <div className="absolute -bottom-8 left-24 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-violet-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-150"></div>
        
        {/* Secondary floating particles */}
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-r from-teal-400/10 to-cyan-500/10 rounded-full filter blur-2xl animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-gradient-to-r from-rose-400/10 to-pink-500/10 rounded-full filter blur-2xl animate-bounce delay-200"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-blue-400/30 rounded-full animate-float"></div>
        <div className="absolute top-3/4 left-1/5 w-4 h-4 bg-purple-400/40 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-pink-400/50 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-5 h-5 bg-cyan-400/30 rounded-full animate-float"></div>
        
        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-purple-500/5 to-transparent"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-24">
        <div className="w-full max-w-4xl">
          {/* Enhanced Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-6 shadow-2xl ring-4 ring-white/20 backdrop-blur-sm">
              <span className="text-3xl">👤</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3 drop-shadow-2xl">
              My Profile
            </h1>
            <p className="text-white/80 text-xl font-medium">Manage your account information</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Profile Container */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/25 to-white/10 rounded-3xl p-10 shadow-2xl border border-white/30 ring-1 ring-white/20">
            
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                  <p className="text-white/70">{user.email}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isDriver 
                        ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                        : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                    }`}>
                      {user.isDriver ? '🚚 Driver' : '👤 Passenger'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isVerified 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                        : 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                    }`}>
                      {user.isVerified ? '✅ Verified' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm border border-blue-400/30 hover:border-blue-300/50 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1"
                >
                  <span className="flex items-center">
                    <span className="mr-2 group-hover:scale-110 transition-transform duration-300">✏️</span>
                    Edit Profile
                  </span>
                </button>
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              {!isEditing ? (
                // View Mode
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group p-6 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <label className="block text-white/70 text-sm font-semibold mb-2">First Name</label>
                    <p className="text-white text-lg font-medium">{user.firstName}</p>
                  </div>
                  
                  <div className="group p-6 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <label className="block text-white/70 text-sm font-semibold mb-2">Last Name</label>
                    <p className="text-white text-lg font-medium">{user.lastName}</p>
                  </div>
                  
                  <div className="group p-6 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <label className="block text-white/70 text-sm font-semibold mb-2">Email Address</label>
                    <p className="text-white text-lg font-medium flex items-center">
                      📧 {user.email}
                    </p>
                  </div>
                  
                  <div className="group p-6 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <label className="block text-white/70 text-sm font-semibold mb-2">Phone Number</label>
                    <p className="text-white text-lg font-medium flex items-center">
                      📱 {user.phoneNumber}
                    </p>
                  </div>
                  
                  <div className="group p-6 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <label className="block text-white/70 text-sm font-semibold mb-2">Member Since</label>
                    <p className="text-white text-lg font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  <div className="group p-6 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <label className="block text-white/70 text-sm font-semibold mb-2">Rating</label>
                    <p className="text-white text-lg font-medium flex items-center">
                      ⭐ {user.rating}/5
                    </p>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="group">
                      <label className="block text-white/90 text-sm font-semibold mb-3 tracking-wide">
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/20 group-hover:border-white/40"
                          placeholder="Enter your first name"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/5 group-hover:to-purple-400/5 transition-all duration-300 pointer-events-none"></div>
                      </div>
                      {errors.firstName && (
                        <p className="text-red-300 text-sm mt-2 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="group">
                      <label className="block text-white/90 text-sm font-semibold mb-3 tracking-wide">
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/20 group-hover:border-white/40"
                          placeholder="Enter your last name"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/5 group-hover:to-purple-400/5 transition-all duration-300 pointer-events-none"></div>
                      </div>
                      {errors.lastName && (
                        <p className="text-red-300 text-sm mt-2 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="block text-white/90 text-sm font-semibold mb-3 tracking-wide">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/20 group-hover:border-white/40"
                        placeholder="Enter your email"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40">
                        📧
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/5 group-hover:to-purple-400/5 transition-all duration-300 pointer-events-none"></div>
                    </div>
                    {errors.email && (
                      <p className="text-red-300 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="group">
                    <label className="block text-white/90 text-sm font-semibold mb-3 tracking-wide">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/20 group-hover:border-white/40"
                        placeholder="Enter phone number"
                        maxLength="10"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40">
                        📱
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/5 group-hover:to-purple-400/5 transition-all duration-300 pointer-events-none"></div>
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-red-300 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Confirmation Password */}
                  <div className="group">
                    <label className="block text-white/90 text-sm font-semibold mb-3 tracking-wide">
                      Current Password (Required for changes)
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmationPassword"
                        value={formData.confirmationPassword}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/20 group-hover:border-white/40"
                        placeholder="Enter your current password"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40">
                        🔒
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/5 group-hover:to-purple-400/5 transition-all duration-300 pointer-events-none"></div>
                    </div>
                    {errors.confirmationPassword && (
                      <p className="text-red-300 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.confirmationPassword}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6">
                    <button
                      onClick={handleUpdate}
                      disabled={updateLoading}
                      className="flex-1 group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm border border-green-400/30 hover:border-green-300/50 disabled:cursor-not-allowed shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 hover:scale-[1.02] disabled:transform-none overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300"></div>
                      <div className="relative flex items-center justify-center">
                        {updateLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                            <span className="text-lg">Saving...</span>
                          </>
                        ) : (
                          <>
                            <span className="mr-3 text-xl group-hover:scale-110 transition-transform duration-300">💾</span>
                            <span className="text-lg">Save Changes</span>
                          </>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={handleCancel}
                      disabled={updateLoading}
                      className="flex-1 group bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm border border-gray-400/30 hover:border-gray-300/50 shadow-lg hover:shadow-gray-500/25 transform hover:-translate-y-1"
                    >
                      <span className="flex items-center justify-center">
                        <span className="mr-3 text-xl group-hover:scale-110 transition-transform duration-300">❌</span>
                        <span className="text-lg">Cancel</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mt-6 p-4 rounded-xl text-center text-sm border backdrop-blur-sm ${
                message.includes('successfully') 
                  ? 'bg-green-500/20 text-green-100 border-green-400/30 shadow-green-500/20' 
                  : 'bg-red-500/20 text-red-100 border-red-400/30 shadow-red-500/20'
              } shadow-lg`}>
                <div className="flex items-center justify-center">
                  <span className="mr-2">
                    {message.includes('successfully') ? '✅' : '❌'}
                  </span>
                  <span className="font-medium">{message}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(90deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Profile;