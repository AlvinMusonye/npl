import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { 
    Car, Home, Maximize, Upload, Eye, MessageSquare, LogOut, AlertTriangle
} from 'lucide-react';

// =========================================================================
// 1. CONSTANTS & CONFIG
// =========================================================================
const API_BASE_URL = 'http://127.0.0.1:8000';

// =========================================================================
// 2. REUSABLE UI COMPONENTS
// =========================================================================

// Glass Card Component
const GlassCard = ({ children, className = "", ...props }) => (
    <div className={`relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-lg ${className}`} {...props}>
        <div className="relative z-10 h-full">{children}</div>
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

// My Asset Card Component
const MyAssetCard = ({ asset, navigate }) => {
    const assetTypeDetails = { VEHICLE: { icon: Car }, PROPERTY: { icon: Home }, LAND: { icon: Maximize } };
    const { icon: Icon } = assetTypeDetails[asset.collateral_type] || { icon: AlertTriangle };
    const primaryImage = asset.images && asset.images.length > 0 ? asset.images[0] : 'https://placehold.co/600x400/E0F2E0/4a6850?text=No+Image';

    return (
      <GlassCard className="group transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#40916c]/20">
        <div className="relative">
          <div className="relative h-56 overflow-hidden rounded-t-3xl">
            <img 
              src={primaryImage} 
              alt={asset.primary_identifier}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 right-4">
              {getStatusBadge(asset.workflow_status)}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-bold text-black group-hover:text-[#40916c] transition-colors">
                {asset.primary_identifier}
              </h3>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Market Valuation</span>
                <span className="font-semibold text-black">KSh {Number(asset.market_valuation_kes).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Offers Received</span>
                <span className="font-bold text-blue-700">{asset.offer_count || 0}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all">
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button 
                onClick={() => navigate('/borrower/offers')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#c8d5c0]/80 to-[#b8cdb0]/80 hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-[#1a3d2e] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Offers
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    );
};

// =========================================================================
// 3. MAIN MY ASSETS PAGE COMPONENT
// =========================================================================
export default function MyAssetsPage({ setRole }) {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssets = async () => {
            setLoading(true);
            setError(null);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) throw new Error('Authentication token not found. Please log in.');

                const response = await fetch(`${API_BASE_URL}/api/assets/my_assets/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
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

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="flex min-h-screen">
                <ModernSidebar userRole="borrower" onLogout={handleLogout} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
                    <div className="p-0 lg:p-4 w-full min-h-[85vh]">
                        <header className="flex justify-between items-center pb-4 mb-8">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">My Asset Listings</h1>
                                <p className="mt-2 text-lg text-gray-600">Track the status and manage your listed collateral.</p>
                            </div>
                            <button
                                onClick={() => navigate('/borrower/register-asset')}
                                className="px-6 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
                            >
                                <Upload className="w-5 h-5" />
                                List New Asset
                            </button>
                        </header>

                        {loading && <div className="text-center p-8 text-gray-600">Loading your assets...</div>}
                        {error && <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl">{error}</div>}
                        
                        {!loading && !error && (
                            assets.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {assets.map((asset) => (
                                        <MyAssetCard key={asset.collateral_uuid} asset={asset} navigate={navigate} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200">
                                    <h3 className="text-2xl font-bold text-gray-800">No Assets Listed Yet</h3>
                                    <p className="text-gray-600 mt-2 mb-6">Click "List New Asset" to get started and receive financing offers.</p>
                                    <button
                                        onClick={() => navigate('/borrower/register-asset')}
                                        className="px-8 py-4 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                                    >
                                        <Upload className="w-5 h-5" />
                                        List Your First Asset
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}