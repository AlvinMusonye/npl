import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Eye, Check, FileText, User, Calendar, X, AlertTriangle, RefreshCw } from 'lucide-react';
import Notification from '../components/ui/Notification.jsx';

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

const StatusBadge = ({ status }) => {
    const statusStyles = {
      PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      APPROVED: 'bg-green-100 text-green-800 border-green-300',
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

const ActionReasonModal = ({ title, label, onConfirm, onClose, actionText = 'Confirm' }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reason.trim()) {
            onConfirm(reason);
        }
    };

    return (
        <div
            className="fixed inset-0  z-[60] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold text-[#1a3d2e] mb-4">{title}</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="reason-input" className="block text-sm font-semibold text-[#4a6850] mb-2">{label}</label>
                    <textarea
                        id="reason-input"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[#6B9071] outline-none"
                        rows="4"
                        required
                    />
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-white/50 hover:bg-white/80 rounded-xl text-[#4a6850] font-semibold transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-green-600/90 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all">{actionText}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DocumentDetailModal = ({ document, onClose, onApprove, onReject, onRequestRevision, onView, isLoading }) => {
    if (!document) return null;

    const DetailItem = ({ label, value, className = '' }) => (
        <div className={className}>
          <p className="text-xs text-[#4a6850] font-medium">{label}</p>
          <p className="font-semibold text-[#1a3d2e] text-base">{value || 'N/A'}</p>
        </div>
    );

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div></div>
        );
    }

    return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div
            className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-[#1a3d2e]">{document.document_type}</h3>
                    <p className="text-sm text-[#4a6850] mt-1">Doc ID: {document.id}</p>
                    <div className="mt-2">
                        <StatusBadge status={document.status} />
                    </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50 transition-colors">
                    <X className="w-6 h-6 text-[#4a6850]" />
                </button>
            </div>

            <div className="space-y-4 bg-white/40 p-6 rounded-2xl border border-white/50">
                <DetailItem label="User" value={document.user_email} />
                <DetailItem label="Document Type" value={document.document_type_display || document.document_type} />
                <DetailItem label="Uploaded On" value={new Date(document.created_at).toLocaleString()} />
                <DetailItem label="Last Updated" value={new Date(document.updated_at).toLocaleString()} />
                {document.asset && <DetailItem label="Associated Asset" value={document.asset} />}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-white/30">
                <button onClick={() => onView(document.id)} className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/90 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                    <Eye className="w-5 h-5" /> View Document
                </button>
                <button onClick={() => onRequestRevision(document.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/90 hover:bg-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                    <RefreshCw className="w-5 h-5" /> Request Revision
                </button>
                <button onClick={() => onReject(document.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600/90 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                    <X className="w-5 h-5" /> Reject
                </button>
                <button onClick={() => onApprove(document.id)} className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-green-600/90 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                    <Check className="w-5 h-5" /> Approve
                </button>
            </div>
          </div>
        </div>
    );
};

const DocumentCard = ({ doc, onViewDetails }) => (
    <GlassCard onClick={() => onViewDetails(doc)} className="p-6 cursor-pointer group hover:scale-105 hover:shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/50 rounded-xl border-2 border-white/60 shadow-md">
                <FileText className="w-8 h-8 text-[#1a3d2e]" />
            </div>
            <StatusBadge status={doc.status} />
        </div>
        <h3 className="text-lg font-bold text-[#1a3d2e] truncate">{doc.document_type}</h3>
        <div className="mt-4 pt-4 border-t border-white/60 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-[#4a6850]">
                <User size={14} /> <span>{doc.user_email}</span>
            </div>
            <div className="flex items-center gap-2 text-[#4a6850]">
                <Calendar size={14} /> <span>{new Date(doc.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    </GlassCard>
);

export default function DocumentManagement() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [actionModal, setActionModal] = useState({ show: false, type: null, docId: null });

    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const showNotification = (message, type = 'info') => {
        setNotification({ show: true, message, type });
    };

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get(`/api/admin/documents/?status=PENDING_REVIEW`);
                setDocuments(response.data.results || response.data);
            } catch (err) {
                setError(err.response?.data?.detail || err.message || 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, []);

    const handleApprove = async (docId) => {
        try {
            await axiosInstance.patch(`/api/admin/documents/${docId}/approve/`);
            setDocuments(documents.filter(doc => doc.id !== docId));
            setSelectedDocument(null);
            showNotification('Document approved successfully!', 'success');
        } catch (err) {
            console.error("Approval error:", err.response || err);
            showNotification(`Error: ${err.response?.data?.detail || err.message}`, 'error');
        }
    };

    const handleReject = (docId) => {
        setActionModal({ show: true, type: 'reject', docId });
    };

    const onRequestRevision = (docId) => {
        setActionModal({ show: true, type: 'requestRevision', docId });
    };

    const handleActionConfirm = async (reason) => {
        const { type, docId } = actionModal;
        const endpoint = type === 'reject' ? 'reject' : 'request-revision';
        const successMessage = type === 'reject' ? 'Document rejected successfully!' : 'Revision request sent successfully!';
        
        setActionModal({ show: false, type: null, docId: null });
        
        try {
            await axiosInstance.patch(`/api/admin/documents/${docId}/${endpoint}/`, { rejection_reason: reason });
            setDocuments(documents.filter(doc => doc.id !== docId));
            setSelectedDocument(null);
            showNotification(successMessage, 'success');
        } catch (err) {
            showNotification(`Error: ${err.response?.data?.detail || err.message}`, 'error');
        }
    };

    const handleView = async (docId) => {
        try {
            const response = await axiosInstance.get(`/api/admin/documents/${docId}/view/`);
            // Use `view_url` as per the API documentation
            if (response.data.view_url) {
                window.open(response.data.view_url, '_blank');
            } else {
                throw new Error('No viewable URL returned from API.');
            }
        } catch (err) {
            showNotification(`Error: ${err.response?.data?.detail || err.message}`, 'error');
        }
    };

    const handleViewDetails = async (doc) => {
        if (!doc || !doc.id) return;
        setIsDetailLoading(true);
        setSelectedDocument(doc); // Show modal immediately with list data
        try {
            // Fetch full details to update the modal
            const response = await axiosInstance.get(`/api/admin/documents/${doc.id}/`);
            setSelectedDocument(response.data);
        } catch (err) {
            showNotification(`Could not fetch full document details: ${err.message}`, 'error');
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedDocument(null);
    };

    const handleActionCancel = () => {
        setActionModal({ show: false, type: null, docId: null });
    };

    return (
        <>
            {notification.show && (
                <Notification message={notification.message} type={notification.type} onClear={() => setNotification({ show: false, message: '', type: '' })} />
            )}

            <DashboardHeader 
                title="Document Management (Compliance)" 
                subtitle="Review and approve documents awaiting verification." 
            />
            
            {loading && <div className="text-center p-8 text-[#4a6850]">Loading documents...</div>}
            {error && <div className="text-center p-8 text-red-600 bg-red-100/50 rounded-xl">{error}</div>}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {documents.length > 0 ? documents.map(doc => (
                        <DocumentCard key={doc.id} doc={doc} onViewDetails={handleViewDetails} />
                    )) : (
                        <GlassCard className="col-span-full p-10 text-center">
                            <h3 className="text-2xl font-bold text-gray-800">No Documents Found</h3>
                            <p className="text-gray-600 mt-2">There are no documents currently awaiting review.</p>
                        </GlassCard>
                    )}
                </div>
            )}

            {selectedDocument && (
                <DocumentDetailModal 
                    document={selectedDocument}
                    onClose={handleCloseModal}
                    isLoading={isDetailLoading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRequestRevision={onRequestRevision}
                    onView={handleView}
                />
            )}

            {actionModal.show && (
                <ActionReasonModal
                    title={actionModal.type === 'reject' ? 'Reject Document' : 'Request Document Revision'}
                    label={actionModal.type === 'reject' ? 'Please provide a reason for rejection:' : 'Please provide feedback for the revision:'}
                    actionText={actionModal.type === 'reject' ? 'Reject' : 'Request Revision'}
                    onConfirm={handleActionConfirm}
                    onClose={handleActionCancel}
                />
            )}
        </>
    );
}