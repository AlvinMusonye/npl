import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { User, Mail, Phone, MapPin, CreditCard, Briefcase, DollarSign, Edit2, Save, X, Camera, Lock } from 'lucide-react';


const API_BASE_URL = 'http://127.0.0.1:8000';

const UserProfilePage = ({ setRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) throw new Error('Authentication token not found.');

        const response = await fetch(`${API_BASE_URL}/api/accounts/me/`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch profile.');
        }

        const data = await response.json();
        const profile = data.profile || {};

        const formattedData = {
          full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          email: data.email || '',
          phone_number: data.mobile_phone_number || '',
          residential_address: profile.residential_address || '',
          gov_id_type: profile.gov_id_type || 'National ID',
          gov_id_number: profile.gov_id_number || '',
          pin_number: profile.pin_number || '',
          source_of_income: profile.source_of_income || 'Employment',
          employment_status: profile.employment_status || 'Permanent',
          monthly_income_range: profile.monthly_income_range || 'Ksh 100,000 - 150,000',
          financial_status_net_worth: profile.financial_status_net_worth || 'Ksh 1M - 5M'
        };

        setProfileData(formattedData);
        setEditedData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleSave = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Authentication token not found.');

      const [firstName, ...lastNameParts] = editedData.full_name.split(' ');
      const lastName = lastNameParts.join(' ');

      const payload = {
        first_name: firstName,
        last_name: lastName,
        mobile_phone_number: editedData.phone_number,
        profile: {
          residential_address: editedData.residential_address,
          gov_id_type: editedData.gov_id_type,
          gov_id_number: editedData.gov_id_number,
          pin_number: editedData.pin_number,
          source_of_income: editedData.source_of_income,
          employment_status: editedData.employment_status,
          monthly_income_range: editedData.monthly_income_range,
          financial_status_net_worth: editedData.financial_status_net_worth,
        }
      };

      const response = await fetch(`${API_BASE_URL}/api/accounts/me/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update profile.');

      setProfileData(editedData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }

  };
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setRole(null);


    navigate('/login');
  };

  const handleCancel = () => {
    setEditedData({ ...profileData });
    setIsEditing(false);
  };
  if (loading) return <div className="min-h-screen bg-gradient-to-br from-[#d4e4d0] via-[#c8d5c0] to-[#b8cdb0] flex items-center justify-center text-gray-800">Loading Profile...</div>;
  if (error) return <div className="min-h-screen bg-gradient-to-br from-[#d4e4d0] via-[#c8d5c0] to-[#b8cdb0] flex items-center justify-center text-red-600">Error: {error}</div>;
  if (!profileData) return <div className="min-h-screen bg-gradient-to-br from-[#d4e4d0] via-[#c8d5c0] to-[#b8cdb0] flex items-center justify-center text-gray-800">Could not load profile data.</div>;

  const InputField = ({ icon: Icon, label, field, type = "text", options = null }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
        {options ? (
          <select
            value={isEditing ? editedData[field] : profileData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            disabled={!isEditing}
            className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-gray-800 outline-none focus:border-white/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={isEditing ? editedData[field] : profileData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            disabled={!isEditing}
            className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-gray-800 outline-none focus:border-white/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4e4d0] via-[#c8d5c0] to-[#b8cdb0]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/30 border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <h1 className="text-3xl font-bold text-gray-800">NPLin</h1>
              <nav className="hidden md:flex gap-8">
              <a href="/borrower" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Dashboard</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">My Assets</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Offers</a>
                <a href="/profile" className="text-gray-900 font-bold border-b-2 border-gray-800">Profile</a>
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 p-8 mb-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10 pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#c8d5c0] to-[#b8cdb0] border-4 border-white/50 shadow-xl flex items-center justify-center">
                <User className="w-16 h-16 text-gray-700" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white/40 backdrop-blur-md rounded-full border border-white/50 hover:bg-white/60 transition-all shadow-lg">
                <Camera className="w-5 h-5 text-gray-800" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">{profileData.full_name}</h2>
              <p className="text-gray-700 text-lg mb-4">{profileData.email}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/40">
                  <span className="text-sm font-semibold text-gray-700">Verified Account</span>
                </div>
                <div className="px-4 py-2 bg-green-500/30 backdrop-blur-md rounded-full border border-green-500/40">
                  <span className="text-sm font-semibold text-green-800">KYC Complete</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-8 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Edit2 className="w-5 h-5" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-500/40 backdrop-blur-md hover:bg-green-500/60 text-green-900 font-bold rounded-xl border border-green-500/40 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-red-500/40 backdrop-blur-md hover:bg-red-500/60 text-red-900 font-bold rounded-xl border border-red-500/40 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="relative overflow-hidden rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-6 h-6" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <InputField icon={User} label="Full Name" field="full_name" />
                <InputField icon={Mail} label="Email Address" field="email" type="email" />
                <InputField icon={Phone} label="Phone Number" field="phone_number" type="tel" />
                <InputField icon={MapPin} label="Residential Address" field="residential_address" />
              </div>
            </div>
          </div>

          {/* Government ID Information */}
          <div className="relative overflow-hidden rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Identification
              </h3>
              <div className="space-y-4">
                <InputField 
                  icon={CreditCard} 
                  label="ID Type" 
                  field="gov_id_type"
                  options={['National ID', 'Passport', 'Driving License']}
                />
                <InputField icon={CreditCard} label="ID Number" field="gov_id_number" />
                <InputField icon={CreditCard} label="PIN Number" field="pin_number" />
              </div>
            </div>
          </div>

          {/* Employment & Income */}
          <div className="relative overflow-hidden rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Employment Details
              </h3>
              <div className="space-y-4">
                <InputField 
                  icon={Briefcase} 
                  label="Source of Income" 
                  field="source_of_income"
                  options={['Employment', 'Business', 'Self-Employed', 'Investment']}
                />
                <InputField 
                  icon={Briefcase} 
                  label="Employment Status" 
                  field="employment_status"
                  options={['Permanent', 'Contract', 'Casual', 'Self-Employed']}
                />
                <InputField 
                  icon={DollarSign} 
                  label="Monthly Income Range" 
                  field="monthly_income_range"
                  options={[
                    'Below Ksh 50,000',
                    'Ksh 50,000 - 100,000',
                    'Ksh 100,000 - 150,000',
                    'Ksh 150,000 - 300,000',
                    'Above Ksh 300,000'
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Financial Status */}
          <div className="relative overflow-hidden rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Financial Information
              </h3>
              <div className="space-y-4">
                <InputField 
                  icon={DollarSign} 
                  label="Net Worth Range" 
                  field="financial_status_net_worth"
                  options={[
                    'Below Ksh 500K',
                    'Ksh 500K - 1M',
                    'Ksh 1M - 5M',
                    'Ksh 5M - 10M',
                    'Above Ksh 10M'
                  ]}
                />
                
                {/* Additional Info Display */}
                <div className="mt-6 p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Account Status</span>
                    <span className="text-sm font-bold text-green-700">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Member Since</span>
                    <span className="text-sm font-bold text-gray-800">January 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-8 relative overflow-hidden rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 p-8 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              Security Settings
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <button className="flex-1 px-6 py-4 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl">
                Change Password
              </button>
              <button className="flex-1 px-6 py-4 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl">
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;