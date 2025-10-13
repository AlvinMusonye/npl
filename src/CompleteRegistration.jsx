import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';
const BACKGROUND_IMAGE_URL = '/loginimage.jpeg';

// NOTE: For maintainability, these shared components (GlassCard, Input, Select)
// should be extracted into their own files within a `components` directory.

const GlassCard = ({ children, className = "" }) => (
    <div
      className={`relative overflow-hidden rounded-[32px] backdrop-blur-3xl bg-white/25 border border-white/50 shadow-[0_25px_80px_rgba(15,42,29,0.2)] ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
        backdropFilter: 'blur(40px) saturate(180%) brightness(120%)',
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
);

const Input = ({ label, name, value, onChange, placeholder, type, required, disabled }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[#0F2A1D] mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 bg-white/40 border-2 border-white/60 rounded-xl text-sm text-[#0F2A1D] placeholder-[#375534]/70 focus:outline-none focus:ring-2 focus:ring-[#375534] focus:border-[#375534] backdrop-blur-sm transition-colors disabled:bg-white/20 disabled:cursor-not-allowed`}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      </div>
    </div>
);

const Select = ({ label, name, value, onChange, required, children }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-[#0F2A1D] mb-2">
            {label}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-3 bg-white/40 border-2 border-white/60 rounded-xl text-sm text-[#0F2A1D] focus:outline-none focus:ring-2 focus:ring-[#375534] focus:border-[#375534] backdrop-blur-sm transition-colors"
        >
            {children}
        </select>
    </div>
);

export default function CompleteRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { googleData } = location.state || {};

  useEffect(() => {
    if (!googleData) {
      console.warn("No Google data found, redirecting to signup.");
      navigate('/signup');
    }
  }, [googleData, navigate]);

  const [formData, setFormData] = useState({
    email: googleData?.email || '',
    first_name: googleData?.first_name || '',
    last_name: googleData?.last_name || '',
    role: '', // User must select this
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (!formData.role) {
      setError("Please select a role.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/accounts/register/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (!response.ok) {
          const errorMsg = Object.values(data).flat().join(' ');
          throw new Error(errorMsg || "Registration failed.");
      }

      alert("Registration successful! Please log in to continue.");
      navigate('/login');

    } catch (err) {
      setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  if (!googleData) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0] overflow-hidden relative font-inter">
      <div className="absolute inset-0 z-0">
        <img
          src={BACKGROUND_IMAGE_URL}
          alt="Abstract background"
          className="object-cover w-full h-full opacity-100"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">
        <GlassCard className="w-full max-w-lg p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#0F2A1D] mb-2">
              Complete Your Registration
            </h1>
            <p className="text-[#375534] text-lg">
              Welcome, {formData.first_name}! Just a few more details.
            </p>
          </div>

          {error && (
            <div className="mb-6 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg p-3 text-md animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              value={formData.email}
              type="email"
              disabled
            />
            
            <Select label="Select Your Role" name="role" value={formData.role} onChange={handleChange} required>
              <option value="" disabled>I am a...</option>
              <option value="BORROWER">Borrower</option>
              <option value="LENDER">Lender</option>
              <option value="FINANCIER">Financier</option>
              <option value="RECOVERY_PARTNER">Recovery Partner</option>
            </Select>

            <Input
              label="Create a Password"
              name="password"
              type="password"
              placeholder="Enter a password for fallback login"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Confirm Password"
              name="password2"
              type="password"
              placeholder="Confirm your password"
              value={formData.password2}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-[#375534] to-[#0F2A1D] text-white font-bold rounded-xl shadow-2xl hover:scale-[1.02] transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Completing...' : 'Complete Registration'}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}

