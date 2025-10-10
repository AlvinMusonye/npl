import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { User, Mail, Phone, Edit, Save, X } from 'lucide-react';
import Notification from '../components/ui/Notification.jsx';

// Reusable UI Components (local to this file for now)
const GlassCard = ({ children, className = '', ...props }) => (
  <div
    className={`relative overflow-hidden rounded-3xl bg-white/40 border border-white/60 shadow-xl ${className}`}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
    }}
    {...props}
  >
    <div className="relative z-10">{children}</div>
  </div>
);

const DashboardHeader = ({ title, subtitle }) => (
  <header className="pb-4 mb-8 border-b border-[#6B9071]/30">
    <h1 className="text-3xl font-bold text-[#1a3d2e]">{title}</h1>
    <p className="mt-1 text-sm text-[#4a6850]">{subtitle}</p>
  </header>
);

const ProfileField = ({ label, value, Icon, isEditing, onChange, name, type = 'text' }) => (
    <div>
        <label className="text-sm font-medium text-[#4a6850]">{label}</label>
        <div className="mt-1 relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            {isEditing ? (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/70 border-2 border-white/60 rounded-xl focus:ring-2 focus:ring-[#6B9071] outline-none transition"
                />
            ) : (
                <p className="w-full pl-10 pr-4 py-2.5 bg-white/30 border-2 border-transparent rounded-xl text-[#1a3d2e] font-semibold">
                    {value || 'N/A'}
                </p>
            )}
        </div>
    </div>
);

export default function AdminProfile() {
    const [profile, setProfile] = useState(null);
    const [editedProfile, setEditedProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const showNotification = (message, type = 'info') => {
        setNotification({ show: true, message, type });
    };

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get('/api/accounts/me/');
                setProfile(response.data);
                setEditedProfile(response.data);
            } catch (err) {
                setError(err.response?.data?.detail || err.message || 'Failed to fetch profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                first_name: editedProfile.first_name,
                last_name: editedProfile.last_name,
                other_names: editedProfile.other_names,
                mobile_phone_number: editedProfile.mobile_phone_number,
            };
            const response = await axiosInstance.patch('/api/accounts/me/', payload);
            setProfile(response.data);
            setIsEditing(false);
            showNotification('Profile updated successfully!', 'success');
        } catch (err) {
            showNotification(`Update failed: ${err.response?.data?.detail || err.message}`, 'error');
        }
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    return (
        <>
            {notification.show && (
                <Notification message={notification.message} type={notification.type} onClear={() => setNotification({ show: false, message: '', type: '' })} />
            )}
            <DashboardHeader 
                title="My Profile & Settings" 
                subtitle="Manage your administrator account details and preferences." 
            />
            {loading && <div className="text-center p-8 text-[#4a6850]">Loading profile...</div>}
            {error && <div className="text-center p-8 text-red-600 bg-red-100/50 rounded-xl">Error: {error}</div>}
            {!loading && profile && (
                <GlassCard className="p-8 max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-[#1a3d2e]">Account Information</h3>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-[#6B9071]/80 text-white font-semibold rounded-lg hover:bg-[#6B9071] transition">
                                <Edit size={16} /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600/90 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                                    <Save size={16} /> Save
                                </button>
                                <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-red-600/90 text-white font-semibold rounded-lg hover:bg-red-700 transition">
                                    <X size={16} /> Cancel
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField label="First Name" name="first_name" value={editedProfile.first_name} Icon={User} isEditing={isEditing} onChange={handleInputChange} />
                        <ProfileField label="Last Name" name="last_name" value={editedProfile.last_name} Icon={User} isEditing={isEditing} onChange={handleInputChange} />
                        <ProfileField label="Other Names" name="other_names" value={editedProfile.other_names} Icon={User} isEditing={isEditing} onChange={handleInputChange} />
                        <ProfileField label="Mobile Phone" name="mobile_phone_number" value={editedProfile.mobile_phone_number} Icon={Phone} isEditing={isEditing} onChange={handleInputChange} />
                        <ProfileField label="Email Address" name="email" value={profile.email} Icon={Mail} isEditing={false} />
                        <ProfileField label="Role" name="role" value={profile.role} Icon={User} isEditing={false} />
                        <ProfileField label="Status" name="status" value={profile.status} Icon={User} isEditing={false} />
                        <ProfileField label="Date Joined" name="date_joined" value={new Date(profile.date_joined).toLocaleDateString()} Icon={User} isEditing={false} />
                    </div>
                </GlassCard>
            )}
        </>
    );
}