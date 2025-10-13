import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { FileText, CheckCircle, AlertTriangle, RefreshCw, Upload, X, LogOut, Plus, File, Loader2 } from 'lucide-react';

// =========================================================================
// 1. CONSTANTS & CONFIG
// =========================================================================
const API_BASE_URL = 'http://127.0.0.1:8000';

const DOCUMENT_TYPES = {
    'Personal KYC': [
        { value: 'GOVERNMENT_ID_FRONT', label: 'Government ID (Front)', asset: false },
        { value: 'GOVERNMENT_ID_BACK', label: 'Government ID (Back)', asset: false },
        { value: 'KRA_PIN_CERTIFICATE', label: 'KRA PIN Certificate', asset: false },
        { value: 'PROOF_OF_ADDRESS', label: 'Proof of Address (e.g., Utility Bill)', asset: false },
    ],
    'Financial Health': [
        { value: 'BANK_STATEMENT', label: 'Bank Statement', asset: false },
        { value: 'PAYSLIP', label: 'Payslip', asset: false },
        { value: 'BUSINESS_REGISTRATION', label: 'Business Registration', asset: false },
    ],
    'Asset Ownership': [
        { value: 'TITLE_DEED', label: 'Title Deed / Certificate of Lease', asset: true },
        { value: 'VEHICLE_LOGBOOK', label: 'Vehicle Logbook', asset: true },
        { value: 'SHARE_CERTIFICATE', label: 'Share Certificate / CDS Statement', asset: true },
        { value: 'OFFICIAL_SEARCH', label: 'Official Search (Land/MPSR)', asset: true },
        { value: 'VALUATION_REPORT', label: 'Asset Valuation Report', asset: true },
    ],
    'Proof of Distress': [
        { value: 'LOAN_STATEMENT', label: 'Loan Statement (from original lender)', asset: true },
        { value: 'DEMAND_LETTER', label: 'Demand Letter / Default Notice', asset: true },
        { value: 'AUCTION_NOTICE', label: 'Auction or Foreclosure Notice', asset: true },
    ],
};

// =========================================================================
// 2. REUSABLE UI COMPONENTS
// =========================================================================

const GlassCard = ({ children, className = "", ...props }) => (
  <div 
    className={`relative overflow-hidden rounded-3xl bg-white/40 border border-white/60 shadow-xl ${className}`}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
    }}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-80"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const StatusBadge = ({ status }) => {
    const statusConfig = {
        'APPROVED': { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-300' },
        'PENDING_REVIEW': { icon: RefreshCw, color: 'bg-yellow-100 text-yellow-800 border-yellow-300', animate: 'animate-spin' },
        'NEEDS_REVISION': { icon: AlertTriangle, color: 'bg-red-100 text-red-800 border-red-300' },
    };
    const config = statusConfig[status] || { icon: FileText, color: 'bg-gray-100 text-gray-800 border-gray-300' };
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color}`}>
        <Icon className={`w-4 h-4 ${config.animate || ''}`} />
        <span className="text-xs font-semibold">{status.replace('_', ' ')}</span>
      </div>
    );
};

const DocumentRow = ({ doc, onUploadRevision }) => (
    <div className="p-4 bg-white/30 rounded-2xl border border-white/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
            <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#1a3d2e]" />
                <div>
                    <h4 className="font-bold text-[#1a3d2e]">{doc.document_type_display}</h4>
                    <p className="text-xs text-[#4a6850]">Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                </div>
            </div>
            {doc.workflow_status === 'NEEDS_REVISION' && (
                <div className="mt-3 ml-9 p-3 bg-red-500/10 border-l-4 border-red-500/50 rounded-r-lg">
                    <p className="text-sm font-semibold text-red-800">Revision Reason:</p>
                    <p className="text-sm text-red-700">{doc.rejection_reason}</p>
                </div>
            )}
        </div>
        <div className="flex items-center gap-4">
            <StatusBadge status={doc.workflow_status} />
            {doc.workflow_status === 'NEEDS_REVISION' && (
                <button 
                    onClick={() => onUploadRevision(doc)}
                    className="px-4 py-2 bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-bold rounded-xl text-sm flex items-center gap-2"
                >
                    <Upload className="w-4 h-4" />
                    Upload New
                </button>
            )}
        </div>
    </div>
);

const UploadModal = ({ document, onClose, onUpload }) => {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            onUpload(file, document.document_type);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
            <GlassCard className="w-full max-w-lg p-8">
                <h3 className="text-2xl font-bold text-[#1a3d2e] mb-2">Upload Revision</h3>
                <p className="text-[#4a6850] mb-6">For document: <span className="font-semibold">{document.document_type_display}</span></p>
                
                <div 
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-white/40 rounded-2xl p-8 bg-white/10 hover:bg-white/20 transition-all text-center cursor-pointer"
                >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-[#4a6850]" />
                    {file ? (
                        <p className="text-lg font-semibold text-[#1a3d2e]">{file.name}</p>
                    ) : (
                        <p className="text-lg font-semibold text-[#1a3d2e]">Click to select a file</p>
                    )}
                    <p className="text-sm text-[#4a6850]">PNG, JPG, PDF up to 10MB</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                </div>

                <div className="flex gap-4 mt-8">
                    <button onClick={onClose} className="flex-1 py-3 bg-white/40 hover:bg-white/60 text-[#1a3d2e] font-semibold rounded-xl border border-white/40">Cancel</button>
                    <button onClick={handleUpload} disabled={!file} className="flex-1 py-3 bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-bold rounded-xl disabled:opacity-50">Upload</button>
                </div>
            </GlassCard>
        </div>
    );
};

const AddDocumentModal = ({ assets, onClose, onUpload, uploading, uploadError, setUploadError }) => {
    const [file, setFile] = useState(null);
    const [documentType, setDocumentType] = useState('GOVERNMENT_ID_FRONT');
    const [selectedAsset, setSelectedAsset] = useState('');
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const selectedDocInfo = Object.values(DOCUMENT_TYPES).flat().find(d => d.value === documentType);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!file || !documentType) return;
        if (selectedDocInfo?.asset && !selectedAsset) {
            setUploadError('Please select an asset for this document type.');
            return;
        }
        onUpload(file, documentType, selectedDocInfo?.asset ? selectedAsset : null);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
            <GlassCard className="w-full max-w-lg p-8">
                <h3 className="text-2xl font-bold text-[#1a3d2e] mb-6">Add a New Document</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#1a3d2e] mb-2">Document Type</label>
                        <select
                            disabled={uploading}
                            value={documentType}
                            onChange={(e) => { setDocumentType(e.target.value); setUploadError(null); }}
                            className="w-full px-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-[#1a3d2e] outline-none focus:ring-2 focus:ring-[#6B9071]"
                        >
                            {Object.entries(DOCUMENT_TYPES).map(([group, types]) => (
                                <optgroup key={group} label={group}>
                                    {types.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                    {selectedDocInfo?.asset && (
                        <div>
                            <label className="block text-sm font-semibold text-[#1a3d2e] mb-2">Link to Asset</label>
                            <select
                                disabled={uploading}
                                value={selectedAsset}
                                onChange={(e) => { setSelectedAsset(e.target.value); setUploadError(null); }}
                                className="w-full px-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-[#1a3d2e] outline-none focus:ring-2 focus:ring-[#6B9071]"
                            >
                                <option value="" disabled>Select an asset...</option>
                                {assets.map(asset => (
                                    <option key={asset.collateral_uuid} value={asset.collateral_uuid}>{asset.primary_identifier}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div 
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                        className={`relative border-2 border-dashed border-white/40 rounded-2xl p-8 bg-white/10 hover:bg-white/20 transition-all text-center cursor-pointer ${dragActive ? 'bg-white/30' : ''}`}
                    >
                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <File className="w-12 h-12 text-[#1a3d2e]" />
                                <p className="text-lg font-semibold text-[#1a3d2e]">{file.name}</p>
                                <p className="text-xs text-[#4a6850]">{(file.size / 1024).toFixed(2)} KB</p>
                                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-2 text-xs text-red-600 hover:underline">Remove file</button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="w-12 h-12 mx-auto text-[#4a6850]" />
                                <p className="text-lg font-semibold text-[#1a3d2e]">Click to upload or drag & drop</p>
                                <p className="text-sm text-[#4a6850]">PNG, JPG, PDF up to 10MB</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" disabled={uploading} />
                    </div>
                </div>
                {uploadError && <div className="mt-4 text-center p-3 text-red-700 bg-red-100/50 rounded-xl">{uploadError}</div>}

                <div className="flex gap-4 mt-8">
                    <button onClick={onClose} disabled={uploading} className="flex-1 py-3 bg-white/40 hover:bg-white/60 text-[#1a3d2e] font-semibold rounded-xl border border-white/40 disabled:opacity-50">Cancel</button>
                    <button onClick={handleUpload} disabled={!file || !documentType || uploading} className="flex-1 py-3 bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
                        {uploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : 'Upload Document'}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};

// =========================================================================
// 3. MAIN MY DOCUMENTS PAGE COMPONENT
// =========================================================================

export default function MyDocumentsPage({ setRole }) {
    const [documents, setDocuments] = useState([]);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true); // Page loading
    const [uploading, setUploading] = useState(false); // File upload loading
    const [error, setError] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [docToRevise, setDocToRevise] = useState(null);
    const navigate = useNavigate();

    const fetchDocuments = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Authentication token not found.');

            const response = await fetch(`${API_BASE_URL}/api/documents/my_documents/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (!response.ok) throw new Error('Failed to fetch documents.');
            const data = await response.json();
            setDocuments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssets = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) return;
            const response = await fetch(`${API_BASE_URL}/api/assets/my_assets/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (response.ok) {
                const data = await response.json();
                setAssets(data);
            }
        } catch (err) {
            console.error("Failed to fetch assets for document linking:", err);
        }
    };

    useEffect(() => {
        fetchDocuments();
        fetchAssets();
    }, []);

    const handleUploadRevision = (doc) => {
        setDocToRevise(doc);
        setShowUploadModal(true);
    };

    const handleUploadFile = async (file, documentType, assetId = null) => {
        const accessToken = localStorage.getItem('accessToken');
        setUploading(true);
        setUploadError(null);

        try {
            // 1. Get presigned URL
            if (showAddModal && selectedDocInfo?.asset && !assetId) throw new Error('Please select an asset for this document type.');
            const presignedUrlRes = await fetch(`${API_BASE_URL}/api/documents/generate-presigned-url/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ file_name: file.name, file_type: file.type }),
            });
            if (!presignedUrlRes.ok) throw new Error('Failed to get presigned URL.');
            const { url, storage_path } = await presignedUrlRes.json();

            // 2. Upload to S3
            const uploadRes = await fetch(url, { method: 'PUT', body: file });
            if (!uploadRes.ok) throw new Error('File upload failed.');

            const payload = { storage_path, document_type: documentType };
            if (assetId) payload.asset = assetId;
            // 3. Create document record
            const createRecordRes = await fetch(`${API_BASE_URL}/api/documents/create-record/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!createRecordRes.ok) throw new Error('Failed to create document record.');

            alert('Document uploaded successfully!');
            setShowUploadModal(false);
            setShowAddModal(false);
            fetchDocuments(); // Refresh the list
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="flex min-h-screen">
                <ModernSidebar userRole="borrower" onLogout={handleLogout} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
                    <div className="p-0 lg:p-4 w-full min-h-[85vh]">
                        <header className="flex justify-between items-center pb-4 mb-8">
                            <div>
                                <h1 className="text-4xl font-bold text-[#1a3d2e]">My Documents</h1>
                                <p className="mt-2 text-lg text-[#4a6850]">View and manage your uploaded documents.</p>
                            </div>
                            <button
                                onClick={() => {
                                    setUploadError(null);
                                    setShowAddModal(true);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105">
                                <Plus className="w-5 h-5" /> Add Document
                            </button>
                        </header>

                        {loading && <div className="text-center p-8 text-[#4a6850]">Loading documents...</div>}
                        {error && <div className="text-center p-8 text-red-600 bg-red-100/50 rounded-2xl">{error}</div>}
                        
                        {!loading && !error && (
                            <div className="space-y-4">
                                {documents.length > 0 ? (
                                    documents.map(doc => (
                                        <DocumentRow key={doc.id} doc={doc} onUploadRevision={handleUploadRevision} />
                                    ))
                                ) : (
                                    <div className="text-center py-16">
                                        <h3 className="text-2xl font-bold text-[#1a3d2e]">No Documents Found</h3>
                                        <p className="text-[#4a6850] mt-2">You have not uploaded any documents yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {showUploadModal && docToRevise && (
                <UploadModal 
                    document={docToRevise}
                    onClose={() => setShowUploadModal(false)}
                    onUpload={handleUploadFile}
                />
            )}

            {showAddModal && (
                <AddDocumentModal
                    assets={assets}
                    uploading={uploading}
                    uploadError={uploadError}
                    setUploadError={setUploadError}
                    onClose={() => setShowAddModal(false)}
                    onUpload={handleUploadFile}
                />
            )}
        </div>
    );
}