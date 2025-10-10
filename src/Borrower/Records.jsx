import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { DollarSign, CheckCircle, RefreshCw, AlertCircle, LogOut, ArrowDown, ArrowUp, X, Eye } from 'lucide-react';

// =========================================================================
// 1. CONSTANTS & CONFIG
// =========================================================================
const API_BASE_URL = 'http://127.0.0.1:8000';

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

const TransactionStatusBadge = ({ status }) => {
    const statusConfig = {
        'COMPLETED': { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-300' },
        'PENDING': { icon: RefreshCw, color: 'bg-yellow-100 text-yellow-800 border-yellow-300', animate: 'animate-spin' },
        'FAILED': { icon: AlertCircle, color: 'bg-red-100 text-red-800 border-red-300' },
    };
    const config = statusConfig[status] || { icon: CheckCircle, color: 'bg-gray-100 text-gray-800 border-gray-300' };
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color}`}>
        <Icon className={`w-4 h-4 ${config.animate || ''}`} />
        <span className="text-xs font-semibold">{status}</span>
      </div>
    );
};

const TransactionDetailModal = ({ transaction, onClose, isLoading, isOpen }) => {
    if (!transaction && !isLoading) return null;

    const DetailItem = ({ label, value, children }) => (
        <div>
            <p className="text-xs text-[#4a6850] uppercase font-semibold tracking-wider">{label}</p>
            {value && <p className="font-medium text-[#1a3d2e] text-base break-words">{value}</p>}
            {children}
        </div>
    );

    const PartyDetail = ({ title, party }) => (
        <div className="bg-white/30 p-4 rounded-xl border border-white/40">
            <h5 className="font-bold text-base text-[#1a3d2e] mb-2">{title}</h5>
            <div className="space-y-2 text-sm text-[#1a3d2e]">
                <p><strong className="font-semibold text-[#4a6850]">Name:</strong> {`${party?.first_name || ''} ${party?.last_name || ''}`}</p>
                <p><strong className="font-semibold text-[#4a6850]">Email:</strong> {party?.email}</p>
                <p><strong className="font-semibold text-[#4a6850]">Role:</strong> {party?.role}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm" onClick={onClose}>
            <GlassCard className="w-full max-w-2xl p-8 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 transition-colors z-10">
                    <X className="w-6 h-6 text-[#4a6850]" />
                </button>
                <h3 className="text-2xl font-bold text-[#1a3d2e] mb-6">Transaction Details</h3>
                
                {isLoading ? (
                    <div className="text-center p-8 text-[#4a6850]">Loading details...</div>
                ) : transaction && (
                    <div className="space-y-6">
                        {/* Main Info */}
                        <div className="p-4 bg-white/20 rounded-2xl grid grid-cols-2 gap-4 items-center">
                            <div>
                                <p className="text-sm text-[#4a6850]">Amount</p>
                                <p className={`font-bold text-3xl ${transaction.transaction_type === 'LOAN_DISBURSEMENT' ? 'text-green-700' : 'text-red-700'}`}>
                                    {transaction.transaction_type === 'LOAN_DISBURSEMENT' ? '+' : '-'} {transaction.currency} {Number(transaction.amount).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[#4a6850] mb-1">Status</p>
                                <TransactionStatusBadge status={transaction.status} />
                            </div>
                        </div>

                        {/* Core Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <DetailItem label="Transaction ID" value={transaction.transaction_id} />
                            <DetailItem label="Type" value={transaction.transaction_type?.replace(/_/g, ' ')} />
                            <DetailItem label="Date Created" value={new Date(transaction.created_at).toLocaleString()} />
                            <DetailItem label="Last Updated" value={new Date(transaction.updated_at).toLocaleString()} />
                            <div className="md:col-span-2">
                                <DetailItem label="Description" value={transaction.description} />
                            </div>
                        </div>

                        {/* Parties */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {transaction.sender && <PartyDetail title="Sender" party={transaction.sender} />}
                            {transaction.receiver && <PartyDetail title="Receiver" party={transaction.receiver} />}
                        </div>

                        {/* Related Info */}
                        {transaction.related_asset && <div className="bg-white/20 p-4 rounded-xl">
                            <h5 className="font-bold text-base text-[#1a3d2e] mb-2">Related Asset</h5>
                            <p className="text-sm"><strong className="font-semibold text-[#4a6850]">Identifier:</strong> {transaction.related_asset.primary_identifier}</p>
                            <p className="text-sm"><strong className="font-semibold text-[#4a6850]">Type:</strong> {transaction.related_asset.collateral_type}</p>
                        </div>}
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

const TransactionRow = ({ tx }) => {
    const isDisbursement = tx.transaction_type === 'DISBURSEMENT' || tx.transaction_type === 'LOAN_DISBURSEMENT';
    const Icon = isDisbursement ? ArrowDown : ArrowUp;
    const iconColor = isDisbursement ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
    const amountSign = isDisbursement ? '+' : '-';

    return (
        <div className="p-4 bg-white/30 rounded-2xl border border-white/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColor}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-[#1a3d2e]">{tx.transaction_type.replace('_', ' ')}</h4>
                    <p className="text-sm text-[#4a6850]">{tx.description}</p>
                    <p className="text-xs text-[#4a6850]/70 mt-1">ID: {tx.transaction_id}</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className={`text-lg font-bold ${isDisbursement ? 'text-green-700' : 'text-red-700'}`}>
                        {amountSign} KSh {Number(tx.amount_kes || tx.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-[#4a6850]">{new Date(tx.created_at).toLocaleString()}</p>
                </div>
                <TransactionStatusBadge status={tx.status} />
            </div>
        </div>
    );
};

// =========================================================================
// 3. MAIN TRANSACTIONS PAGE COMPONENT
// =========================================================================

export default function MyTransactionsPage({ setRole }) {
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) throw new Error('Authentication token not found.');

                const response = await fetch(`${API_BASE_URL}/api/transactions/my_history/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch transaction history.');
                const data = await response.json();
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const handleViewDetails = async (txId) => {
        setIsModalOpen(true);
        setDetailLoading(true);
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Authentication token not found.');

            const response = await fetch(`${API_BASE_URL}/api/transactions/my_history/${txId}/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (!response.ok) throw new Error('Failed to fetch transaction details.');
            const data = await response.json();
            setSelectedTransaction(data);
        } catch (err) {
            setError(err.message); // Or a separate error state for the modal
            setSelectedTransaction(null);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null); // Clear data to ensure modal hides
    };

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0]">
            <div className="flex min-h-screen">
                <ModernSidebar userRole="borrower" onLogout={handleLogout} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
                    <GlassCard className="p-6 lg:p-10 w-full min-h-[85vh]">
                        <header className="pb-4 mb-8 border-b border-[#6B9071]/30">
                            <h1 className="text-4xl font-bold text-[#1a3d2e]">My Transactions</h1>
                            <p className="mt-2 text-lg text-[#4a6850]">A complete history of your financial activities on the platform.</p>
                        </header>

                        {loading && <div className="text-center p-8 text-[#4a6850]">Loading transaction history...</div>}
                        {error && <div className="text-center p-8 text-red-600 bg-red-100/50 rounded-2xl">{error}</div>}
                        
                        {!loading && !error && (
                            <div className="space-y-4">
                                {transactions.length > 0 ? (
                                    transactions.map(tx => (
                                        <div key={tx.transaction_id} onClick={() => handleViewDetails(tx.transaction_id)} className="cursor-pointer hover:scale-[1.02] transition-transform duration-200">
                                            <TransactionRow tx={tx} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16">
                                        <h3 className="text-2xl font-bold text-[#1a3d2e]">No Transactions Found</h3>
                                        <p className="text-[#4a6850] mt-2">You do not have any transaction history yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </GlassCard>
                </main>
            </div>
            {isModalOpen && (
                <TransactionDetailModal
                    transaction={selectedTransaction}
                    isLoading={detailLoading}
                    onClose={handleCloseModal}
                    isOpen={isModalOpen}
                />
            )}
        </div>
    );
}