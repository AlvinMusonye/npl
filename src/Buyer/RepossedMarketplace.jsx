import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { Car, Home, Maximize, Store, DollarSign, Contact, CheckCircle } from 'lucide-react';

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

const AssetCard = ({ asset, onRequestContact }) => {
    const assetTypeDetails = { VEHICLE: { icon: Car }, PROPERTY: { icon: Home }, LAND: { icon: Maximize } };
    const { icon: Icon } = assetTypeDetails[asset.collateral_type] || { icon: Store };
    const primaryImage = asset.images && asset.images.length > 0 ? asset.images[0] : 'https://placehold.co/600x400/E0F2E0/4a6850?text=No+Image';

    return (
      <GlassCard className="group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
        <div className="relative h-56 overflow-hidden rounded-t-3xl">
          <img 
            src={primaryImage} 
            alt={asset.primary_identifier}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Icon className="w-5 h-5 text-[#1a3d2e]" />
            <h3 className="text-xl font-bold text-[#1a3d2e] truncate" title={asset.primary_identifier}>
              {asset.primary_identifier || 'Repossessed Asset'}
            </h3>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#4a6850]">Sale Price</span>
              <span className="font-semibold text-lg text-green-700">KSh {Number(asset.sale_price_kes).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-center pt-4 border-t border-white/30">
            <button 
              onClick={() => onRequestContact(asset.collateral_uuid)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#c8d5c0]/80 to-[#b8cdb0]/80 hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-[#1a3d2e] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
              <Contact className="w-5 h-5" />
              Request Contact
            </button>
          </div>
        </div>
      </GlassCard>
    );
};

// =========================================================================
// 3. MAIN REPOSSESSED MARKETPLACE PAGE COMPONENT
// =========================================================================

export default function RepossedMarketplace({ setRole }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRepossessedListings = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Authentication token not found.');

      const response = await fetch(`${API_BASE_URL}/api/assets/repossessed_listings/`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to fetch repossessed assets.');
      const data = await response.json();
      setAssets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepossessedListings();
  }, []);

  const handleRequestContact = async (assetId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Authentication token not found.');

      const response = await fetch(`${API_BASE_URL}/api/assets/repossessed_listings/${assetId}/request-contact/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to send contact request.');
      
      alert(data.status || 'Contact request sent successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0]">
      <div className="flex min-h-screen">
        <ModernSidebar userRole="buyer" onLogout={handleLogout} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
          <GlassCard className="p-6 lg:p-10 w-full min-h-[85vh]">
            <header className="pb-4 mb-8 border-b border-[#6B9071]/30">
              <h1 className="text-4xl font-bold text-[#1a3d2e]">Repossessed Assets Marketplace</h1>
              <p className="mt-2 text-lg text-[#4a6850]">Browse and find repossessed assets available for sale.</p>
            </header>

            {loading && <div className="text-center p-8 text-[#4a6850]">Loading marketplace...</div>}
            {error && <div className="text-center p-8 text-red-600 bg-red-100/50 rounded-2xl">{error}</div>}
            
            {!loading && !error && (
              assets.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {assets.map(asset => (
                    <AssetCard key={asset.collateral_uuid} asset={asset} onRequestContact={handleRequestContact} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-2xl font-bold text-[#1a3d2e]">Marketplace is Empty</h3>
                  <p className="text-[#4a6850] mt-2">There are no repossessed assets listed for sale at the moment.</p>
                </div>
              )
            )}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}