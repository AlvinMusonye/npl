import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { Contact, Briefcase, Mail, Clock, CheckCircle, RefreshCw } from 'lucide-react';

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

const StatusBadge = ({ status }) => {
    const statusConfig = {
        'PENDING': { icon: RefreshCw, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
        'CONTACTED': { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-300' },
    };
    const config = statusConfig[status] || { icon: Contact, color: 'bg-gray-100 text-gray-800 border-gray-300' };
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color}`}>
        <Icon className={`w-4 h-4 ${status === 'PENDING' ? 'animate-pulse' : ''}`} />
        <span className="text-xs font-semibold">{status}</span>
      </div>
    );
};

const ContactRequestCard = ({ request }) => (
    <GlassCard className="p-6">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-[#1a3d2e] flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Request for: {request.asset_identifier}
            </h3>
            <StatusBadge status={request.status} />
        </div>
        <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/30 rounded-xl">
                <Contact className="w-5 h-5 text-[#4a6850]" />
                <div>
                    <p className="text-sm text-[#4a6850]">Buyer Name</p>
                    <p className="font-semibold text-[#1a3d2e]">{request.buyer_name}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/30 rounded-xl">
                <Mail className="w-5 h-5 text-[#4a6850]" />
                <div>
                    <p className="text-sm text-[#4a6850]">Buyer Email</p>
                    <p className="font-semibold text-[#1a3d2e]">{request.buyer_email}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/30 rounded-xl">
                <Clock className="w-5 h-5 text-[#4a6850]" />
                <div>
                    <p className="text-sm text-[#4a6850]">Request Date</p>
                    <p className="font-semibold text-[#1a3d2e]">{new Date(request.created_at).toLocaleString()}</p>
                </div>
            </div>
        </div>
    </GlassCard>
);

// =========================================================================
// 3. MAIN CONTACT REQUESTS PAGE COMPONENT
// =========================================================================

export default function ContactRequestsPage({ setRole }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContactRequests = async () => {
            setLoading(true);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) throw new Error('Authentication token not found.');

                const response = await fetch(`${API_BASE_URL}/api/assets/my_contact_requests/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch contact requests.');
                const data = await response.json();
                setRequests(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchContactRequests();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0]">
            <div className="flex min-h-screen">
                <ModernSidebar userRole="lender" onLogout={handleLogout} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
                    <GlassCard className="p-6 lg:p-10 w-full min-h-[85vh]">
                        <header className="pb-4 mb-8 border-b border-[#6B9071]/30">
                            <h1 className="text-4xl font-bold text-[#1a3d2e]">My Contact Requests</h1>
                            <p className="mt-2 text-lg text-[#4a6850]">Review and manage contact requests from potential buyers.</p>
                        </header>

                        {loading && <div className="text-center p-8 text-[#4a6850]">Loading contact requests...</div>}
                        {error && <div className="text-center p-8 text-red-600 bg-red-100/50 rounded-2xl">{error}</div>}
                        
                        {!loading && !error && (
                            requests.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {requests.map(req => <ContactRequestCard key={req.id} request={req} />)}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <h3 className="text-2xl font-bold text-[#1a3d2e]">No Contact Requests Yet</h3>
                                    <p className="text-[#4a6850] mt-2">You have not received any contact requests for your listed assets.</p>
                                </div>
                            )
                        )}
                    </GlassCard>
                </main>
            </div>
        </div>
    );
}