import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { Car, Home, Maximize, Store, Contact, X, FileText, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Reusable UI Components
const ProductCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${className}`}>
    {children}
  </div>
);

const AssetCard = ({ asset }) => {
    const assetTypeDetails = { VEHICLE: { icon: Car }, PROPERTY: { icon: Home }, LAND: { icon: Maximize } };
    const { icon: Icon } = assetTypeDetails[asset.collateral_type] || { icon: Store };
    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/600x400/E0F2E0/4a6850?text=No+Image';
        return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
    };
    const imageList = asset.image_urls || asset.images;
    const primaryImage = imageList && imageList.length > 0 ? getImageUrl(imageList[0].image || imageList[0]) : 'https://placehold.co/600x400/E0F2E0/4a6850?text=No+Image';

    const displayAmount = asset.listing_type === 'FOR_SALE' ? asset.sale_price_kes : asset.relief_amount_requested_kes || asset.market_valuation_kes;
    const amountLabel = asset.listing_type === 'FOR_SALE' ? 'Sale Price' : 'Relief Requested';    

    return (
      <ProductCard className="group">
        {/* Image Section */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          <img 
            src={primaryImage} 
            alt={asset.primary_identifier}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Title with Icon */}
          <div className="flex items-start gap-2">
            <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <h3 className="font-medium text-gray-900 leading-tight line-clamp-2" title={asset.primary_identifier}>
              {asset.primary_identifier}
            </h3>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="text-xs text-gray-500">{amountLabel}</div>
            <div className="text-xl font-semibold text-gray-900">
              KSh {Number(displayAmount).toLocaleString()}
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Contact className="w-5 h-5" />
            Request Contact
          </button>
        </div>
      </ProductCard>
    );
};

const AssetDetailModal = ({ asset, onClose, onContactOwner, isLoading }) => {
  if (!asset && !isLoading) return null;

  const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/600x400/E0F2E0/4a6850?text=No+Image';
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  };

  const details = asset?.details || {};
  const imageList = (asset?.image_urls || asset?.images || []).map(img => getImageUrl(typeof img === 'string' ? img : img.image)).filter(Boolean);
  const primaryImage = imageList.length > 0 ? imageList[0] : getImageUrl(null);

  const DetailItem = ({ label, value }) => (
    <div><p className="text-xs text-gray-500 font-medium mb-1">{label}</p><p className="font-medium text-gray-900 text-sm">{value || 'N/A'}</p></div>
  );

  const DocumentViewer = ({ documents }) => {
    if (!documents || documents.length === 0) return null;
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-4">Supporting Documents</h4>
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <a key={index} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-md hover:bg-gray-50 border"><FileText className="w-5 h-5 text-gray-500" /> <span className="text-sm font-medium text-gray-700">{doc.document_type}</span></a>
          ))}
        </div>
      </div>
    );
  };
  return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}><div className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-gray-900" />
          </div>
        ) : asset && (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{asset.primary_identifier}</h3>
                <p className="text-sm text-gray-500 mt-1">Asset ID: {asset.collateral_uuid}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-6 h-6 text-gray-500" /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Images & Contact */}
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
                <button 
                    onClick={() => onContactOwner(asset)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors">
                    <Contact className="w-5 h-5" />
                    Contact Owner
                </button>
              </div>

              {/* Right Column: Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">Financials</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {asset.listing_type === 'DISTRESSED' && <DetailItem label="Relief Requested (KES)" value={Number(asset.relief_amount_requested_kes).toLocaleString()} />}
                    {asset.listing_type === 'REPOSSESSED' && <DetailItem label="Sale Price (KES)" value={Number(asset.sale_price_kes).toLocaleString()} />}
                    <DetailItem label="Market Value (KES)" value={Number(asset.market_valuation_kes).toLocaleString()} />
                    <DetailItem label="Encumbrance" value={asset.encumbrance_status} />
                    <DetailItem label="Lister Email" value={asset.lister_email} />
                    <DetailItem label="Lister Phone" value={asset.lister_phone} />

                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">Collateral Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Asset Type" value={asset.collateral_type} />
                    <DetailItem label="Valuation Date" value={asset.valuation_date ? new Date(asset.valuation_date).toLocaleDateString() : 'N/A'} />
                    {asset.collateral_type === 'VEHICLE' && (
                        <>
                            <DetailItem label="Make" value={details.make} />
                            <DetailItem label="Model" value={details.model} />
                            <DetailItem label="Year" value={details.year_of_manufacture} />
                            <DetailItem label="Mileage" value={details.mileage ? `${Number(details.mileage).toLocaleString()} km` : 'N/A'} />
                        </>
                    )}
                    {asset.collateral_type === 'LAND' && (
                        <>
                            <DetailItem label="Registration District" value={details.registration_district} />
                            <DetailItem label="Land Size (sqm)" value={details.land_size_sqm ? Number(details.land_size_sqm).toLocaleString() : 'N/A'} />
                        </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}</div></div>);
};

export default function AssetListings({ setRole }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
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
        if (!response.ok) throw new Error('Failed to fetch public asset listings.');
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

  const handleViewDetails = async (assetId) => {
    if (!assetId) return;
    setIsDetailLoading(true);
    setSelectedAsset(null); // Clear previous asset
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/api/assets/public_listings/${assetId}/`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error('Failed to fetch asset details.');
        const data = await response.json();
        setSelectedAsset(data);
    } catch (err) {
        setError(err.message); // Show error in the main view
    } finally {
        setIsDetailLoading(false);
    }
  };

  const handleContactOwner = async (asset) => {
    if (!asset) return;

    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) throw new Error('Authentication token not found.');

        const payload = {
            initial_message: `Hello, I'm interested in learning more about the asset you listed (${asset.primary_identifier}).`
        };

        const response = await fetch(`${API_BASE_URL}/api/assets/public_listings/${asset.collateral_uuid}/start-conversation/`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Failed to start conversation.');
        
        navigate(`/lender/communication?convId=${data.id}`);

    } catch (err) {
        alert(`Error: ${err.message}`);
    }
  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {(selectedAsset || isDetailLoading) && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={handleCloseModal}
          onContactOwner={handleContactOwner}
          isLoading={isDetailLoading}
        />
      )}
      <div className="flex min-h-screen">
        <ModernSidebar userRole="lender" onLogout={handleLogout} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
          <div className="p-0 lg:p-4 w-full min-h-[85vh]">
            <header className="pb-6 mb-8 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="mt-1 text-gray-600">Browse assets available for sale or financing.</p>
            </header>

            {loading && <div className="text-center p-8 text-gray-600">Loading marketplace assets...</div>}
            {error && <div className="text-center p-8 text-red-600 bg-red-50 rounded-lg">{error}</div>}
            
            {!loading && !error && (
              assets.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {assets.map(asset => (
                    <div key={asset.collateral_uuid} onClick={() => handleViewDetails(asset.collateral_uuid)}>
                        <AssetCard asset={asset} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900">Marketplace is Empty</h3>
                  <p className="text-gray-600 mt-2">There are no public asset listings at the moment.</p>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}