import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
    LayoutDashboard, Users, Gavel, FileText, Wallet, Settings, List, XCircle, Menu, Building, TrendingUp, Handshake, 
    Bot, Zap, Lock, Store, Check, X, ArrowRight, CreditCard, Search, ShieldOff, Eye

} from 'lucide-react';

// =========================================================================
// 1. CONSTANTS & CONFIG
// =========================================================================

const API_BASE_URL = 'http://127.0.0.1:8000';

// =========================================================================
// 1. REUSABLE UI COMPONENTS (Glassmorphism & Layout)
// =========================================================================

// Glass Card Component
const GlassCard = ({ children, className = "", ...props }) => (
  <div 
    className={`relative overflow-hidden rounded-3xl bg-white/40 border border-white/60 shadow-xl ${className}`}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    }}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-80"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

// Header Component
const DashboardHeader = ({ title, subtitle }) => (
  <header className="pb-4 mb-8 border-b border-[#6B9071]/30">
    <h1 className="text-3xl font-bold text-[#1a3d2e]">{title}</h1>
    <p className="mt-1 text-sm text-[#4a6850]">{subtitle}</p>
  </header>
);

// Operational Metric Card for Overview
const OperationalCard = ({ title, count, link, Icon, apiAction, linkText, onClick }) => (
    <a href={link} onClick={(e) => { e.preventDefault(); onClick && onClick(); }} className="block hover:scale-105 transition-all duration-300 ease-out cursor-pointer">

        <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <Icon className="w-8 h-8 text-[#6B9071]" />
                <span className="text-xs text-[#4a6850] px-2 py-1 bg-[#C8E6C8]/50 rounded-full">{apiAction}</span>
            </div>
            <div className="mt-4">
                <div className="text-4xl font-extrabold text-red-600">{count}</div>
                <div className="text-lg font-medium text-[#1a3d2e] mt-1">{title}</div>
            </div>
            <div className="mt-4 text-sm flex items-center text-[#6B9071] hover:text-[#4a6850]">
                {linkText} <ArrowRight className="w-4 h-4 ml-1" />
            </div>
        </GlassCard>
    </a>
);

// Status Badge Component for User Status
const UserStatusBadge = ({ status }) => {
    const statusStyles = {
        PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
        ACTIVE: 'bg-green-100 text-green-800 border border-green-300',
        BLOCKED: 'bg-red-100 text-red-800 border border-red-300',
        SUBMITTED: 'bg-blue-100 text-blue-800 border border-blue-300',
        SUSPENDED: 'bg-orange-100 text-orange-800 border border-orange-300',

    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};


// =========================================================================
// 2. DASHBOARD PAGE COMPONENTS (MIMICKING pages/ directory)
// =========================================================================

// 1. Main Admin Dashboard (Landing Page) 🏠
const OverviewPage = ({ data, setCurrentPage }) => {
    if (!data || !data.system_summary) {
        return (
            <GlassCard className="p-8 h-64 flex items-center justify-center text-red-600">
                Could not load dashboard summary data.
            </GlassCard>
        );
    }

    const { pending_users, pending_assets, pending_documents } = data.system_summary;
    const { manage_accounts_url, review_assets_url, review_documents_url } = data;
  
  
    return (
      <>
        <DashboardHeader 
          title="Executive Dashboard: Mission Control" 
          subtitle="Highest priority actions for account activation, listing approval, and compliance document processing." 
        />
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-[#1a3d2e] mb-6">System Summary & Priority Queues 🔥</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OperationalCard
              title="Pending Users for Approval"
              count={pending_users}
              link="#"
              Icon={Users}
              apiAction={`GET ${manage_accounts_url}`}
              linkText="Manage Accounts"
              onClick={() => setCurrentPage('users')}
            />
            <OperationalCard
              title="Pending Assets for Verification"
              count={pending_assets}
              link="#"
              Icon={Gavel}
              apiAction={`GET ${review_assets_url}`}
              linkText="Review Listings"
              onClick={() => setCurrentPage('assets')}
            />
            <OperationalCard
              title="Pending Documents for Review"
              count={pending_documents}
              link="#"
              Icon={FileText}
              apiAction={`GET ${review_documents_url}`}
              linkText="Process Documents"
              onClick={() => setCurrentPage('documents')}
            />
          </div>
        </section>
        
        <section className="mt-10">
           <h2 className="text-2xl font-semibold text-[#1a3d2e] mb-6">Marketplace KPIs (Simulated)</h2>
           <GlassCard className="p-8 h-64 flex items-center justify-center text-[#4a6850]">
              [KPI Charts for Active Listings, GMV, and STR would be displayed here]
           </GlassCard>
        </section>
      </>
    );
};

// User Detail Modal Component
const UserDetailModal = ({ user, onClose, onApprove, onReject, onSuspend }) => {
    if (!user) return null;

    // Defensive check for profile and documents which might not exist on all user objects
    const profile = user.profile || { phone_number: 'N/A', address: 'N/A' };
    const documents = user.documents || [];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <GlassCard className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold text-[#1a3d2e]">{user.first_name} {user.last_name}</h3>
                        <p className="text-sm text-[#4a6850] mt-1">{user.email} | <span className="font-semibold">{user.role}</span></p>
                        <div className="mt-2"><UserStatusBadge status={user.status} /></div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50 transition-colors">
                        <X className="w-6 h-6 text-[#4a6850]" />
                    </button>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#6B9071]/30 pt-6">
                    <div>
                        <h4 className="font-semibold text-[#1a3d2e] mb-2">User Profile</h4>
                        <p className="text-sm text-[#4a6850]"><span className="font-medium">Phone:</span> {profile.phone_number}</p>
                        <p className="text-sm text-[#4a6850]"><span className="font-medium">Address:</span> {profile.address}</p>
                        <p className="text-sm text-[#4a6850]"><span className="font-medium">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#1a3d2e] mb-2">Submitted Documents</h4>
                        {documents.length > 0 ? (
                            <ul className="space-y-2">
                                {documents.map(doc => (
                                    <li key={doc.id} className="flex justify-between items-center text-sm p-2 bg-white/30 rounded-lg">
                                        <span>{doc.type}</span>
                                        <UserStatusBadge status={doc.status} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-[#4a6850]">No documents submitted.</p>
                        )}
                    </div>
                </div>

                <div className="mt-8 border-t border-[#6B9071]/30 pt-6">
                    <p className="text-sm text-[#4a6850] mb-4">
                    **API Actions:** `PATCH /api/admin/users/{user.id}/[approve|reject]/` or `PATCH /api/admin/accounts/{user.id}/suspend/`
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => onApprove(user.id)} 
                            className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                            <Check className="w-5 h-5" /> Approve User
                        </button>
                        <button 
                            onClick={() => onSuspend(user.id)} 
                            className="flex-1 py-3 px-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-lg flex items-center justify-center gap-2">
                            <ShieldOff className="w-5 h-5" /> Suspend User
                        </button>

                        <button 
                            onClick={() => onReject(user.id)} 
                            className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                            <X className="w-5 h-5" /> Reject User
                        </button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

// 2. User & Account Management Dashboard (KYC/KYB) 👥
const UsersPage = () => {

    const [users, setUsers] = useState([]);
    const [filterStatus, setFilterStatus] = useState('PENDING');

    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all users from GET /api/accounts/admin/users/
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    throw new Error('Authentication token not found. Please log in.');
                }

                const url = filterStatus === 'ALL' 
                    ? `${API_BASE_URL}/api/admin/users/`
                    : `${API_BASE_URL}/api/admin/users/?status=${filterStatus}`;

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to fetch users.');
                }

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [filterStatus]);

    // Fetch single user details from GET /api/accounts/admin/users/{userId}/
    const handleViewUser = async (userId) => {
        console.log(`Fetching details for user: ${userId}`);
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Authentication token not found.');

            const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user details.');
            }
            
            const userDetails = await response.json();
            setSelectedUser(userDetails);
        } catch (err) {
            setError(err.message);
            console.error(err.message);
        }
    };

    const handleCloseModal = () => setSelectedUser(null);

    const updateUserStatus = async (userId, action) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Authentication token not found.');

            const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/${action}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Failed to ${action} user.`);
            }

            const newStatus = action === 'approve' ? 'ACTIVE' : 'BLOCKED';
            setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
            handleCloseModal();

        } catch (err) {
            console.error(err.message);
            alert(`Error: ${err.message}`); // Simple alert for action failure
        }
    };

    const handleApprove = (userId) => {
        updateUserStatus(userId, 'approve');
    };

    const handleReject = (userId) => {
        updateUserStatus(userId, 'reject');
    };
    const handleSuspend = async (userId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Authentication token not found.');

            const response = await fetch(`${API_BASE_URL}/api/admin/accounts/${userId}/suspend/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Failed to suspend user.`);
            }

            setUsers(users.map(u => u.id === userId ? { ...u, status: 'SUSPENDED' } : u));
            handleCloseModal();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };


    return (
        <>
            <DashboardHeader 
                title="Users & Account Management (KYC/KYB)" 
                subtitle="Oversight of user base. Manage verification, roles, and status (ACTIVE, PENDING, BLOCKED)." 
            />
            
            <section>
                <GlassCard className="p-6">
                    <h3 className="text-xl font-bold text-[#1a3d2e] mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-[#6B9071]" /> User List View
                    </h3>

                    <div className="flex space-x-2 mb-4 border-b border-[#6B9071]/30 pb-4">
                        {['PENDING', 'ACTIVE', 'BLOCKED', 'SUSPENDED', 'ALL'].map(status => (
                            <button 
                                key={status} 
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                    filterStatus === status 
                                    ? 'bg-[#6B9071] text-white shadow-md' 
                                    : 'bg-white/50 text-[#4a6850] hover:bg-white/80'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-x-auto">
                        {loading && <div className="text-center p-8 text-[#4a6850]">Loading users...</div>}
                        {error && <div className="text-center p-8 text-red-600">{error}</div>}
                        {!loading && !error && (
                            <table className="min-w-full text-sm text-left">
                                <thead className="border-b border-[#6B9071]/30 text-[#1a3d2e]">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Joined On</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="border-b border-white/60 hover:bg-white/40">
                                            <td className="p-4 font-medium text-[#1a3d2e]">{user.first_name} {user.last_name}</td>
                                            <td className="p-4 text-[#4a6850]">{user.role}</td>
                                            <td className="p-4"><UserStatusBadge status={user.status} /></td>
                                            <td className="p-4 text-[#4a6850]">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <button 
                                                    onClick={() => handleViewUser(user.id)}
                                                    className="px-3 py-1.5 bg-[#6B9071]/80 text-white text-xs font-semibold rounded-lg hover:bg-[#6B9071]">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </GlassCard>
            </section>

            <UserDetailModal 
                user={selectedUser} 
                onClose={handleCloseModal}
                onApprove={handleApprove}
                onReject={handleReject}
                onSuspend={handleSuspend}

            />
        </>
    );
};


// 3. Asset & Listing Verification Dashboard 🏡
const AssetsPage = () => (
    <>
      <DashboardHeader 
        title="Asset & Listing Verification" 
        subtitle="Review new assets submitted by Borrowers/Lenders, valuation reports, and monitor active offers." 
      />
      
      <section className="mb-8">
        <GlassCard className="p-8">
            <h3 className="text-xl font-bold text-[#1a3d2e] mb-4 flex items-center">
                <Gavel className="w-5 h-5 mr-2 text-[#6B9071]" /> Asset Review Queue
            </h3>
            <p className="text-[#4a6850] mb-4 text-sm">
            {'**API: POST/PATCH /api/admin/asset-listings/{asset_id}/approve/** - Vetting asset quality and title.'}
            </p>
            <div className="h-64 bg-white/30 border-2 border-dashed border-[#6B9071]/40 rounded-2xl flex items-center justify-center text-[#4a6850]">
                [Data Table: Asset ID, Type, Status (Pending, Approved), Borrower/Lender, Approval Actions]
            </div>
        </GlassCard>
      </section>

      <section>
        <GlassCard className="p-8">
            <h3 className="text-xl font-bold text-[#1a3d2e] mb-4 flex items-center">
                <Store className="w-5 h-5 mr-2 text-[#6B9071]" /> Asset Offer Monitoring
            </h3>
            <p className="text-[#4a6850] mb-4 text-sm">
                **API: GET /api/admin/assets/offers/** - Ensures fair bidding and prevents manipulation during matching.
            </p>
            <div className="h-32 bg-white/30 border-2 border-dashed border-[#6B9071]/40 rounded-2xl flex items-center justify-center text-[#4a6850]">
                [Table: Offer ID, Asset ID, Financier, Amount, Status]
            </div>
        </GlassCard>
      </section>
    </>
  );

// 4. Document Management Dashboard (Compliance) 📜
const DocumentsPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            setError(null);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) throw new Error('Authentication token not found.');

                const response = await fetch(`${API_BASE_URL}/api/admin/documents/?status=PENDING_REVIEW`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch pending documents.');
                
                const data = await response.json();
                setDocuments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, []);

    const handleApprove = async (docId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Authentication token not found.');

            await fetch(`${API_BASE_URL}/api/admin/documents/${docId}/approve/`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            setDocuments(documents.filter(doc => doc.id !== docId));
            alert('Document approved successfully!');
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleView = async (docId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Authentication token not found.');

            const response = await fetch(`${API_BASE_URL}/api/admin/documents/${docId}/view/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (!response.ok) throw new Error('Failed to get viewable URL for document.');

            const data = await response.json();
            if (data.url) {
                window.open(data.url, '_blank');
            } else {
                throw new Error('No viewable URL returned from API.');
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <>
            <DashboardHeader 
                title="Document Management (Compliance)" 
                subtitle="Review and approve documents awaiting verification." 
            />
            <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-[#1a3d2e] mb-4">Documents Awaiting Review</h3>
                <div className="overflow-x-auto">
                    {loading && <div className="text-center p-8 text-[#4a6850]">Loading documents...</div>}
                    {error && <div className="text-center p-8 text-red-600">{error}</div>}
                    {!loading && !error && (
                        <table className="min-w-full text-sm text-left">
                            <thead className="border-b border-[#6B9071]/30 text-[#1a3d2e]">
                                <tr>
                                    <th className="p-4">Document ID</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Uploaded On</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map(doc => (
                                    <tr key={doc.id} className="border-b border-white/60 hover:bg-white/40">
                                        <td className="p-4 font-mono text-xs text-[#4a6850]">{doc.id}</td>
                                        <td className="p-4 text-[#4a6850]">{doc.user_email}</td>
                                        <td className="p-4 font-medium text-[#1a3d2e]">{doc.document_type}</td>
                                        <td className="p-4 text-[#4a6850]">{new Date(doc.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 flex gap-2">
                                            <button onClick={() => handleView(doc.id)} className="px-3 py-1.5 bg-blue-500/80 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-1"><Eye size={14}/> View</button>
                                            <button onClick={() => handleApprove(doc.id)} className="px-3 py-1.5 bg-green-600/80 text-white text-xs font-semibold rounded-lg hover:bg-green-700 flex items-center gap-1"><Check size={14}/> Approve</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </GlassCard>
        </>
    );
};

// 5. Transaction & Settlement Monitoring Dashboard 💰
const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) throw new Error('Authentication token not found.');

                const response = await fetch(`${API_BASE_URL}/api/admin/transactions/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch transactions.');
                
                const data = await response.json();
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <>
            <DashboardHeader 
                title="Transaction & Settlement Monitoring" 
                subtitle="Auditing all platform transactions, from offer funding to final settlement." 
            />
            <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-[#1a3d2e] mb-4">Platform Transactions</h3>
                <div className="overflow-x-auto">
                    {loading && <div className="text-center p-8 text-[#4a6850]">Loading transactions...</div>}
                    {error && <div className="text-center p-8 text-red-600">{error}</div>}
                    {!loading && !error && (
                        <table className="min-w-full text-sm text-left">
                            <thead className="border-b border-[#6B9071]/30 text-[#1a3d2e]">
                                <tr>
                                    <th className="p-4">Transaction ID</th>
                                    <th className="p-4">Amount (KES)</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => (
                                    <tr key={tx.id} className="border-b border-white/60 hover:bg-white/40">
                                        <td className="p-4 font-mono text-xs text-[#4a6850]">{tx.id}</td>
                                        <td className="p-4 font-semibold text-[#1a3d2e]">{Number(tx.amount_kes).toLocaleString()}</td>
                                        <td className="p-4 text-[#4a6850]">{tx.transaction_type}</td>
                                        <td className="p-4"><UserStatusBadge status={tx.status} /></td>
                                        <td className="p-4 text-[#4a6850]">{new Date(tx.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </GlassCard>
        </>
    );
};

// 6. Communication Audit Dashboard 💬
const AuditPage = () => (
    <>
      <DashboardHeader 
        title="Communication Audit & Compliance Log" 
        subtitle="Read-only access to conversation history for compliance and dispute resolution purposes (view upon need)." 
      />
      
      <section className="mb-8">
        <GlassCard className="p-8">
            <h3 className="text-xl font-bold text-[#1a3d2e] mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-[#6B9071]" /> Conversation Search
            </h3>
            <p className="text-[#4a6850] mb-4 text-sm">
                **API: GET /api/chat/** - Search conversations by User ID, Asset ID, or date range.
            </p>
            <div className="h-32 bg-white/30 border-2 border-dashed border-[#6B9071]/40 rounded-2xl flex items-center justify-center text-[#4a6850]">
                [Search Form & List of Conversation IDs]
            </div>
        </GlassCard>
      </section>

      <section>
        <GlassCard className="p-8">
            <h3 className="text-xl font-bold text-[#1a3d2e] mb-4 flex items-center">
                <List className="w-5 h-5 mr-2 text-[#6B9071]" /> Chat Log Viewer (Read-Only)
            </h3>
            <p className="text-[#4a6850] mb-4 text-sm">
                Detailed, read-only view of message history between parties.
            </p>
            <div className="h-64 bg-white/30 border-2 border-dashed border-[#6B9071]/40 rounded-2xl flex items-center justify-center text-[#4a6850]">
                [Display of Selected Chat Transcript]
            </div>
        </GlassCard>
      </section>
    </>
  );

// Standard Settings Page
const SettingsPage = () => (
    <>
      <DashboardHeader 
        title="Platform Settings" 
        subtitle="Configure system parameters, fee structures, SLA targets, and user roles." 
      />
      <GlassCard className="p-8">
          <h3 className="text-xl font-bold text-[#1a3d2e] mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-[#6B9071]" /> System Configuration
          </h3>
          <p className="text-[#4a6850] mb-4 text-sm">Update reserve fee percentage, anti-sniping duration, and KYC requirements.</p>
          <div className="h-96 bg-white/30 border-2 border-dashed border-[#6B9071]/40 rounded-2xl flex items-center justify-center text-[#4a6850]">
              [Configuration Forms for System Parameters]
          </div>
      </GlassCard>
    </>
);

// =========================================================================
// 3. SIDEBAR COMPONENT
// =========================================================================

const Sidebar = ({ isMenuOpen, setIsMenuOpen, currentPage, setCurrentPage, handleLogout }) => {
    const menuItems = [
    { key: 'overview', name: 'Dashboard', icon: LayoutDashboard },
    { key: 'users', name: 'Users / KYC', icon: Users },
    { key: 'assets', name: 'Assets / Listings', icon: Gavel },
    { key: 'documents', name: 'Document Mgmt', icon: FileText },
    { key: 'transactions', name: 'Transactions', icon: Wallet },
    { key: 'audit', name: 'Comms Audit', icon: List },
    { key: 'settings', name: 'Settings', icon: Settings },
  ];

  const handleNavClick = (key) => {
    setCurrentPage(key);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Sidebar Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
           <GlassCard className="h-full rounded-none lg:rounded-r-[32px] p-6 flex flex-col">
            {/* Logo and Close Button */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-[#1a3d2e]">NPLin</h2>
                <p className="text-xs text-[#6B9071] mt-1">Admin Dashboard</p>
              </div>
              <button 
                className="lg:hidden text-[#4a6850] hover:text-[#1a3d2e] p-2 hover:bg-white/50 rounded-xl transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2 flex-1">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`w-full text-left flex items-center space-x-3 p-4 rounded-2xl transition-all duration-200
                    ${currentPage === item.key 
                      ? 'bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-semibold shadow-lg transform scale-105' 
                      : 'text-[#4a6850] font-medium hover:bg-white/60 hover:scale-102'}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>

            {/* Sign Out Button */}
            <div className="mt-auto pt-6 border-t border-[#C8E6C8]/50">
            <button 
                onClick={handleLogout}
                className="w-full py-3 text-sm text-red-600 hover:text-red-800 hover:bg-red-50/50 rounded-xl transition-all duration-200 font-medium"
              >
                Sign Out
              </button>
            </div>
        </GlassCard>
      </div>
    </>
  );
};


// =========================================================================
// 4. MAIN DASHBOARD LOGIC
// =========================================================================



export default function AdminDashboard({ setRole }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [errorOverview, setErrorOverview] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchDashboardData = async () => {
        setLoadingOverview(true);
        setErrorOverview(null);
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                throw new Error('Authentication token not found. Please log in.');
            }

            const response = await fetch(`${API_BASE_URL}/api/dashboard/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to fetch dashboard data.');
            }

            const data = await response.json();
            setDashboardData(data);
        } catch (err) {
            setErrorOverview(err.message);
        } finally {
            setLoadingOverview(false);
        }
    };

    // Only fetch data if we are on the overview page
    if (currentPage === 'overview') {
        fetchDashboardData();
    }
}, [currentPage]);



  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        if (loadingOverview) {
            return <div className="flex items-center justify-center h-64 text-lg text-[#4a6850]">Loading Dashboard Data...</div>;
        }
        if (errorOverview) {
            return <div className="flex items-center justify-center h-64 bg-red-100/50 rounded-2xl text-lg text-red-600 p-4">Error: {errorOverview}</div>;
        }
        return <OverviewPage data={dashboardData} setCurrentPage={setCurrentPage} />;      case 'users':
        return <UsersPage />;
      case 'assets':
        return <AssetsPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'audit':
        return <AuditPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage data={dashboardData} setCurrentPage={setCurrentPage} />;
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0]">
      
      <div className="flex min-h-screen">
        
        {/* Sidebar Component */}
        <Sidebar 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen} 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleLogout={handleLogout}

        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-72 transition-all duration-300">
          
          {/* Mobile Header / Menu Toggle */}
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h1 className="text-2xl font-bold text-[#1a3d2e]">NPLin Admin</h1>
            <button 
              className="text-[#1a3d2e] p-3 rounded-2xl bg-white/60 backdrop-blur-lg shadow-md hover:shadow-lg transition-all"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <GlassCard className="p-6 lg:p-10 mb-8 rounded-3xl w-full min-h-[85vh]">
            {renderPage()}
          </GlassCard>

          <footer className="text-center text-sm text-[#4a6850] mt-6">
              <p>&copy; 2025 NPLin Marketplace. All data real-time (simulated).</p>
          </footer>
        </main>
      </div>
    </div>
  );
}