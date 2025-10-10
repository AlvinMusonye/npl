import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import { Car, Home, Maximize, Check, X, Store } from 'lucide-react';
import Notification from '../components/ui/Notification.jsx';

// Reusable UI Components
const GlassCard = ({ children, className = "", ...props }) => (
  <div
    className={`relative overflow-hidden rounded-3xl bg-white/40 border border-white/60 shadow-xl cursor-pointer pointer-events-auto ${className}`}
    style={{
      background:
        'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
    }}
    {...props}
  >
    <div className="relative z-10 pointer-events-none">{children}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusStyles = {
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    PENDING_ADMIN: 'bg-blue-100 text-blue-800 border-blue-300',
    LISTED: 'bg-green-100 text-green-800 border-green-300',
    REJECTED: 'bg-red-100 text-red-800 border-red-300',
  };
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${
        statusStyles[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status ? status.replace('_', ' ') : 'UNKNOWN'}
    </span>
  );
};

const AssetDetailModal = ({ asset, onClose, onVerify, onReject }) => {
  if (!asset) return null;

  // Safe fallbacks for missing nested fields
  const details = asset.details || {};
  const lister = asset.lister || {};
  const images =
    asset.images && Array.isArray(asset.images)
      ? asset.images.map((img) =>
          typeof img === 'string'
            ? img
            : img.image || 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800'
        )
      : [];

  const DetailItem = ({ label, value, className = '' }) => (
    <div className={className}>
      <p className="text-xs text-[#4a6850] font-medium">{label}</p>
      <p className="font-semibold text-[#1a3d2e] text-base">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div
      className="fixed inset-0 backdrop-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 max-w-6xl w-full shadow-2xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-[#1a3d2e]">
              {asset.primary_identifier} ({asset.listing_type})
            </h3>
            <p className="text-sm text-[#4a6850] mt-1">Asset ID: {asset.id}</p>
            <div className="mt-2">
              <StatusBadge status={asset.workflow_status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <X className="w-6 h-6 text-[#4a6850]" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Images & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {images.length > 0 && (
              <div className="space-y-4">
                {images.map((imagePath, index) => (
                  <a
                    key={index}
                    href={imagePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <img
                      src={imagePath}
                      alt={`Asset image ${index + 1}`}
                      className="w-full h-auto object-cover rounded-2xl border-2 border-white/60 shadow-lg group-hover:opacity-80 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            )}
            <div className="sticky top-0 bg-white/50 backdrop-blur-md p-4 rounded-2xl space-y-3">
              <button
                onClick={() => onVerify(asset.id)}
                disabled={asset.workflow_status === 'LISTED'}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600/90 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" /> Verify & List
              </button>
              <button
                onClick={() => onReject(asset.id)}
                disabled={asset.workflow_status === 'REJECTED'}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/90 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" /> Reject
              </button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Info */}
            <div className="bg-white/40 p-6 rounded-2xl border border-white/50">
              <h4 className="font-bold text-lg text-[#1a3d2e] mb-4 border-b border-white/50 pb-2">Primary Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem label="Asset Type" value={asset.collateral_type} />
                <DetailItem label="Market Value (KES)" value={Number(asset.market_valuation_kes).toLocaleString()} />
                {asset.listing_type === 'DISTRESSED' && asset.relief_amount_requested_kes ? (
                  <DetailItem label="Relief Requested (KES)" value={Number(asset.relief_amount_requested_kes).toLocaleString()} />
                ) : asset.sale_price_kes ? (
                  <DetailItem label="Sale Price (KES)" value={Number(asset.sale_price_kes).toLocaleString()} />
                ) : null}
                <DetailItem label="Valuation Date" value={asset.valuation_date ? new Date(asset.valuation_date).toLocaleDateString() : 'N/A'} />
                <DetailItem label="Encumbrance" value={asset.encumbrance_status} />
                <DetailItem label="MPSR Ref" value={asset.mpsr_filing_ref || 'N/A'} />
                <DetailItem label="Date Registered" value={asset.date_registered ? new Date(asset.date_registered).toLocaleString() : 'N/A'} />
                <DetailItem label="Last Updated" value={asset.updated_at ? new Date(asset.updated_at).toLocaleString() : 'N/A'} />
              </div>
            </div>

            {/* Lister Info */}
            <div className="bg-white/40 p-6 rounded-2xl border border-white/50">
              <h4 className="font-bold text-lg text-[#1a3d2e] mb-4 border-b border-white/50 pb-2">Lister Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem label="Lister Name" value={`${lister.first_name || ''} ${lister.last_name || ''}`} />
                <DetailItem label="Lister Email" value={lister.email} />
                <DetailItem label="Lister Phone" value={lister.mobile_phone_number} />
                <DetailItem label="Lister Role" value={lister.role} />
                <DetailItem label="Lister Status" value={lister.status} />
              </div>
            </div>

            {/* Asset Specifics */}
            <div className="bg-white/40 p-6 rounded-2xl border border-white/50">
              <h4 className="font-bold text-lg text-[#1a3d2e] mb-4 border-b border-white/50 pb-2">Collateral Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem label="Registration Number" value={details.registration_number} />
                <DetailItem label="Make" value={details.make} />
                <DetailItem label="Model" value={details.model} />
                <DetailItem label="Chassis Number" value={details.chassis_number} />
                <DetailItem label="Year of Manufacture" value={details.year_of_manufacture} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminAssetCard = ({ asset, onViewDetails }) => {
  const assetTypeDetails = {
    VEHICLE: { icon: Car },
    PROPERTY: { icon: Home },
    LAND: { icon: Maximize },
  };
  const { icon: Icon } = assetTypeDetails[asset.collateral_type] || {
    icon: Store,
  };

  const imageUrl =
    asset.images && asset.images.length > 0
      ? (typeof asset.images[0] === 'string'
        ? asset.images[0] // It's a direct URL string
        : asset.images[0]?.image) // It's an object, check for the 'image' property
      : 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800';

  return (
    <GlassCard
      onClick={() => {
        console.log('Clicked asset:', asset.id);
        if (asset.id) onViewDetails(asset.id);
      }}
      className="group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl flex flex-col cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden rounded-t-3xl">
        <img
          src={imageUrl}
          alt={asset.primary_identifier}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 right-4">
          <StatusBadge status={asset.workflow_status} />
        </div>
        <div className="absolute bottom-4 left-4 px-2 py-1 text-xs text-white bg-black/50 rounded-md">
          {asset.listing_type}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5 text-gray-700" />
          <h3
            className="text-lg font-bold text-[#1a3d2e] truncate"
            title={asset.primary_identifier}
          >
            {asset.primary_identifier}
          </h3>
        </div>

        <div className="space-y-2 text-sm mb-4 flex-grow">
          <div className="flex justify-between">
            <span className="text-gray-600">Owner:</span>{' '}
            <span className="font-medium text-gray-800 truncate">
              {asset.lister?.email || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Valuation:</span>{' '}
            <span className="font-semibold text-gray-800">
              KSh {Number(asset.market_valuation_kes).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default function AssetManagement() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const filterEndpoints = {
    all: '/api/admin/assets/',
    distressed: '/api/admin/assets/distressed/',
    repossessed: '/api/admin/assets/repossessed/',
    pending: '/api/admin/assets/?workflow_status=PENDING_ADMIN',
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = filterEndpoints[filter] || filterEndpoints.all;
        const response = await axiosInstance.get(url);
        let rawAssets = [];
        if (response.data && Array.isArray(response.data.results)) {
          rawAssets = response.data.results;
        } else if (Array.isArray(response.data)) {
          rawAssets = response.data;
        }

        // ✅ Normalize the data to ensure 'id' is always present
        const normalizedAssets = rawAssets.map(asset => ({
          ...asset,
          id: asset.id || asset.collateral_uuid,
        }));

        setAssets(normalizedAssets);
      } catch (err) {
        setError(
          err.response?.data?.detail || err.message || 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, [filter]);

  const handleAssetAction = async (assetId, action) => {
    const newStatus = action === 'verify' ? 'LISTED' : 'REJECTED';
    try {
      await axiosInstance.post(`/api/admin/assets/${assetId}/${action}/`);
      setAssets((prevAssets) =>
        prevAssets.map((asset) =>
          asset.id === assetId
            ? { ...asset, workflow_status: newStatus }
            : asset
        )
      );
      setSelectedAsset(null);
      showNotification(`Asset successfully ${action === 'verify' ? 'listed' : 'rejected'}!`, 'success');
    } catch (err) {
      showNotification(`Error: ${err.response?.data?.detail || err.message}`, 'error');
    }
  };

  const handleViewDetails = async (assetId) => {
    console.log("Asset clicked:", assetId); // ✅ Step 2: Log on click
    if (!assetId) return;

    setIsDetailLoading(true);
    try {
      console.log(`Fetching: /api/admin/assets/${assetId}/`); // ⚡ Bonus debug tip
      const response = await axiosInstance.get(`/api/admin/assets/${assetId}/`);
      console.log("Asset details:", response.data); // ✅ Step 2: Log response
      setSelectedAsset(response.data);
    } catch (error) {
      console.error("Error fetching asset details:", error);
      showNotification(
        `Failed to fetch asset details: ${
          error.response?.data?.detail || error.message
        }`
      );
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseModal = () => setSelectedAsset(null);

  return (
    <>
      {notification.show && (
        <Notification message={notification.message} type={notification.type} onClear={() => setNotification({ show: false, message: '', type: '' })} />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a3d2e]">
          Asset Management
        </h1>
        <p className="mt-1 text-sm text-[#4a6850]">
          Review, verify, and manage all platform assets.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {Object.keys(filterEndpoints).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors capitalize ${
                filter === key
                  ? 'bg-[#6B9071] text-white shadow-md'
                  : 'bg-white/50 text-[#4a6850] hover:bg-white/80'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <p className="text-center text-lg text-gray-700">Loading assets...</p>
      )}
      {error && (
        <p className="text-center text-lg text-red-600 bg-red-100 p-4 rounded-xl">
          Error: {error}
        </p>
      )}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assets.length > 0 ? (
            assets // Ensure we only render assets that have an ID
              .filter((asset) => asset && asset.id)
              .map((asset) => (
              <AdminAssetCard
                key={asset.id || `${asset.primary_identifier}-${Math.random()}`}
                asset={asset}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <GlassCard className="col-span-full p-10 text-center">
              <h3 className="text-2xl font-bold text-gray-800">
                No Assets Found
              </h3>
              <p className="text-gray-600 mt-2">
                There are no assets matching the current filter.
              </p>
            </GlassCard>
          )}
        </div>
      )}

      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={handleCloseModal}
          onVerify={() => handleAssetAction(selectedAsset.id, 'verify')}
          onReject={() => handleAssetAction(selectedAsset.id, 'reject')}
        />
      )}

      {isDetailLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </>
  );
}
