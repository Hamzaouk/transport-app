import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Add useNavigate and Link imports

const Register = () => {
  const navigate = useNavigate(); // Add navigate hook
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    isDriver: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    // Configuration avec timeout et meilleure gestion d'erreurs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout

    try {
      // Retirer confirmPassword et préparer les données à envoyer
      const { confirmPassword, ...dataToSend } = formData;
      
      console.log('Données envoyées:', dataToSend);
      
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend),
        signal: controller.signal,
        mode: 'cors' // Ajout pour CORS
      });

      clearTimeout(timeoutId);
      console.log('Status de la réponse:', response.status);

      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.log('Réponse non-JSON:', text);
        result = { message: text || 'Server error occurred' };
      }

      console.log('Résultat reçu:', result);

      if (response.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          isDriver: false
        });
        setErrors({});
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        
      } else {
        // Gestion améliorée des erreurs
        let errorMessage = 'Registration failed. Please try again.';
        
        if (response.status === 400) {
          // Gestion des erreurs de validation
          if (result.errors && Array.isArray(result.errors)) {
            errorMessage = result.errors.map(err => err.msg || err.message).join(', ');
          } else if (result.error && Array.isArray(result.error)) {
            errorMessage = result.error.map(err => err.msg || err.message).join(', ');
          } else {
            errorMessage = result.message || result.error || 'Invalid input data';
          }
        } else if (response.status === 404) {
          // Votre backend retourne 404 pour "user exists"
          errorMessage = result.message || 'User already exists!';
        } else if (response.status === 409) {
          errorMessage = result.message || 'User already exists';
        } else if (response.status === 500) {
          errorMessage = result.message || 'Server error. Please try again later';
        } else {
          errorMessage = result.message || result.error || `Error ${response.status}: Registration failed`;
        }
        
        setMessage(errorMessage);
      }

    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Registration error:', error);
      
      if (error.name === 'AbortError') {
        setMessage('Request timeout. Server is taking too long to respond.');
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setMessage('Connection failed. Please check: 1) Server is running on port 8000, 2) No firewall blocking, 3) Correct URL');
      } else if (error.name === 'SyntaxError') {
        setMessage('Server returned invalid response. Please check server logs.');
      } else if (error.message.includes('NetworkError')) {
        setMessage('Network error. Check your internet connection.');
      } else {
        setMessage(`Error: ${error.message}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-300/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-75"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-150"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">TransportConnect</h1>
            <p className="text-white/80 text-lg">Create your account</p>
          </div>

          {/* Register container with backdrop blur */}
          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-8 shadow-2xl border border-white/30">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
                  placeholder="Enter your first name"
                  required
                />
                {errors.firstName && (
                  <p className="text-red-300 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
                  placeholder="Enter your last name"
                  required
                />
                {errors.lastName && (
                  <p className="text-red-300 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <p className="text-red-300 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                  pattern="[0-9]{10}"
                  required
                />
                {errors.phoneNumber && (
                  <p className="text-red-300 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
                  placeholder="Enter your password"
                  minLength="6"
                  required
                />
                {errors.password && (
                  <p className="text-red-300 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
                  placeholder="Confirm your password"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-300 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Driver Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDriver"
                  checked={formData.isDriver}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label className="ml-2 text-white/90 text-sm">
                  Register as a driver
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 backdrop-blur-sm border border-white/30 hover:border-white/50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Message */}
            {message && (
              <div className={`mt-5 p-3 rounded-lg text-center text-sm ${
                message.includes('successful') 
                  ? 'bg-green-500/20 text-green-100 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-100 border border-red-500/30'
              }`}>
                {message}
              </div>
            )}

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-white/80 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-white font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;