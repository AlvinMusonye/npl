import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { Car, Home, Maximize, Store, DollarSign, Percent, Info, X, CheckCircle } from 'lucide-react';

// =========================================================================
// 1. CONSTANTS & CONFIG
// =========================================================================
const API_BASE_URL = 'http://127.0.0.1:8000';

// =========================================================================
// 2. REUSABLE UI COMPONENTS
// =========================================================================

const GlassCard = ({ children, className = "", ...props }) => (
  <div className={`relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-lg ${className}`} {...props}>
    <div className="relative z-10">{children}</div>
  </div>
);

const InputField = ({ icon: Icon, label, name, placeholder, value, onChange, type = "text" }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-300 text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#40916c] transition-all"
        />
      </div>
    </div>
);

const OfferModal = ({ asset, onClose, onSubmit }) => {
    const [offerData, setOfferData] = useState({
        offer_amount_kes: '',
        proposed_interest_rate: '',
        lender_comment: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOfferData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await onSubmit(asset.collateral_uuid, offerData);
            onClose();
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!asset) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg p-8 bg-white rounded-3xl border shadow-2xl">
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-black mb-2">Submit Offer</h3>
                    <button onClick={onClose} className="p-2 -mt-2 -mr-2 rounded-full hover:bg-gray-100"><X className="w-6 h-6 text-gray-600" /></button>
                </div>
                <p className="text-gray-600 mb-6">For asset: <span className="font-semibold">{asset.primary_identifier || asset.collateral_uuid}</span></p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField icon={DollarSign} label="Offer Amount (KES)" name="offer_amount_kes" type="number" value={offerData.offer_amount_kes} onChange={handleChange} />
                    <InputField icon={Percent} label="Proposed Interest Rate (%)" name="proposed_interest_rate" type="number" step="0.01" value={offerData.proposed_interest_rate} onChange={handleChange} />
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Comment</label>
                        <textarea name="lender_comment" rows="3" value={offerData.lender_comment} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-300 text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#40916c]" />
                    </div>
                    {error && <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-black font-semibold rounded-xl border border-gray-300">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] text-black font-bold rounded-xl disabled:opacity-50">
                            {submitting ? 'Submitting...' : 'Submit Offer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AssetCard = ({ asset, onMakeOffer }) => {
    const assetTypeDetails = { VEHICLE: { icon: Car }, PROPERTY: { icon: Home }, LAND: { icon: Maximize } };
    const { icon: Icon } = assetTypeDetails[asset.collateral_type] || { icon: Store };
    const primaryImage = asset.images && asset.images.length > 0 ? asset.images[0] : 'https://placehold.co/600x400/E0F2E0/4a6850?text=No+Image';

    return (
      <GlassCard className="group hover:shadow-xl hover:shadow-[#40916c]/20 transition-all duration-300">
        <div className="relative h-56 overflow-hidden rounded-t-3xl">
          <img src={primaryImage} alt={asset.primary_identifier} className="w-full h-full object-cover" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Icon className="w-5 h-5 text-gray-600" />
            <h3 className="text-xl font-bold text-black truncate group-hover:text-[#40916c] transition-colors">{asset.primary_identifier || 'Asset'}</h3>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Relief Requested</span>
              <span className="font-semibold text-lg text-green-700">KSh {Number(asset.relief_amount_requested_kes).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Borrower Risk Score</span>
              <span className="font-bold text-black">{asset.borrower_risk_score || 'N/A'}</span>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button onClick={() => onMakeOffer(asset)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-sm transition-all">
              <DollarSign className="w-5 h-5" /> Make an Offer
            </button>
          </div>
        </div>
      </GlassCard>
    );
};

// =========================================================================
// 3. MAIN ASSET MARKETPLACE PAGE COMPONENT
// =========================================================================

export default function AssetMarketplace({ setRole }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicListings = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) throw new Error('Authentication token not found.');

        const response = await fetch(`${API_BASE_URL}/api/assets/public_listings/`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error('Failed to fetch marketplace assets.');
        const data = await response.json();
        setAssets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicListings();
  }, []);

  const handleOfferSubmit = async (collateralUuid, offerData) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) throw new Error('Authentication token not found.');

    const response = await fetch(`${API_BASE_URL}/api/assets/${collateralUuid}/offer/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit offer.');
    }
    alert('Offer submitted successfully!');
  };

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <ModernSidebar userRole="financier" onLogout={handleLogout} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
          <div className="p-0 lg:p-4 w-full min-h-[85vh]">
            <header className="pb-4 mb-8">
              <h1 className="text-4xl font-bold text-black">Asset Marketplace</h1>
              <p className="mt-2 text-lg text-gray-600">Browse distressed assets and find investment opportunities.</p>
            </header>

            {loading && <div className="text-center p-8 text-gray-600">Loading marketplace...</div>}
            {error && <div className="text-center p-8 text-red-600 bg-red-50 rounded-2xl">{error}</div>}
            
            {!loading && !error && (
              assets.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {assets.map(asset => (
                    <AssetCard key={asset.collateral_uuid} asset={asset} onMakeOffer={setSelectedAsset} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200">
                  <h3 className="text-2xl font-bold text-black">Marketplace is Currently Empty</h3>
                  <p className="text-gray-500 mt-2">Check back later for new investment opportunities.</p>
                </div>
              )
            )}
          </div>
        </main>
      </div>
      {selectedAsset && (
        <OfferModal 
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
            onSubmit={handleOfferSubmit}
        />
      )}
    </div>
  );
}