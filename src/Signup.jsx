import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


// === CONSTANTS ===
const API_BASE_URL = 'http://127.0.0.1:8000'; 
const API_REGISTER_ENDPOINT = `${API_BASE_URL}/api/accounts/register/`;

// Placeholder image URL for the background
const BACKGROUND_IMAGE_URL = '/loginimage.jpeg'; 

// === Glass Card Component (UNCHANGED) ===
const GlassCard = ({ children, className = "", ...props }) => (
  <div
    className={`relative overflow-hidden rounded-[32px] backdrop-blur-3xl border border-white/50 shadow-[0_25px_80px_rgba(15,42,29,0.2)] ${className}`}
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

    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'BORROWER',
    
    // 👇 NEW STATE FIELDS FOR CONSENT
    agreedToTerms: false,
    consentKycVerification: false,
    consentDataForRiskTracking: false,
    consentDataForRecovery: false,
    consentElectronicCommunication: false,
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    // Check all required consents are checked
    if (!formData.agreedToTerms || !formData.consentKycVerification || !formData.consentElectronicCommunication) {
        setError("Please check all required consent boxes to proceed with registration.");
        return;
    }

    setIsLoading(true);

    try {
      // 🚨 FIX: All required fields, including the new consent fields, are mapped to snake_case.
      const payload = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName, 
        last_name: formData.lastName,
        role: formData.role,
        
        // 👇 UPDATED AND NEW CONSENT FIELDS for the API
        agreed_to_terms: formData.agreedToTerms,
        agreed_to_privacy_policy: formData.agreedToTerms, // Assuming privacy policy is bundled with main terms
        consent_kyc_verification: formData.consentKycVerification,
        consent_data_for_risk_tracking: formData.consentDataForRiskTracking,
        consent_data_for_recovery: formData.consentDataForRecovery,
        consent_electronic_communication: formData.consentElectronicCommunication,
      };

      const response = await fetch(API_REGISTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessages = 'Registration failed.';
        
        if (data) {
            errorMessages = Object.keys(data)
                .map(key => {
                    const error = data[key];
                    const message = Array.isArray(error) ? error.join(' ') : error;
                    return key === 'non_field_errors' ? message : `${key}: ${message}`;
                })
                .join(' | ');
        }
        
        throw new Error(errorMessages);
      }

      console.log("Registration successful!", data);
      setIsSuccess(true);
       // Redirect the user to the login page after a delay
       setTimeout(() => { navigate('/login'); }, 2000); 

    } catch (err) {
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderConsentCheckbox = (name, label, required = false) => (
    <div className="flex items-start">
      <div className="flex items-center h-5 mt-1">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={formData[name]}
          onChange={handleChange}
          className="focus:ring-[#0F2A1D] h-4 w-4 text-[#0F2A1D] border-gray-300 rounded cursor-pointer"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={name} className={`font-medium text-[#0F2A1D] ${required ? 'font-bold' : ''}`}>
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0] overflow-hidden relative font-inter">
      {/* Background and Navigation (UNCHANGED) */}
      <div className="absolute inset-0 z-0">
        <img
          src={BACKGROUND_IMAGE_URL}
          alt="Glassmorphism Background"
          className="object-cover h-full w-full opacity-100 " 
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1920x1080/0F2A1D/ffffff?text=NPLin+Background+Fallback'; }}
        />
      </div>
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2A1D] mb-2">Join NPLin</h1>
            <p className="text-[#375534] text-lg">Create your account to get started</p>
          </div>

          {isSuccess && (
            <div className="mt-4 text-center text-green-700 bg-green-100 border border-green-400 rounded-lg p-4 text-md font-semibold animate-fadeIn mb-6">
              ✅ Registration successful! Please check your email for verification.
            </div>
          )}

          {error && (
            <div className="mt-4 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg p-3 text-sm mb-6 animate-fadeIn">
              **Error:** {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAME, EMAIL, PASSWORD FIELDS (UNCHANGED) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" type="text" required />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" type="text" required />
            </div>
            <Input label="Email Address" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" type="email" required />
            <Input label="Password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" type="password" required />
            <Input label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" type="password" required />
            
            {/* ROLE SELECT (UNCHANGED) */}
            <div>
              <label className="block text-sm font-medium text-[#0F2A1D] mb-2">I am a...</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                className="w-full px-4 py-3 bg-white/40 border-2 border-white/60 rounded-xl text-sm text-[#0F2A1D] focus:outline-none focus:ring-2 focus:ring-[#375534] focus:border-[#375534] transition-colors appearance-none cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}
              >
                <option value="BORROWER">Borrower</option>
                <option value="LENDER">Lender</option>
                <option value="FINANCIER">Financier</option>
                <option value="RECOVERY_PARTNER">Recovery Partner</option>
              </select>
            </div>

            {/* --- ADVANCED CONSENT SECTION --- */}
            <div className="pt-4 border-t border-white/70 space-y-3">
                <h3 className="text-lg font-bold text-[#0F2A1D]">Required Consents</h3>
                
                {/* 1. Main Terms & Conditions (REQUIRED) */}
                {renderConsentCheckbox(
                    "agreedToTerms", 
                    <span>I agree to the <a href="/terms" className="text-[#0F2A1D] font-semibold hover:underline">Terms & Conditions</a> and Privacy Policy</span>, 
                    true
                )}

                {/* 2. KYC Verification (REQUIRED) */}
                {renderConsentCheckbox(
                    "consentKycVerification", 
                    "Consent to use data for KYC and identity verification purposes.", 
                    true
                )}
                
                {/* 3. Electronic Communication (REQUIRED) */}
                {renderConsentCheckbox(
                    "consentElectronicCommunication", 
                    "Consent to receive electronic communications regarding my account and transactions.", 
                    true
                )}
                
                <h3 className="text-lg font-bold text-[#0F2A1D] pt-4">Data Processing Consents</h3>

                {/* 4. Risk Tracking (Optional/Default True) */}
                {renderConsentCheckbox(
                    "consentDataForRiskTracking", 
                    "Consent to use anonymized data for risk modeling and tracking.", 
                    false
                )}

                {/* 5. Recovery Data (Optional/Default True) */}
                {renderConsentCheckbox(
                    "consentDataForRecovery", 
                    "Consent to share limited data with registered Recovery Partners (if applicable).", 
                    false
                )}
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-[#375534] to-[#0F2A1D] text-white font-bold rounded-xl shadow-2xl hover:scale-[1.02] transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              disabled={isLoading || !formData.agreedToTerms || !formData.consentKycVerification || !formData.consentElectronicCommunication || isSuccess}
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

// Reusable Input Component (for cleaner JSX - UNCHANGED)
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