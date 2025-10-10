import React, { useState, useEffect, useMemo, useRef } from 'react';
import axiosInstance from '../api/axiosInstance'; // Import the new axios instance
import { 
  Search, 
  Filter,
  MoreVertical,
  X,
  Check,
  ShieldOff,
  Eye
} from 'lucide-react';
import Notification from '../components/ui/Notification.jsx';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Reusable UI Components
const GlassCard = ({ children, className = "", ...props }) => (
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

const UserStatusBadge = ({ status }) => {
    const statusStyles = {
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        ACTIVE: 'bg-green-100 text-green-800 border-green-300',
        BLOCKED: 'bg-red-100 text-red-800 border-red-300',
        SUSPENDED: 'bg-orange-100 text-orange-800 border-orange-300',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status ? status.replace('_', ' ') : 'UNKNOWN'}
        </span>
    );
};

// User Detail Modal
const UserDetailModal = ({ user, onClose, onUpdateStatus }) => {
    if (!user) return null;

    const modalRef = useRef(null);

    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    const roleAvatars = {
        BORROWER: '👤',
        LENDER: '🏦',
        FINANCIER: '💰',
        BUYER: '🛒',
        ADMIN: '🛡️',
    };

    const profile = user.profile || {};

    // Safely parse residential_address which might be a stringified JSON
    let address = { street: 'N/A', city: 'N/A', country: 'N/A' };
    if (profile.residential_address) {
        try {
            // Replace single quotes with double quotes for valid JSON
            const validJsonString = profile.residential_address.replace(/'/g, '"');
            const parsedAddress = JSON.parse(validJsonString);
            address = { ...address, ...parsedAddress };
        } catch (e) {
            // If parsing fails, display the raw string
            address = { street: profile.residential_address, city: '', country: '' };
        }
    }

    return (
        <div className="fixed inset-0  backdrop-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div ref={modalRef} className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center text-5xl border-4 border-white shadow-lg">
                            {roleAvatars[user.role] || '❓'}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-1">{user.first_name} {user.last_name}</h2>
                            <p className="text-gray-600">{user.role}</p>
                            <div className="mt-2"><UserStatusBadge status={user.status} /></div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-[#4a6850]" />
                    </button>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-600 mb-1">Email Address</p>
                        <p className="font-semibold text-gray-900">{user.email}</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                        <p className="font-semibold text-gray-900">{user.mobile_phone_number || 'N/A'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-600 mb-1">Address</p>
                        <p className="font-semibold text-gray-900">{`${address.street}, ${address.city}`}</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-600 mb-1">Joined On</p>
                        <p className="font-semibold text-gray-900">{new Date(user.date_joined).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-600 mb-1">ID Number</p>
                        <p className="font-semibold text-gray-900">{profile.gov_id_number || 'N/A'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-600 mb-1">PIN Number</p>
                        <p className="font-semibold text-gray-900">{profile.pin_number || 'N/A'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-600 mb-1">Bank</p>
                        <p className="font-semibold text-gray-900">{profile.bank_account_details?.bank_name || 'N/A'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-600 mb-1">Account No.</p>
                        <p className="font-semibold text-gray-900">{profile.bank_account_details?.account_number || 'N/A'}</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-[#4a6850] mb-4">
                        API Actions: `POST /api/admin/accounts/{'{user.id}'}/[approve|deactivate]/`
                    </p>
                    <div className="flex gap-4">
                        {user.status !== 'ACTIVE' && (
                            <button 
                                onClick={() => onUpdateStatus(user.id, 'approve', 'ACTIVE')} 
                                className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                                <Check className="w-5 h-5" /> Approve User
                            </button>
                        )}
                        {user.status === 'ACTIVE' && (
                            <button 
                                onClick={() => onUpdateStatus(user.id, 'deactivate', 'BLOCKED')} 
                                className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                                <ShieldOff className="w-5 h-5" /> Deactivate User
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserCard = ({ user, onClick }) => {
    const roleAvatars = {
        BORROWER: '👤',
        LENDER: '🏦',
        FINANCIER: '💰',
        BUYER: '🛒',
        ADMIN: '🛡️',
    };

    return (
        <GlassCard 
            onClick={onClick}
            className="p-6 cursor-pointer group hover:scale-105 hover:shadow-2xl transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-3xl border-2 border-white/60 shadow-md">
                    {roleAvatars[user.role] || '❓'}
                </div>
                <UserStatusBadge status={user.status} />
            </div>
            <h3 className="text-lg font-bold text-[#1a3d2e] truncate">{user.first_name} {user.last_name}</h3>
            <p className="text-sm text-[#4a6850]">{user.email}</p>
            <div className="mt-4 pt-4 border-t border-white/60 flex justify-between items-center text-xs text-[#4a6850]">
                <span>{user.role}</span>
                <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
        </GlassCard>
    );
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  useEffect(() => {
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = filterStatus === 'ALL' 
                ? `/api/admin/users/`
                : `/api/admin/users/?status=${filterStatus}`;

            const response = await axiosInstance.get(url);
            // API returns a paginated object like { count: ..., results: [...] }
            // We need to use the 'results' array.
            if (response.data && Array.isArray(response.data.results)) {
                setUsers(response.data.results);
            } else {
                setUsers(response.data); // Fallback for non-paginated responses
            }
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };
    fetchUsers();
  }, [filterStatus]);

  const handleViewUser = async (userId) => {
    try {
        const response = await axiosInstance.get(`/api/admin/users/${userId}/`);
        const userDetails = response.data;
        setSelectedUser(userDetails);
    } catch (err) {
        setError(err.response?.data?.detail || err.message);
    }
  };

  const handleUpdateStatus = async (userId, action, newStatus) => {
    try {
        await axiosInstance.post(`/api/admin/accounts/${userId}/${action}/`);

        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        setSelectedUser(null);
        showNotification(`User successfully ${action}d!`, 'success');
    } catch (err) {
        showNotification(`Error: ${err.response?.data?.detail || err.message}`, 'error');
    }
  };

  const filteredUsers = useMemo(() => users.filter(user => {
    const name = `${user.first_name || ''} ${user.last_name || ''}`;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }), [users, searchQuery]);

  return (
    <>
        {notification.show && (
          <Notification message={notification.message} type={notification.type} onClear={() => setNotification({ show: false, message: '', type: '' })} />
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1a3d2e]">User Management</h1>
              <p className="mt-1 text-sm text-[#4a6850]">View, approve, and manage all platform users.</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              {['ALL', 'PENDING', 'ACTIVE', 'BLOCKED', 'SUSPENDED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`
                    px-4 py-2 text-sm font-semibold rounded-lg transition-colors
                    ${filterStatus === status 
                      ? 'bg-[#6B9071] text-white shadow-md' 
                      : 'bg-white/50 text-[#4a6850] hover:bg-white/80'
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2.5 rounded-xl bg-white/60 border-2 border-transparent focus:border-[#6B9071] focus:ring-0 w-72 transition"
                />
              </div>
              <button className="p-3 rounded-xl bg-white/60 hover:bg-white/80">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-visible">
            {loading && <div className="text-center p-8 text-[#4a6850]">Loading users...</div>}
            {error && <div className="text-center p-8 text-red-600 bg-red-100/50 rounded-xl">{error}</div>}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map(user => (
                        <UserCard 
                            key={user.id} 
                            user={user} 
                            onClick={() => handleViewUser(user.id)} 
                        />
                    ))}
                </div>
            )}
        </div>

        <UserDetailModal 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)}
            onUpdateStatus={handleUpdateStatus}
        />
    </>
  );
}
