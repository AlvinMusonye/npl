import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { 
    Car, Home, Maximize, Upload, DollarSign, Calendar, FileText, CheckCircle, ArrowRight, Trash2, X, LogOut 
} from 'lucide-react';

// =========================================================================
// 1. CONSTANTS & CONFIG
// =========================================================================
const API_BASE_URL = 'http://127.0.0.1:8000';

const assetTypes = [
    { value: 'VEHICLE', label: 'Vehicle', icon: Car, color: 'from-blue-400/30 to-blue-500/30' },
    { value: 'PROPERTY', label: 'Property', icon: Home, color: 'from-green-400/30 to-green-500/30' },
    { value: 'LAND', label: 'Land', icon: Maximize, color: 'from-yellow-400/30 to-yellow-500/30' }
];

// =========================================================================
// 2. REUSABLE UI COMPONENTS
// =========================================================================

const GlassCard = ({ children, className = "", ...props }) => (
  <div 
    className={`relative overflow-hidden rounded-3xl bg-white/40 border border-white/60 shadow-xl ${className}`}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    }}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-80"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const InputField = ({ icon: Icon, label, type = "text", placeholder, value, onChange, disabled = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#1a3d2e]">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4a6850]" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-[#1a3d2e] placeholder-[#4a6850]/70 outline-none focus:ring-2 focus:ring-[#6B9071] focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
    </div>
);

const AssetTypeCard = ({ type, onSelect }) => {
    const Icon = type.icon;
    return (
      <button
        onClick={() => onSelect(type.value)}
        className="group relative overflow-hidden rounded-3xl p-8 bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="relative flex flex-col items-center gap-4">
          <div className="p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-16 h-16 text-[#1a3d2e]" />
          </div>
          <h3 className="text-2xl font-bold text-[#1a3d2e]">{type.label}</h3>
          <p className="text-[#4a6850] text-center">List your {type.label.toLowerCase()} for relief financing</p>
        </div>
      </button>
    );
};

const SuccessModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <GlassCard className="p-12 max-w-md mx-4 shadow-2xl animate-scale-in">
            <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#1a3d2e] mb-4">Asset Listed Successfully!</h3>
                <p className="text-[#4a6850] mb-8">Your asset has been submitted for review. You'll receive notifications on its status.</p>
                <button
                    onClick={onClose}
                    className="px-8 py-3 bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    View My Assets
                </button>
            </div>
        </GlassCard>
    </div>
);

// =========================================================================
// 3. MAIN REGISTER ASSET PAGE COMPONENT
// =========================================================================

export default function RegisterAssetPage({ setRole }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        collateral_type: '',
        primary_identifier: '',
        relief_amount_requested_kes: '',
        valuation_kes: '',
        valuation_date: '',
        details: {},
    });
    const [uploadedImages, setUploadedImages] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        navigate('/login');
    };

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

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            setError('Authentication error. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const imagePaths = await Promise.all(
                uploadedImages.map(async (imageObj) => {
                    const presignedUrlResponse = await fetch(`${API_BASE_URL}/api/documents/generate-presigned-url/`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ file_name: imageObj.file.name, file_type: imageObj.file.type }),
                    });
                    if (!presignedUrlResponse.ok) throw new Error('Failed to get presigned URL.');
                    const { url, storage_path } = await presignedUrlResponse.json();

                    const uploadResponse = await fetch(url, {
                        method: 'PUT',
                        headers: { 'Content-Type': imageObj.file.type },
                        body: imageObj.file,
                    });
                    if (!uploadResponse.ok) throw new Error(`Failed to upload ${imageObj.file.name}.`);

                    const createRecordResponse = await fetch(`${API_BASE_URL}/api/documents/create-record/`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ storage_path: storage_path, document_type: 'ASSET_IMAGE' }),
                    });
                    if (!createRecordResponse.ok) throw new Error('Failed to create document record.');

                    return storage_path;
                })
            );

            const assetPayload = {
                listing_type: 'DISTRESSED',
                ...formData,
                details: {
                    ...formData.details,
                    ...(formData.details.year && { year_of_manufacture: parseInt(formData.details.year, 10) }),
                },
                images: imagePaths,
            };
            assetPayload.market_valuation_kes = formData.valuation_kes; // Map to correct API field name
            if (assetPayload.details.year) delete assetPayload.details.year;

            const registerResponse = await fetch(`${API_BASE_URL}/api/assets/register/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(assetPayload),
            });

            if (!registerResponse.ok) {
                const errorData = await registerResponse.json();
                throw new Error(JSON.stringify(errorData) || 'Failed to register asset.');
            }

            setShowSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getAssetSpecificFields = () => {
        const valueGetter = (field) => formData.details[field] || '';
        const onChangeHandler = (field, e) => handleDetailsChange(field, e.target.value);

        switch (formData.collateral_type) {
            case 'VEHICLE':
                return (
                    <>
                        <InputField icon={Car} label="Make" placeholder="e.g., Toyota" value={valueGetter('make')} onChange={(e) => onChangeHandler('make', e)} />
                        <InputField icon={Car} label="Model" placeholder="e.g., Corolla" value={valueGetter('model')} onChange={(e) => onChangeHandler('model', e)} />
                        <InputField icon={Calendar} label="Year" type="number" placeholder="e.g., 2018" value={valueGetter('year')} onChange={(e) => onChangeHandler('year', e)} />
                        <InputField icon={FileText} label="Registration Number" placeholder="e.g., KAA 123A" value={formData.primary_identifier} onChange={(e) => handleInputChange('primary_identifier', e.target.value)} />
                        <InputField icon={FileText} label="Chassis Number" placeholder="e.g., JM6KE..." value={valueGetter('chassis_number')} onChange={(e) => onChangeHandler('chassis_number', e)} />
                        <InputField icon={FileText} label="Mileage (km)" type="number" placeholder="e.g., 50000" value={valueGetter('mileage')} onChange={(e) => onChangeHandler('mileage', e)} />
                        <InputField icon={DollarSign} label="Relief Amount Requested (KES)" type="number" placeholder="e.g., 500000" value={formData.relief_amount_requested_kes} onChange={(e) => handleInputChange('relief_amount_requested_kes', e.target.value)} />
                    </>
                );
            case 'PROPERTY':
                return (
                    <>
                        <InputField icon={FileText} label="Title Number" placeholder="e.g., NGONG/NGONG/12345" value={formData.primary_identifier} onChange={(e) => handleInputChange('primary_identifier', e.target.value)} />
                        <InputField icon={MapPin} label="Address" placeholder="Enter property address" value={valueGetter('address')} onChange={(e) => onChangeHandler('address', e)} />
                        <InputField icon={Home} label="Property Type" placeholder="e.g., Apartment, House" value={valueGetter('property_type')} onChange={(e) => onChangeHandler('property_type', e)} />
                        <InputField icon={Maximize} label="Size (sq ft)" type="number" placeholder="e.g., 1500" value={valueGetter('size')} onChange={(e) => onChangeHandler('size', e)} />
                        <InputField icon={DollarSign} label="Relief Amount Requested (KES)" type="number" placeholder="e.g., 500000" value={formData.relief_amount_requested_kes} onChange={(e) => handleInputChange('relief_amount_requested_kes', e.target.value)} />
                    </>
                );
            case 'LAND':
                return (
                    <>
                        <InputField icon={FileText} label="Title Number" placeholder="e.g., LR 12345" value={formData.primary_identifier} onChange={(e) => handleInputChange('primary_identifier', e.target.value)} />
                        <InputField icon={MapPin} label="Location" placeholder="Enter land location" value={valueGetter('location')} onChange={(e) => onChangeHandler('location', e)} />
                        <InputField icon={Maximize} label="Size (acres)" type="number" placeholder="e.g., 5" value={valueGetter('size')} onChange={(e) => onChangeHandler('size', e)} />
                        <InputField icon={FileText} label="Land Use" placeholder="e.g., Residential, Agricultural" value={valueGetter('land_use')} onChange={(e) => onChangeHandler('land_use', e)} />
                        <InputField icon={DollarSign} label="Relief Amount Requested (KES)" type="number" placeholder="e.g., 500000" value={formData.relief_amount_requested_kes} onChange={(e) => handleInputChange('relief_amount_requested_kes', e.target.value)} />
                    </>
                );
            default: return null;
        }
    };

    const renderContent = () => {
        switch (step) {
            case 1: // Select Asset Type
                return (
                    <div className="space-y-8">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold text-[#1a3d2e] mb-4">List Your Asset</h2>
                            <p className="text-xl text-[#4a6850]">Choose the type of asset you want to list for financing.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {assetTypes.map(type => (
                                <AssetTypeCard key={type.value} type={type} onSelect={(val) => {
                                    setFormData(prev => ({ ...prev, collateral_type: val }));
                                    setStep(2);
                                }} />
                            ))}
                        </div>
                    </div>
                );
            case 2: // Asset Details
                return (
                    <GlassCard className="p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[#1a3d2e]">Asset Details</h2>
                            <p className="text-lg text-[#4a6850]">Provide information about your {assetTypes.find(t => t.value === formData.collateral_type)?.label.toLowerCase()}.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {getAssetSpecificFields()}
                            <InputField icon={DollarSign} label="Market Valuation (KES)" type="number" placeholder="e.g., 1000000" value={formData.valuation_kes} onChange={(e) => handleInputChange('valuation_kes', e.target.value)} />
                            <InputField icon={Calendar} label="Valuation Date" type="date" value={formData.valuation_date} onChange={(e) => handleInputChange('valuation_date', e.target.value)} />
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 bg-white/40 backdrop-blur-md hover:bg-white/60 text-[#1a3d2e] font-semibold rounded-xl border border-white/40 transition-all">Back</button>
                            <button onClick={() => setStep(3)} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-bold rounded-xl transition-all">Continue</button>
                        </div>
                    </GlassCard>
                );
            case 3: // Images & Submit
                return (
                    <GlassCard className="p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[#1a3d2e]">Upload Images & Documents</h2>
                            <p className="text-lg text-[#4a6850]">Add photos and required documents (e.g., Title, Logbook).</p>
                        </div>
                        <div className="mb-8">
                            <label className="block cursor-pointer">
                                <div className="border-2 border-dashed border-white/40 rounded-2xl p-12 bg-white/10 hover:bg-white/20 transition-all text-center">
                                    <Upload className="w-16 h-16 mx-auto mb-4 text-[#4a6850]" />
                                    <p className="text-lg font-semibold text-[#1a3d2e] mb-2">Click to upload files</p>
                                    <p className="text-sm text-[#4a6850]">PNG, JPG, PDF up to 10MB each</p>
                                </div>
                                <input type="file" multiple accept="image/*, application/pdf" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                        {uploadedImages.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-[#1a3d2e] mb-4">Uploaded Files ({uploadedImages.length})</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {uploadedImages.map((imageObj, index) => (
                                        <div key={index} className="relative group">
                                            {imageObj.file.type.includes('pdf')
                                                ? <FileText className="w-full h-32 object-cover rounded-xl border border-white/40 p-8 text-[#4a6850] bg-white/40" />
                                                : <img src={imageObj.preview} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded-xl border border-white/40" />
                                            }
                                            <button onClick={() => removeImage(index)} className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {error && <div className="my-4 text-center p-4 text-red-600 bg-red-100/50 rounded-2xl">{error}</div>}
                        <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="flex-1 px-6 py-3 bg-white/40 backdrop-blur-md hover:bg-white/60 text-[#1a3d2e] font-semibold rounded-xl border border-white/40 transition-all">Back</button>
                            <button onClick={handleSubmit} disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                {loading ? 'Submitting...' : <><CheckCircle className="w-5 h-5" /> Submit Asset</>}
                            </button>
                        </div>
                    </GlassCard>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0]">
            {showSuccess && <SuccessModal onClose={() => navigate('/borrower/assets')} />}
            <div className="flex min-h-screen">
                <ModernSidebar userRole="borrower" onLogout={handleLogout} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center gap-4">
                            {[1, 2, 3].map((stepNum) => (
                                <React.Fragment key={stepNum}>
                                    <div className={`flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md border transition-all duration-300 ${step >= stepNum ? 'bg-white/40 border-white/60 shadow-lg' : 'bg-white/20 border-white/30'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${step >= stepNum ? 'bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white' : 'bg-white/30 text-[#4a6850]'}`}>
                                            {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                                        </div>
                                        <span className={`font-semibold ${step >= stepNum ? 'text-[#1a3d2e]' : 'text-[#4a6850]'}`}>
                                            {stepNum === 1 ? 'Asset Type' : stepNum === 2 ? 'Details' : 'Images & Submit'}
                                        </span>
                                    </div>
                                    {stepNum < 3 && <ArrowRight className="w-6 h-6 text-[#4a6850]/50" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}