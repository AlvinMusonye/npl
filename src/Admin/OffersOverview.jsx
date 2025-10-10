import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { TrendingUp, User, Handshake, X, DollarSign, Percent, Calendar, Info } from 'lucide-react';

// Reusable UI Components (local to this file for now)
const GlassCard = ({ children, className = "", ...props }) => (
  <div
    className={`relative overflow-hidden rounded-3xl bg-white/40 border border-white/60 shadow-xl ${className}`}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
    }}
    {...props}
  >
    <div className="relative z-10">{children}</div>
  </div>
);

const DashboardHeader = ({ title, subtitle }) => (
  <header className="pb-4 mb-8 border-b border-[#6B9071]/30">
    <h1 className="text-3xl font-bold text-[#1a3d2e]">{title}</h1>
    <p className="mt-1 text-sm text-[#4a6850]">{subtitle}</p>
  </header>
);

const OfferStatusBadge = ({ status }) => {
    const statusStyles = {
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        ACCEPTED: 'bg-green-100 text-green-800 border-green-300',
        REJECTED: 'bg-red-100 text-red-800 border-red-300',
        COUNTERED: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status ? status.replace('_', ' ') : 'UNKNOWN'}
        </span>
    );
};

const OfferDetailModal = ({ offer, onClose, isLoading }) => {
    if (!offer) return null;

    // Extract images safely from the nested collateral object
    const images =
        offer.collateral?.images && Array.isArray(offer.collateral.images)
        ? offer.collateral.images.map((img) =>
            typeof img === 'string' ? img : img.image || null
          ).filter(Boolean)
        : [];

    const DetailSection = ({ title, children }) => (
        <div className="bg-white/40 p-5 rounded-2xl border border-white/50">
            <h4 className="font-bold text-lg text-[#1a3d2e] mb-4 border-b border-white/50 pb-2">{title}</h4>
            <div className="grid grid-cols-2 gap-4">{children}</div>
        </div>
    );

    const DetailItem = ({ label, value, className = '' }) => (
        <div className={className}>
            <p className="text-xs text-[#4a6850] font-medium">{label}</p>
            <p className="font-semibold text-[#1a3d2e] text-base">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div className="fixed inset-  z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 max-w-6xl w-full shadow-2xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {isLoading ? (
                    <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a3d2e]"></div></div>
                ) : (
                    <>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-[#1a3d2e]">Offer Details</h3>
                                <p className="text-sm text-[#4a6850] mt-1">Offer ID: {offer.id}</p>
                                <div className="mt-2"><OfferStatusBadge status={offer.status} /></div>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50 transition-colors">
                                <X className="w-6 h-6 text-[#4a6850]" />
                            </button>
                        </div>

                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Images */}
                            <div className="lg:col-span-1 space-y-6">
                                {images.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-lg text-[#1a3d2e]">Collateral Images</h4>
                                        {images.map((imagePath, index) => (
                                            <a key={index} href={imagePath} target="_blank" rel="noopener noreferrer" className="block group">
                                                <img
                                                    src={imagePath}
                                                    alt={`Collateral image ${index + 1}`}
                                                    className="w-full h-auto object-cover rounded-2xl border-2 border-white/60 shadow-lg group-hover:opacity-80 transition-opacity"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <DetailSection title="Offer Summary">
                                    <DetailItem label="Offer Amount (KES)" value={offer.offer_amount_kes ? Number(offer.offer_amount_kes).toLocaleString() : 'N/A'} />
                                    <DetailItem label="Interest Rate" value={offer.proposed_interest_rate ? `${(offer.proposed_interest_rate * 100).toFixed(2)}%` : 'N/A'} />
                                    <DetailItem label="Date Proposed" value={offer.date_proposed ? new Date(offer.date_proposed).toLocaleString() : 'N/A'} />
                                    <DetailItem label="Last Updated" value={offer.date_updated ? new Date(offer.date_updated).toLocaleString() : 'N/A'} />
                                    <DetailItem label="Lender Comment" value={offer.lender_comment} className="col-span-2" />
                                    <DetailItem label="Borrower Comment" value={offer.borrower_comment} className="col-span-2" />
                                </DetailSection>

                                <DetailSection title="Collateral Information">
                                    <DetailItem label="Identifier" value={offer.collateral?.primary_identifier || 'N/A'} />
                                    <DetailItem label="Type" value={offer.collateral?.collateral_type || 'N/A'} />
                                    <DetailItem label="Market Value (KES)" value={offer.collateral?.market_valuation_kes ? Number(offer.collateral.market_valuation_kes).toLocaleString() : 'N/A'} />
                                    <DetailItem label="Relief Requested (KES)" value={offer.collateral?.relief_amount_requested_kes ? Number(offer.collateral.relief_amount_requested_kes).toLocaleString() : 'N/A'} />
                                </DetailSection>

                                <DetailSection title="Lender Details">
                                    <DetailItem label="Name" value={`${offer.lender?.first_name} ${offer.lender?.last_name}`} />
                                    <DetailItem label="Email" value={offer.lender?.email} />
                                    <DetailItem label="Phone" value={offer.lender?.mobile_phone_number} />
                                    <DetailItem label="Status" value={offer.lender?.status} />
                                </DetailSection>

                                <DetailSection title="Borrower Details">
                                    <DetailItem label="Name" value={`${offer.borrower?.first_name} ${offer.borrower?.last_name}`} />
                                    <DetailItem label="Email" value={offer.borrower?.email} />
                                    <DetailItem label="Phone" value={offer.borrower?.mobile_phone_number} />
                                    <DetailItem label="Status" value={offer.borrower?.status} />
                                </DetailSection>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default function OffersOverview() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    const handleViewDetails = async (offerId) => {
        if (!offerId) return;
        setIsDetailLoading(true);
        // Find the offer from the list to show basic data immediately
        const basicOfferData = offers.find(o => o.offer_id === offerId);
        setSelectedOffer(basicOfferData);

        try {
            const response = await axiosInstance.get(`/api/offers/${offerId}/`);
            setSelectedOffer(response.data); // Update with full details
        } catch (err) {
            setError(`Failed to fetch offer details: ${err.message}`); // Show error in a notification or modal later
        } finally {
            setIsDetailLoading(false);
        }
    };

    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get('/api/offers/');
                setOffers(response.data);
            } catch (err) {
                setError(err.response?.data?.detail || err.message || 'Failed to fetch offers.');
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const handleCloseModal = () => {
        setSelectedOffer(null);
    };

    return (
        <>
            <DashboardHeader 
                title="Offers Overview" 
                subtitle="Monitor and analyze all offers made across the platform." 
            />
            <GlassCard className="p-6">
                <div className="overflow-x-auto">
                    {loading && <div className="text-center p-8 text-[#4a6850]">Loading offers...</div>}
                    {error && <div className="text-center p-8 text-red-600 bg-red-100/50 rounded-xl">Error: {error}</div>}
                    {!loading && !error && (
                        <table className="min-w-full text-sm text-left">
                            <thead className="border-b border-[#6B9071]/30 text-[#1a3d2e]">
                                <tr>
                                    <th className="p-4">Asset</th>
                                    <th className="p-4">Lender</th>
                                    <th className="p-4">Borrower</th>
                                    <th className="p-4">Amount (KES)</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offers.length > 0 ? offers.map(offer => (
                                    <tr key={offer.offer_id} onClick={() => handleViewDetails(offer.offer_id)} className="border-b border-white/60 hover:bg-white/40 cursor-pointer">
                                        <td className="p-4 font-medium text-[#1a3d2e]">{offer.collateral_identifier}</td>
                                        <td className="p-4 text-[#4a6850]">{offer.lender.email}</td>
                                        <td className="p-4 text-[#4a6850]">{offer.borrower.email}</td>
                                        <td className="p-4 font-semibold text-[#1a3d2e]">{Number(offer.offer_amount_kes).toLocaleString()}</td>
                                        <td className="p-4"><OfferStatusBadge status={offer.status} /></td>
                                        <td className="p-4 text-[#4a6850]">{new Date(offer.date_proposed).toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="text-center p-10">
                                            <div className="flex flex-col items-center gap-4 text-[#4a6850]">
                                                <Handshake className="w-12 h-12" />
                                                <h3 className="text-xl font-bold">No Offers Found</h3>
                                                <p>There are no offers currently recorded on the platform.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </GlassCard>

            {selectedOffer && (
                <OfferDetailModal
                    offer={selectedOffer}
                    onClose={handleCloseModal}
                    isLoading={isDetailLoading}
                />
            )}
        </>
    );
}