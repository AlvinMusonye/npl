import React, { useState } from 'react';
import { Car, Home, Maximize, Upload, DollarSign, Calendar, MapPin, FileText, ImageIcon, CheckCircle, ArrowRight, X } from 'lucide-react';
import OffersChatPage from './OffersChatPage';

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
  const [view, setView] = useState('list');


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

  const handleSubmit = () => {
    // Here you would make the API call: POST /api/v1/assets/register/
    console.log('Submitting asset:', formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Reset or redirect
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
  if (view === 'offers') {
    return <OffersChatPage setView={setView} />;
  }

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
                <button onClick={() => setView('offers')} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Offers
                </button>
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


     </div>
    </div>
  );
};

export default ListAssetPage;
    