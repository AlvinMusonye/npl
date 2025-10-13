import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';



// === CONSTANTS ===
const API_BASE_URL = 'http://127.0.0.1:8000'; 
const API_REGISTER_ENDPOINT = `${API_BASE_URL}/api/accounts/register/`;

// Placeholder image URL for the background
const BACKGROUND_IMAGE_URL = '/loginimage.jpeg'; 

// Role enum values from the backend
const BACKEND_ROLES = {
  BORROWER: "BORROWER",
  LENDER: "LENDER",
  FINANCIER: "FINANCIER",
  RECOVERY_PARTNER: "RECOVERY_PARTNER",
  ADMIN: "ADMIN",
};

// Map backend role values to specific frontend dashboard paths
const DASHBOARD_PATHS = {
  [BACKEND_ROLES.ADMIN]: "/admin",
  [BACKEND_ROLES.BORROWER]: "/borrower",
  [BACKEND_ROLES.LENDER]: "/lender",
  [BACKEND_ROLES.FINANCIER]: "/financier",
  [BACKEND_ROLES.RECOVERY_PARTNER]: "/recovery",
  "DEFAULT": "/dashboard" // Fallback path
};

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

const SearchableDropdown = ({ label, name, value, onChange, options, placeholder }) => {
  const [searchText, setSearchText] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSearchText(value || '');
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange({ target: { name, value: option } });
    setSearchText(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-[#0F2A1D] mb-2">{label}</label>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/40 border-2 border-white/60 rounded-xl text-sm text-[#0F2A1D] placeholder-[#375534]/70 focus:outline-none focus:ring-2 focus:ring-[#375534] focus:border-[#375534] backdrop-blur-sm transition-colors"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white/80 backdrop-blur-md border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
          {filteredOptions.map(option => (
            <li key={option} onClick={() => handleSelect(option)} className="px-4 py-2 cursor-pointer hover:bg-white/60 text-[#0F2A1D]">
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const africanCountries = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde",
  "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo, Democratic Republic of the",
  "Congo, Republic of the", "Cote d'Ivoire", "Djibouti", "Egypt", "Equatorial Guinea",
  "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau",
  "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania",
  "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe",
  "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan",
  "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
];

const countryCodes = [
  { name: 'Kenya', code: '+254' },
  { name: 'Uganda', code: '+256' },
  { name: 'Tanzania', code: '+255' },
  { name: 'Nigeria', code: '+234' },
  { name: 'Ghana', code: '+233' },
  { name: 'South Africa', code: '+27' },
  { name: 'Egypt', code: '+20' },
  { name: 'Algeria', code: '+213' },
  { name: 'Angola', code: '+244' },
  { name: 'Benin', code: '+229' },
  { name: 'Botswana', code: '+267' },
  { name: 'Burkina Faso', code: '+226' },
  { name: 'Burundi', code: '+257' },
  { name: 'Cameroon', code: '+237' },
  { name: 'Chad', code: '+235' },
  { name: 'Comoros', code: '+269' },
  { name: 'Congo, Dem. Rep.', code: '+243' },
  { name: 'Congo, Rep.', code: '+242' },
  { name: 'Djibouti', code: '+253' },
  { name: 'Eritrea', code: '+291' },
  { name: 'Ethiopia', code: '+251' },
  { name: 'Gabon', code: '+241' },
  { name: 'Gambia', code: '+220' },
  { name: 'Guinea', code: '+224' },
  { name: 'Lesotho', code: '+266' },
  { name: 'Liberia', code: '+231' },
  { name: 'Libya', code: '+218' },
  { name: 'Madagascar', code: '+261' },
  { name: 'Malawi', code: '+265' },
  { name: 'Mali', code: '+223' },
  { name: 'Mauritania', code: '+222' },
  { name: 'Mauritius', code: '+230' },
  { name: 'Morocco', code: '+212' },
  { name: 'Mozambique', code: '+258' },
  { name: 'Namibia', code: '+264' },
  { name: 'Niger', code: '+227' },
  { name: 'Rwanda', code: '+250' },
  { name: 'Senegal', code: '+221' },
  { name: 'Sierra Leone', code: '+232' },
  { name: 'Somalia', code: '+252' },
  { name: 'Sudan', code: '+249' },
  { name: 'Togo', code: '+228' },
  { name: 'Tunisia', code: '+216' },
  { name: 'Zambia', code: '+260' },
  { name: 'Zimbabwe', code: '+263' },
  { name: 'USA', code: '+1' },
  { name: 'UK', code: '+44' }
];

// === Signup Page Component ===
export default function SignupPage({ setRole }) {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'BORROWER',

    // New fields from your JSON structure
    country_code: '+254',
    mobile_phone_number: '',
    date_of_birth: '',
    nationality: 'Kenyan',
    country: 'Kenya',
    city: '',
    street_address: '',
    postal_code: '',

    // Expanded consents
    agreedToRequiredConsents: false,
    agreedToDataProcessing: false,
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
  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    console.log("Received Google ID Token on Signup");
    setError('');
    setIsLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/accounts/google-login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token: idToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Google authentication with backend failed.');
        }

        // Case 1: Existing user - Login was successful, backend returns tokens
        if (data.tokens) {
            console.log("Existing user found via Google, logging in...");
            
            const determinedRole = data.user.role.toUpperCase();
            const redirectPath = DASHBOARD_PATHS[determinedRole] || DASHBOARD_PATHS.DEFAULT;

            // Store tokens and user data
            localStorage.setItem('accessToken', data.tokens.access);
            localStorage.setItem('refreshToken', data.tokens.refresh);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('userRole', determinedRole);

            // Update state and redirect
            setRole(determinedRole);
            setIsSuccess(true);
            
            navigate(redirectPath);
        } 
        // Case 2: New user - Needs to complete registration
        else if (data.status === 'new_user') {
            console.log("New user, redirecting to complete registration...");
            navigate('/complete-registration', { state: { googleData: data } });
        } else {
            throw new Error('Unexpected response from backend during Google Sign-In.');
        }
    } catch (err) {
        setError(err.message || 'An error occurred during Google sign-in.');
    } finally {
        setIsLoading(false);
    }
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
    if (!formData.agreedToRequiredConsents) {
        setError("You must agree to the required terms and consents to proceed.");
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
        
        // New fields for the API
        mobile_phone_number: `${formData.country_code}${formData.mobile_phone_number}`,
        date_of_birth: formData.date_of_birth,
        nationality: formData.nationality,
        residential_address: {
            country: formData.country,
            city: formData.city,
            street_address: formData.street_address,
            postal_code: formData.postal_code,
        },

        agreed_to_terms: formData.agreedToRequiredConsents,
        agreed_to_privacy_policy: formData.agreedToRequiredConsents, // Assuming privacy policy is bundled with main terms
        consent_kyc_verification: formData.agreedToRequiredConsents,
        consent_electronic_communication: formData.agreedToRequiredConsents,
        consent_data_for_risk_tracking: formData.agreedToDataProcessing,
        consent_data_for_recovery: formData.agreedToDataProcessing,
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
      {/* Background Image */}
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
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8 py-12">
        <GlassCard className="w-full max-w-5xl p-6 sm:p-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left-side Text */}
            <div className="text-center lg:text-left">
              <div className="mb-8">
                <h1 className="text-2xl lg:text-4xl font-extrabold text-[#0F2A1D] mb-4 leading-tight">
                  Join NPLin
                </h1>
                <p className="text-[#375534] text-md lg:text-lg leading-relaxed">
                  Create your account to get started and unlock a new world of financial opportunities.
                </p>
              </div>

              {/* --- Consent Section for desktop --- */}
              <div className="hidden lg:block space-y-6 pt-2">
                <div className="pt-4 border-t border-white/70 space-y-3">
                  <h3 className="text-base font-bold text-[#0F2A1D]">Required Consents</h3>
                  {renderConsentCheckbox(
                      "agreedToRequiredConsents",
                      <span>By checking this box, I agree to the <a href="/terms" className="text-[#0F2A1D] font-semibold hover:underline">Terms & Conditions</a>, Privacy Policy, and consent to KYC verification and electronic communications.</span>,
                      true
                  )}
                </div>
                <div className="pt-4 border-t border-white/70 space-y-3">
                  <h3 className="text-base font-bold text-[#0F2A1D]">Data Processing Consents</h3>
                  {renderConsentCheckbox(
                      "agreedToDataProcessing",
                      "I consent to share limited data with registered Recovery Partners (if applicable).",
                      false
                  )}
                </div>
              </div>
            </div>

            {/* Right-side Form */}
            <div>
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

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Form fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" type="text" required />
                      <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" type="text" required />
                    </div>
                    <Input label="Email Address" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" type="email" required />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" type="password" required />
                      <Input label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" type="password" required />
                    </div>

                    {/* Phone Number with Country Code */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F2A1D] mb-2">Mobile Phone Number</label>
                      <div className="flex">
                        <select name="country_code" value={formData.country_code} onChange={handleChange} className="px-3 py-3 bg-white/40 border-2 border-r-0 border-white/60 rounded-l-xl text-sm text-[#0F2A1D] focus:outline-none focus:ring-2 focus:ring-[#375534] focus:border-[#375534] transition-colors appearance-none cursor-pointer">
                          {countryCodes.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                        </select>
                        <input
                          type="tel"
                          name="mobile_phone_number"
                          value={formData.mobile_phone_number}
                          onChange={handleChange}
                          placeholder="712345678"
                          required
                          className="w-full px-4 py-3 bg-white/40 border-2 border-white/60 rounded-r-xl text-sm text-[#0F2A1D] placeholder-[#375534]/70 focus:outline-none focus:ring-2 focus:ring-[#375534] focus:border-[#375534] backdrop-blur-sm transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Date of Birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" required />
                      <SearchableDropdown
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        options={africanCountries}
                        placeholder="Search for a country..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Nairobi" type="text" required />
                      <Input label="Street Address" name="street_address" value={formData.street_address} onChange={handleChange} placeholder="123 Kimathi St" type="text" required />
                      <Input label="Postal Code" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="00100" type="text" required />
                    </div>
                    <SearchableDropdown
                      label="Nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      options={africanCountries}
                      placeholder="Search for a nationality..."
                    />

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
                        <option value="FINANCIER">Investor / Financier</option>
                        <option value="BUYER">Buyer</option>
                      </select>
                    </div>

                {/* --- Consent Section for mobile --- */}
                <div className="lg:hidden space-y-6 pt-2">
                  <div className="pt-4 border-t border-white/70 space-y-3 mt-4">
                    <h3 className="text-lg font-bold text-[#0F2A1D]">Required Consents</h3>
                    {renderConsentCheckbox(
                        "agreedToRequiredConsents",
                        <span>By checking this box, I agree to the <a href="/terms" className="text-[#0F2A1D] font-semibold hover:underline">Terms & Conditions</a>, Privacy Policy, and consent to KYC verification and electronic communications.</span>,
                        true
                    )}
                  </div>
                  <div className="pt-4 border-t border-white/70 space-y-3 mt-4">
                    <h3 className="text-lg font-bold text-[#0F2A1D]">Data Processing Consents</h3>
                    {renderConsentCheckbox(
                        "agreedToDataProcessing",
                        "I consent to share limited data with registered Recovery Partners (if applicable).",
                        false
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full !mt-6 px-6 py-3 bg-gradient-to-r from-[#375534] to-[#0F2A1D] text-white font-bold rounded-xl shadow-2xl hover:scale-[1.02] transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  disabled={isLoading || !formData.agreedToRequiredConsents || isSuccess}
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
              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-white/40"></div>
                <span className="flex-shrink mx-4 text-sm text-[#375534]">Or sign up with</span>
                <div className="flex-grow border-t border-white/40"></div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    console.log('Google Login Failed');
                    setError('Google signup failed. Please try again.');
                  }}
                  useOneTap
                  theme="outline"
                />
              </div>

              <div className="mt-8 text-center">
                <p className="text-[#375534] text-sm">
                  Already have an account?{' '}
                  <a href="/login" className="text-[#0F2A1D] font-semibold hover:underline">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
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