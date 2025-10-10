import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { 
    DollarSign, Check, X, ArrowLeftRight, MessageSquare, TrendingUp, LogOut 
} from 'lucide-react';

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
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    }}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-80"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const InputField = ({ icon: Icon, label, name, type = "text", placeholder, value, onChange }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#1a3d2e]">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4a6850]" />}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-[#1a3d2e] placeholder-[#4a6850]/70 outline-none focus:ring-2 focus:ring-[#6B9071] focus:border-transparent transition-all"
        />
      </div>
    </div>
);

const CounterOfferModal = ({ offer, onClose, onSubmit }) => {
    const [counterData, setCounterData] = useState({
        offer_amount_kes: '',
        borrower_comment: ''
    });

    const handleChange = (e) => {
        setCounterData({ ...counterData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(offer.offer_id, counterData);
    };

    if (!offer) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <GlassCard className="w-full max-w-md p-8">
                <h3 className="text-2xl font-bold text-[#1a3d2e] mb-6">Make Counter Offer</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField icon={DollarSign} label="Counter Amount (KES)" name="offer_amount_kes" type="number" value={counterData.offer_amount_kes} onChange={handleChange} />
                    <InputField icon={MessageSquare} label="Your Comment" name="borrower_comment" type="text" value={counterData.borrower_comment} onChange={handleChange} />
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/40 hover:bg-white/60 text-[#1a3d2e] font-semibold rounded-xl border border-white/40">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-bold rounded-xl">Submit Counter</button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

const OfferCard = ({ offer, onAccept, onDecline, onCounter }) => {
    const statusConfig = {
        'PENDING': { color: 'text-yellow-600' },
        'COUNTERED': { color: 'text-blue-600' },
        'ACCEPTED': { color: 'text-green-600' },
        'DECLINED': { color: 'text-red-600' },
    };
    const config = statusConfig[offer.status];

    return (
        <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-4 border-b border-white/40 pb-3">
                <h3 className="text-xl font-bold text-[#1a3d2e]">Offer on: {offer.collateral_identifier}</h3>
                <span className={`font-semibold ${config?.color || 'text-gray-600'}`}>{offer.status}</span>
            </div>
            
            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-[#4a6850]">Financier</span>
                    <span className="font-semibold text-[#1a3d2e]">{offer.lender_name}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                    <span className="text-[#4a6850]">Offer Amount</span>
                    <span className="text-green-700">KSh {Number(offer.offer_amount_kes).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-[#4a6850]">Proposed Rate</span>
                    <span className="font-semibold text-[#1a3d2e]">{parseFloat(offer.proposed_interest_rate * 100).toFixed(2)}%</span>
                </div>
            </div>

            {offer.status === 'PENDING' || offer.status === 'COUNTERED' ? (
                <div className="mt-4 pt-4 border-t border-white/40 flex flex-col sm:flex-row gap-3">
                    <button onClick={() => onAccept(offer.offer_id)} className="flex-1 px-4 py-2 bg-green-600/80 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> Accept
                    </button>
                    <button onClick={() => onCounter(offer)} className="flex-1 px-4 py-2 bg-blue-600/80 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2">
                        <ArrowLeftRight className="w-4 h-4" /> Counter
                    </button>
                    <button onClick={() => onDecline(offer.offer_id)} className="flex-1 px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2">
                        <X className="w-4 h-4" /> Decline
                    </button>
                </div>
            ) : (
                <p className="text-sm text-center text-[#4a6850] pt-4 border-t border-white/40">This offer has been {offer.status.toLowerCase()}.</p>
            )}
        </GlassCard>
    );
};

// =========================================================================
// 3. MAIN MY OFFERS PAGE COMPONENT
// =========================================================================

export default function MyOffersPage({ setRole }) {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [showCounterModal, setShowCounterModal] = useState(false);
    const navigate = useNavigate();

    const fetchOffers = async () => {
        setLoading(true);
        setError(null);
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Authentication token not found.');

            const response = await fetch(`${API_BASE_URL}/api/assets/my_offers/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });

            if (!response.ok) throw new Error('Failed to fetch offers.');
            
            const data = await response.json();
            setOffers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const handleOfferAction = async (offerId, action, payload = null) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Authentication token not found.');

            const response = await fetch(`${API_BASE_URL}/api/offers/${offerId}/${action}/`, {
                method: payload ? 'PATCH' : 'POST',
                headers: { 
                    'Authorization': `Bearer ${accessToken}`,
                    ...(payload && {'Content-Type': 'application/json'})
                },
                ...(payload && { body: JSON.stringify(payload) })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || errData.status || `Failed to ${action} offer.`);
            }
            
            alert(`Offer action '${action}' was successful!`);
            fetchOffers(); // Re-fetch offers to get the latest state
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleAcceptOffer = (offerId) => handleOfferAction(offerId, 'accept');
    const handleDeclineOffer = (offerId) => handleOfferAction(offerId, 'decline');

    const handleOpenCounterModal = (offer) => {
        setSelectedOffer(offer);
        setShowCounterModal(true);
    };

    const handleCounterOfferSubmit = async (offerId, counterData) => {
        await handleOfferAction(offerId, 'counter', counterData);
        setShowCounterModal(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0]">
            <div className="flex min-h-screen">
                <ModernSidebar userRole="borrower" onLogout={handleLogout} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
                    <GlassCard className="p-6 lg:p-10 w-full min-h-[85vh]">
                        <header className="pb-4 mb-8 border-b border-[#6B9071]/30">
                            <h1 className="text-4xl font-bold text-[#1a3d2e]">My Offers Received</h1>
                            <p className="mt-2 text-lg text-[#4a6850]">Review, accept, or negotiate offers from financiers.</p>
                        </header>

                        {loading && <div className="text-center p-8 text-[#4a6850]">Loading your offers...</div>}
                        {error && <div className="text-center p-8 text-red-600 bg-red-100/50 rounded-2xl">Error: {error}</div>}
                        
                        {!loading && !error && (
                            offers.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {offers.map(offer => (
                                        <OfferCard 
                                            key={offer.offer_id} 
                                            offer={offer}
                                            onAccept={handleAcceptOffer}
                                            onDecline={handleDeclineOffer}
                                            onCounter={handleOpenCounterModal}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <h3 className="text-2xl font-bold text-[#1a3d2e]">No Offers Yet</h3>
                                    <p className="text-[#4a6850] mt-2">You have not received any offers on your listed assets.</p>
                                </div>
                            )
                        )}
                    </GlassCard>
                </main>
            </div>

            {showCounterModal && (
                <CounterOfferModal 
                    offer={selectedOffer}
                    onClose={() => setShowCounterModal(false)}
                    onSubmit={handleCounterOfferSubmit}
                />
            )}
        </div>
    );
}