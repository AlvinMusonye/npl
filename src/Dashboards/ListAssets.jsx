import React, { useState } from 'react';
import { Car, Home, Maximize, Upload, DollarSign, Calendar, MapPin, FileText, CheckCircle, ArrowRight, Trash2 } from 'lucide-react';

const ListAssetPage = () => {
  const [step, setStep] = useState(1);
  const [assetType, setAssetType] = useState('');
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

  const assetTypes = [
    { value: 'VEHICLE', label: 'Vehicle', icon: Car, color: 'from-blue-400/30 to-blue-500/30' },
    { value: 'PROPERTY', label: 'Property', icon: Home, color: 'from-green-400/30 to-green-500/30' },
    { value: 'LAND', label: 'Land', icon: Maximize, color: 'from-yellow-400/30 to-yellow-500/30' }
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDetailsChange = (field, value) => {
    setFormData({
      ...formData,
      details: { ...formData.details, [field]: value }
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setUploadedImages([...uploadedImages, ...imageUrls]);
  };

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log('Submitting asset:', formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setStep(1);
      setAssetType('');
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

  const AssetTypeCard = ({ type }) => {
    const Icon = type.icon;
    return (
      <button
        onClick={() => {
          setAssetType(type.value);
          setFormData({ ...formData, collateral_type: type.value });
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

  const InputField = ({ icon: Icon, label, field, type = "text", placeholder, detailField = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
        <input
          type={type}
          placeholder={placeholder}
          value={detailField ? formData.details[field] || '' : formData[field] || ''}
          onChange={(e) => detailField ? handleDetailsChange(field, e.target.value) : handleInputChange(field, e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-gray-800 placeholder-gray-600 outline-none focus:border-white/60 transition-all"
        />
      </div>
    </div>
  );

  const getAssetSpecificFields = () => {
    switch (assetType) {
      case 'VEHICLE':
        return (
          <>
            <InputField icon={Car} label="Make" field="make" placeholder="e.g., Toyota" detailField />
            <InputField icon={Car} label="Model" field="model" placeholder="e.g., Corolla" detailField />
            <InputField icon={Calendar} label="Year" field="year" type="number" placeholder="e.g., 2018" detailField />
            <InputField icon={FileText} label="Registration Number" field="registration_number" placeholder="e.g., KAA 123A" detailField />
            <InputField icon={FileText} label="Mileage (km)" field="mileage" type="number" placeholder="e.g., 50000" detailField />
          </>
        );
      case 'PROPERTY':
        return (
          <>
            <InputField icon={MapPin} label="Address" field="address" placeholder="Enter property address" detailField />
            <InputField icon={Home} label="Property Type" field="property_type" placeholder="e.g., Apartment, House" detailField />
            <InputField icon={Maximize} label="Size (sq ft)" field="size" type="number" placeholder="e.g., 1500" detailField />
            <InputField icon={FileText} label="Number of Bedrooms" field="bedrooms" type="number" placeholder="e.g., 3" detailField />
            <InputField icon={FileText} label="Number of Bathrooms" field="bathrooms" type="number" placeholder="e.g., 2" detailField />
          </>
        );
      case 'LAND':
        return (
          <>
            <InputField icon={MapPin} label="Location" field="location" placeholder="Enter land location" detailField />
            <InputField icon={Maximize} label="Size (acres)" field="size" type="number" placeholder="e.g., 5" detailField />
            <InputField icon={FileText} label="Title Number" field="title_number" placeholder="e.g., LR 12345" detailField />
            <InputField icon={FileText} label="Land Use" field="land_use" placeholder="e.g., Residential, Agricultural" detailField />
          </>
        );
      default:
        return null;
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
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Dashboard</a>
                <a href="#" className="text-gray-900 font-bold border-b-2 border-gray-800">List Asset</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">My Assets</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Offers</a>
              </nav>
            </div>
            <button className="px-6 py-2.5 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl">
              Profile
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
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
                <AssetTypeCard key={type.value} type={type} />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Asset Details */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Asset Details</h2>
              <p className="text-xl text-gray-700">Provide information about your {assetTypes.find(t => t.value === assetType)?.label.toLowerCase()}</p>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Common Fields */}
                <InputField 
                  icon={FileText} 
                  label="Primary Identifier" 
                  field="primary_identifier" 
                  placeholder="Unique identifier for this asset" 
                />
                <InputField 
                  icon={DollarSign} 
                  label="Relief Amount Requested (KES)" 
                  field="relief_amount_requested_kes" 
                  type="number"
                  placeholder="e.g., 500000" 
                />
                <InputField 
                  icon={DollarSign} 
                  label="Market Valuation (KES)" 
                  field="market_valuation_kes" 
                  type="number"
                  placeholder="e.g., 1000000" 
                />
                <InputField 
                  icon={Calendar} 
                  label="Valuation Date" 
                  field="valuation_date" 
                  type="date"
                  placeholder="" 
                />

                {/* Asset-Specific Fields */}
                {getAssetSpecificFields()}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Images & Submit */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Upload Images</h2>
              <p className="text-xl text-gray-700">Add photos of your asset to increase credibility</p>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
              {/* Upload Area */}
              <div className="mb-8">
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-white/40 rounded-2xl p-12 bg-white/10 hover:bg-white/20 transition-all duration-300 text-center">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-lg font-semibold text-gray-800 mb-2">Click to upload images</p>
                    <p className="text-sm text-gray-600">PNG, JPG up to 10MB each</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded Images Grid */}
              {uploadedImages.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Images ({uploadedImages.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border border-white/40"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Submit Asset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 max-w-md mx-4 border border-white/40 shadow-2xl animate-scale-in">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAssetPage;