import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Car, Home, Maximize, Upload, DollarSign, Calendar, MapPin, FileText, CheckCircle, ArrowRight, Trash2, Eye, Edit, MessageSquare, 
    LayoutDashboard, User, CreditCard, Clock, Check, AlertTriangle , Store 
} from 'lucide-react';

// =========================================================================
// 1. REUSABLE UI COMPONENTS (Placeholder for separation)
// =========================================================================

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
// 2. DATA & STATE (Consolidated data for demo)
// =========================================================================

const initialAssets = [
    { id: 1, title: 'Toyota Prado 2018', type: 'VEHICLE', status: 'Listed', relief_amount_requested_kes: 950000, market_valuation_kes: 1200000, offers: 3, image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800' },
    { id: 2, title: '4BR House in Karen', type: 'PROPERTY', status: 'Under Review', relief_amount_requested_kes: 5000000, market_valuation_kes: 7500000, offers: 0, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800' },
    { id: 3, title: 'Agricultural Land 5.5 Acres', type: 'LAND', status: 'Verified', relief_amount_requested_kes: 1500000, market_valuation_kes: 2000000, offers: 1, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800' },
    { id: 4, title: 'VW Polo 2015', type: 'VEHICLE', status: 'Action Required', relief_amount_requested_kes: 400000, market_valuation_kes: 550000, offers: 0, image: 'https://images.unsplash.com/photo-1596707328606-d71e98d89e52?w=800' },
];

const simulatedOffers = [
    { id: 101, assetId: 1, financier: 'Financier A', amount: 900000, rate: '12%', status: 'Pending', date: '2023-10-01' },
    { id: 102, assetId: 3, financier: 'Financier B', amount: 1450000, rate: '10%', status: 'Countered', date: '2023-09-28' },
    { id: 103, assetId: 1, financier: 'Financier C', amount: 950000, rate: '11%', status: 'Pending', date: '2023-10-03' },
    { id: 104, assetId: 2, financier: 'Financier D', amount: 4800000, rate: '13%', status: 'Rejected', date: '2023-10-05' },
];

const simulatedLoan = {
    principalBalance: 3200000,
    financier: 'Financier X',
    nextPaymentDue: '2023-11-15',
    interestRate: '10.5%',
    paymentHistory: [
        { date: '2023-09-15', amount: 150000, principal: 130000, interest: 20000 },
        { date: '2023-08-15', amount: 150000, principal: 125000, interest: 25000 },
    ]
};

const assetTypes = [
    { value: 'VEHICLE', label: 'Vehicle', icon: Car, color: 'from-blue-400/30 to-blue-500/30' },
    { value: 'PROPERTY', label: 'Property', icon: Home, color: 'from-green-400/30 to-green-500/30' },
    { value: 'LAND', label: 'Land', icon: Maximize, color: 'from-yellow-400/30 to-yellow-500/30' }
];

// =========================================================================
// 3. PAGE LOGIC AND COMPONENTS (Borrower-Specific Views)
// =========================================================================

// Placeholder for OffersChatPage (for navigation)
const OffersChatPage = ({ setView }) => (
    <div className="h-[70vh] flex items-center justify-center">
        <GlassCard className="p-10 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Offers Negotiation View</h2>
            <p className="text-gray-600 mb-6">
                **API: GET /api/assets/my_offers/{'{offer_id}'}/ | chat_url**
                <br />
                This is the private chat and negotiation interface for a specific offer.
            </p>
            <button 
                onClick={() => setView('offers-review')}
                className="mt-4 px-6 py-3 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300"
            >
                Back to Offers List
            </button>
        </GlassCard>
    </div>
);


// Borrower Dashboard Component (The new 5-page structure)

// --- 1. Borrower Landing Dashboard 🏠 ---
const BorrowerLandingDashboard = ({ myAssets, myOffers, setCurrentPage }) => {
    const summary = useMemo(() => ({
        activeListings: myAssets.filter(a => a.status === 'Listed' || a.status === 'Verified').length,
        pendingVerification: myAssets.filter(a => a.status === 'Under Review' || a.status === 'Action Required').length,
        totalRequested: myAssets.reduce((sum, a) => sum + a.relief_amount_requested_kes, 0),
        newOffers: myOffers.filter(o => o.status === 'Pending').length, // Simple filter for new/pending
        nextPayment: simulatedLoan.nextPaymentDue,
        outstandingBalance: simulatedLoan.principalBalance,
    }), [myAssets, myOffers]);

    const MetricCard = ({ title, value, Icon, color, action }) => (
        <GlassCard 
            className="p-6 cursor-pointer hover:shadow-2xl hover:scale-[1.03] transition-all"
            onClick={action}
        >
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-opacity-30 ${color.bg}`}>
                    <Icon className={`w-6 h-6 ${color.text}`} />
                </div>
                <span className="text-xs text-gray-600">Quick Link</span>
            </div>
            <div className="mt-4">
                <div className="text-3xl font-bold text-gray-800">{value}</div>
                <div className="text-sm text-gray-600 mt-1">{title}</div>
            </div>
        </GlassCard>
    );

    return (
        <div className="space-y-10">
            <div className="p-8 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back, Betty!</h2>
                <div className="flex items-center gap-3 text-lg text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Account Status: <span className="font-semibold text-green-700">Verified</span></span>
                </div>
            </div>

            <section>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Asset & Offer Activity</h3>
                <div className="grid md:grid-cols-4 gap-6">
                    <MetricCard
                        title="Active Listings"
                        value={summary.activeListings}
                        Icon={Store}
                        color={{ bg: 'bg-green-100', text: 'text-green-600' }}
                        action={() => setCurrentPage('asset-management')}
                    />
                    <MetricCard
                        title="Pending Verification"
                        value={summary.pendingVerification}
                        Icon={AlertTriangle}
                        color={{ bg: 'bg-yellow-100', text: 'text-yellow-600' }}
                        action={() => setCurrentPage('asset-management')}
                    />
                    <MetricCard
                        title="New Offers Received"
                        value={summary.newOffers}
                        Icon={DollarSign}
                        color={{ bg: 'bg-blue-100', text: 'text-blue-600' }}
                        action={() => setCurrentPage('offers-review')}
                    />
                    <MetricCard
                        title="Total Relief Requested"
                        value={`KSh ${summary.totalRequested.toLocaleString()}`}
                        Icon={CreditCard}
                        color={{ bg: 'bg-purple-100', text: 'text-purple-600' }}
                        action={() => setCurrentPage('asset-management')}
                    />
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Loan Servicing Portal</h3>
                <GlassCard className="p-6">
                    <div className="grid md:grid-cols-3 gap-6 items-center">
                        <div>
                            <p className="text-sm text-gray-600">Outstanding Loan Balance</p>
                            <p className="text-3xl font-extrabold text-red-600">KSh {summary.outstandingBalance.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Next Payment Due</p>
                            <p className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="w-5 h-5" /> {summary.nextPayment}
                            </p>
                        </div>
                        <button
                            onClick={() => setCurrentPage('loan-servicing')}
                            className="w-full px-6 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-5 h-5" /> Manage Repayments
                        </button>
                    </div>
                </GlassCard>
            </section>
        </div>
    );
};


// --- 2. Asset Registration & Management Dashboard 📜 ---

const AssetTypeCard = ({ type, setAssetType, setStep }) => {
    const Icon = type.icon;
    return (
      <button
        onClick={() => {
          setAssetType(type.value);
          setStep(2);
        }}
        className="group relative overflow-hidden rounded-3xl p-8 bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="relative flex flex-col items-center gap-4">
          <div className="p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-16 h-16 text-gray-700" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{type.label}</h3>
          <p className="text-gray-600 text-center">List your {type.label.toLowerCase()} for relief financing</p>
        </div>
      </button>
    );
};

const AssetFormSection = ({ step, setStep, formData, setFormData, uploadedImages, setUploadedImages, assetType, handleSubmit, setShowSuccess }) => {
    
    // Handlers for form state
    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };
    const handleDetailsChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            details: { ...prev.details, [field]: value }
        }));
    };
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setUploadedImages(prev => [...prev, ...imageUrls]);
    };
    const removeImage = (index) => {
        setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    };

    const getAssetSpecificFields = () => {
        const valueGetter = (field) => formData.details[field] || '';
        const onChangeHandler = (field, e) => handleDetailsChange(field, e.target.value);

        switch (assetType) {
          case 'VEHICLE':
            return (
              <>
                <InputField icon={Car} label="Make" field="make" placeholder="e.g., Toyota" value={valueGetter('make')} onChange={(e) => onChangeHandler('make', e)} />
                <InputField icon={Car} label="Model" field="model" placeholder="e.g., Corolla" value={valueGetter('model')} onChange={(e) => onChangeHandler('model', e)} />
                <InputField icon={Calendar} label="Year" field="year" type="number" placeholder="e.g., 2018" value={valueGetter('year')} onChange={(e) => onChangeHandler('year', e)} />
                <InputField icon={FileText} label="Registration Number" field="registration_number" placeholder="e.g., KAA 123A" value={valueGetter('registration_number')} onChange={(e) => onChangeHandler('registration_number', e)} />
                <InputField icon={FileText} label="Mileage (km)" field="mileage" type="number" placeholder="e.g., 50000" value={valueGetter('mileage')} onChange={(e) => onChangeHandler('mileage', e)} />
              </>
            );
          case 'PROPERTY':
            return (
              <>
                <InputField icon={MapPin} label="Address" field="address" placeholder="Enter property address" value={valueGetter('address')} onChange={(e) => onChangeHandler('address', e)} />
                <InputField icon={Home} label="Property Type" field="property_type" placeholder="e.g., Apartment, House" value={valueGetter('property_type')} onChange={(e) => onChangeHandler('property_type', e)} />
                <InputField icon={Maximize} label="Size (sq ft)" field="size" type="number" placeholder="e.g., 1500" value={valueGetter('size')} onChange={(e) => onChangeHandler('size', e)} />
                <InputField icon={FileText} label="Number of Bedrooms" field="bedrooms" type="number" placeholder="e.g., 3" value={valueGetter('bedrooms')} onChange={(e) => onChangeHandler('bedrooms', e)} />
                <InputField icon={FileText} label="Number of Bathrooms" field="bathrooms" type="number" placeholder="e.g., 2" value={valueGetter('bathrooms')} onChange={(e) => onChangeHandler('bathrooms', e)} />
              </>
            );
          case 'LAND':
            return (
              <>
                <InputField icon={MapPin} label="Location" field="location" placeholder="Enter land location" value={valueGetter('location')} onChange={(e) => onChangeHandler('location', e)} />
                <InputField icon={Maximize} label="Size (acres)" field="size" type="number" placeholder="e.g., 5" value={valueGetter('size')} onChange={(e) => onChangeHandler('size', e)} />
                <InputField icon={FileText} label="Title Number" field="title_number" placeholder="e.g., LR 12345" value={valueGetter('title_number')} onChange={(e) => onChangeHandler('title_number', e)} />
                <InputField icon={FileText} label="Land Use" field="land_use" placeholder="e.g., Residential, Agricultural" value={valueGetter('land_use')} onChange={(e) => onChangeHandler('land_use', e)} />
              </>
            );
          default:
            return null;
        }
    };
    
    // Consolidated Form Logic
    return (
        <>
            {/* Progress Steps */}
            <div className="mb-12">
                <div className="flex items-center justify-center gap-4">
                {[1, 2, 3].map((stepNum) => (
                    <React.Fragment key={stepNum}>
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md border transition-all duration-300 ${
                        step >= stepNum 
                        ? 'bg-white/40 border-white/60 shadow-lg' 
                        : 'bg-white/20 border-white/30'
                    }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
                        step >= stepNum 
                            ? 'bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] text-gray-800' 
                            : 'bg-white/30 text-gray-600'
                        }`}>
                        {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                        </div>
                        <span className={`font-semibold ${step >= stepNum ? 'text-gray-800' : 'text-gray-600'}`}>
                        {stepNum === 1 ? 'Asset Type' : stepNum === 2 ? 'Details' : 'Images & Submit'}
                        </span>
                    </div>
                    {stepNum < 3 && <ArrowRight className="w-6 h-6 text-gray-600" />}
                    </React.Fragment>
                ))}
                </div>
            </div>

            {/* Step 1: Select Asset Type */}
            {step === 1 && (
                <div className="space-y-8">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">List Your Distressed Asset</h2>
                    <p className="text-xl text-gray-700">Choose the type of asset you want to list for relief financing</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {assetTypes.map(type => (
                    <AssetTypeCard key={type.value} type={type} setAssetType={(val) => setFormData(prev => ({...prev, collateral_type: val}))} setStep={setStep} />
                    ))}
                </div>
                </div>
            )}

            {/* Step 2: Asset Details */}
            {step === 2 && (
                <div className="space-y-8">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Asset Details</h2>
                    <p className="text-xl text-gray-700">Provide information about your {assetTypes.find(t => t.value === formData.collateral_type)?.label.toLowerCase()}</p>
                </div>

                <GlassCard className="p-8 shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-6">
                    {/* Common Fields */}
                    <InputField icon={FileText} label="Primary Identifier" field="primary_identifier" placeholder="Unique identifier (e.g., Title/Reg. No.)" value={formData.primary_identifier} onChange={(e) => handleInputChange('primary_identifier', e.target.value)} />
                    <InputField icon={DollarSign} label="Relief Amount Requested (KES)" field="relief_amount_requested_kes" type="number" placeholder="e.g., 500000" value={formData.relief_amount_requested_kes} onChange={(e) => handleInputChange('relief_amount_requested_kes', e.target.value)} />
                    <InputField icon={DollarSign} label="Market Valuation (KES)" field="market_valuation_kes" type="number" placeholder="e.g., 1000000" value={formData.market_valuation_kes} onChange={(e) => handleInputChange('market_valuation_kes', e.target.value)} />
                    <InputField icon={Calendar} label="Valuation Date" field="valuation_date" type="date" placeholder="" value={formData.valuation_date} onChange={(e) => handleInputChange('valuation_date', e.target.value)} />
                    {getAssetSpecificFields()}
                    </div>

                    <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Back
                    </button>
                    <button onClick={() => setStep(3)} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Continue
                    </button>
                    </div>
                </GlassCard>
                </div>
            )}

            {/* Step 3: Images & Submit */}
            {step === 3 && (
                <div className="space-y-8">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Upload Images & Documents</h2>
                    <p className="text-xl text-gray-700">Add photos and required documents to complete the listing process.</p>
                </div>

                <GlassCard className="p-8 shadow-2xl">
                    <div className="mb-8">
                    <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-white/40 rounded-2xl p-12 bg-white/10 hover:bg-white/20 transition-all duration-300 text-center">
                        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-lg font-semibold text-gray-800 mb-2">Click to upload images (Title, Logbook, Photos)</p>
                        <p className="text-sm text-gray-600">PNG, JPG, PDF up to 10MB each</p>
                        </div>
                        <input type="file" multiple accept="image/*, application/pdf" onChange={handleImageUpload} className="hidden" />
                    </label>
                    </div>

                    {uploadedImages.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Files ({uploadedImages.length})</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedImages.map((img, index) => (
                            <div key={index} className="relative group">
                            {img.includes('pdf') 
                                ? <FileText className="w-full h-32 object-cover rounded-xl border border-white/40 p-8 text-gray-600 bg-white/40" />
                                : <img src={img} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded-xl border border-white/40" />
                            }
                            <button onClick={() => removeImage(index)} className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            </div>
                        ))}
                        </div>
                    </div>
                    )}

                    <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="flex-1 px-6 py-3 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Back
                    </button>
                    <button onClick={() => handleSubmit(setShowSuccess)} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Submit Asset
                    </button>
                    </div>
                </GlassCard>
                </div>
            )}
        </>
    );
};

const AssetManagementView = ({ myAssets, setCurrentPage, setFormData, setAssetType, setStep }) => {
    
    // Combined view for Asset Submission Form and Asset Listings (My Asset Listings)
    const MyAssetCard = ({ asset }) => {
        const assetTypeDetails = { VEHICLE: { icon: Car }, PROPERTY: { icon: Home }, LAND: { icon: Maximize } };
        const { icon: Icon } = assetTypeDetails[asset.type];
    
        return (
          <GlassCard className="group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
            <div className="relative">
              <div className="relative h-56 overflow-hidden rounded-t-3xl">
                <img 
                  src={asset.image} 
                  alt={asset.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
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
                    {asset.title}
                  </h3>
                </div>
    
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Relief Amount</span>
                    <span className="font-semibold text-gray-800">KSh {asset.relief_amount_requested_kes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Market Value</span>
                    <span className="font-semibold text-gray-800">KSh {asset.market_valuation_kes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Offers Received</span>
                    <span className="font-bold text-blue-700">{asset.offers}</span>
                  </div>
                </div>
    
                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30 text-sm font-medium text-gray-700 hover:bg-white/60 transition-all">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button 
                    onClick={() => setCurrentPage('offers-review')}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#c8d5c0]/80 to-[#b8cdb0]/80 hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
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

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center">
                <h2 className="text-4xl font-bold text-gray-800">My Asset Listings</h2>
                <button
                    onClick={() => {
                        setStep(1); 
                        setCurrentPage('asset-registration');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                    <Upload className="w-5 h-5" />
                    List New Asset
                </button>
            </div>
            
            <p className="text-lg text-gray-700">
                **API: GET /api/assets/my_assets/** - Track the status and verification progress of your collateral.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myAssets.map(asset => (
                    <MyAssetCard key={asset.id} asset={asset} />
                ))}
            </div>
        </div>
    );
};


// --- 3. Offer Review & Negotiation Dashboard 💰 ---
const OffersReviewDashboard = ({ myOffers, setCurrentPage }) => {

    const OfferCard = ({ offer }) => {
        const statusConfig = {
            'Pending': { color: 'text-yellow-600', button: 'bg-yellow-500/80 hover:bg-yellow-600', text: 'Negotiate' },
            'Countered': { color: 'text-blue-600', button: 'bg-blue-500/80 hover:bg-blue-600', text: 'Review Counter' },
            'Accepted': { color: 'text-green-600', button: 'bg-green-500/80 hover:bg-green-600', text: 'View Loan' },
            'Rejected': { color: 'text-red-600', button: 'bg-gray-400', text: 'Rejected' },
        };
        const config = statusConfig[offer.status];
        const asset = initialAssets.find(a => a.id === offer.assetId);

        return (
            <GlassCard className="p-6">
                <div className="flex justify-between items-start mb-4 border-b border-white/40 pb-3">
                    <h3 className="text-xl font-bold text-gray-800">Offer on: {asset.title}</h3>
                    <span className={`font-semibold ${config.color}`}>{offer.status}</span>
                </div>
                
                <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Financier</span>
                        <span className="font-semibold text-gray-800">{offer.financier}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-600">Offer Amount</span>
                        <span className="text-green-700">KSh {offer.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Proposed Rate</span>
                        <span className="font-semibold text-gray-800">{offer.rate}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/40 flex justify-between gap-3">
                    <button 
                        onClick={() => setCurrentPage('offers-chat')} // Navigates to the chat view
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white font-semibold rounded-xl transition-all shadow-md"
                        style={{ backgroundColor: config.button }}
                        disabled={offer.status === 'Rejected'}
                    >
                        <MessageSquare className="w-4 h-4" />
                        {config.text}
                    </button>
                    {offer.status === 'Pending' && (
                        <button 
                            className="flex-1 px-4 py-2 bg-green-600/80 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-md"
                            onClick={() => console.log('Accept Offer:', offer.id)}
                        >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    **API: POST /api/offers/{'{offer_id}'}/accept/ or PATCH /api/offers/{'{offer_id}'}/counter/**
                </p>
            </GlassCard>
        );
    };

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Offer Review & Negotiation</h2>
            <p className="text-lg text-gray-700">
                A consolidated list of all financing proposals received across your assets.
                <span className="block mt-2 font-semibold">API: GET /api/assets/my_offers/</span>
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myOffers.map(offer => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
        </div>
    );
};


// --- 4. Loan Servicing & Repayment Portal 💳 ---
const LoanServicingPortal = () => {
    
    const PaymentHistoryTable = ({ history }) => (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white/40 backdrop-blur-md rounded-xl border border-white/40">
                <thead>
                    <tr className="text-left text-gray-800 border-b border-white/40">
                        <th className="p-4">Date</th>
                        <th className="p-4">Amount Paid</th>
                        <th className="p-4">Principal</th>
                        <th className="p-4">Interest</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item, index) => (
                        <tr key={index} className="border-b border-white/20 last:border-b-0 hover:bg-white/50">
                            <td className="p-4 text-gray-700">{item.date}</td>
                            <td className="p-4 font-semibold text-green-700">KSh {item.amount.toLocaleString()}</td>
                            <td className="p-4 text-gray-600">KSh {item.principal.toLocaleString()}</td>
                            <td className="p-4 text-gray-600">KSh {item.interest.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Loan Servicing Portal</h2>
            <p className="text-lg text-gray-700">
                Manage your active loan, track repayment history, and initiate payments.
            </p>

            <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" /> Active Loan Summary
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/40 rounded-xl">
                        <p className="text-sm text-gray-600">Principal Balance</p>
                        <p className="text-3xl font-extrabold text-red-600">KSh {simulatedLoan.principalBalance.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-white/40 rounded-xl">
                        <p className="text-sm text-gray-600">Next Payment Due</p>
                        <p className="text-2xl font-bold text-gray-800">{simulatedLoan.nextPaymentDue}</p>
                    </div>
                    <div className="p-4 bg-white/40 rounded-xl">
                        <p className="text-sm text-gray-600">Interest Rate</p>
                        <p className="text-2xl font-bold text-gray-800">{simulatedLoan.interestRate}</p>
                    </div>
                    <div className="p-4 bg-white/40 rounded-xl">
                        <p className="text-sm text-gray-600">Financier</p>
                        <p className="text-2xl font-bold text-gray-800">{simulatedLoan.financier}</p>
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Make a Payment</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <InputField 
                        icon={DollarSign} 
                        label="Payment Amount (KES)" 
                        field="payment_amount" 
                        type="number" 
                        placeholder="e.g., 150000" 
                        value={''} 
                        onChange={() => {}}
                    />
                    <button 
                        className="self-end px-6 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <CreditCard className="w-5 h-5" /> Initiate Payment (M-Pesa/Bank)
                    </button>
                </div>
            </GlassCard>

            <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Repayment History</h3>
                <PaymentHistoryTable history={simulatedLoan.paymentHistory} />
            </GlassCard>
        </div>
    );
};


// --- 5. Profile & Settings ⚙️ ---
const ProfileAndSettings = () => {
    
    // Placeholder data for profile fields
    const [profile, setProfile] = useState({
        name: 'Betty Achieng',
        email: 'betty.a@example.com',
        phone: '0712 345 678',
        income: 'Self-Employed',
    });

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Profile & Settings</h2>
            <p className="text-lg text-gray-700">
                Manage your personal data, KYC status, and application details.
            </p>

            <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-[#6B9071]" /> My Profile & Contact Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <InputField icon={User} label="Full Name" field="name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                    <InputField icon={MessageSquare} label="Email Address" field="email" type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                    <InputField icon={FileText} label="Phone Number" field="phone" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                    <InputField icon={DollarSign} label="Income Profile" field="income" value={profile.income} onChange={(e) => setProfile({...profile, income: e.target.value})} />
                </div>
                <button 
                    className="mt-8 px-6 py-3 bg-gradient-to-r from-[#b8cdb0] to-[#a8bd9f] hover:from-[#a8bd9f] hover:to-[#99af8d] text-gray-800 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => console.log('Update Profile')}
                >
                    Save Changes
                </button>
                <p className="text-xs text-gray-500 mt-2">
                    **API: GET /api/accounts/me/ and PATCH /api/accounts/me/**
                </p>
            </GlassCard>

            <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-[#6B9071]" /> KYC/KYB Documents Status
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/40 rounded-xl">
                        <span className="font-semibold text-gray-700">National ID Copy</span>
                        {getStatusBadge('Verified')}
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/40 rounded-xl">
                        <span className="font-semibold text-gray-700">Proof of Address</span>
                        {getStatusBadge('Under Review')}
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/40 rounded-xl">
                        <span className="font-semibold text-gray-700">Income Verification</span>
                        {getStatusBadge('Action Required')}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};


// =========================================================================
// 4. MAIN BORROWER DASHBOARD COMPONENT (The Single File Export)
// =========================================================================

export default function BorrowerDashboard() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'asset-management', 'asset-registration', 'offers-review', 'offers-chat', 'loan-servicing', 'profile'
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    collateral_type: '',
    primary_identifier: '',
    relief_amount_requested_kes: '',
    market_valuation_kes: '',
    valuation_date: '',
    details: {},
    images: []
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // Renamed views for clarity and mapping
  const menuMap = {
      'landing': 'Dashboard',
      'asset-management': 'My Assets',
      'asset-registration': 'List New Asset',
      'offers-review': 'Offers',
      'loan-servicing': 'Loan Repayment',
      'profile': 'Profile & Settings',
  };

  // Function to handle asset submission success
  const handleSubmit = (setShowSuccess) => {
    console.log('Submitting asset:', formData);
    // Simulate API call success
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentPage('asset-management');
      setStep(1);
      setFormData({
        collateral_type: '',
        primary_identifier: '',
        relief_amount_requested_kes: '',
        market_valuation_kes: '',
        valuation_date: '',
        details: {},
        images: []
      });
      setUploadedImages([]);
    }, 3000);
  };
  
  // RENDER LOGIC
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <BorrowerLandingDashboard myAssets={initialAssets} myOffers={simulatedOffers} setCurrentPage={setCurrentPage} />;
      
      case 'asset-management':
        return <AssetManagementView myAssets={initialAssets} setCurrentPage={setCurrentPage} setFormData={setFormData} setAssetType={(val) => setFormData(prev => ({...prev, collateral_type: val}))} setStep={setStep} />;
      
      case 'asset-registration':
        return <AssetFormSection 
                    step={step} setStep={setStep} 
                    formData={formData} setFormData={setFormData} 
                    uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} 
                    assetType={formData.collateral_type} handleSubmit={handleSubmit} setShowSuccess={setShowSuccess} 
                />;
      
      case 'offers-review':
        return <OffersReviewDashboard myOffers={simulatedOffers} setCurrentPage={setCurrentPage} />;
        
      case 'offers-chat':
        return <OffersChatPage setView={setCurrentPage} />; // Placeholder chat view
        
      case 'loan-servicing':
        return <LoanServicingPortal />;
        
      case 'profile':
        return <ProfileAndSettings />;
        
      default:
        return <BorrowerLandingDashboard myAssets={initialAssets} myOffers={simulatedOffers} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4e4d0] via-[#c8d5c0] to-[#b8cdb0]">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/30 border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <h1 className="text-3xl font-bold text-gray-800">NPLin</h1>
              <nav className="hidden md:flex gap-8">
              {Object.entries(menuMap).map(([key, label]) => (
                <button 
                  key={key}
                  onClick={() => setCurrentPage(key)} 
                  className={`font-medium transition-colors ${currentPage === key ? 'text-gray-900 font-bold border-b-2 border-gray-800' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  {label}
                </button>
              ))}
              </nav>
            </div>
            <button 
              onClick={() => setCurrentPage('profile')}
              className="px-6 py-2.5 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl">
              <User className="w-5 h-5 mr-1 inline-block" /> Profile
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {renderPage()}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <GlassCard className="p-12 max-w-md mx-4 shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Asset Listed Successfully!</h3>
              <p className="text-gray-600 mb-8">Your asset has been submitted for review. You'll receive notifications when investors show interest.</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-8 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}