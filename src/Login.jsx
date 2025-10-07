import React, { useState } from 'react';

// === CONSTANTS ===
const API_BASE_URL = 'http://127.0.0.1:8000'; 
const API_LOGIN_ENDPOINT = `${API_BASE_URL}/api/accounts/login/`;
const BACKGROUND_IMAGE_URL = '/loginimage.jpeg'; 


// Role enum values from the backend
const BACKEND_ROLES = {
    BORROWER: "BORROWER",
    LENDER: "LENDER",
    RECOVERY_PARTNER: "RECOVERY_PARTNER",
    ADMIN: "ADMIN",
};

// Map backend role values to specific frontend dashboard paths
// NOTE: These paths must match the routes defined in App.jsx (e.g., '/admin' instead of '/admin-dashboard')
const DASHBOARD_PATHS = {
    [BACKEND_ROLES.ADMIN]: "/admin",
    [BACKEND_ROLES.BORROWER]: "/borrower",
    [BACKEND_ROLES.LENDER]: "/lender",
    [BACKEND_ROLES.RECOVERY_PARTNER]: "/recovery",
    "DEFAULT": "/dashboard" // Fallback path
};

// === Glass Card Component ===
const GlassCard = ({ children, className = "", ...props }) => (
  <div
    className={`relative overflow-hidden rounded-[32px] backdrop-blur-3xl bg-white/25 border border-white/50 shadow-[0_25px_80px_rgba(15,42,29,0.2)] ${className}`}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
      backdropFilter: 'blur(40px) saturate(180%) brightness(120%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%) brightness(120%)',
      boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.6), 0 25px 80px rgba(15,42,29,0.2)',
    }}
    {...props}
  >
    {/* Decorative blur elements and borders for the glass effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/25 to-transparent opacity-90"></div>
    <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/70 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/40 rounded-full blur-2xl"></div>
    <div className="absolute top-8 right-8 w-32 h-32 bg-white/50 rounded-full blur-xl"></div>
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-transparent via-white/60 to-transparent"></div>
    <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-white/40 to-transparent"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

// Reusable Input Component
const Input = ({ label, name, value, onChange, placeholder, type, required }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[#0F2A1D] mb-2">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-white/40 border-2 border-white/60 rounded-xl text-sm text-[#0F2A1D] placeholder-[#375534]/70 focus:outline-none focus:ring-2 focus:ring-[#375534] focus:border-[#375534] backdrop-blur-sm transition-colors"
        style={{
          background: 'rgba(255,255,255,0.3)',
          backdropFilter: 'blur(10px)',
        }}
        placeholder={placeholder}
        required={required}
      />
    </div>
);


// === Login Page Component ===
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userRole, setUserRole] = useState(''); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSuccess(false);
    setUserRole('');
    setIsLoading(true);

    if (!API_BASE_URL) {
      setError('API URL is not configured. Please check the API_BASE_URL constant.');
      setIsLoading(false);
      return;
    }

    try {
      const payload = { email: formData.email, password: formData.password };
      
      const response = await fetch(API_LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid credentials. Please try again.');
      }
      
      // --- START: Role Determination using actual API response ---
      // 1. Get the actual role from the API response (e.g., "ADMIN", "LENDER")
      const determinedRole = data.user.role;
      
      // 2. Determine the redirect path using the actual role
      const redirectPath = DASHBOARD_PATHS[determinedRole] || DASHBOARD_PATHS.DEFAULT;
      // --- END: Role Determination ---


      // 1. Store tokens 
      localStorage.setItem('accessToken', data.tokens.access);
      localStorage.setItem('refreshToken', data.tokens.refresh);
      // 2. Store the determined role
      localStorage.setItem('userRole', determinedRole);
      
      // 3. Update state and initiate redirection
      setUserRole(determinedRole);
      setIsSuccess(true);
      
      console.log(`Login successful as ${determinedRole}! Redirecting to ${redirectPath}...`, data);
      
      // Redirect to the role-specific dashboard path
      setTimeout(() => {
          window.location.href = redirectPath;
      }, 500); 

    } catch (err) {
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0] overflow-hidden relative font-inter">
              {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={BACKGROUND_IMAGE_URL}
          alt="Abstract background"
          className="object-cover w-full h-full opacity-100"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1920x1080/0F2A1D/ffffff?text=NPLin+Background'; }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-[#0F2A1D]">
              NPLin
            </a>
            <a  
              href="/signup" 
              className="px-6 py-2 bg-white/20 backdrop-blur-xl rounded-full text-[#0F2A1D] font-medium hover:bg-white/40 transition-all duration-300 shadow-lg"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4 sm:px-6 lg:px-8 py-12">
        <GlassCard className="w-full max-w-md p-6 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2A1D] mb-2">
              Welcome Back
            </h1>
            <p className="text-[#375534] text-lg">
              Sign in to your NPLin account
            </p>
          </div>

          {isSuccess && (
            <div className="mt-4 text-center text-green-700 bg-green-100 border border-green-400 rounded-lg p-4 text-md font-semibold animate-fadeIn mb-6">
              ✅ Login successful as **{userRole.replace('_', ' ')}**! Redirecting...
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg p-3 text-sm mb-6 animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <Input
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="npl@gmail.com"
              type="email"
              required
            />

            <Input
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              type="password"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#375534] bg-white/25 border-white/40 rounded focus:ring-[#375534]/70"
                />
                <span className="ml-2 text-sm text-[#375534]">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#0F2A1D] font-medium hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-[#375534] to-[#0F2A1D] text-white font-bold rounded-xl shadow-2xl hover:scale-[1.02] transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#375534] text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-[#0F2A1D] font-semibold hover:underline">
                Create one
              </a>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
