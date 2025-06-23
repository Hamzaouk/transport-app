import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DisplayAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      
      // Configure axios request with or without auth token
      const config = {
        method: 'GET',
        url: 'http://localhost:8000/api/announcements/getall',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Add auth header if user is logged in
      if (isLoggedIn && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios(config);
      setAnnouncements(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching announcements:', error);
      if (error.response?.status === 404) {
        setError('No announcements available at the moment.');
      } else if (error.response?.status === 401 && isLoggedIn) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('isLoggedIn');
      } else {
        setError('Failed to load announcements. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (announcementId) => {
    try {
      const config = {
        method: 'GET',
        url: `http://localhost:8000/api/announcements/getone/${announcementId}`,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Add auth header if user is logged in
      if (isLoggedIn && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios(config);
      setSelectedAnnouncement(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching announcement details:', error);
      alert('Failed to load announcement details.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600 text-xl">Loading announcements...</p>
          </div>
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

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Transportation Announcements
            </span>
          </h1>
          <p className="text-gray-600 text-lg mb-6">Browse available transportation routes and cargo opportunities</p>
          
          {/* CTA for non-logged in users */}
          {!isLoggedIn && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mb-8">
              <p className="text-blue-800 text-sm mb-3">Want to post your own announcement?</p>
              <div className="flex gap-2 justify-center">
                <a
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                >
                  Register
                </a>
              </div>
            </div>
          )}

          {/* Add Announcement Button for logged in users */}
          {isLoggedIn && (
            <a
              href="/announcements/add"
              className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Post New Announcement
            </a>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800 text-center">{error}</p>
            <button
              onClick={fetchAnnouncements}
              className="mt-3 mx-auto block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Announcements Grid */}
        {announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(announcement.status)}`}>
                      {announcement.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(announcement.createdAt)}
                    </span>
                  </div>

                  {/* Route Info */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="font-medium">From:</span>
                      <span className="ml-1">{announcement.startPoint}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="font-medium">To:</span>
                      <span className="ml-1">{announcement.destination}</span>
                    </div>
                  </div>

                  {/* Capacity & Date */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-600 text-xs mb-1">Available Capacity</div>
                      <div className="font-semibold text-gray-900">{announcement.availableCapacity} kg</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-600 text-xs mb-1">Start Date</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(announcement.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Package Types */}
                  {announcement.packageTypes && announcement.packageTypes.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-600 mb-2">Package Types:</div>
                      <div className="flex flex-wrap gap-1">
                        {announcement.packageTypes.slice(0, 3).map((type, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          >
                            {type}
                          </span>
                        ))}
                        {announcement.packageTypes.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            +{announcement.packageTypes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <button
                    onClick={() => handleViewDetails(announcement._id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <div className="text-center py-16">
              <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No announcements available</h3>
              <p className="text-gray-600 mb-6">Be the first to post a transportation announcement!</p>
              {isLoggedIn && (
                <a
                  href="/announcements/add"
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Post Announcement
                </a>
              )}
            </div>
          )
        )}
      </main>

      {/* Modal for Announcement Details */}
      {showModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Announcement Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Driver Info */}
              {selectedAnnouncement.driver && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Driver Information</h3>
                  <p className="text-gray-700">
                    {selectedAnnouncement.driver.firstName} {selectedAnnouncement.driver.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">{selectedAnnouncement.driver.email}</p>
                </div>
              )}

              {/* Route Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Route Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Start Point:</span>
                      <p className="font-medium">{selectedAnnouncement.startPoint}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Destination:</span>
                      <p className="font-medium">{selectedAnnouncement.destination}</p>
                    </div>
                    {selectedAnnouncement.waypoints && selectedAnnouncement.waypoints.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">Waypoints:</span>
                        <ul className="list-disc list-inside">
                          {selectedAnnouncement.waypoints.map((waypoint, index) => (
                            <li key={index} className="font-medium">{waypoint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Cargo Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Available Capacity:</span>
                      <p className="font-medium">{selectedAnnouncement.availableCapacity} kg</p>
                    </div>
                    {selectedAnnouncement.maxDimensions && (
                      <div>
                        <span className="text-sm text-gray-600">Max Dimensions:</span>
                        <p className="font-medium">
                          {selectedAnnouncement.maxDimensions.length} × {selectedAnnouncement.maxDimensions.width} × {selectedAnnouncement.maxDimensions.height} cm
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedAnnouncement.status)}`}>
                        {selectedAnnouncement.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Types */}
              {selectedAnnouncement.packageTypes && selectedAnnouncement.packageTypes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Accepted Package Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnnouncement.packageTypes.map((type, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <span className="text-sm text-gray-600">Start Date:</span>
                  <p className="font-medium">{formatDate(selectedAnnouncement.startDate)}</p>
                </div>
                {selectedAnnouncement.endDate && (
                  <div>
                    <span className="text-sm text-gray-600">End Date:</span>
                    <p className="font-medium">{formatDate(selectedAnnouncement.endDate)}</p>
                  </div>
                )}
              </div>

              {/* Contact Action */}
              {isLoggedIn && (
                <div className="border-t pt-6">
                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                    Contact Driver
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayAnnouncements;