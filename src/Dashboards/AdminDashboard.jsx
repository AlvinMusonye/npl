import React, { useState, useMemo, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useNavigate, useLocation } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar'; // Import the new sidebar
import UserManagement from '../Admin/UserManagement';
import DocumentManagement from '../Admin/DocumentManagement'; // Import the new DocumentManagement component
import AssetManagement from '../Admin/AssetManagement'; // Import the new AssetManagement component
import OffersOverview from '../Admin/OffersOverview'; // Import the new OffersOverview component
import AdminProfile from '../Admin/AdminProfile'; // Import the new AdminProfile component

import { 
    LayoutDashboard, Users, Gavel, FileText, Wallet, XCircle, Menu, Building, TrendingUp, Handshake, BarChart3, PieChart,
    Bot, Zap, Lock, Store, Check, X, ArrowRight, CreditCard, ShieldOff, Eye
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// =========================================================================
// 1. CONSTANTS & CONFIG
// =========================================================================

const API_BASE_URL = 'http://127.0.0.1:8000';

// =========================================================================
// 1. REUSABLE UI COMPONENTS (Glassmorphism & Layout)
// =========================================================================

// Glass Card Component
const Card = ({ children, className = "", ...props }) => (
  <div className={`relative rounded-3xl bg-white border border-gray-200 shadow-lg ${className}`} {...props}>
    <div className="relative z-10">{children}</div>
  </div>
);

// Header Component
const DashboardHeader = ({ title, subtitle }) => (
  <header className="pb-4 mb-8">
    <h1 className="text-4xl font-bold text-black">{title}</h1>
    <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
  </header>
);

// Operational Metric Card for Overview
const OperationalCard = ({ title, count, link, Icon, linkText, onClick }) => (
    <a href={link} onClick={(e) => { e.preventDefault(); onClick && onClick(); }} className="block hover:scale-105 transition-all duration-300 ease-out cursor-pointer">

        <Card className="p-6 h-full flex flex-col justify-between bg-gray-50/50 hover:bg-white">
            <div className="flex items-start justify-between">
                <Icon className="w-8 h-8 text-[#40916c]" />
            </div>
            <div className="mt-4">
                <div className="text-4xl font-extrabold text-red-600">{count}</div>
                <div className="text-lg font-medium text-black mt-1">{title}</div>
            </div>
            <div className="mt-4 text-sm flex items-center text-[#40916c] hover:text-black">
                {linkText} <ArrowRight className="w-4 h-4 ml-1" />
            </div>
        </Card>
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
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchAnalytics = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) throw new Error('Authentication token not found.');
          
          const response = await fetch(`${API_BASE_URL}/api/accounts/admin/analytics/`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          });

          if (!response.ok) throw new Error('Failed to fetch analytics data.');
          
          const data = await response.json();
          setAnalytics(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchAnalytics();
    }, []);

    // Chart Data
    const usersByRoleData = {
        labels: analytics ? Object.keys(analytics.users_by_role) : [],
        datasets: [{
            label: 'Users by Role',
            data: analytics ? Object.values(analytics.users_by_role) : [],
            backgroundColor: ['#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7'],
        }]
    };

    const usersByStatusData = {
        labels: analytics ? Object.keys(analytics.users_by_status) : [],
        datasets: [{
            label: 'Users by Status',
            data: analytics ? Object.values(analytics.users_by_status) : [],
            backgroundColor: '#52b788',
            borderColor: '#40916c',
            borderWidth: 1,
        }]
    };

    // Mock time-series data for line graphs
    const last30DaysLabels = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Hide legend for a cleaner look
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#40916c',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw}`,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#555',
                },
            },
            y: {
                grid: {
                    color: '#e9e9e9',
                    borderDash: [5, 5],
                },
                ticks: {
                    color: '#555',
                },
            },
        },
    };

    const lineGraphData = {
        labels: last30DaysLabels,
        datasets: [
            {
                label: 'Platform Activity',
                data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 25 + 5)),
                borderColor: '#40916c',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, '#40916c80');
                    gradient.addColorStop(1, '#40916c00');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#40916c',
            }
        ]
    };

    if (loading) return <div className="text-center p-8">Loading analytics...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-50 rounded-xl">Error: {error}</div>;
    if (!analytics) return <div className="text-center p-8">No analytics data available.</div>;

    const { pending_users = 0, pending_assets = 0, pending_documents = 0 } = data?.system_summary || {};
    const { manage_accounts_url, review_assets_url, review_documents_url } = data?.system_summary || {};
  
    return (
      <>
        <DashboardHeader 
          title="Executive Dashboard: Mission Control" 
          subtitle="System-wide analytics and high-priority action items." 
        />
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-[#1a3d2e] mb-6">System Summary & Priority Queues 🔥</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OperationalCard
              title="Pending Users for Approval"
              count={pending_users}
              link="#"
              Icon={Users}
              linkText="Manage Accounts"
              onClick={() => navigate('/admin/users')}
            />
            <OperationalCard
              title="Pending Assets for Verification"
              count={pending_assets}
              link="#"
              Icon={Gavel}
              linkText="Review Listings"
              onClick={() => navigate('/admin/assets')}
            />
            <OperationalCard
              title="Pending Documents for Review"
              count={pending_documents}
              link="#"
              Icon={FileText}
              linkText="Process Documents"
              onClick={() => navigate('/admin/documents')}
            />
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2"><BarChart3 /> Activity Over Last 30 Days</h3>
            <div className="h-80">
              <Line data={lineGraphData} options={lineChartOptions} />
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2"><PieChart /> Users by Role</h3>
            <div className="h-64 flex items-center justify-center">
              <Pie data={usersByRoleData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Card>
        </section>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-black mb-4">Users by Status</h3>
            <div className="h-80">
              <Bar data={usersByStatusData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-bold text-black mb-4">Platform Totals</h3>
            {/* Placeholder for the second bar graph */}
            <div className="flex items-center justify-center h-80 bg-gray-100 rounded-xl text-gray-500">Second Bar Graph Here</div>
          </Card>
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
          g;
            <DashboardHeader 
                title="Transaction & Settlement Monitoring" 
                subtitle="Auditing all platform transactions, from offer funding to final settlement." 
            />
            <Card className="p-6">
                <h3 className="text-xl font-bold text-black mb-4">Platform Transactions</h3>
                <div className="overflow-x-auto">
                    {loading && <div className="text-center p-8 text-gray-600">Loading transactions...</div>}
                    {error && <div className="text-center p-8 text-red-600">{error}</div>}
                    {!loading && !error && (
                        <table className="min-w-full text-sm text-left">
                            <thead className="border-b border-gray-200 text-black">
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
                                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4 font-mono text-xs text-gray-500">{tx.id}</td>
                                        <td className="p-4 font-semibold text-black">{Number(tx.amount_kes).toLocaleString()}</td>
                                        <td className="p-4 text-gray-600">{tx.transaction_type}</td>
                                        <td className="p-4"><UserStatusBadge status={tx.status} /></td>
                                        <td className="p-4 text-gray-600">{new Date(tx.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
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
    if (currentPage === 'dashboard') {
        fetchDashboardData();
    }
}, [currentPage, location.pathname]);



  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': // Matches the path from the new sidebar
        if (loadingOverview) {
            return <div className="flex items-center justify-center h-64 text-lg text-gray-600">Loading Dashboard Data...</div>;
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
    <div className="min-h-screen bg-white">
      
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
            <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
          </div>

          <div className="p-6 lg:p-10 mb-8 rounded-3xl w-full min-h-[85vh] bg-gray-50/50 border border-gray-200">
            {renderPage()}
          </div>

          <footer className="text-center text-sm text-gray-500 mt-6">
              <p>&copy; 2025 NPLin Marketplace. All data real-time (simulated).</p>
          </footer>
        </main>
      </div>
    </div>
  );
}