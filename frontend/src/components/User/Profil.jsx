import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
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
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
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
    
    // Clear general message when user starts typing
    if (message && (name === 'currentPassword' || name === 'newPassword')) {
      setMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (formData.firstName.length > 20) {
      newErrors.firstName = 'First name must be less than 20 characters';
    }
    
    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
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
    
    // Current Password validation (required for updates)
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Please enter your current password to confirm changes';
    }
    
    // New Password validation (optional, but if provided must be valid)
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }
    
    // Confirm New Password validation
    if (formData.newPassword && formData.newPassword.trim()) {
      if (!formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Please confirm your new password';
      } else if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Passwords do not match';
      }
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
      
      // Prepare update data
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        confirmationPassword: formData.currentPassword
      };
      
      // Only include new password if it's provided
      if (formData.newPassword && formData.newPassword.trim()) {
        updateData.password = formData.newPassword;
        console.log('🔐 New password will be updated');
        console.log('🔍 Password length:', formData.newPassword.length);
        console.log('🔍 Password contains special chars:', /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword));
        console.log('🔍 Password contains numbers:', /\d/.test(formData.newPassword));
        console.log('🔍 Password contains uppercase:', /[A-Z]/.test(formData.newPassword));
        console.log('🔍 Password contains lowercase:', /[a-z]/.test(formData.newPassword));
      }
      
      console.log('📤 Sending update request to:', `http://localhost:8000/api/users/edit-info/${user._id}`);
      console.log('📤 Request payload:', {
        ...updateData,
        password: updateData.password ? `[${updateData.password.length} chars]` : undefined,
        confirmationPassword: `[${updateData.confirmationPassword.length} chars]`
      });
      
      const response = await fetch(`http://localhost:8000/api/users/edit-info/${user._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Get response as text first to see raw response
      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('📥 Parsed response data:', result);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (response.ok) {
        let successMessage = 'Profile updated successfully! 🎉';
        
        // Check if password was actually updated
        if (formData.newPassword && formData.newPassword.trim()) {
          successMessage += '\n🔑 Password has been changed successfully!';
          
          // Test the new password immediately
          console.log('🧪 Testing new password...');
          try {
            const testResponse = await fetch('http://localhost:8000/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: formData.email,
                password: formData.newPassword
              })
            });
            
            const testResult = await testResponse.json();
            console.log('🧪 Password test result:', testResult);
            
            if (testResponse.ok) {
              console.log('✅ New password works correctly!');
              successMessage += '\n✅ New password verified and working!';
            } else {
              console.log('❌ New password test failed:', testResult.message);
              successMessage += '\n⚠️ Warning: New password may not be working correctly.';
            }
          } catch (testError) {
            console.error('❌ Password test error:', testError);
          }
          
          // Show additional confirmation
          setTimeout(() => {
            const confirmLogout = window.confirm(
              '🔐 Your password has been changed!\n\n' +
              'For security reasons, you should log out and log back in with your new password.\n\n' +
              'Would you like to logout now?'
            );
            
            if (confirmLogout) {
              localStorage.removeItem('authToken');
              localStorage.removeItem('isLoggedIn');
              window.location.href = '/login';
            }
          }, 3000);
        }
        
        setMessage(successMessage);
        setUser(result.updatedUser);
        setIsEditing(false);
        setFormData(prev => ({ 
          ...prev, 
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }));
        // Clear password visibility states
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        // Refresh user data
        fetchUserProfile();
      } else {
        console.error('❌ Update failed:', result);
        // Handle specific error messages
        if (result.message && (result.message.toLowerCase().includes('password') || result.message.toLowerCase().includes('incorrect'))) {
          setMessage('❌ Current password is incorrect. Please verify and try again.');
          setErrors(prev => ({ ...prev, currentPassword: 'Incorrect password' }));
        } else if (result.message && result.message.toLowerCase().includes('email')) {
          setMessage('❌ Email address is already in use or invalid.');
          setErrors(prev => ({ ...prev, email: 'Email issue' }));
        } else {
          setMessage(`❌ ${result.message || 'Failed to update profile'}`);
        }
      }
    } catch (error) {
      console.error('❌ Network error updating profile:', error);
      setMessage('❌ Network error. Please check your connection and try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setMessage('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    // Reset form data to original user data
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else if (field === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">Failed to load profile</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Profile
            </span>
          </h1>
          <p className="text-gray-600 text-lg">Manage your account information and security settings</p>
        </div>

        {/* Profile Container */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center mt-2 space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isDriver 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {user.isDriver ? '🚚 Driver' : '👤 Shipper'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isVerified 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-orange-100 text-orange-800 border border-orange-200'
                  }`}>
                    {user.isVerified ? '✅ Verified' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
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
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-300">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">First Name</label>
                  <p className="text-gray-900 text-lg font-medium">{user.firstName}</p>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-300">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Last Name</label>
                  <p className="text-gray-900 text-lg font-medium">{user.lastName}</p>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-300">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
                  <p className="text-gray-900 text-lg font-medium flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {user.email}
                  </p>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-300">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Phone Number</label>
                  <p className="text-gray-900 text-lg font-medium flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    {user.phoneNumber}
                  </p>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-300">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Member Since</label>
                  <p className="text-gray-900 text-lg font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-300">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Account Type</label>
                  <p className="text-gray-900 text-lg font-medium">
                    {user.isDriver ? 'Driver Account' : 'Shipper Account'}
                  </p>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-12 rounded-lg border ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter your email"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-12 rounded-lg border ${
                        errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter phone number"
                      maxLength="10"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Security Section Divider */}
                <div className="border-t border-gray-200 pt-6 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    Security Settings
                  </h3>
                </div>

                {/* Current Password */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Current Password (Required for changes)
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-12 pr-12 rounded-lg border ${
                        errors.currentPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter your current password"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showCurrentPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    New Password (Optional - leave empty to keep current)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter new password (optional)"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.newPassword}
                    </p>
                  )}
                  {formData.newPassword && formData.newPassword.length > 0 && !errors.newPassword && (
                    <p className="text-green-600 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      New password will be updated
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                {formData.newPassword && formData.newPassword.trim() && (
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pl-12 pr-12 rounded-lg border ${
                          errors.confirmNewPassword 
                            ? 'border-red-500 focus:ring-red-500' 
                            : formData.confirmNewPassword && formData.newPassword === formData.confirmNewPassword
                              ? 'border-green-500 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                        } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                        placeholder="Confirm your new password"
                      />
                      <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmNewPassword && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {errors.confirmNewPassword}
                      </p>
                    )}
                    {formData.confirmNewPassword && formData.newPassword === formData.confirmNewPassword && !errors.confirmNewPassword && (
                      <p className="text-green-600 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Passwords match perfectly!
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleUpdate}
                    disabled={updateLoading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center">
                      {updateLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Save Changes
                        </>
                      )}
                    </span>
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={updateLoading}
                    className="flex-1 bg-gray-500 hover:bg-gray-400 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:transform-none"
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Cancel
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center border ${
              message.includes('successfully') || message.includes('🎉')
                ? 'bg-green-50 text-green-800 border-green-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              <div className="flex items-center justify-center">
                <span className="font-medium">{message}</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;