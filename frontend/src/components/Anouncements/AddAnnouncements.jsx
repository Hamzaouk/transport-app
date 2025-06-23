import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddAnnouncements = () => {
  const [formData, setFormData] = useState({
    startPoint: '',
    wayPoints: [''],
    destination: '',
    maxDimensions: {
      length: '',
      width: '',
      height: ''
    },
    packagesTypes: [''],
    availableCapacity: '',
    startDate: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn || !token) {
      alert('You must be logged in to create an announcement.');
      window.location.href = '/login';
      return;
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('maxDimensions')) {
      const dimension = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        maxDimensions: {
          ...prev.maxDimensions,
          [dimension]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index, field) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.startPoint.trim()) {
      newErrors.startPoint = 'Start point is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.availableCapacity || formData.availableCapacity <= 0) {
      newErrors.availableCapacity = 'Available capacity must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const selectedDate = new Date(formData.startDate);
      const currentDate = new Date();
      if (selectedDate <= currentDate) {
        newErrors.startDate = 'Start date must be in the future';
      }
    }

    // Validate waypoints (remove empty ones)
    const validWayPoints = formData.wayPoints.filter(point => point.trim() !== '');
    
    // Validate package types (remove empty ones)
    const validPackageTypes = formData.packagesTypes.filter(type => type.trim() !== '');
    if (validPackageTypes.length === 0) {
      newErrors.packagesTypes = 'At least one package type is required';
    }

    // Validate dimensions (optional but if provided, must be valid)
    if (formData.maxDimensions.length && formData.maxDimensions.length <= 0) {
      newErrors.maxDimensionsLength = 'Length must be greater than 0';
    }
    if (formData.maxDimensions.width && formData.maxDimensions.width <= 0) {
      newErrors.maxDimensionsWidth = 'Width must be greater than 0';
    }
    if (formData.maxDimensions.height && formData.maxDimensions.height <= 0) {
      newErrors.maxDimensionsHeight = 'Height must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');

      // Prepare data for submission
      const submissionData = {
        startPoint: formData.startPoint.trim(),
        destination: formData.destination.trim(),
        availableCapacity: parseInt(formData.availableCapacity),
        startDate: formData.startDate,
        wayPoints: formData.wayPoints.filter(point => point.trim() !== ''),
        packagesTypes: formData.packagesTypes.filter(type => type.trim() !== ''),
        maxDimensions: {}
      };

      // Add dimensions only if provided
      if (formData.maxDimensions.length) {
        submissionData.maxDimensions.length = parseInt(formData.maxDimensions.length);
      }
      if (formData.maxDimensions.width) {
        submissionData.maxDimensions.width = parseInt(formData.maxDimensions.width);
      }
      if (formData.maxDimensions.height) {
        submissionData.maxDimensions.height = parseInt(formData.maxDimensions.height);
      }

      console.log('Submitting announcement:', submissionData);

      const response = await axios.post(
        'http://localhost:8000/api/announcements/create',
        submissionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Announcement created:', response.data);
      setMessage('Announcement created successfully! 🎉');
      
      // Reset form
      setFormData({
        startPoint: '',
        wayPoints: [''],
        destination: '',
        maxDimensions: {
          length: '',
          width: '',
          height: ''
        },
        packagesTypes: [''],
        availableCapacity: '',
        startDate: ''
      });

      // Redirect to announcements page after success
      setTimeout(() => {
        window.location.href = '/announcements';
      }, 2000);

    } catch (error) {
      console.error('Error creating announcement:', error);
      
      if (error.response?.status === 401) {
        setMessage('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('isLoggedIn');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.data?.error) {
        setMessage(`Error: ${error.response.data.error}`);
      } else {
        setMessage('Failed to create announcement. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date for date input (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Create New Announcement
            </span>
          </h1>
          <p className="text-gray-600 text-lg">Post your transportation route and connect with shippers</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Route Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Route Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Point */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Start Point *
                  </label>
                  <input
                    type="text"
                    name="startPoint"
                    value={formData.startPoint}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.startPoint ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter starting city/location"
                  />
                  {errors.startPoint && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.startPoint}
                    </p>
                  )}
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.destination ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter destination city/location"
                  />
                  {errors.destination && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.destination}
                    </p>
                  )}
                </div>
              </div>

              {/* Waypoints */}
              <div className="mt-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Waypoints (Optional)
                </label>
                {formData.wayPoints.map((waypoint, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={waypoint}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'wayPoints')}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder={`Waypoint ${index + 1}`}
                    />
                    {formData.wayPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'wayPoints')}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('wayPoints')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Waypoint
                </button>
              </div>
            </div>

            {/* Cargo Information Section */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                Cargo Information
              </h2>

              {/* Available Capacity */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Available Capacity (kg) *
                </label>
                <input
                  type="number"
                  name="availableCapacity"
                  value={formData.availableCapacity}
                  onChange={handleChange}
                  min="1"
                  className={`w-full md:w-1/2 px-4 py-3 rounded-lg border ${
                    errors.availableCapacity ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter available capacity in kg"
                />
                {errors.availableCapacity && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {errors.availableCapacity}
                  </p>
                )}
              </div>

              {/* Max Dimensions */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Maximum Dimensions (cm) - Optional
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="number"
                      name="maxDimensions.length"
                      value={formData.maxDimensions.length}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.maxDimensionsLength ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="Length"
                    />
                    {errors.maxDimensionsLength && (
                      <p className="text-red-500 text-xs mt-1">{errors.maxDimensionsLength}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      name="maxDimensions.width"
                      value={formData.maxDimensions.width}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.maxDimensionsWidth ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="Width"
                    />
                    {errors.maxDimensionsWidth && (
                      <p className="text-red-500 text-xs mt-1">{errors.maxDimensionsWidth}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      name="maxDimensions.height"
                      value={formData.maxDimensions.height}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.maxDimensionsHeight ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="Height"
                    />
                    {errors.maxDimensionsHeight && (
                      <p className="text-red-500 text-xs mt-1">{errors.maxDimensionsHeight}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Package Types */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Accepted Package Types *
                </label>
                {formData.packagesTypes.map((packageType, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={packageType}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'packagesTypes')}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder={`Package type ${index + 1} (e.g., electronics, furniture, documents)`}
                    />
                    {formData.packagesTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'packagesTypes')}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                {errors.packagesTypes && (
                  <p className="text-red-500 text-sm mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {errors.packagesTypes}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => addArrayField('packagesTypes')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Package Type
                </button>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Schedule
              </h2>

              {/* Start Date */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Departure Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  className={`w-full md:w-1/2 px-4 py-3 rounded-lg border ${
                    errors.startDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {errors.startDate}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Announcement...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Create Announcement
                      </>
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => window.location.href = '/announcements'}
                  disabled={loading}
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

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-lg text-center border ${
                message.includes('successfully') || message.includes('🎉')
                  ? 'bg-green-50 text-green-800 border-green-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                <span className="font-medium">{message}</span>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddAnnouncements;