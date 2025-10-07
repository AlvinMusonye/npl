import React, { useState } from 'react';
import { MessageSquare, CheckCircle, XCircle, Send, DollarSign, TrendingUp, Calendar, User, ArrowLeftRight } from 'lucide-react';

const OffersChatPage = ({ setView }) => {
    const [selectedOffer, setSelectedOffer] = useState(null);
  const [message, setMessage] = useState('');
  const [showCounterOffer, setShowCounterOffer] = useState(false);
  const [counterOfferData, setCounterOfferData] = useState({
    offer_amount_kes: '',
    proposed_interest_rate: '',
    borrower_comment: ''
  });

  const offers = [
    {
      id: 1,
      asset_title: 'Toyota Prado 2018',
      asset_id: 1,
      financier_name: 'Kenya Credit Bank',
      offer_amount_kes: 900000,
      proposed_interest_rate: 18.5,
      loan_term_months: 24,
      status: 'PENDING',
      created_at: '2024-10-05',
      financier_comment: 'We are pleased to offer you relief financing for your vehicle. Our terms are competitive and flexible.',
      messages: [
        {
          id: 1,
          sender: 'financier',
          text: 'Hello, we have reviewed your asset and would like to make an offer.',
          timestamp: '2024-10-05 10:30'
        },
        {
          id: 2,
          sender: 'borrower',
          text: 'Thank you for the offer. Could you provide more details about the repayment terms?',
          timestamp: '2024-10-05 11:15'
        },
        {
          id: 3,
          sender: 'financier',
          text: 'Certainly! The repayment will be structured over 24 months with flexible payment options.',
          timestamp: '2024-10-05 14:20'
        }
      ]
    },
    {
      id: 2,
      asset_title: '4BR House in Karen',
      asset_id: 2,
      financier_name: 'Prime Finance Ltd',
      offer_amount_kes: 4800000,
      proposed_interest_rate: 16.0,
      loan_term_months: 36,
      status: 'COUNTERED',
      created_at: '2024-10-03',
      financier_comment: 'Excellent property. We can offer favorable terms for this prime location.',
      messages: [
        {
          id: 1,
          sender: 'financier',
          text: 'We are interested in financing your property.',
          timestamp: '2024-10-03 09:00'
        },
        {
          id: 2,
          sender: 'borrower',
          text: 'I appreciate the offer, but I was hoping for the full relief amount. Can we negotiate?',
          timestamp: '2024-10-03 15:30'
        }
      ]
    },
    {
      id: 3,
      asset_title: 'Agricultural Land 5.5 Acres',
      asset_id: 3,
      financier_name: 'Agricultural Finance Corp',
      offer_amount_kes: 1625000,
      proposed_interest_rate: 15.5,
      loan_term_months: 48,
      status: 'PENDING',
      created_at: '2024-10-02',
      financier_comment: 'We specialize in agricultural financing and can offer you competitive rates.',
      messages: [
        {
          id: 1,
          sender: 'financier',
          text: 'Your land meets our criteria. We would like to proceed with this offer.',
          timestamp: '2024-10-02 13:45'
        }
      ]
    },
    {
      id: 4,
      asset_title: 'Toyota Prado 2018',
      asset_id: 1,
      financier_name: 'Swift Credit Solutions',
      offer_amount_kes: 850000,
      proposed_interest_rate: 19.0,
      loan_term_months: 18,
      status: 'DECLINED',
      created_at: '2024-10-01',
      financier_comment: 'Quick approval process with minimal paperwork.',
      messages: [
        {
          id: 1,
          sender: 'financier',
          text: 'We can fast-track your application.',
          timestamp: '2024-10-01 16:20'
        },
        {
          id: 2,
          sender: 'borrower',
          text: 'Thank you, but I have received better offers.',
          timestamp: '2024-10-02 09:00'
        }
      ]
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { icon: MessageSquare, text: 'Pending Review', color: 'bg-yellow-500/30 border-yellow-500/40 text-yellow-800' },
      COUNTERED: { icon: ArrowLeftRight, text: 'Counter Offer Sent', color: 'bg-blue-500/30 border-blue-500/40 text-blue-800' },
      ACCEPTED: { icon: CheckCircle, text: 'Accepted', color: 'bg-green-500/30 border-green-500/40 text-green-800' },
      DECLINED: { icon: XCircle, text: 'Declined', color: 'bg-red-500/30 border-red-500/40 text-red-800' }
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border ${config.color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold">{config.text}</span>
      </div>
    );
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message logic here
      setMessage('');
    }
  };

  const handleAcceptOffer = (offerId) => {
    // API call: POST /api/v1/assets/offers/{offer_id}/accept/
    console.log('Accepting offer:', offerId);
  };

  const handleDeclineOffer = (offerId) => {
    // API call: POST /api/v1/assets/offers/{offer_id}/decline/
    console.log('Declining offer:', offerId);
  };

  const handleCounterOffer = () => {
    // API call: PATCH /api/v1/assets/offers/{offer_id}/counter/
    console.log('Counter offer:', counterOfferData);
    setShowCounterOffer(false);
  };

  const OfferCard = ({ offer }) => (
    <button
      onClick={() => setSelectedOffer(offer)}
      className={`w-full text-left relative overflow-hidden rounded-2xl p-4 backdrop-blur-xl border transition-all duration-300 ${
        selectedOffer?.id === offer.id
          ? 'bg-white/40 border-white/60 shadow-xl'
          : 'bg-white/20 border-white/30 hover:bg-white/30'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-800 mb-1">{offer.asset_title}</h3>
            <p className="text-sm text-gray-600">{offer.financier_name}</p>
          </div>
          {getStatusBadge(offer.status)}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Offer Amount:</span>
            <span className="font-bold text-gray-800">KSh {offer.offer_amount_kes.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Interest Rate:</span>
            <span className="font-bold text-gray-800">{offer.proposed_interest_rate}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Term:</span>
            <span className="font-bold text-gray-800">{offer.loan_term_months} months</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/30">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{offer.created_at}</span>
          </div>
        </div>
      </div>
    </button>
  );

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
                <button onClick={() => setView('list')} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  List Asset
                </button>                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">My Assets</a>
                <a href="#" className="text-gray-900 font-bold border-b-2 border-gray-800">Offers</a>
              </nav>
            </div>
            <button className="px-6 py-2.5 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl">
              Profile
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Offers & Messages</h2>
          <p className="text-xl text-gray-700">Review offers and communicate with financiers</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="text-sm text-gray-600 mb-1">Total Offers</div>
              <div className="text-3xl font-bold text-gray-800">{offers.length}</div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="text-sm text-gray-600 mb-1">Pending</div>
              <div className="text-3xl font-bold text-yellow-800">
                {offers.filter(o => o.status === 'PENDING').length}
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="text-sm text-gray-600 mb-1">Countered</div>
              <div className="text-3xl font-bold text-blue-800">
                {offers.filter(o => o.status === 'COUNTERED').length}
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="text-sm text-gray-600 mb-1">Accepted</div>
              <div className="text-3xl font-bold text-green-800">
                {offers.filter(o => o.status === 'ACCEPTED').length}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Split View */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Offers List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">All Offers</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {offers.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </div>

          {/* Chat & Details */}
          <div className="lg:col-span-2">
            {selectedOffer ? (
              <div className="relative overflow-hidden rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none" />
                
                <div className="relative">
                  {/* Offer Header */}
                  <div className="p-6 border-b border-white/30">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedOffer.asset_title}</h3>
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="w-4 h-4" />
                          <span>{selectedOffer.financier_name}</span>
                        </div>
                      </div>
                      {getStatusBadge(selectedOffer.status)}
                    </div>

                    {/* Offer Details */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/30">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-xs">Offer Amount</span>
                        </div>
                        <div className="text-xl font-bold text-gray-800">
                          KSh {selectedOffer.offer_amount_kes.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/30">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-xs">Interest Rate</span>
                        </div>
                        <div className="text-xl font-bold text-gray-800">
                          {selectedOffer.proposed_interest_rate}%
                        </div>
                      </div>
                      <div className="p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/30">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs">Loan Term</span>
                        </div>
                        <div className="text-xl font-bold text-gray-800">
                          {selectedOffer.loan_term_months} months
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
                      <p className="text-sm text-gray-700">{selectedOffer.financier_comment}</p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-6 max-h-96 overflow-y-auto">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Messages</h4>
                    <div className="space-y-4">
                      {selectedOffer.messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'borrower' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-md border ${
                              msg.sender === 'borrower'
                                ? 'bg-[#c8d5c0]/40 border-[#c8d5c0]/50'
                                : 'bg-white/40 border-white/50'
                            }`}
                          >
                            <p className="text-gray-800 mb-1">{msg.text}</p>
                            <span className="text-xs text-gray-600">{msg.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  {selectedOffer.status !== 'DECLINED' && selectedOffer.status !== 'ACCEPTED' && (
                    <div className="p-6 border-t border-white/30">
                      <div className="flex gap-3 mb-4">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-gray-800 placeholder-gray-600 outline-none focus:border-white/60 transition-all"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="px-6 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAcceptOffer(selectedOffer.id)}
                          className="flex-1 px-6 py-3 bg-green-500/40 backdrop-blur-md hover:bg-green-500/60 text-green-900 font-bold rounded-xl border border-green-500/40 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Accept Offer
                        </button>
                        <button
                          onClick={() => setShowCounterOffer(true)}
                          className="flex-1 px-6 py-3 bg-blue-500/40 backdrop-blur-md hover:bg-blue-500/60 text-blue-900 font-bold rounded-xl border border-blue-500/40 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <ArrowLeftRight className="w-5 h-5" />
                          Counter Offer
                        </button>
                        <button
                          onClick={() => handleDeclineOffer(selectedOffer.id)}
                          className="flex-1 px-6 py-3 bg-red-500/40 backdrop-blur-md hover:bg-red-500/60 text-red-900 font-bold rounded-xl border border-red-500/40 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          Decline
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Select an Offer</h3>
                <p className="text-gray-600">Choose an offer from the list to view details and chat with the financier</p>
              </div>
            )}
          </div>
        </div>

        {/* Counter Offer Modal */}
        {showCounterOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Make Counter Offer</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Counter Amount (KSh)</label>
                  <input
                    type="number"
                    value={counterOfferData.offer_amount_kes}
                    onChange={(e) => setCounterOfferData({ ...counterOfferData, offer_amount_kes: e.target.value })}
                    placeholder="900000"
                    className="w-full px-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-gray-800 placeholder-gray-600 outline-none focus:border-white/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Proposed Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={counterOfferData.proposed_interest_rate}
                    onChange={(e) => setCounterOfferData({ ...counterOfferData, proposed_interest_rate: e.target.value })}
                    placeholder="17.5"
                    className="w-full px-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-gray-800 placeholder-gray-600 outline-none focus:border-white/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Comment</label>
                  <textarea
                    rows="4"
                    value={counterOfferData.borrower_comment}
                    onChange={(e) => setCounterOfferData({ ...counterOfferData, borrower_comment: e.target.value })}
                    placeholder="Thank you for the offer. I can accept if you can meet the full relief amount at a slightly lower rate..."
                    className="w-full px-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-gray-800 placeholder-gray-600 outline-none focus:border-white/60 transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCounterOffer(false)}
                  className="flex-1 py-3 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCounterOffer}
                  className="flex-1 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Submit Counter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersChatPage;