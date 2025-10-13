import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { 
    Car, Home, Maximize, Upload, Eye, MessageSquare, AlertTriangle, Edit, X, FileText
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Reusable UI Components
const ProductCard = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}>
        {children}
    </div>
);

const StatusBadge = ({ status }) => {
  if (!status) return null; // Don't render anything if status is missing
  const statusStyles = {
    PENDING_REVIEW: 'bg-yellow-500 text-white',
    PENDING_ADMIN: 'bg-blue-500 text-white',
    LISTED: 'bg-green-500 text-white',
    REJECTED: 'bg-red-500 text-white',
  };
  return (
    <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded z-10 ${statusStyles[status] || 'bg-gray-500 text-white'}`}>{status.replace('_', ' ')}</span>
  );
};

const DocumentViewer = ({ title, documents }) => {
  if (!documents || documents.length === 0) return null;

  const isImage = (url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  const getFullUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {documents.map((doc, index) => {
            const docUrl = getFullUrl(doc.document || doc.image || doc);
            return (
              <a key={index} href={docUrl} target="_blank" rel="noopener noreferrer" className="block group">
                {isImage(docUrl) ? (
                  <img src={docUrl} alt={`${title} ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                ) : (
                  <div className="w-full h-32 rounded-lg border border-gray-200 bg-white flex flex-col items-center justify-center p-2 text-center">
                    <FileText className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-600 break-all">{docUrl.split('/').pop()}</span>
                  </div>
                )}
              </a>
            );
        })}
      </div>
    </div>
  );
};

const AssetDetailModal = ({ asset, onClose, isLoading }) => {
  if (!asset && !isLoading) return null;

  const details = asset?.details || {};
  const imageList = (asset?.image_urls || asset?.images || []).map(img => getImageUrl(typeof img === 'string' ? img : img.image)).filter(Boolean);
  const primaryImage = imageList.length > 0 ? imageList[0] : getImageUrl(null);
  const ownershipDocs = (asset?.proof_of_ownership_docs || []).map(doc => doc.document || doc
  );
  const distressDocs = (asset?.proof_of_distress_docs || []).map(doc => 
    doc.document || doc
  );

    const DetailItem = ({ label, value }) => (
    <div>
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <p className="font-medium text-gray-900 text-sm">{value || 'N/A'}</p>
    </div>
  );

  const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/600x400/E0F2E0/4a6850?text=No+Image';
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-6xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : asset && (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{asset.primary_identifier}</h3>
                <p className="text-sm text-gray-500 mt-1">Asset ID: {asset.collateral_uuid}</p>
                <div className="mt-2"><StatusBadge status={asset.workflow_status} /></div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-6 h-6 text-gray-500" /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Images */}
              <div className="space-y-6">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img src={primaryImage} alt={asset.primary_identifier} className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {imageList.slice(1, 5).map((img, i) => (
                        <div key={i} className="aspect-square rounded-md overflow-hidden bg-gray-100">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">Primary Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <DetailItem label="Asset Type" value={asset.collateral_type} />
                    <DetailItem label="Market Value (KES)" value={Number(asset.market_valuation_kes).toLocaleString()} />
                    <DetailItem label="Relief Requested (KES)" value={Number(asset.relief_amount_requested_kes).toLocaleString()} />
                    <DetailItem label="Valuation Date" value={asset.valuation_date ? new Date(asset.valuation_date).toLocaleDateString() : 'N/A'} />
                    <DetailItem label="Last Updated" value={asset.updated_at ? new Date(asset.updated_at).toLocaleString() : 'N/A'} />
                    <DetailItem label="Date Registered" value={asset.date_registered ? new Date(asset.date_registered).toLocaleString() : 'N/A'} />
                  </div>
                </div>

                {asset.collateral_type === 'VEHICLE' && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Collateral Details</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <DetailItem label="Make" value={details.make} />
                      <DetailItem label="Model" value={details.model} />
                      <DetailItem label="Year" value={details.year_of_manufacture} />
                      <DetailItem label="Registration Number" value={details.registration_number} />
                      <DetailItem label="Chassis Number" value={details.chassis_number} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// My Asset Card Component
const MyAssetCard = ({ asset, navigate }) => {
    const assetTypeDetails = { VEHICLE: { icon: Car }, PROPERTY: { icon: Home }, LAND: { icon: Maximize } };
    const { icon: Icon } = assetTypeDetails[asset.collateral_type] || { icon: AlertTriangle };
    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/600x400/E0F2E0/4a6850?text=No+Image';
        return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
    };
    const imageList = asset.image_urls || asset.images;
    const primaryImage = imageList && imageList.length > 0 ? getImageUrl(imageList[0].image || imageList[0]) : 'https://placehold.co/600x400/E0F2E0/4a6850?text=No+Image';

    return (
      <ProductCard className="group">
        {/* Image Section */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img 
            src={primaryImage} 
            alt={asset.primary_identifier}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <StatusBadge status={asset.workflow_status} />
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Title with Icon */}
          <div className="flex items-start gap-2">
            <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <h3 className="font-medium text-gray-900 leading-tight line-clamp-2">
              {asset.primary_identifier}
            </h3>
          </div>

          {/* Pricing & Offers */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Relief Requested</span>
              <span className="text-gray-900 font-semibold">KSh {Number(asset.relief_amount_requested_kes).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Offers Received</span>
              <span className="text-blue-600 font-bold">{asset.offer_count || 0}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button 
              onClick={() => navigate.view(asset.collateral_uuid)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            <button 
              onClick={() => navigate.navigate(`/borrower/register-asset?edit=${asset.collateral_uuid}`)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button 
              onClick={() => navigate('/borrower/offers')}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Offers
            </button>
          </div>
        </div>
      </ProductCard>
    );
};

export default function MyAssetsPage({ setRole }) {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
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

    const handleViewDetails = async (assetId) => {
        if (!assetId) return;
        setIsDetailLoading(true);
        setSelectedAsset(null);
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/assets/my_assets/${assetId}/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (!response.ok) throw new Error('Failed to fetch asset details.');
            const data = await response.json();
            setSelectedAsset(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedAsset(null);
        navigate('/borrower/assets', { replace: true });
    };

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        navigate('/login');
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const assetIdToView = params.get('view');
        if (assetIdToView && !selectedAsset) {
            handleViewDetails(assetIdToView);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.search]);

    return (
        <div className="min-h-screen bg-gray-50">
            {(selectedAsset || isDetailLoading) && (
                <AssetDetailModal
                    asset={selectedAsset}
                    onClose={handleCloseModal}
                    isLoading={isDetailLoading}
                />
            )}
            <div className="flex min-h-screen">
                <ModernSidebar userRole="borrower" onLogout={handleLogout} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
                    <div className="p-0 lg:p-4 w-full min-h-[85vh]">
                        <header className="flex justify-between items-center pb-6 mb-8 border-b border-gray-200">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Asset Listings</h1>
                                <p className="mt-1 text-gray-600">Track the status and manage your listed collateral.</p>
                            </div>
                            <button
                                onClick={() => navigate('/borrower/register-asset')}
                                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all flex items-center gap-2"
                            >
                                <Upload className="w-5 h-5" />
                                List New Asset
                            </button>
                        </header>

                        {loading && <div className="text-center p-8 text-gray-600">Loading your assets...</div>}
                        {error && <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">{error}</div>}
                        
                        {!loading && !error && (
                            assets.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {assets.map((asset) => (
                                        <MyAssetCard 
                                            key={asset.collateral_uuid} 
                                            asset={asset} 
                                            navigate={{navigate: navigate, view: (assetId) => navigate(`/borrower/assets?view=${assetId}`)}} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                                    <h3 className="text-2xl font-bold text-gray-900">No Assets Listed Yet</h3>
                                    <p className="text-gray-600 mt-2 mb-6">Click "List New Asset" to get started and receive financing offers.</p>
                                    <button
                                        onClick={() => navigate('/borrower/register-asset')}
                                        className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all flex items-center gap-2 mx-auto"
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