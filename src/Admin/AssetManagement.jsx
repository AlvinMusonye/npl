import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import { Car, Home, Maximize, Check, X, Store, FileText } from 'lucide-react';
import Notification from '../components/ui/Notification.jsx';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Reusable UI Components
const ProductCard = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}
    {...props}
  >
    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const statusStyles = {
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PENDING_ADMIN: 'bg-blue-100 text-blue-800 border-blue-200',
    LISTED: 'bg-green-100 text-green-800 border-green-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <span
      className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full z-10 border ${
        statusStyles[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status ? status.replace('_', ' ') : 'UNKNOWN'}
    </span>
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
      <div className="space-y-3">
        {documents.map((docUrl, index) => (
          <a key={index} href={getFullUrl(docUrl)} target="_blank" rel="noopener noreferrer" className="block p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors group">
            {isImage(docUrl) ? (
              <img src={getFullUrl(docUrl)} alt={`${title} ${index + 1}`} className="w-full h-auto object-cover rounded" />
            ) : (
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900" title={docUrl.split('/').pop()}>
                  {docUrl.split('/').pop()}
                </span>
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

const AssetDetailModal = ({ asset, onClose, onVerify, onReject }) => {
  if (!asset) return null;

  const details = asset.details || {};
  const lister = asset.lister || {};
  const imageList = asset.image_urls || asset.images;
  const images = imageList && Array.isArray(imageList) ?
      imageList.map((img) =>
          typeof img === 'string'
            ? img
            : img.image || 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800'
        )
      : [];
  const ownershipDocs = Array.isArray(asset.proof_of_ownership_docs)
    ? asset.proof_of_ownership_docs.map(doc => doc.document || doc)
    : [];
  const distressDocs = Array.isArray(asset.proof_of_distress_docs)
    ? asset.proof_of_distress_docs.map(doc => doc.document || doc)
    : [];

  const DetailItem = ({ label, value, className = '' }) => (
    <div className={className}>
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <p className="font-medium text-gray-900 text-sm">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-6xl w-full shadow-2xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {asset.primary_identifier} ({asset.listing_type})
            </h3>
            <p className="text-sm text-gray-500 mt-1">Asset ID: {asset.collateral_uuid}</p>
            <div className="mt-2">
              <StatusBadge status={asset.workflow_status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Actions */}
          <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
            <div className="sticky top-0 bg-gray-50 p-4 rounded-lg space-y-3">
              <button
                onClick={() => onVerify(asset.collateral_uuid, 'verify')}
                disabled={asset.workflow_status === 'LISTED'}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" /> Verify & List
              </button>
              <button
                onClick={() => onReject(asset.collateral_uuid, 'reject')}
                disabled={asset.workflow_status === 'REJECTED'}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg border border-gray-300 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" /> Reject
              </button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
            {/* Primary Info */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Primary Information</h4>
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
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Lister Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem label="Lister Name" value={`${lister.first_name || ''} ${lister.last_name || ''}`} />
                <DetailItem label="Lister Email" value={lister.email} />
                <DetailItem label="Lister Phone" value={lister.mobile_phone_number} />
                <DetailItem label="Lister Role" value={lister.role} />
                <DetailItem label="Lister Status" value={lister.status} />
              </div>
            </div>

            {/* Asset Specifics */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Collateral Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem label="Registration Number" value={details.registration_number} />
                <DetailItem label="Make" value={details.make} />
                <DetailItem label="Model" value={details.model} />
                <DetailItem label="Chassis Number" value={details.chassis_number} />
                <DetailItem label="Year of Manufacture" value={details.year_of_manufacture} />
              </div>
            </div>

            {/* Documents */}
            <DocumentViewer title="Asset Images" documents={images} />
            <DocumentViewer title="Proof of Ownership" documents={ownershipDocs} />
            <DocumentViewer title="Proof of Distress" documents={distressDocs} />
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

  const getFullUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800';
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  };

  const imageList = asset.image_urls || asset.images;
  const imageUrl = imageList && imageList.length > 0 ?
      getFullUrl(typeof imageList[0] === 'string'
        ? imageList[0]
        : imageList[0]?.image)
      : 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800';

  return (
    <ProductCard
      onClick={() => {
        console.log('Clicked asset:', asset.collateral_uuid);
        if (asset.collateral_uuid) onViewDetails(asset.collateral_uuid);
      }}
      className="group cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={asset.primary_identifier}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800';
          }}
        />
        <StatusBadge status={asset.workflow_status} />
        <div className="absolute bottom-3 left-3 px-2.5 py-1 text-xs font-medium text-white bg-black/60 backdrop-blur-sm rounded">
          {asset.listing_type}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Title with Icon */}
        <div className="flex items-start gap-2">
          <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <h3
            className="font-medium text-gray-900 leading-tight line-clamp-2"
            title={asset.primary_identifier}
          >
            {asset.primary_identifier}
          </h3>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Owner:</span>
            <span className="text-gray-900 font-medium truncate ml-2">
              {asset.lister?.email || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Valuation:</span>
            <span className="text-gray-900 font-semibold">
              KSh {Number(asset.market_valuation_kes).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </ProductCard>
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

        const normalizedAssets = rawAssets.map(asset => ({
          ...asset,
          id: asset.collateral_uuid || asset.id,
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

  const handleAssetAction = async (collateralUuid, action) => {
    const newStatus = action === 'verify' ? 'LISTED' : 'REJECTED';
    try {
      await axiosInstance.patch(`/api/admin/assets/${collateralUuid}/${action}/`);
      setAssets((prevAssets) =>
        prevAssets.map((asset) =>
          asset.collateral_uuid === collateralUuid
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
    console.log("Asset clicked:", assetId);
    if (!assetId) return;

    setIsDetailLoading(true);
    try {
      const response = await axiosInstance.get(`/api/admin/assets/${assetId}/`);
      const assetData = response.data;
      assetData.collateral_uuid = assetData.collateral_uuid || assetData.id;
      setSelectedAsset(assetData);
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
        <h1 className="text-3xl font-bold text-gray-900">
          Asset Management
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Review, verify, and manage all platform assets.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          {Object.keys(filterEndpoints).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                filter === key
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <p className="text-center text-lg text-gray-600">Loading assets...</p>
      )}
      {error && (
        <p className="text-center text-lg text-red-600 bg-red-50 p-4 rounded-lg">
          Error: {error}
        </p>
      )}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assets.length > 0 ? (
            assets
              .filter((asset) => asset && asset.id)
              .map((asset) => (
              <AdminAssetCard
                key={asset.id || `${asset.primary_identifier}-${Math.random()}`}
                asset={asset}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <div className="col-span-full bg-white p-10 text-center rounded-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                No Assets Found
              </h3>
              <p className="text-gray-600 mt-2">
                There are no assets matching the current filter.
              </p>
            </div>
          )}
        </div>
      )}

      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={handleCloseModal}
          onVerify={handleAssetAction}
          onReject={handleAssetAction}
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