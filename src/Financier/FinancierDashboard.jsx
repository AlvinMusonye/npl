import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { Store, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

// =========================================================================
// 1. CONSTANTS & CONFIG
// =========================================================================
const API_BASE_URL = 'http://127.0.0.1:8000';

// =========================================================================
// 2. REUSABLE UI COMPONENTS
// =========================================================================

const GlassCard = ({ children, className = "", ...props }) => (
  <div 
    className={`relative overflow-hidden rounded-3xl bg-white/40 border border-white/60 shadow-xl ${className}`}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
    }}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-80"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const NavCard = ({ title, description, Icon, onClick }) => (
    <div onClick={onClick} className="block hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
        <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div>
                <div className="p-3 inline-block bg-white/50 rounded-xl mb-4">
                    <Icon className="w-8 h-8 text-[#6B9071]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a3d2e]">{title}</h3>
                <p className="text-sm text-[#4a6850] mt-2">{description}</p>
            </div>
            <div className="mt-6 text-sm flex items-center font-semibold text-[#6B9071] hover:text-[#4a6850]">
                Go to {title} <ArrowRight className="w-4 h-4 ml-2" />
            </div>
        </GlassCard>
    </div>
);

// =========================================================================
// 3. MAIN FINANCIER DASHBOARD COMPONENT
// =========================================================================

export default function FinancierDashboard({ setRole }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) throw new Error('Authentication token not found. Please log in.');

        const response = await fetch(`${API_BASE_URL}/api/dashboard/`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch dashboard data.');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0]">
      <div className="flex min-h-screen">
        <ModernSidebar userRole="financier" onLogout={handleLogout} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
          <GlassCard className="p-6 lg:p-10 w-full min-h-[85vh]">
            {loading && <div className="text-center p-8 text-[#4a6850]">Loading Dashboard...</div>}
            {error && <div className="text-center p-8 text-red-600 bg-red-100/50 rounded-2xl">{error}</div>}
            {dashboardData && (
              <>
                <header className="pb-4 mb-8 border-b border-[#6B9071]/30">
                  <h1 className="text-4xl font-bold text-[#1a3d2e]">{dashboardData.welcome_message}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-lg text-[#4a6850]">Account Status:</p>
                    <span className="px-3 py-1 bg-green-100/50 text-green-800 font-semibold rounded-full border border-green-300 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> {dashboardData.account_status}
                    </span>
                  </div>
                </header>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <NavCard title="Asset Marketplace" description="Browse distressed assets and find investment opportunities." Icon={Store} onClick={() => navigate('/financier/marketplace')} />
                  <NavCard title="My Offers Made" description="Track and manage the offers you have submitted." Icon={TrendingUp} onClick={() => navigate('/financier/offers-made')} />
                </section>
              </>
            )}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}