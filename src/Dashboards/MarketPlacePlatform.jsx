import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Car, Home, Maximize, Upload, DollarSign, Calendar, MapPin, FileText, CheckCircle, ArrowRight, Trash2, Eye, Edit, MessageSquare, 
    LayoutDashboard, User, CreditCard, Clock, Check, AlertTriangle, Store, X
} from 'lucide-react';


const API_BASE_URL = 'http://127.0.0.1:8000';

// Card component with glassmorphism style
const GlassCard = ({ children, className = "", ...props }) => (
    <div 
      className={`relative overflow-hidden rounded-3xl bg-white/20 border border-white/30 shadow-xl ${className}`}
      style={{
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
      }}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
);

// Input Field Component
const InputField = ({ icon: Icon, label, field, type = "text", placeholder, value, onChange, detailField = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-gray-800 placeholder-gray-600 outline-none focus:border-white/60 transition-all"
        />
      </div>
    </div>
);

// Status Badge Component
const getStatusBadge = (status) => {
    const statusConfig = {
      'Listed': { color: 'bg-green-500/30 border-green-500/40 text-green-800' },
      'Under Review': { color: 'bg-yellow-500/30 border-yellow-500/40 text-yellow-800' },
      'Action Required': { color: 'bg-red-500/30 border-red-500/40 text-red-800' },
      'Verified': { color: 'bg-blue-500/30 border-blue-500/40 text-blue-800' },
      'Pending Approval': { color: 'bg-yellow-500/30 border-yellow-500/40 text-yellow-800' },
      'Active': { color: 'bg-green-500/30 border-green-500/40 text-green-800' },
    };
    const config = statusConfig[status] || { color: 'bg-gray-500/30 border-gray-500/40 text-gray-800' };
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border ${config.color}`}>
        <span className="text-xs font-semibold">{status}</span>
      </div>
    );
};



// =========================================================================
// 3. PAGE LOGIC AND COMPONENTS (Borrower-Specific Views)
// =========================================================================

const OfferModal = ({ asset, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid, positive amount.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(asset.id, parseFloat(amount));
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!asset) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <GlassCard className="w-full max-w-md p-8">
        <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Make an Offer</h3>
            <button onClick={onClose} className="p-2 -mt-2 -mr-2 rounded-full hover:bg-white/50 transition-colors">
                <X className="w-6 h-6 text-gray-600" />
            </button>
        </div>
        <p className="text-gray-600 mb-6">For asset: <span className="font-semibold">{asset.primary_identifier}</span></p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            icon={DollarSign}
            label="Your Offer Amount (KES)"
            type="number"
            placeholder="e.g., 950000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm -mt-2">{error}</p>}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl transition-all disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Offer'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

const AssetCard = ({ asset, onMakeOffer }) => {
    const assetTypeDetails = { VEHICLE: { icon: Car }, PROPERTY: { icon: Home }, LAND: { icon: Maximize } };
    const { icon: Icon } = assetTypeDetails[asset.collateral_type] || { icon: Store };

    const imageUrl = asset.images && asset.images.length > 0 ? asset.images[0].image : 'https://images.unsplash.com/photo-1526726538640-74c178414213?w=800';

    return (
      <GlassCard className="group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
        <div className="relative">
          <div className="relative h-56 overflow-hidden rounded-t-3xl">
            <img 
              src={imageUrl} 
              alt={asset.primary_identifier}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1526726538640-74c178414213?w=800'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 right-4">
              {getStatusBadge(asset.status)}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-5 h-5 text-gray-700" />
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                {asset.primary_identifier}
              </h3>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Relief Amount Requested</span>
                <span className="font-semibold text-gray-800">KSh {Number(asset.relief_amount_requested_kes).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Market Value</span>
                <span className="font-semibold text-gray-800">KSh {Number(asset.market_valuation_kes).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center pt-4 border-t border-white/30">
              <button 
                onClick={() => onMakeOffer(asset)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#c8d5c0]/80 to-[#b8cdb0]/80 hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <DollarSign className="w-5 h-5" />
                Make an Offer
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    );
};



// =========================================================================
// 4. MAIN BORROWER DASHBOARD COMPONENT (The Single File Export)
// =========================================================================

export default function LenderMarketplace() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Authentication token not found. Please log in.');
        }

        const response = await fetch(`${API_BASE_URL}/api/assets/public_listings/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch assets.');
        }

        const data = await response.json();
        setAssets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const handleMakeOffer = (asset) => {
    setSelectedAsset(asset);
    setShowOfferModal(true);

  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
    setShowOfferModal(false);
  };
  
  const handleOfferSubmit = async (assetId, amount) => {
    console.log(`Submitting offer of ${amount} for asset ${assetId}`);
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Authentication token not found.');
    }

    const response = await fetch(`${API_BASE_URL}/api/assets/${assetId}/offer/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ offer_amount_kes: amount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Try to parse a more specific error message
      const specificError = errorData.error || errorData.detail || 'Failed to submit offer.';
      throw new Error(specificError);
    }
    
    const result = await response.json();
    console.log('Offer submitted successfully', result);
    alert('Offer submitted successfully!');
    // Optionally, you could refresh assets or update the UI to show the offer was made.

    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4e4d0] via-[#c8d5c0] to-[#b8cdb0]">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/30 border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">NPLin Marketplace</h1>

            <button 
              onClick={() => navigate('/profile')}
              className="px-6 py-2.5 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl">
              <User className="w-5 h-5 mr-1 inline-block" /> Profile
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Public Asset Listings</h2>
          <p className="text-lg text-gray-700 mt-2">Browse available assets and make offers for relief financing.</p>
        </div>

        {loading && <p className="text-center text-lg text-gray-700">Loading assets...</p>}
        {error && <p className="text-center text-lg text-red-600 bg-red-100 p-4 rounded-xl">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assets.length > 0 ? (
              assets.map(asset => (
                <AssetCard key={asset.id} asset={asset} onMakeOffer={handleMakeOffer} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-700 text-lg">No assets are currently listed in the marketplace.</p>
            )}
          </div>
        )}
      </main>

      {showOfferModal && (
        <OfferModal 
          asset={selectedAsset}
          onClose={handleCloseModal}
          onSubmit={handleOfferSubmit}
        />

      )}
    </div>
  );
}