import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { 
    Car, Home, Maximize, Upload, DollarSign, Calendar, FileText, CheckCircle, ArrowRight, Trash2, X, LogOut, MapPin } from 'lucide-react';

// =========================================================================
// 1. CONSTANTS & CONFIG
// =========================================================================
const API_BASE_URL = 'http://127.0.0.1:8000';

const assetTypes = [
    { value: 'VEHICLE', label: 'Vehicle', icon: Car, color: 'from-blue-400/30 to-blue-500/30' },
    { value: 'HOUSE', label: 'House', icon: Home, color: 'from-green-400/30 to-green-500/30' },
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
          className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-gray-300 text-[#1a3d2e] placeholder-[#4a6850]/70 outline-none focus:ring-2 focus:ring-[#6B9071] focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
    </div>
);

const AssetTypeCard = ({ type, onSelect }) => {
    const Icon = type.icon;
    return (
      <button
        onClick={() => onSelect(type.value)}
        className="group relative overflow-hidden rounded-3xl p-8 bg-gray-50/50 border border-gray-200 hover:bg-white transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-[#40916c]/20"
      >
        <div className="relative flex flex-col items-center gap-4">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-16 h-16 text-[#40916c]" />
          </div>
          <h3 className="text-2xl font-bold text-black">{type.label}</h3>
          <p className="text-gray-600 text-center">List your {type.label.toLowerCase()} for relief financing</p>
        </div>
      </button>
    );
};

const SuccessModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="p-12 max-w-md mx-4 shadow-2xl animate-scale-in bg-white rounded-3xl border">
            <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-black mb-4">Asset Listed Successfully!</h3>
                <p className="text-gray-600 mb-8">Your asset has been submitted for review. You'll receive notifications on its status.</p>
                <button
                    onClick={onClose}
                    className="px-8 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] text-black font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    View My Assets
                </button>
            </div>
        </div>
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
    const [proofOfOwnershipDocs, setProofOfOwnershipDocs] = useState([]);
    const [proofOfDistressDocs, setProofOfDistressDocs] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [existingOwnershipDocs, setExistingOwnershipDocs] = useState([]);
    const [existingDistressDocs, setExistingDistressDocs] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const editAssetId = new URLSearchParams(location.search).get('edit');

    useEffect(() => {
        if (editAssetId) {
            const fetchAssetData = async () => {
                setLoading(true);
                try {
                    const accessToken = localStorage.getItem('accessToken');
                    const response = await fetch(`${API_BASE_URL}/api/assets/my_assets/${editAssetId}/`, {
                        headers: { 'Authorization': `Bearer ${accessToken}` },
                    });
                    if (!response.ok) throw new Error('Failed to fetch asset data for editing.');
                    const data = await response.json();
                    
                    setFormData({
                        // Top-level fields
                        collateral_type: data.collateral_type,
                        primary_identifier: data.primary_identifier,
                        relief_amount_requested_kes: data.relief_amount_requested_kes || '',
                        valuation_kes: data.market_valuation_kes || '',
                        valuation_date: data.valuation_date || '',
                        // Pre-fill nested details, mapping API names to form names (e.g., year_of_manufacture -> year)
                        details: {
                            ...data.details,
                            ...(data.details?.year_of_manufacture && { year: data.details.year_of_manufacture }),
                            ...(data.details?.registration_number && { registration_number: data.details.registration_number }),
                        } || {},
                    });

                    // Store existing documents to display them
                    setExistingImages(data.images || []);
                    setExistingOwnershipDocs(data.proof_of_ownership_docs || []);
                    setExistingDistressDocs(data.proof_of_distress_docs || []);
                    setStep(2);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchAssetData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editAssetId]);

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        navigate('/login');
    };

    useEffect(() => {
        if (editAssetId) {
            const fetchAssetData = async () => {
                setLoading(true);
                try {
                    const accessToken = localStorage.getItem('accessToken');
                    const response = await fetch(`${API_BASE_URL}/api/assets/my_assets/${editAssetId}/`, {
                        headers: { 'Authorization': `Bearer ${accessToken}` },
                    });
                    if (!response.ok) throw new Error('Failed to fetch asset data for editing.');
                    const data = await response.json();
                    
                    setFormData({
                        // Top-level fields
                        collateral_type: data.collateral_type,
                        primary_identifier: data.primary_identifier,
                        relief_amount_requested_kes: data.relief_amount_requested_kes || '',
                        valuation_kes: data.market_valuation_kes || '',
                        valuation_date: data.valuation_date || '',
                        // Pre-fill nested details, mapping API names to form names (e.g., year_of_manufacture -> year)
                        details: {
                            ...data.details,
                            ...(data.details?.year_of_manufacture && { year: data.details.year_of_manufacture }),
                            ...(data.details?.registration_number && { registration_number: data.details.registration_number }),
                        } || {},
                    });

                    // Store existing documents to display them
                    setExistingImages(data.images || []);
                    setExistingOwnershipDocs(data.proof_of_ownership_docs || []);
                    setExistingDistressDocs(data.proof_of_distress_docs || []);
                    setStep(2);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchAssetData();
        }
    }, [editAssetId]);

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

    const handleOwnershipDocsUpload = (e) => {
        const newFiles = Array.from(e.target.files).map(file => ({
            file: file,
            preview: URL.createObjectURL(file)
        }));
        setProofOfOwnershipDocs(prev => [...prev, ...newFiles]);
    };

    const handleDistressDocsUpload = (e) => {
        const newFiles = Array.from(e.target.files).map(file => ({
            file: file,
            preview: URL.createObjectURL(file)
        }));
        setProofOfDistressDocs(prev => [...prev, ...newFiles]);
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

        // Step 1: A helper function to upload a single file and get its URL
        const uploadFile = async (file, documentType) => {
            const filePayload = new FormData();
            filePayload.append('file', file);
            filePayload.append('document_type', documentType);

            // Assuming a new endpoint for direct file uploads that returns a URL
            const response = await fetch(`${API_BASE_URL}/api/documents/upload/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: filePayload,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to upload ${file.name}: ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            return result.file_url; // Correctly access the file_url from the response
        };

        try {
            // Step 2: Upload all files concurrently and collect their URLs
            const imageUrls = await Promise.all(
                uploadedImages.map(img => uploadFile(img.file, 'ASSET_IMAGE'))
            );
            const ownershipDocUrls = await Promise.all(
                proofOfOwnershipDocs.map(doc => uploadFile(doc.file, 'ASSET_OWNERSHIP'))
            );
            const distressDocUrls = await Promise.all(
                proofOfDistressDocs.map(doc => uploadFile(doc.file, 'ASSET_DISTRESS'))
            );

        // If we are editing, we send JSON for text fields.
        // File updates would require a different approach, but this fixes editing details.
        if (editAssetId) {
            const details = {
                ...formData.details,
                ...(formData.collateral_type === 'VEHICLE' && { registration_number: formData.primary_identifier }),
                ...(formData.details.year && { year_of_manufacture: parseInt(formData.details.year, 10) }),
            };
            if (details.year) delete details.year;

            const patchPayload = {
                collateral_type: formData.collateral_type,
                primary_identifier: formData.primary_identifier,
                relief_amount_requested_kes: formData.relief_amount_requested_kes,
                market_valuation_kes: formData.valuation_kes,
                valuation_date: formData.valuation_date,
                details: details,
            };

            try {
                const response = await fetch(`${API_BASE_URL}/api/assets/my_assets/${editAssetId}/`, {
                    method: 'PATCH',
                    headers: { 
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(patchPayload),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(JSON.stringify(errorData) || 'Failed to update asset.');
                }
                setShowSuccess(true);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
            return; // End execution for edit mode
        }

        // Step 3: Construct the final JSON payload with the URLs
        const details = {
            ...formData.details,
            ...(formData.collateral_type === 'VEHICLE' && { registration_number: formData.primary_identifier }),
            ...(formData.details.year && { year_of_manufacture: parseInt(formData.details.year, 10) }),
        };
        if (details.year) delete details.year;

        const finalPayload = {
            listing_type: 'DISTRESSED',
            collateral_type: formData.collateral_type,
            primary_identifier: formData.primary_identifier,
            relief_amount_requested_kes: formData.relief_amount_requested_kes,
            market_valuation_kes: formData.valuation_kes,
            valuation_date: formData.valuation_date,
            details: details,
            images: imageUrls,
            proof_of_ownership_docs: ownershipDocUrls,
            proof_of_distress_docs: distressDocUrls,
        };

            // Step 4: Submit the final JSON payload
            const response = await fetch(`${API_BASE_URL}/api/assets/register/`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
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
                        <InputField icon={FileText} label="Registration Number" placeholder="e.g., KAA 123A" value={formData.primary_identifier} onChange={(e) => { handleInputChange('primary_identifier', e.target.value); handleDetailsChange('registration_number', e.target.value); }} />
                        <InputField icon={FileText} label="Chassis Number" placeholder="e.g., JM6KE..." value={valueGetter('chassis_number')} onChange={(e) => onChangeHandler('chassis_number', e)} />
                        <InputField icon={FileText} label="Mileage (km)" type="number" placeholder="e.g., 50000" value={valueGetter('mileage')} onChange={(e) => onChangeHandler('mileage', e)} />
                        <InputField icon={DollarSign} label="Relief Amount Requested (KES)" type="number" placeholder="e.g., 500000" value={formData.relief_amount_requested_kes} onChange={(e) => handleInputChange('relief_amount_requested_kes', e.target.value)} />
                    </>
                );
            case 'HOUSE':
                return (
                    <>
                        <InputField icon={FileText} label="Title Number" placeholder="e.g., NGONG/NGONG/12345" value={formData.primary_identifier} onChange={(e) => handleInputChange('primary_identifier', e.target.value)} />
                        <InputField icon={MapPin} label="Address" placeholder="Enter property address" value={valueGetter('address')} onChange={(e) => onChangeHandler('address', e)} />
                        <InputField icon={Home} label="Property Type" placeholder="e.g., Apartment, House" value={valueGetter('property_type')} onChange={(e) => onChangeHandler('property_type', e)} />
                        <InputField icon={Maximize} label="Size (sqm)" type="number" placeholder="e.g., 250" value={valueGetter('size_sqm')} onChange={(e) => onChangeHandler('size_sqm', e)} />
                        <InputField icon={Home} label="Bedrooms" type="number" placeholder="e.g., 4" value={valueGetter('bedrooms')} onChange={(e) => onChangeHandler('bedrooms', e)} />
                        <InputField icon={Home} label="Bathrooms" type="number" placeholder="e.g., 3" value={valueGetter('bathrooms')} onChange={(e) => onChangeHandler('bathrooms', e)} />
                        <InputField icon={DollarSign} label="Relief Amount Requested (KES)" type="number" placeholder="e.g., 500000" value={formData.relief_amount_requested_kes} onChange={(e) => handleInputChange('relief_amount_requested_kes', e.target.value)} />
                    </>
                );
            case 'LAND':
                return (
                    <>
                        <InputField icon={FileText} label="Title Number" placeholder="e.g., LR 12345" value={formData.primary_identifier} onChange={(e) => handleInputChange('primary_identifier', e.target.value)} />
                        <InputField icon={MapPin} label="Registration District" placeholder="e.g., Kiambu" value={valueGetter('registration_district')} onChange={(e) => onChangeHandler('registration_district', e)} />
                        <InputField icon={Maximize} label="Land Size (sqm)" type="number" placeholder="e.g., 800" value={valueGetter('land_size_sqm')} onChange={(e) => onChangeHandler('land_size_sqm', e)} />
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
                            <h2 className="text-4xl font-bold text-black mb-4">List Your Asset</h2>
                            <p className="text-xl text-gray-600">Choose the type of asset you want to list for financing.</p>
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
                    <GlassCard className="p-8 shadow-2xl bg-white">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-black">{editAssetId ? 'Edit Asset Details' : 'Asset Details'}</h2>
                            <p className="text-lg text-gray-600">Provide information about your {assetTypes.find(t => t.value === formData.collateral_type)?.label.toLowerCase()}.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {getAssetSpecificFields()}
                            <InputField icon={DollarSign} label="Market Valuation (KES)" type="number" placeholder="e.g., 1000000" value={formData.valuation_kes} onChange={(e) => handleInputChange('valuation_kes', e.target.value)} />
                            <InputField icon={Calendar} label="Valuation Date" type="date" value={formData.valuation_date} onChange={(e) => handleInputChange('valuation_date', e.target.value)} />
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black font-semibold rounded-xl border border-gray-300 transition-all">Back</button>
                            <button onClick={() => setStep(3)} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] text-black font-bold rounded-xl transition-all">Continue</button>
                        </div>
                    </GlassCard>
                );
            case 3: // Images & Submit
                return (
                    <GlassCard className="p-8 shadow-2xl bg-white">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[#1a3d2e]">{editAssetId ? 'Update' : 'Upload'} Images & Documents</h2>
                            <p className="text-lg text-[#4a6850]">Add photos and required documents (e.g., Title, Logbook).</p>
                        </div>
                        <div className="mb-8">
                            <label className="block cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 bg-gray-50 hover:bg-gray-100 transition-all text-center">
                                    <Upload className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                                    <p className="text-lg font-semibold text-black mb-2">Click to upload Asset Images</p>
                                    <p className="text-sm text-gray-500">PNG, JPG, GIF (at least 2 required)</p>
                                </div>
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>

                        {/* Proof of Ownership */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#1a3d2e] mb-2">Proof of Ownership <span className="text-red-500">*</span></h3>
                            <p className="text-sm text-[#4a6850] mb-4">Upload documents like a logbook for vehicles or a title deed for property/land.</p>
                            <label className="block cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50 hover:bg-gray-100 transition-all text-center">
                                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                                    <p className="text-md font-semibold text-black mb-1">Click to upload ownership documents</p>
                                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB each</p>
                                </div>
                                <input type="file" multiple accept="application/pdf,image/*" onChange={handleOwnershipDocsUpload} className="hidden" />
                            </label>
                        </div>

                        {/* Proof of Distress */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#1a3d2e] mb-2">Proof of Distress <span className="text-red-500">*</span></h3>
                            <p className="text-sm text-[#4a6850] mb-4">Upload documents like loan statements or demand letters.</p>
                            <label className="block cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50 hover:bg-gray-100 transition-all text-center">
                                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                                    <p className="text-md font-semibold text-black mb-1">Click to upload distress documents</p>
                                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB each</p>
                                </div>
                                <input type="file" multiple accept="application/pdf,image/*" onChange={handleDistressDocsUpload} className="hidden" />
                            </label>
                        </div>

                        {/* Display Existing Files in Edit Mode */}
                        {editAssetId && (
                            <>
                                {existingImages.length > 0 && <ExistingFileViewer title="Current Images" files={existingImages} />}
                                {existingOwnershipDocs.length > 0 && <ExistingFileViewer title="Current Ownership Docs" files={existingOwnershipDocs} />}
                                {existingDistressDocs.length > 0 && <ExistingFileViewer title="Current Distress Docs" files={existingDistressDocs} />}
                            </>
                        )}

                        {/* Combined File Previews */}
                        {(uploadedImages.length > 0 || (editAssetId && existingImages.length > 0)) && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-black mb-4">Asset Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {uploadedImages.map((imageObj, index) => ( // New images
                                        <div key={index} className="relative group">
                                            {imageObj.file.type.includes('pdf')
                                                ? <FileText className="w-full h-32 object-cover rounded-xl border border-gray-200 p-8 text-gray-500 bg-gray-100" />
                                                : <img src={imageObj.preview} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                                            }
                                            <button onClick={() => removeImage(index)} className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {editAssetId && existingImages.map((file, index) => { // Existing images
                                        const url = (file.image || file).startsWith('http') ? (file.image || file) : `${API_BASE_URL}${file.image || file}`;
                                        return (
                                            <div key={`existing-${index}`} className="relative group">
                                                <img src={url} alt={`Existing file ${index + 1}`} className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                                                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">Current</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {(proofOfOwnershipDocs.length > 0 || (editAssetId && existingOwnershipDocs.length > 0)) && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-black mb-4">Ownership Docs</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {proofOfOwnershipDocs.map((doc, index) => ( // New docs
                                        <div key={index} className="relative group">
                                            {doc.file.type.includes('pdf')
                                                ? <FileText className="w-full h-32 object-cover rounded-xl border border-gray-200 p-8 text-gray-500 bg-gray-100" />
                                                : <img src={doc.preview} alt={`Ownership Doc ${index + 1}`} className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                                            }
                                            <button onClick={() => setProofOfOwnershipDocs(prev => prev.filter((_, i) => i !== index))} className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {editAssetId && existingOwnershipDocs.map((file, index) => { // Existing docs
                                        const url = (file.document || file).startsWith('http') ? (file.document || file) : `${API_BASE_URL}${file.document || file}`;
                                        return (
                                            <a key={`existing-own-${index}`} href={url} target="_blank" rel="noopener noreferrer" className="relative group">
                                                <FileText className="w-full h-32 object-cover rounded-xl border border-gray-200 p-8 text-gray-500 bg-gray-100" />
                                                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">Current</div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {(proofOfDistressDocs.length > 0 || (editAssetId && existingDistressDocs.length > 0)) && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-black mb-4">Distress Docs</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {proofOfDistressDocs.map((doc, index) => ( // New docs
                                        <div key={index} className="relative group">
                                            {doc.file.type.includes('pdf')
                                                ? <FileText className="w-full h-32 object-cover rounded-xl border border-gray-200 p-8 text-gray-500 bg-gray-100" />
                                                : <img src={doc.preview} alt={`Distress Doc ${index + 1}`} className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                                            }
                                            <button onClick={() => setProofOfDistressDocs(prev => prev.filter((_, i) => i !== index))} className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {editAssetId && existingDistressDocs.map((file, index) => { // Existing docs
                                        const url = (file.document || file).startsWith('http') ? (file.document || file) : `${API_BASE_URL}${file.document || file}`;
                                        return (
                                            <a key={`existing-distress-${index}`} href={url} target="_blank" rel="noopener noreferrer" className="relative group">
                                                <FileText className="w-full h-32 object-cover rounded-xl border border-gray-200 p-8 text-gray-500 bg-gray-100" />
                                                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">Current</div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {error && <div className="my-4 text-center p-4 text-red-600 bg-red-100/50 rounded-2xl">{error}</div>}
                        <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black font-semibold rounded-xl border border-gray-300 transition-all">Back</button>
                            <button onClick={handleSubmit} disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                {loading ? 'Submitting...' : <><CheckCircle className="w-5 h-5" /> {editAssetId ? 'Update Asset' : 'Submit Asset'}</>}
                            </button>
                        </div>
                    </GlassCard>
                );
            default: return null;
        }
    };

    return (
        <>
            {showSuccess && <SuccessModal onClose={() => navigate('/borrower/assets')} />}
            <div className="min-h-screen bg-white">
                <div className="flex min-h-screen">
                    <ModernSidebar userRole="borrower" onLogout={handleLogout} />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
                        {/* Progress Steps */}
                        <div className="mb-12">
                            <div className="flex items-center justify-center gap-4">
                                {[1, 2, 3].map((stepNum) => (
                                    <React.Fragment key={stepNum}>
                                        <div className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${step >= stepNum ? 'bg-white shadow-md border-gray-200' : 'bg-gray-100 border-gray-200'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${step >= stepNum ? 'bg-gradient-to-r from-[#d8f3dc] to-[#40916c] text-black' : 'bg-gray-200 text-gray-500'}`}>
                                                {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                                            </div>
                                            <span className={`font-semibold ${step >= stepNum ? 'text-[#1a3d2e]' : 'text-[#4a6850]'}`}>
                                                {stepNum === 1 ? 'Asset Type' : stepNum === 2 ? 'Details' : editAssetId ? 'Update' : 'Images & Submit'}
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
        </>
    );
}

const ExistingFileViewer = ({ title, files }) => {
    const isImage = (url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    
    const getFullUrl = (path) => {
        if (!path) return '';
        return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
    };

    return (
        <div className="mb-8 p-4 bg-gray-50 rounded-xl border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, index) => {
                    const url = getFullUrl(file.document || file);
                    return (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="relative group">
                        {isImage(file.document || file)
                            ? <img src={url} alt={`Existing file ${index + 1}`} className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                            : <div className="w-full h-32 rounded-xl border border-gray-200 bg-gray-100 flex flex-col items-center justify-center p-2">
                                <FileText className="w-12 h-12 text-gray-500" />
                                <p className="text-xs text-center text-gray-500 mt-2 truncate w-full">{(file.document || file).split('/').pop()}</p>
                              </div>
                        }
                    </a>);
                })}
            </div>
        </div>
    );
};