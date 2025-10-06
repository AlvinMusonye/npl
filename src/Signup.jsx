import React, { useState } from 'react';

// === CONSTANTS ===
// NOTE: Replaced process.env.NEXT_PUBLIC_API_URL, which causes the 'process is not defined' error, 
// with a direct placeholder URL. Update this to your correct API base URL.
const API_BASE_URL = 'http://127.0.0.1:8000'; 
const API_REGISTER_ENDPOINT = `${API_BASE_URL}/api/accounts/register/`;

// Placeholder image URL for the background
const BACKGROUND_IMAGE_URL = '/loginimage.jpeg';

// === Glass Card Component ===
const GlassCard = ({ children, className = "", ...props }) => (
  <div
    className={`relative overflow-hidden rounded-[32px] backdrop-blur-3xl  border border-white/50 shadow-[0_25px_80px_rgba(15,42,29,0.2)] ${className}`}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
      backdropFilter: 'blur(40px) saturate(180%) brightness(120%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%) brightness(120%)',
      boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.6), 0 25px 80px rgba(15,42,29,0.2)',
    }}
    {...props}
  >
    {/* Decorative blur elements */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/25 to-transparent opacity-90"></div>
    <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/70 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/40 rounded-full blur-2xl"></div>
    <div className="absolute top-8 right-8 w-32 h-32 bg-white/50 rounded-full blur-xl"></div>
    {/* Border highlights */}
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-transparent via-white/60 to-transparent"></div>
    <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-white/40 to-transparent"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

// === Signup Page Component ===
export default function SignupPage() {
  // We cannot use Next.js's useRouter, so we'll use a success state instead.
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'BORROWER',
    agreed_to_terms: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New state for success feedback

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSuccess(false);
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_REGISTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          agreed_to_terms: formData.agreed_to_terms,
          agreed_to_privacy_policy: formData.agreed_to_terms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server-side validation errors
        const errorMessages = Object.values(data).flat().join(' ');
        throw new Error(errorMessages || 'An error occurred during registration.');
      }

      // Simulation of successful routing in a single file environment
      console.log("Registration successful!", data);
      setIsSuccess(true);
      // Optionally reset form data here: setFormData(initialFormData);

    } catch (err) {
      // Handle network errors or custom server errors
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0] overflow-hidden relative font-inter">
      {/* Background Image (using standard img tag) */}
      <div className="absolute inset-0 z-0">
        <img
          src={BACKGROUND_IMAGE_URL}
          alt="Glassmorphism Background"
          className="object-cover w-full h-full opacity-30" // Lower opacity to match the soft aesthetic
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1920x1080/0F2A1D/ffffff?text=NPLin+Background+Fallback'; }}
        />
      </div>

      {/* Navigation (using a tags instead of Link) */}
      <nav className="relative z-20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold font-[var(--font-secondary)] text-[#0F2A1D]">
              NPLin
            </a>
            <a  
              href="/login" 
              className="px-6 py-2 bg-white/20 backdrop-blur-xl rounded-full text-[#0F2A1D] font-medium hover:bg-white/40 transition-all duration-300 shadow-lg"
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4 sm:px-6 lg:px-8 py-12">
        <GlassCard className="w-full max-w-lg p-6 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2A1D] mb-2">
              Join NPLin
            </h1>
            <p className="text-[#375534] text-lg">
              Create your account to get started
            </p>
          </div>

          {isSuccess && (
            <div className="mt-4 text-center text-green-700 bg-green-100 border border-green-400 rounded-lg p-4 text-md font-semibold animate-fadeIn mb-6">
              ✅ Registration successful! Redirecting to login...
            </div>
          )}

          {/* Error Display (placed here for better visibility) */}
          {error && (
            <div className="mt-4 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg p-3 text-sm mb-6 animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                type="text"
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                type="text"
                required
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
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

            <Input
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              type="password"
              required
            />

            <div>
              <label className="block text-sm font-medium text-[#0F2A1D] mb-2">
                I am a...
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                className="w-full px-4 py-3 bg-white/40 border-2 border-white/60 rounded-xl text-sm text-[#0F2A1D] focus:outline-none focus:ring-2 focus:ring-[#375534] focus:border-[#375534] transition-colors appearance-none cursor-pointer"
                style={{
                    background: 'rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)',
                }}
              >
                <option value="BORROWER">Borrower</option>
                <option value="LENDER">Lender</option>
                <option value="RECOVERY_PARTNER">Recovery Partner</option>
              </select>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5 mt-1">
                <input
                  id="terms"
                  name="agreed_to_terms"
                  type="checkbox"
                  checked={formData.agreed_to_terms}
                  onChange={handleChange}
                  className="focus:ring-[#0F2A1D] h-4 w-4 text-[#0F2A1D] border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-[#0F2A1D]">
                  I agree to the <a href="/terms" className="text-[#0F2A1D] font-semibold hover:underline">Terms and Conditions</a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-[#375534] to-[#0F2A1D] text-white font-bold rounded-xl shadow-2xl hover:scale-[1.02] transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              disabled={isLoading || !formData.agreed_to_terms || isSuccess}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#375534] text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-[#0F2A1D] font-semibold hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// Reusable Input Component (for cleaner JSX)
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