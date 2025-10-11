import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Car, Home, Maximize, Upload, DollarSign, Calendar, MapPin, FileText, CheckCircle, ArrowRight, Trash2, Eye, Edit, MessageSquare, 
    LayoutDashboard, User, CreditCard, Clock, Check, AlertTriangle, Store, X, ArrowLeftRight, LogOut
} from 'lucide-react';


// =========================================================================
// 1. REUSABLE UI COMPONENTS (Placeholder for separation)
// =========================================================================
const API_BASE_URL = 'http://127.0.0.1:8000';

// Card component with glassmorphism style
const GlassCard = ({ children, className = "", ...props }) => (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white/20 border border-gray-200 shadow-lg ${className}`}
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
const InputField = ({ icon: Icon, label, field, type = "text", placeholder, value, onChange, disabled = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-md rounded-xl border border-gray-300 text-gray-800 placeholder-gray-500 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
    </div>
);

// Status Badge Component
const getStatusBadge = (status) => {
    const statusConfig = {
      'Listed': { color: 'bg-green-100 border-green-200 text-green-800' },
      'Under Review': { color: 'bg-yellow-100 border-yellow-200 text-yellow-800' },
      'Action Required': { color: 'bg-red-100 border-red-200 text-red-800' },
      'Verified': { color: 'bg-blue-100 border-blue-200 text-blue-800' },
      'Pending Approval': { color: 'bg-yellow-100 border-yellow-200 text-yellow-800' },
      'Active': { color: 'bg-green-100 border-green-200 text-green-800' },
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 border-gray-200 text-gray-800' };
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border ${config.color}`}>
        <span className="text-xs font-semibold">{status}</span>
      </div>
    );
};


// =========================================================================
// 2. DATA & STATE (Consolidated data for demo)
// =========================================================================



const assetTypes = [
    { value: 'VEHICLE', label: 'Vehicle', icon: Car, color: 'from-blue-50 to-blue-100' },
    { value: 'PROPERTY', label: 'Property', icon: Home, color: 'from-green-50 to-green-100' },
    { value: 'LAND', label: 'Land', icon: Maximize, color: 'from-yellow-50 to-yellow-100' }
];

// =========================================================================
// 3. PAGE LOGIC AND COMPONENTS (Borrower-Specific Views)
// =========================================================================



// Borrower Dashboard Component (The new 5-page structure)

// --- 1. Borrower Landing Dashboard 🏠 ---
const BorrowerLandingDashboard = ({ myAssets, myOffers, setCurrentPage }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const summary = useMemo(() => ({
        activeListings: myAssets.filter(a => a.status === 'Listed' || a.status === 'Verified').length,
        pendingVerification: myAssets.filter(a => a.status === 'Under Review' || a.status === 'Action Required').length,
        totalRequested: myAssets.reduce((sum, a) => sum + a.relief_amount_requested_kes, 0),
        newOffers: myOffers.filter(o => o.status === 'PENDING').length,
        nextPayment: 'N/A', // To be replaced with loan data
        outstandingBalance: 0, // To be replaced with loan data

    }), [myAssets, myOffers]);

    const MetricCard = ({ title, value, Icon, color, action }) => (
        <GlassCard 
            className="p-6 cursor-pointer hover:shadow-2xl hover:scale-[1.03] transition-all bg-white/50"
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
            <div className="p-8 bg-gray-50/50 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back, {user ? user.first_name : 'User'}!</h2>
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
                <GlassCard className="p-6 bg-white/50">
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
                            className="w-full px-6 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] hover:from-[#40916c] hover:to-[#d8f3dc] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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
        className="group relative overflow-hidden rounded-3xl p-8 bg-white/50 backdrop-blur-xl border border-gray-200 hover:bg-white/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="relative flex flex-col items-center gap-4 text-center">
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
        const newFiles = Array.from(e.target.files).map(file => ({
            file: file,
            preview: URL.createObjectURL(file)
        }));
        setUploadedImages(prev => [...prev, ...newFiles]);

    };
    const removeImage = (index) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
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
                <InputField icon={FileText} label="Chassis Number" field="chassis_number" placeholder="e.g., JM6KE..." value={valueGetter('chassis_number')} onChange={(e) => onChangeHandler('chassis_number', e)} />

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
                        ? 'bg-white/80 border-gray-300 shadow-lg'
                        : 'bg-white/50 border-gray-200'
                    }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
                        step >= stepNum
                            ? 'bg-gradient-to-r from-[#d8f3dc] to-[#40916c] text-white'
                            : 'bg-gray-200 text-gray-600'
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
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">List Your Asset</h2>
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
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Asset Details</h2>
                    <p className="text-xl text-gray-700">Provide information about your {assetTypes.find(t => t.value === formData.collateral_type)?.label.toLowerCase()}</p>
                </div>

                <GlassCard className="p-8 shadow-2xl bg-white/50">
                    <div className="grid md:grid-cols-2 gap-6">
                    {/* Common Fields */}
                    <InputField icon={FileText} label="Primary Identifier" field="primary_identifier" placeholder="Unique identifier (e.g., Title/Reg. No.)" value={formData.primary_identifier} onChange={(e) => handleInputChange('primary_identifier', e.target.value)} />
                    <InputField icon={DollarSign} label="Relief Amount Requested (KES)" field="relief_amount_requested_kes" type="number" placeholder="e.g., 500000" value={formData.relief_amount_requested_kes} onChange={(e) => handleInputChange('relief_amount_requested_kes', e.target.value)} />
                    <InputField icon={DollarSign} label="Market Valuation (KES)" field="market_valuation_kes" type="number" placeholder="e.g., 1000000" value={formData.market_valuation_kes} onChange={(e) => handleInputChange('market_valuation_kes', e.target.value)} />
                    <InputField icon={Calendar} label="Valuation Date" field="valuation_date" type="date" placeholder="" value={formData.valuation_date} onChange={(e) => handleInputChange('valuation_date', e.target.value)} />
                    {getAssetSpecificFields()}
                    </div>

                    <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl border border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Back
                    </button>
                    <button onClick={() => setStep(3)} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] hover:from-[#40916c] hover:to-[#d8f3dc] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
                        Continue
                    </button>
                    </div>
                </GlassCard>
                </div>
            )}

            {/* Step 3: Images & Submit */}
            {step === 3 && (
                <div className="space-y-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Upload Images & Documents</h2>
                    <p className="text-xl text-gray-700">Add photos and required documents to complete the listing process.</p>
                </div>

                <GlassCard className="p-8 shadow-2xl bg-white/50">
                    <div className="mb-8">
                    <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 bg-gray-50/50 hover:bg-gray-100 transition-all duration-300 text-center">
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
                        {uploadedImages.map((imageObj, index) => (
                            <div key={index} className="relative group">
                            {imageObj.file.type.includes('pdf')
                                ? <FileText className="w-full h-32 object-cover rounded-xl border border-gray-300 p-8 text-gray-600 bg-white/80" />
                                : <img src={imageObj.preview} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded-xl border border-white/40" />
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
                    <button onClick={() => setStep(2)} className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl border border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Back
                    </button>
                    <button onClick={handleSubmit} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] hover:from-[#40916c] hover:to-[#d8f3dc] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
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
          <GlassCard className="group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl bg-white/50">
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
    
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button 
                    onClick={() => setCurrentPage('offers-review')}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] hover:from-[#40916c] hover:to-[#d8f3dc] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
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
                    className="px-6 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] hover:from-[#40916c] hover:to-[#d8f3dc] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
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
const OffersReviewDashboard = ({ myOffers, loading, error, onAccept, onDecline, onCounter }) => {

    const OfferCard = ({ offer }) => {
        const statusConfig = {
            'PENDING': { color: 'text-yellow-600' },
            'COUNTERED': { color: 'text-blue-600' },
            'ACCEPTED': { color: 'text-green-600' },
            'DECLINED': { color: 'text-red-600' },

        };
        const config = statusConfig[offer.status];

        return (
            <GlassCard className="p-6 bg-white/50">
                <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-3">
                <h3 className="text-xl font-bold text-gray-800">Offer on: {offer.asset_title || 'N/A'}</h3>
                <span className={`font-semibold ${config.color}`}>{offer.status}</span>
                </div>
                
                <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Financier</span>
                        <span className="font-semibold text-gray-800">{offer.financier_name}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-600">Offer Amount</span>
                        <span className="text-green-700">KSh {Number(offer.offer_amount_kes).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Proposed Rate</span>
                        <span className="font-semibold text-gray-800">{offer.proposed_interest_rate}%</span>
                    </div>
                </div>

                {offer.status === 'PENDING' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">

                        <button 
                            onClick={() => onAccept(offer.id)}
                            className="flex-1 px-4 py-2 bg-green-600/80 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"

                        >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                        </button>
                        <button 
                            onClick={() => onCounter(offer)}
                            className="flex-1 px-4 py-2 bg-blue-600/80 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <ArrowLeftRight className="w-4 h-4 mr-1" />
                            Counter
                        </button>
                        <button 
                            onClick={() => onDecline(offer.id)}
                            className="flex-1 px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                        </button>
                    </div>
                )}

            </GlassCard>
        );
    };

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Offer Review & Negotiation</h2>
            {loading && <p className="text-center text-lg text-gray-700">Loading your offers...</p>}
            {error && <p className="text-center text-lg text-red-600 bg-red-100 p-4 rounded-xl">Error: {error}</p>}
            {!loading && !error && (
                <>
                    <p className="text-lg text-gray-700">
                        A consolidated list of all financing proposals received across your assets.
                        <span className="block mt-2 font-semibold">API: GET /api/assets/my_offers/</span>
                    </p>
                    {myOffers.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myOffers.map(offer => (
                                <OfferCard key={offer.id} offer={offer} />
                            ))}
                        </div>
                    ) : (
                        <GlassCard className="p-10 text-center bg-white/50">
                            <h3 className="text-2xl font-bold text-gray-800">No Offers Yet</h3>
                            <p className="text-gray-600 mt-2">You have not received any offers on your assets.</p>
                        </GlassCard>
                    )}
                </>
            )}

        </div>
    );
};

// Counter Offer Modal
const CounterOfferModal = ({ offer, onClose, onSubmit }) => {
    const [counterData, setCounterData] = useState({
        offer_amount_kes: '',
        proposed_interest_rate: '',
        borrower_comment: ''
    });

    const handleChange = (e) => {
        setCounterData({ ...counterData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(offer.id, counterData);
    };

    if (!offer) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <GlassCard className="w-full max-w-md p-8 bg-white/90">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Make Counter Offer</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField icon={DollarSign} label="Counter Amount (KES)" name="offer_amount_kes" type="number" value={counterData.offer_amount_kes} onChange={handleChange} />
                    <InputField icon={TrendingUp} label="Proposed Interest Rate (%)" name="proposed_interest_rate" type="number" step="0.1" value={counterData.proposed_interest_rate} onChange={handleChange} />
                    <InputField icon={MessageSquare} label="Your Comment" name="borrower_comment" type="text" value={counterData.borrower_comment} onChange={handleChange} />
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl border border-gray-300">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] hover:from-[#40916c] hover:to-[#d8f3dc] text-white font-bold rounded-xl">Submit Counter</button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

// --- 4. Loan Servicing & Repayment Portal 💳 ---
const LoanServicingPortal = () => {
    
    const PaymentHistoryTable = ({ history }) => (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white/80 backdrop-blur-md rounded-xl border border-gray-200">
                <thead>
                    <tr className="text-left text-gray-800 border-b border-gray-200">
                        <th className="p-4">Date</th>
                        <th className="p-4">Amount Paid</th>
                        <th className="p-4">Principal</th>
                        <th className="p-4">Interest</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200/50 last:border-b-0 hover:bg-gray-100/50">
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

            <GlassCard className="p-8 bg-white/50">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" /> Active Loan Summary
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/80 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600">Principal Balance</p>
                        <p className="text-3xl font-extrabold text-red-600">KSh 0</p>
                    </div>
                    <div className="p-4 bg-white/80 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600">Next Payment Due</p>
                        <p className="text-2xl font-bold text-gray-800">N/A</p>
                    </div>
                    {/* <div className="p-4 bg-white/40 rounded-xl">

                        <p className="text-sm text-gray-600">Interest Rate</p>
                        <p className="text-2xl font-bold text-gray-800">{simulatedLoan.interestRate}</p>
                    </div>
                    <div className="p-4 bg-white/40 rounded-xl">
                        <p className="text-sm text-gray-600">Financier</p>
                        <p className="text-2xl font-bold text-gray-800">{simulatedLoan.financier}</p>
                                 </div> */}
                </div>

            </GlassCard>

            <GlassCard className="p-8 bg-white/50">
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
                        className="self-end px-6 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] hover:from-[#40916c] hover:to-[#d8f3dc] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <CreditCard className="w-5 h-5" /> Initiate Payment (M-Pesa/Bank)
                    </button>
                </div>
            </GlassCard>

            <GlassCard className="p-8 bg-white/50">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Repayment History</h3>
                <PaymentHistoryTable history={[]} />
            </GlassCard>
        </div>
    );
};


// --- 5. Profile & Settings ⚙️ ---
const ProfileAndSettings = () => {
    
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [editedData, setEditedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) throw new Error('Authentication token not found.');

                const response = await fetch(`${API_BASE_URL}/api/accounts/me/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to fetch profile.');
                }

                const data = await response.json();
                
                const formattedData = {
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                    email: data.email || '',
                    phone: data.mobile_phone_number || '',
                    income: data.profile?.source_of_income || 'Not Set',
                };

                setProfileData(formattedData);
                setEditedData(formattedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (field, value) => {
        setEditedData({ ...editedData, [field]: value });
    };

    const handleSave = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Authentication token not found.');

            const [firstName, ...lastNameParts] = editedData.name.split(' ');
            const lastName = lastNameParts.join(' ');

            const payload = {
                first_name: firstName,
                last_name: lastName,
                email: editedData.email,
                mobile_phone_number: editedData.phone,
                profile: {
                    source_of_income: editedData.income,
                }
            };

            const response = await fetch(`${API_BASE_URL}/api/accounts/me/`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to update profile.');

            setProfileData(editedData);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };
    
    const handleCancel = () => {
        setEditedData(profileData);
        setIsEditing(false);
    };

    if (loading) return <div className="text-center p-8 text-gray-700">Loading Profile...</div>;
    if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;
    if (!profileData) return <div className="text-center p-8 text-gray-700">Could not load profile data.</div>;



    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Profile & Settings</h2>
            <p className="text-lg text-gray-700">
                Manage your personal data, KYC status, and application details.
            </p>

            <GlassCard className="p-8 bg-white/50">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-[#40916c]" /> My Profile & Contact Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                <InputField icon={User} label="Full Name" field="name" value={editedData.name} onChange={(e) => handleInputChange('name', e.target.value)} disabled={!isEditing} />
                    <InputField icon={MessageSquare} label="Email Address" field="email" type="email" value={editedData.email} onChange={(e) => handleInputChange('email', e.target.value)} disabled={!isEditing} />
                    <InputField icon={FileText} label="Phone Number" field="phone" value={editedData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} disabled={!isEditing} />
                    <InputField icon={DollarSign} label="Income Profile" field="income" value={editedData.income} onChange={(e) => handleInputChange('income', e.target.value)} disabled={!isEditing} />
                </div>
                
                {!isEditing ? (
                    <button 
                        className="mt-8 px-6 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] hover:from-[#40916c] hover:to-[#d8f3dc] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-4 mt-8">
                        <button 
                            className="px-6 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] hover:from-[#40916c] hover:to-[#d8f3dc] text-white font-bold rounded-xl shadow-lg hover:shadow-xl"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                        <button 
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl border border-gray-300 transition-all"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                    **API: GET /api/accounts/me/ and PATCH /api/accounts/me/**
                </p>
            </GlassCard>

            <GlassCard className="p-8 bg-white/50">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-[#40916c]" /> KYC/KYB Documents Status
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl border border-gray-200">
                        <span className="font-semibold text-gray-700">National ID Copy</span>
                        {getStatusBadge('Verified')}
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl border border-gray-200">
                        <span className="font-semibold text-gray-700">Proof of Address</span>
                        {getStatusBadge('Under Review')}
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl border border-gray-200">
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

export default function BorrowerDashboard({ setRole }) {
    const [currentPage, setCurrentPage] = useState('landing');
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
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
  const [showCounterModal, setShowCounterModal] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setRole(null);

    navigate('/login');
  };

  const menuMap = {
      'landing': 'Dashboard',
      'asset-management': 'My Assets',
      'asset-registration': 'List New Asset',
      'offers-review': 'Offers',
      'loan-servicing': 'Loan Repayment',
      'profile': 'Profile & Settings',
  };

  // Function to handle asset submission success
  useEffect(() => {
    if (currentPage === 'offers-review') {
        const fetchOffers = async () => {
            setLoading(true);
            setError(null);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) throw new Error('Authentication token not found.');

                const response = await fetch(`${API_BASE_URL}/api/assets/my_offers/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });

                if (!response.ok) throw new Error('Failed to fetch offers.');
                
                const data = await response.json();
                setMyOffers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }
  }, [currentPage]);

  const updateOfferStatus = (offerId, newStatus) => {
    setMyOffers(myOffers.map(o => o.id === offerId ? { ...o, status: newStatus } : o));
  };

  const handleOfferAction = async (offerId, action) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) throw new Error('Authentication token not found.');

        const response = await fetch(`${API_BASE_URL}/api/offers/${offerId}/${action}/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || `Failed to ${action} offer.`);
        }
        
        updateOfferStatus(offerId, action === 'accept' ? 'ACCEPTED' : 'DECLINED');
        alert(`Offer ${action}ed successfully!`);
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
  };

  const handleAcceptOffer = (offerId) => handleOfferAction(offerId, 'accept');
  const handleDeclineOffer = (offerId) => handleOfferAction(offerId, 'decline');

  const handleOpenCounterModal = (offer) => {
    setSelectedOffer(offer);
    setShowCounterModal(true);
  };

  const handleCounterOfferSubmit = async (offerId, counterData) => {
    console.log('Submitting counter for', offerId, counterData);
    // Implement PATCH /api/offers/{offerId}/counter/
    // On success:
    // updateOfferStatus(offerId, 'COUNTERED');
    // setShowCounterModal(false);
    // alert('Counter offer submitted!');
    alert('Counter offer functionality to be implemented.');
    setShowCounterModal(false);
  };


  const handleSubmit = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        alert('Authentication error. Please log in again.');
        return;
    }

    try {
        // Step 1: Upload all images and get their storage paths
        const imagePaths = await Promise.all(
            uploadedImages.map(async (imageObj) => {
                // 1a: Get presigned URL
                const presignedUrlResponse = await fetch(`${API_BASE_URL}/api/documents/generate-presigned-url/`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ file_name: imageObj.file.name, file_type: imageObj.file.type }),
                });
                if (!presignedUrlResponse.ok) throw new Error('Failed to get presigned URL.');
                const { url, storage_path } = await presignedUrlResponse.json();

                // 1b: Upload file to S3
                const uploadResponse = await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': imageObj.file.type },
                    body: imageObj.file,
                });
                if (!uploadResponse.ok) throw new Error(`Failed to upload ${imageObj.file.name}.`);

                // 1c: Create document record
                const createRecordResponse = await fetch(`${API_BASE_URL}/api/documents/create-record/`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ storage_path: storage_path, document_type: 'ASSET_IMAGE' }),
                });
                if (!createRecordResponse.ok) throw new Error('Failed to create document record.');

                return storage_path;
            })
        );

        // Step 2: Construct and submit the asset registration payload
        const assetPayload = {
            collateral_type: formData.collateral_type,
            primary_identifier: formData.primary_identifier,
            valuation_kes: formData.market_valuation_kes, // Mapping form field to API field
            valuation_date: formData.valuation_date,
            details: {
                ...formData.details,
                // Map form field 'year' to API's 'year_of_manufacture' if it exists
                ...(formData.details.year && { year_of_manufacture: parseInt(formData.details.year, 10) }),
            },
            images: imagePaths,
        };
        // Remove the old 'year' field if it exists to avoid sending it
        if (assetPayload.details.year) {
            delete assetPayload.details.year;
        }

        const registerResponse = await fetch(`${API_BASE_URL}/api/assets/register/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(assetPayload),
        });

        if (!registerResponse.ok) {
            const errorData = await registerResponse.json();
            throw new Error(JSON.stringify(errorData) || 'Failed to register asset.');
        }

        // Step 3: Handle success
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setCurrentPage('asset-management');
            // Reset form state
            setStep(1);
            setFormData({
                collateral_type: '', primary_identifier: '', relief_amount_requested_kes: '',
                market_valuation_kes: '', valuation_date: '', details: {}, images: []
            });
            setUploadedImages([]);
        }, 3000);

    } catch (error) {
        console.error('Asset registration failed:', error);
        alert(`Error: ${error.message}`);
    }
  };
  
  // RENDER LOGIC
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <BorrowerLandingDashboard myAssets={[]} myOffers={myOffers} setCurrentPage={setCurrentPage} />;
      
      case 'asset-management':
        return <AssetManagementView myAssets={[]} setCurrentPage={setCurrentPage} setFormData={setFormData} setAssetType={(val) => setFormData(prev => ({...prev, collateral_type: val}))} setStep={setStep} />;
      
      case 'asset-registration':
        return <AssetFormSection 
                    step={step} setStep={setStep} 
                    formData={formData} setFormData={setFormData} 
                    uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} 
                    assetType={formData.collateral_type} handleSubmit={handleSubmit} 
                />;
      
      case 'offers-review':
        return <OffersReviewDashboard 
        myOffers={myOffers} 
        loading={loading}
        error={error}
        onAccept={handleAcceptOffer}
        onDecline={handleDeclineOffer}
        onCounter={handleOpenCounterModal}
    />;

      case 'loan-servicing':
        return <LoanServicingPortal />;
        
      case 'profile':
        return <ProfileAndSettings />;
        
      default:
        return <BorrowerLandingDashboard myAssets={[]} myOffers={myOffers} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <h1 className="text-3xl font-bold text-gray-800">NPLin</h1>
              <nav className="hidden md:flex gap-8">
              {Object.entries(menuMap).map(([key, label]) => (
                <button 
                  key={key}
                  onClick={() => setCurrentPage(key)} 
                  className={`font-medium transition-colors ${currentPage === key ? 'text-gray-900 font-bold border-b-2 border-[#40916c]' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  {label}
                </button>
              ))}
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-red-500/10 backdrop-blur-md hover:bg-red-500/20 text-red-800 font-semibold rounded-xl border border-red-500/20 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
              <LogOut className="w-5 h-5" /> Logout

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
          <GlassCard className="p-12 max-w-md mx-4 shadow-2xl animate-scale-in bg-white/80">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Asset Listed Successfully!</h3>
              <p className="text-gray-600 mb-8">Your asset has been submitted for review. You'll receive notifications when investors show interest.</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-8 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] hover:from-[#40916c] hover:to-[#d8f3dc] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
          </GlassCard>
        </div>
      )}
            {/* Counter Offer Modal */}
            {showCounterModal && (
          <CounterOfferModal 
            offer={selectedOffer}
            onClose={() => setShowCounterModal(false)}
            onSubmit={handleCounterOfferSubmit}
          />
      )}

    </div>
  );
}