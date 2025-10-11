import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { Briefcase, Mail, User, ArrowRight, LogOut } from 'lucide-react';

// =========================================================================
// 1. CONSTANTS & CONFIG
// =========================================================================
const API_BASE_URL = 'http://127.0.0.1:8000';

// =========================================================================
// 2. REUSABLE UI COMPONENTS
// =========================================================================

// Glass Card Component (consistent with your app's theme)
const GlassCard = ({ children, className = "", ...props }) => (
    <div className={`relative rounded-3xl bg-white border border-gray-200 shadow-lg ${className}`} {...props}>
      <div className="relative z-10">{children}</div>
    </div>
);

// Navigation Card for quick links
const NavCard = ({ title, description, Icon, path, onClick }) => (
    <div onClick={onClick} className="block group hover:scale-[1.03] transition-all duration-300 ease-out cursor-pointer">
        <GlassCard className="p-6 h-full flex flex-col justify-between bg-gray-50/50 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-[#40916c]/20">
            <div>
                <div className="p-3 inline-block bg-white rounded-xl mb-4 border">
                    <Icon className="w-8 h-8 text-[#40916c]" />
                </div>
                <h3 className="text-xl font-bold text-black">{title}</h3>
                <p className="text-sm text-gray-600 mt-2">{description}</p>
            </div>
            <div className="mt-6 text-sm flex items-center font-semibold text-gray-700 group-hover:text-black">
                Go to {title} <ArrowRight className="w-4 h-4 ml-2" />
            </div>
        </GlassCard>
    </div>
);


// =========================================================================
// 3. MAIN BORROWER DASHBOARD COMPONENT
// =========================================================================

export default function BorrowerDashboard({ setRole }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        <ModernSidebar userRole="borrower" onLogout={handleLogout} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
          <div className="p-0 lg:p-4 w-full min-h-[85vh]">
            {loading && <div className="text-center p-8 text-gray-600">Loading Dashboard...</div>}
            {error && <div className="text-center p-8 text-red-600 bg-red-50 rounded-2xl">{error}</div>}
            {dashboardData && (
              <>
                <div className="p-8 mb-12 bg-gray-50 rounded-3xl border border-gray-200">
                    <header>
                        <h1 className="text-4xl font-bold text-black">{dashboardData.welcome_message}</h1>
                        <p className="mt-2 text-lg text-gray-600">Here's a quick overview of your account.</p>
                    </header>
                </div>

                <section>
                    <h2 className="text-2xl font-bold text-[#1a3d2e] mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <NavCard title="My Assets" description="View and manage your listed assets." Icon={Briefcase} onClick={() => navigate('/borrower/assets')} />
                  <NavCard title="My Offers" description="Review and negotiate offers from financiers." Icon={Mail} onClick={() => navigate('/borrower/offers')} />
                  <NavCard title="My Profile" description="Update your personal and contact information." Icon={User} onClick={() => navigate('/profile')} />
                </div>    
                </section>

              </>
            )}
          </div>
          
        </main>

      </div>
    </div>

  );
}