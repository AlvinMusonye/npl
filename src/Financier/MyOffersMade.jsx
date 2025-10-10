import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { DollarSign, Percent, Clock, CheckCircle, RefreshCw, XCircle, ArrowLeftRight } from 'lucide-react';

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

const OfferStatusBadge = ({ status }) => {
    const statusConfig = {
        'PENDING': { icon: RefreshCw, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
        'ACCEPTED': { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-300' },
        'REJECTED': { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-300' },
        'COUNTERED': { icon: ArrowLeftRight, color: 'bg-blue-100 text-blue-800 border-blue-300' },
    };
    const config = statusConfig[status] || { icon: Clock, color: 'bg-gray-100 text-gray-800 border-gray-300' };
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color}`}>
        <Icon className={`w-4 h-4 ${status === 'PENDING' ? 'animate-spin' : ''}`} />
        <span className="text-xs font-semibold">{status}</span>
      </div>
    );
};

const OfferCard = ({ offer }) => (
    <GlassCard className="p-6">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-bold text-[#1a3d2e]">Offer on Asset:</h3>
                <p className="text-sm text-[#4a6850] break-all">{offer.collateral}</p>
            </div>
            <OfferStatusBadge status={offer.status} />
        </div>
        <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/30 rounded-xl">
                <span className="text-sm text-[#4a6850] flex items-center gap-2"><DollarSign className="w-4 h-4" /> Offer Amount</span>
                <span className="font-semibold text-[#1a3d2e]">KSh {Number(offer.offer_amount_kes).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/30 rounded-xl">
                <span className="text-sm text-[#4a6850] flex items-center gap-2"><Percent className="w-4 h-4" /> Interest Rate</span>
                <span className="font-semibold text-[#1a3d2e]">{offer.proposed_interest_rate}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/30 rounded-xl">
                <span className="text-sm text-[#4a6850] flex items-center gap-2"><Clock className="w-4 h-4" /> Date Proposed</span>
                <span className="font-semibold text-[#1a3d2e]">{new Date(offer.date_proposed).toLocaleDateString()}</span>
            </div>
        </div>
        {offer.lender_comment && <p className="text-sm text-[#4a6850] mt-4 p-3 bg-white/20 rounded-xl italic">"{offer.lender_comment}"</p>}
    </GlassCard>
);

// =========================================================================
// 3. MAIN MY OFFERS MADE PAGE COMPONENT
// =========================================================================

export default function MyOffersMade({ setRole }) {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOffersMade = async () => {
            setLoading(true);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) throw new Error('Authentication token not found.');

                const response = await fetch(`${API_BASE_URL}/api/assets/my_offers_made/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch offers made.');
                const data = await response.json();
                setOffers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOffersMade();
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
            <header className="pb-4 mb-8 border-b border-[#6B9071]/30">
              <h1 className="text-4xl font-bold text-[#1a3d2e]">My Offers Made</h1>
              <p className="mt-2 text-lg text-[#4a6850]">Track the status of all offers you have submitted.</p>
            </header>

            {loading && <div className="text-center p-8 text-[#4a6850]">Loading your offers...</div>}
            {error && <div className="text-center p-8 text-red-600 bg-red-100/50 rounded-2xl">{error}</div>}
            
            {!loading && !error && (
              offers.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offers.map(offer => <OfferCard key={offer.offer_id} offer={offer} />)}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-2xl font-bold text-[#1a3d2e]">No Offers Made Yet</h3>
                  <p className="text-[#4a6850] mt-2">You have not submitted any offers. Browse the marketplace to get started.</p>
                </div>
              )
            )}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}