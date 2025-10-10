import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar'; // Import the new sidebar
import UserManagement from '../Admin/UserManagement';
import DocumentManagement from '../Admin/DocumentManagement'; // Import the new DocumentManagement component
import AssetManagement from '../Admin/AssetManagement'; // Import the new AssetManagement component
import OffersOverview from '../Admin/OffersOverview'; // Import the new OffersOverview component
import AdminProfile from '../Admin/AdminProfile'; // Import the new AdminProfile component

import { 
    LayoutDashboard, Users, Gavel, FileText, Wallet, XCircle, Menu, Building, TrendingUp, Handshake,
    Bot, Zap, Lock, Store, Check, X, ArrowRight, CreditCard, ShieldOff, Eye
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
        PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 border border-yellow-300',

        ACTIVE: 'bg-green-100 text-green-800 border border-green-300',
        LISTED: 'bg-green-100 text-green-800 border border-green-300',

        BLOCKED: 'bg-red-100 text-red-800 border border-red-300',
        REJECTED: 'bg-red-100 text-red-800 border border-red-300',

        SUBMITTED: 'bg-blue-100 text-blue-800 border border-blue-300',
        SUSPENDED: 'bg-orange-100 text-orange-800 border border-orange-300',

    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.replace('_', ' ')}
            </span>
    );
};


// =========================================================================
// 2. DASHBOARD PAGE COMPONENTS (MIMICKING pages/ directory)
// =========================================================================

// 1. Main Admin Dashboard (Landing Page) 🏠
const OverviewPage = ({ data }) => {
    if (!data || !data.system_summary) {
        return (
            <GlassCard className="p-8 h-64 flex items-center justify-center text-red-600">
                Could not load dashboard summary data.
            </GlassCard>
        );
    }

    const { pending_users, pending_assets, pending_documents } = data.system_summary;
    const { manage_accounts_url, review_assets_url, review_documents_url } = data;
    const navigate = useNavigate();
  
  
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
              onClick={() => navigate('/admin/users')}
            />
            <OperationalCard
              title="Pending Assets for Verification"
              count={pending_assets}
              link="#"
              Icon={Gavel}
              apiAction={`GET ${review_assets_url}`}
              linkText="Review Listings"
              onClick={() => navigate('/admin/assets')}
            />
            <OperationalCard
              title="Pending Documents for Review"
              count={pending_documents}
              link="#"
              Icon={FileText}
              apiAction={`GET ${review_documents_url}`}
              linkText="Process Documents"
              onClick={() => navigate('/admin/documents')}
            />
          </div>
        </section>
        

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


// =========================================================================
// 4. MAIN DASHBOARD LOGIC
// =========================================================================


export default function AdminDashboard({ setRole }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [errorOverview, setErrorOverview] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Determine the current page from the URL path
  const currentPage = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments[1] || 'overview'; // 'admin' is [0], so we check [1]
  }, [location.pathname]);


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
    if (currentPage === 'overview' || currentPage === 'admin') {
        fetchDashboardData();
    }
}, [currentPage, location.pathname]);



  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': // Matches the path from the new sidebar
        if (loadingOverview) {
            return <div className="flex items-center justify-center h-64 text-lg text-[#4a6850]">Loading Dashboard Data...</div>;
        }
        if (errorOverview) {
            return <div className="flex items-center justify-center h-64 bg-red-100/50 rounded-2xl text-lg text-red-600 p-4">Error: {errorOverview}</div>;
        }
        return <OverviewPage data={dashboardData} />;
      case 'users':
        return <UserManagement />;
      case 'assets':
        return <AssetManagement />;
      case 'documents':
        return <DocumentManagement />;
      case 'transactions':
        return <TransactionsPage />;
      case 'offers':
        return <OffersOverview />;
      case 'profile':
        return <AdminProfile />;

      default:
        return <OverviewPage data={dashboardData} />;
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
        <ModernSidebar 
            userRole="admin"
            onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
          
          {/* Mobile Header / Menu Toggle */}
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h1 className="text-2xl font-bold text-[#1a3d2e]">Admin Dashboard</h1>
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