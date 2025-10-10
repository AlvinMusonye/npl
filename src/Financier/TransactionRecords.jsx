import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { DollarSign, CheckCircle, User, Briefcase, Hash, Type, Info, LogOut } from 'lucide-react';

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

const InputField = ({ icon: Icon, label, name, placeholder, value, onChange, type = "text" }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#1a3d2e]">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4a6850]" />
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-[#1a3d2e] placeholder-[#4a6850]/70 outline-none focus:ring-2 focus:ring-[#6B9071] transition-all"
        />
      </div>
    </div>
);

const SelectField = ({ icon: Icon, label, name, value, onChange, children }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#1a3d2e]">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4a6850]" />
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-[#1a3d2e] outline-none focus:ring-2 focus:ring-[#6B9071] appearance-none"
        >
          {children}
        </select>
      </div>
    </div>
);

const SuccessModal = ({ onClose, transactionId }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
        <GlassCard className="p-12 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
                <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-[#1a3d2e] mb-4">Transaction Recorded!</h3>
                <p className="text-[#4a6850] mb-2">The transaction has been successfully recorded on the platform.</p>
                <p className="text-xs text-[#4a6850]/80 mb-8">ID: {transactionId}</p>
                <button onClick={onClose} className="px-8 py-3 bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-bold rounded-xl">
                    Record Another
                </button>
            </div>
        </GlassCard>
    </div>
);

// =========================================================================
// 3. MAIN TRANSACTION RECORDS PAGE COMPONENT
// =========================================================================

export default function TransactionRecordsPage({ setRole }) {
    const [formData, setFormData] = useState({
        transaction_id: '',
        sender: '',
        receiver: '',
        amount: '',
        currency: 'KES',
        transaction_type: 'OFFER_PAYOUT',
        status: 'COMPLETED',
        related_asset: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [newTxId, setNewTxId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Pre-fill the receiver with the current user's ID from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            setFormData(prev => ({ ...prev, receiver: user.id }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Authentication token not found.');

            const response = await fetch(`${API_BASE_URL}/api/transactions/record/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, amount: formData.amount.toString() }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(JSON.stringify(data) || 'Failed to record transaction.');
            }
            
            setNewTxId(data.transaction_id);
            setShowSuccess(true);
            // Reset form for next entry
            setFormData({
                transaction_id: '', sender: '', receiver: formData.receiver, amount: '',
                currency: 'KES', transaction_type: 'OFFER_PAYOUT', status: 'COMPLETED',
                related_asset: '', description: ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0]">
            {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} transactionId={newTxId} />}
            <div className="flex min-h-screen">
                <ModernSidebar userRole="financier" onLogout={handleLogout} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
                    <GlassCard className="p-6 lg:p-10 w-full">
                        <header className="pb-4 mb-8 border-b border-[#6B9071]/30">
                            <h1 className="text-4xl font-bold text-[#1a3d2e]">Record a Transaction</h1>
                            <p className="mt-2 text-lg text-[#4a6850]">Manually record a financial transaction for historical tracking.</p>
                        </header>

                        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                            <InputField icon={Hash} label="Bank/Payment Reference ID" name="transaction_id" placeholder="e.g., BANK_REF_XYZ123" value={formData.transaction_id} onChange={handleChange} />
                            <InputField icon={User} label="Sender (Borrower's User ID)" name="sender" placeholder="Enter borrower's user UUID" value={formData.sender} onChange={handleChange} />
                            <InputField icon={DollarSign} label="Amount" name="amount" type="number" placeholder="e.g., 2200000" value={formData.amount} onChange={handleChange} />
                            <SelectField icon={DollarSign} label="Currency" name="currency" value={formData.currency} onChange={handleChange}>
                                <option value="KES">KES</option>
                                <option value="USD">USD</option>
                            </SelectField>
                            <SelectField icon={Type} label="Transaction Type" name="transaction_type" value={formData.transaction_type} onChange={handleChange}>
                                <option value="OFFER_PAYOUT">Offer Payout</option>
                                <option value="LOAN_REPAYMENT">Loan Repayment</option>
                                <option value="OTHER">Other</option>
                            </SelectField>
                            <SelectField icon={CheckCircle} label="Status" name="status" value={formData.status} onChange={handleChange}>
                                <option value="COMPLETED">Completed</option>
                                <option value="PENDING">Pending</option>
                                <option value="FAILED">Failed</option>
                            </SelectField>
                            <InputField icon={Briefcase} label="Related Asset ID" name="related_asset" placeholder="Enter asset UUID" value={formData.related_asset} onChange={handleChange} />
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#1a3d2e]">Description</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    placeholder="e.g., Loan repayment from John Doe for asset NBO/123."
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-[#1a3d2e] placeholder-[#4a6850]/70 outline-none focus:ring-2 focus:ring-[#6B9071] transition-all"
                                ></textarea>
                            </div>

                            {error && <div className="text-center p-3 text-red-700 bg-red-100/50 rounded-xl">{error}</div>}

                            <div className="pt-4">
                                <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-bold rounded-xl text-lg disabled:opacity-50">
                                    {loading ? 'Recording...' : 'Record Transaction'}
                                </button>
                            </div>
                        </form>
                    </GlassCard>
                </main>
            </div>
        </div>
    );
}