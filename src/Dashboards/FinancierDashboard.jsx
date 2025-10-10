// import React, { useState, useMemo, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Menu, Search, Briefcase, User, TrendingUp, DollarSign, Clock, CheckCircle, XCircle, ArrowRight, LogOut } from 'lucide-react';


// // --- DUMMY DATA ---
// const dummyData = {

//   accountStatus: "Active", // "Pending Approval" | "Active"
//   portfolio: {
//     deployed: 12500000,
//     returns: 1450000,
//     yield: 11.6,
//   },
//   insights: {
//     upcomingRepayments: 185000,
//     pendingOffers: 7,
//   },
//   assets: [
//     { id: 'AS001', type: 'Real Estate', location: 'Lagos, NG', debt: 450000, return: 14.5, risk: 'B' },
//     { id: 'AS002', type: 'Vehicle', location: 'Nairobi, KE', debt: 12000, return: 18.0, risk: 'C' },
//     { id: 'AS003', type: 'Inventory', location: 'Accra, GH', debt: 75000, return: 12.0, risk: 'A' },
//     { id: 'AS004', type: 'Real Estate', location: 'Cairo, EG', debt: 1200000, return: 9.5, risk: 'A' },
//   ],
//   offers: [
//     { id: 'OFR101', assetId: 'AS001', amount: 400000, rate: 11.0, status: 'Pending Review', date: '2024-10-01' },
//     { id: 'OFR102', assetId: 'AS003', amount: 75000, rate: 12.5, status: 'Accepted', date: '2024-09-28' },
//     { id: 'OFR103', assetId: 'AS004', amount: 1200000, rate: 9.0, status: 'Rejected', date: '2024-09-25' },
//   ],
//   activeInvestments: [
//     { id: 'INV501', assetId: 'AS003', financed: 75000, rate: 12.5, tenure: 10, nextRepayment: '2024-11-01', progress: 30 },
//   ]
// };

// // --- COLOR CONSTANTS (Based on the image) ---
// const COLORS = {
//   BG_PRIMARY: '#E6F4E6', // Very light mint green
//   TEXT_DARK: '#283A28',  // Very dark forest green
//   CTA_GREEN: '#5C9B5C',  // Rich, mid-tone green
//   ACCENT_GREEN: '#B8E2B8', // Soft green (for borders/secondary bg)
//   DATA_HIGHLIGHT: '#7CC47C', // Medium green
//   CARD_WHITE: '#FFFFFF',
// };

// // --- UTILITY COMPONENTS ---

// const NavItem = ({ view, setView, icon: Icon, label }) => (
//   <button
//     onClick={() => setView(view)}
//     className={`flex items-center w-full py-3 px-6 rounded-lg transition duration-200 text-left 
//       ${view === label 
//         ? `bg-[${COLORS.CTA_GREEN}] text-white font-semibold shadow-md` 
//         : `text-[${COLORS.TEXT_DARK}] hover:bg-[${COLORS.ACCENT_GREEN}]/50`}`
//     }
//   >
//     <Icon size={20} className="mr-3" />
//     {label}
//   </button>
// );

// const MetricCard = ({ title, value, unit = '', icon: Icon, highlightColor = COLORS.TEXT_DARK, action, onClick }) => (
//   <div 
//     className={`p-5 bg-[${COLORS.CARD_WHITE}] rounded-xl shadow-lg transition duration-300 hover:shadow-xl border border-[${COLORS.ACCENT_GREEN}]/50 ${onClick ? 'cursor-pointer' : ''}`}
//     onClick={onClick}
//   >
//     <div className="flex justify-between items-start">
//       <h3 className={`text-sm font-medium text-gray-500 uppercase`}>{title}</h3>
//       <Icon size={24} className={`text-[${COLORS.CTA_GREEN}]`} />
//     </div>
//     <p className={`mt-2 text-3xl font-bold text-[${highlightColor}]`}>
//       {value}
//       <span className={`text-xl font-semibold ml-1 text-[${COLORS.TEXT_DARK}]`}>{unit}</span>
//     </p>
//     {action && <p className="mt-4 text-sm text-gray-500 cursor-pointer hover:underline flex items-center">{action} <ArrowRight size={14} className="ml-1"/></p>}
//   </div>
// );

// const StatusBadge = ({ status, isIconOnly = false }) => {
//   let colorClass, text;
//   let Icon = CheckCircle;
//   switch (status) {
//     case 'Active':
//     case 'Accepted':
//     case 'Approved':
//         colorClass = `bg-green-100 text-green-800 border border-green-300`;
//         Icon = CheckCircle;
//       text = 'Active';
//       break;
//     case 'Pending Approval':
//     case 'Pending Review':
//         colorClass = `bg-yellow-100 text-yellow-800 border border-yellow-300`;
//         Icon = Clock;
//       text = 'Pending';
//       break;
//     case 'Rejected':
//         colorClass = `bg-red-100 text-red-800 border border-red-300`;
//         Icon = XCircle;
//       text = 'Rejected';
//       break;
//     default:
//         colorClass = `bg-gray-100 text-gray-800 border border-gray-300`;
//         text = status;
//   }
//   return (
//     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
//       <Icon size={14} className={isIconOnly ? "" : "mr-1"} />
//       {!isIconOnly && text}
//     </span>
//   );
// };


// // --- PAGE COMPONENTS ---

// // 1. Financier Landing Dashboard 🚀
// const DashboardView = ({ setView }) => {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//       const userData = localStorage.getItem('user');
//       if (userData) {
//           setUser(JSON.parse(userData));
//       }
//     }, []);
  
//     const { portfolio, insights, accountStatus } = dummyData;
  
  
//   const StatusComponent = () => (
//     <div className={`flex items-center p-4 rounded-xl border border-[${COLORS.ACCENT_GREEN}] bg-[${COLORS.CARD_WHITE}] shadow-md mb-8`}>
//       <StatusBadge status={accountStatus} />
//       <span className={`ml-3 text-lg font-medium text-[${COLORS.TEXT_DARK}]`}>
//         Your account status is: <span className="font-bold">{accountStatus}</span>.
//         {accountStatus === 'Active' && " You can now deploy capital."}
//         {accountStatus === 'Pending Approval' && " Please check your Profile for outstanding KYC."}
//       </span>
//     </div>
//   );

//   return (
//     <div className="space-y-8">
//       <h1 className={`text-4xl font-extrabold text-[${COLORS.TEXT_DARK}]`}>Welcome back, {user ? user.first_name : 'Financier'}!</h1>
//       <StatusComponent />

//       {/* Portfolio Summary */}
//       <h2 className={`text-2xl font-semibold text-[${COLORS.TEXT_DARK}]`}>Portfolio Summary</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <MetricCard
//           title="Capital Deployed"
//           value={`$${(portfolio.deployed / 1000000).toFixed(1)}M`}
//           icon={Briefcase}
//           highlightColor={COLORS.CTA_GREEN}
//         />
//         <MetricCard
//           title="Total Returns Earned"
//           value={`$${(portfolio.returns / 1000).toFixed(0)}k`}
//           icon={DollarSign}
//           highlightColor={COLORS.DATA_HIGHLIGHT}
//         />
//         <MetricCard
//           title="Current Yield (Annualized)"
//           value={`${portfolio.yield.toFixed(1)}`}
//           unit="%"
//           icon={TrendingUp}
//           highlightColor={COLORS.DATA_HIGHLIGHT}
//         />
//       </div>

//       {/* Actionable Insights */}
//       <h2 className={`text-2xl font-semibold text-[${COLORS.TEXT_DARK}] mt-8`}>Actionable Insights</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <MetricCard
//           title="Upcoming Repayments"
//           value={`$${insights.upcomingRepayments.toLocaleString()}`}
//           unit=" (Next 7 days)"
//           icon={Clock}
//           highlightColor={COLORS.TEXT_DARK}
//         />
//         <MetricCard
//           title="Pending Offers"
//           value={insights.pendingOffers}
//           unit=" awaiting response"
//           icon={Search}
//           highlightColor={insights.pendingOffers > 0 ? COLORS.CTA_GREEN : COLORS.TEXT_DARK}
//           action="Review My Offers"
//           onClick={() => setView('My Offers')}
//         />
//       </div>

//       {/* Quick Links */}
//       <h2 className={`text-2xl font-semibold text-[${COLORS.TEXT_DARK}] mt-8`}>Quick Links</h2>
//       <div className="flex flex-col sm:flex-row gap-4">
//         <button
//           onClick={() => setView('Marketplace')}
//           className={`px-6 py-3 rounded-xl bg-[${COLORS.CTA_GREEN}] text-white font-semibold shadow-md hover:bg-opacity-90 transition duration-150 flex items-center`}
//         >
//           <Search size={20} className="mr-2" />
//           Marketplace Listings
//         </button>
//         <a
//           href="/api/assets/public_listings/" // Placeholder URL as per prompt
//           className={`px-6 py-3 rounded-xl border border-[${COLORS.CTA_GREEN}] text-[${COLORS.CTA_GREEN}] font-semibold shadow-sm hover:bg-[${COLORS.ACCENT_GREEN}]/30 transition duration-150 flex items-center`}
//         >
//           My Offers URL <ArrowRight size={16} className="ml-2" />
//         </a>
//       </div>
//     </div>
//   );
// };

// // 2. Marketplace & Due Diligence Dashboard 🔍
// const MarketplaceView = () => {
//   const [filters, setFilters] = useState({ type: '', risk: '', search: '' });
//   const [showDetail, setShowDetail] = useState(null); // stores the asset object

//   const filteredAssets = useMemo(() => {
//     return dummyData.assets.filter(asset => {
//       if (filters.search && !asset.id.toLowerCase().includes(filters.search.toLowerCase()) && !asset.location.toLowerCase().includes(filters.search.toLowerCase())) return false;
//       if (filters.type && asset.type !== filters.type) return false;
//       if (filters.risk && asset.risk !== filters.risk) return false;
//       return true;
//     });
//   }, [filters]);

//   const RiskBadge = ({ risk }) => (
//     <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${risk === 'A' ? 'bg-green-100 text-green-800 border-green-300' : risk === 'B' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
//       {risk}
//     </span>
//   );

//   const OfferSubmissionForm = ({ asset }) => {
//     const [offer, setOffer] = useState({ amount: '', rate: '', tenure: '', message: '' });
//     const handleSubmit = (e) => {
//       e.preventDefault();
//       // POST /api/offers/ simulation
//       console.log('Submitting offer:', { ...offer, assetId: asset.id });
//       // Using custom confirmation box instead of alert
//       const confirmElement = document.getElementById('custom-confirm-modal');
//       const confirmMessageElement = document.getElementById('custom-confirm-message');
      
//       if (confirmElement && confirmMessageElement) {
//         confirmMessageElement.innerHTML = `Offer submitted for Asset ${asset.id}. (Check console for details)`;
//         confirmElement.classList.remove('hidden');
//         setTimeout(() => {
//           confirmElement.classList.add('hidden');
//           setShowDetail(null);
//         }, 2000); // Hide after 2 seconds
//       } else {
//         setShowDetail(null);
//       }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="mt-6 p-4 border border-[${COLORS.ACCENT_GREEN}]/50 rounded-lg bg-white/50">
//         <h3 className={`text-xl font-bold text-[${COLORS.TEXT_DARK}] mb-4`}>Offer Submission</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="number"
//             placeholder="Offer Amount ($)"
//             value={offer.amount}
//             onChange={(e) => setOffer({ ...offer, amount: e.target.value })}
//             required
//             className={`p-3 border border-[${COLORS.ACCENT_GREEN}] rounded-lg focus:ring-2 focus:ring-[${COLORS.CTA_GREEN}]`}
//           />
//           <input
//             type="number"
//             placeholder="Proposed Rate (%)"
//             step="0.1"
//             value={offer.rate}
//             onChange={(e) => setOffer({ ...offer, rate: e.target.value })}
//             required
//             className={`p-3 border border-[${COLORS.ACCENT_GREEN}] rounded-lg focus:ring-2 focus:ring-[${COLORS.CTA_GREEN}]`}
//           />
//         </div>
//         <textarea
//           placeholder="Message for Borrower/Lender (Optional)"
//           rows="3"
//           value={offer.message}
//           onChange={(e) => setOffer({ ...offer, message: e.target.value })}
//           className={`mt-4 w-full p-3 border border-[${COLORS.ACCENT_GREEN}] rounded-lg focus:ring-2 focus:ring-[${COLORS.CTA_GREEN}]`}
//         />
//         <button
//           type="submit"
//           className={`mt-4 w-full px-6 py-3 rounded-xl bg-[${COLORS.CTA_GREEN}] text-white font-semibold shadow-lg hover:bg-opacity-90 transition duration-150`}
//         >
//           Submit Formal Offer
//         </button>
//       </form>
//     );
//   };

//   const AssetDetailModal = ({ asset, onClose }) => (
//     <div className="fixed inset-0 bg-[${COLORS.TEXT_DARK}]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <div className={`bg-[${COLORS.CARD_WHITE}] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl`}>
//         <div className="flex justify-between items-start border-b pb-4 mb-4">
//           <h2 className={`text-3xl font-bold text-[${COLORS.TEXT_DARK}]`}>Asset Listing: {asset.id}</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-red-600 transition"><XCircle size={28} /></button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <MetricCard title="Asset Type" value={asset.type} unit="" icon={Briefcase} highlightColor={COLORS.TEXT_DARK} />
//           <MetricCard title="Location" value={asset.location} unit="" icon={TrendingUp} highlightColor={COLORS.TEXT_DARK} />
//           <MetricCard title="Risk Score" value={asset.risk} unit="" icon={DollarSign} highlightColor={asset.risk === 'A' ? COLORS.DATA_HIGHLIGHT : COLORS.TEXT_DARK} />
//         </div>

//         <div className="space-y-4">
//           <p className={`text-lg text-[${COLORS.TEXT_DARK}]`}>
//             <strong>Valuation Report Summary:</strong> The asset (a multi-unit residential property) was appraised at <strong>$550,000</strong>.
//             The outstanding debt of <strong>$450,000</strong> represents an <strong>81.8%</strong> Loan-to-Value (LTV), making it a potentially attractive low-risk opportunity.
//           </p>

//           <p className="text-md text-gray-700 border-l-4 border-gray-400 pl-4 py-2">
//             <strong>Borrower Profile (Anonymized):</strong> Stable income history, first-time distress due to temporary liquidity issue.
//             Terms requested: <strong>12.5%</strong> interest, 48-month tenure.
//           </p>

//           <h3 className={`text-2xl font-semibold text-[${COLORS.TEXT_DARK}] mt-6`}>Verified Documents</h3>
//           <div className="flex gap-4">
//             <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 underline">Lien Document (PDF)</a>
//             <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 underline">Appraisal Report (PDF)</a>
//           </div>
//         </div>

//         <OfferSubmissionForm asset={asset} />
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex flex-col md:flex-row h-full">
//       {/* Filters/Search (Left Sidebar) */}
//       <div className={`w-full md:w-64 p-6 bg-[${COLORS.BG_PRIMARY}] border-r border-[${COLORS.ACCENT_GREEN}] md:sticky top-0 h-full`}>
//         <h2 className={`text-xl font-bold text-[${COLORS.TEXT_DARK}] mb-4 flex items-center`}>
//           <Search size={20} className="mr-2" /> Investment Filters
//         </h2>
//         <input
//           type="text"
//           placeholder="Search ID or Location..."
//           value={filters.search}
//           onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//           className={`w-full p-2 mb-4 rounded-lg border border-[${COLORS.ACCENT_GREEN}] focus:ring-2 focus:ring-[${COLORS.CTA_GREEN}]`}
//         />

//         {['Asset Type', 'Risk Score'].map(filterName => (
//           <div key={filterName} className="mb-4">
//             <label className={`block text-sm font-semibold mb-1 text-[${COLORS.TEXT_DARK}]`}>{filterName}</label>
//             <select
//               value={filters[filterName.split(' ')[0].toLowerCase()]}
//               onChange={(e) => setFilters({ ...filters, [filterName.split(' ')[0].toLowerCase()]: e.target.value })}
//               className={`w-full p-2 rounded-lg border border-[${COLORS.ACCENT_GREEN}] focus:ring-2 focus:ring-[${COLORS.CTA_GREEN}] bg-white`}
//             >
//               <option value="">All {filterName}s</option>
//               {filterName === 'Asset Type' && ['Real Estate', 'Vehicle', 'Inventory'].map(type => <option key={type} value={type}>{type}</option>)}
//               {filterName === 'Risk Score' && ['A', 'B', 'C', 'D'].map(risk => <option key={risk} value={risk}>{risk}</option>)}
//             </select>
//           </div>
//         ))}

//         <p className="text-xs text-gray-500 mt-6">Outstanding Debt & Expected Return range filters not implemented (visual placeholder).</p>
//       </div>

//       {/* Asset Listings View (Main Area) */}
//       <div className="flex-1 p-6">
//         <h1 className={`text-3xl font-extrabold text-[${COLORS.TEXT_DARK}] mb-6`}>Public Asset Listings ({filteredAssets.length})</h1>
//         <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className={`bg-[${COLORS.BG_PRIMARY}]`}>
//               <tr>
//                 {['Asset ID', 'Type', 'Location', 'Debt', 'Return', 'Risk', 'Action'].map(header => (
//                   <th key={header} className={`px-6 py-3 text-left text-xs font-medium text-[${COLORS.TEXT_DARK}] uppercase tracking-wider`}>
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredAssets.length > 0 ? filteredAssets.map((asset) => (
//                 <tr key={asset.id} className="hover:bg-gray-50 transition duration-150 cursor-pointer">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.type}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.location}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">${asset.debt.toLocaleString()}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[${COLORS.DATA_HIGHLIGHT}]">{asset.return.toFixed(1)}%</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm"><RiskBadge risk={asset.risk} /></td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       onClick={() => setShowDetail(asset)}
//                       className={`text-[${COLORS.CTA_GREEN}] hover:text-opacity-80 font-semibold transition`}
//                     >
//                       Due Diligence
//                     </button>
//                   </td>
//                 </tr>
//               )) : (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-12 text-center text-gray-500 text-lg">No assets match your current filters.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showDetail && <AssetDetailModal asset={showDetail} onClose={() => setShowDetail(null)} />}
//     </div>
//   );
// };

// // 3. My Offers & Commitments Dashboard 🤝
// const MyOffersView = () => {
//   const [activeTab, setActiveTab] = useState('Pending Offers'); // 'Pending Offers' | 'Active Investments'

//   const OffersTable = ({ data }) => (
//     <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className={`bg-[${COLORS.BG_PRIMARY}]`}>
//           <tr>
//             {['Asset ID', 'My Offer Amount', 'Proposed Rate', 'Status', 'Date Offered', 'Action'].map(header => (
//               <th key={header} className={`px-6 py-3 text-left text-xs font-medium text-[${COLORS.TEXT_DARK}] uppercase tracking-wider`}>
//                 {header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {data.map((offer) => (
//             <tr key={offer.id} className="hover:bg-gray-50 transition duration-150">
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.assetId}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">${offer.amount.toLocaleString()}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[${COLORS.DATA_HIGHLIGHT}]">{offer.rate.toFixed(1)}%</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={offer.status} /></td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.date}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                 {offer.status === 'Accepted' ? (
//                   <button
//                     onClick={() => {
//                         const confirmElement = document.getElementById('custom-confirm-modal');
//                         const confirmMessageElement = document.getElementById('custom-confirm-message');
//                         if (confirmElement && confirmMessageElement) {
//                           confirmMessageElement.innerHTML = `Initiating funding for ${offer.assetId}. Redirecting to Escrow...`;
//                           confirmElement.classList.remove('hidden');
//                           setTimeout(() => {
//                             confirmElement.classList.add('hidden');
//                           }, 2000);
//                         }
//                     }}
//                     className={`text-white bg-[${COLORS.CTA_GREEN}] px-3 py-1 rounded-lg hover:bg-opacity-90 transition`}
//                   >
//                     Fund Now
//                   </button>
//                 ) : (
//                   <button className="text-gray-500 hover:text-gray-700 transition">View Details</button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   const InvestmentsTable = ({ data }) => (
//     <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className={`bg-[${COLORS.BG_PRIMARY}]`}>
//           <tr>
//             {['Asset ID', 'Financed Amount', 'Rate', 'Tenure Remaining', 'Next Repayment', 'Progress'].map(header => (
//               <th key={header} className={`px-6 py-3 text-left text-xs font-medium text-[${COLORS.TEXT_DARK}] uppercase tracking-wider`}>
//                 {header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {data.map((inv) => (
//             <tr key={inv.id} className="hover:bg-gray-50 transition duration-150">
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inv.assetId}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">${inv.financed.toLocaleString()}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[${COLORS.DATA_HIGHLIGHT}]">{inv.rate.toFixed(1)}%</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.tenure} months</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.nextRepayment}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm">
//                 <div className="w-24 bg-gray-200 rounded-full h-2">
//                   <div
//                     className="h-2 rounded-full"
//                     style={{ width: `${inv.progress}%`, backgroundColor: COLORS.DATA_HIGHLIGHT }}
//                     title={`${inv.progress}% repaid`}
//                   ></div>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       <h1 className={`text-3xl font-extrabold text-[${COLORS.TEXT_DARK}]`}>My Offers & Commitments</h1>

//       {/* Tabs */}
//       <div className={`flex border-b border-[${COLORS.ACCENT_GREEN}]`}>
//         {['Pending Offers', 'Active Investments'].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-6 py-3 font-semibold transition-all duration-200 ${
//               activeTab === tab
//                 ? `border-b-4 border-[${COLORS.CTA_GREEN}] text-[${COLORS.CTA_GREEN}]`
//                 : `text-gray-500 hover:text-[${COLORS.TEXT_DARK}]`
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Content */}
//       <div className="pt-4">
//         {activeTab === 'Pending Offers' && (
//           <OffersTable data={dummyData.offers} />
//         )}
//         {activeTab === 'Active Investments' && (
//           <InvestmentsTable data={dummyData.activeInvestments} />
//         )}
//       </div>

//       {/* Funding Portal Callout */}
//       {activeTab === 'Pending Offers' && dummyData.offers.some(o => o.status === 'Accepted') && (
//         <div className={`p-6 mt-8 rounded-xl bg-[${COLORS.ACCENT_GREEN}]/30 border border-[${COLORS.DATA_HIGHLIGHT}] flex justify-between items-center shadow-md`}>
//           <div>
//             <h3 className={`text-xl font-bold text-[${COLORS.TEXT_DARK}]`}>Funding Portal Access</h3>
//             <p className="text-gray-600">You have accepted offers awaiting disbursement. Initiate fund transfer to escrow now.</p>
//           </div>
//           <button
//             onClick={() => {
//                 const confirmElement = document.getElementById('custom-confirm-modal');
//                 const confirmMessageElement = document.getElementById('custom-confirm-message');
//                 if (confirmElement && confirmMessageElement) {
//                   confirmMessageElement.innerHTML = `Redirecting to Escrow Funding Interface...`;
//                   confirmElement.classList.remove('hidden');
//                   setTimeout(() => {
//                     confirmElement.classList.add('hidden');
//                   }, 2000);
//                 }
//             }}
//             className={`px-6 py-3 rounded-xl bg-[${COLORS.CTA_GREEN}] text-white font-semibold shadow-md hover:bg-opacity-90 transition`}
//           >
//             Initiate Fund Transfer
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // 4. Profile & Account Management ⚙️
// const ProfileView = () => {
//   const [profile, setProfile] = useState({
//     firstName: 'Frank', lastName: 'Investor', mobile: '+234 800 123 4567',
//     sourceOfFunds: 'Private Equity', investorType: 'Institutional',
//     bankName: 'Africa Central Bank', account: '1234567890', payoutVerified: 'Verified'
//   });

//   const [kycDocs, setKycDocs] = useState([
//     { name: 'Identity Proof', status: 'Approved' },
//     { name: 'Proof of Address', status: 'Approved' },
//     { name: 'Source of Funds Declaration', status: 'Pending Review' }
//   ]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // PATCH /api/accounts/me/ simulation
//     console.log('Profile update simulated:', profile);
    
//     const confirmElement = document.getElementById('custom-confirm-modal');
//     const confirmMessageElement = document.getElementById('custom-confirm-message');
    
//     if (confirmElement && confirmMessageElement) {
//         confirmMessageElement.innerHTML = `Profile updated successfully!`;
//         confirmElement.classList.remove('hidden');
//         setTimeout(() => {
//             confirmElement.classList.add('hidden');
//         }, 2000);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <h1 className={`text-3xl font-extrabold text-[${COLORS.TEXT_DARK}]`}>Profile & Account Management</h1>

//       {/* Profile Form */}
//       <form onSubmit={handleSubmit} className={`p-6 bg-[${COLORS.CARD_WHITE}] rounded-xl shadow-lg border border-[${COLORS.ACCENT_GREEN}]`}>
//         <h2 className={`text-2xl font-semibold text-[${COLORS.TEXT_DARK}] mb-4 border-b pb-2`}>Personal & Financier Details</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <input type="text" name="firstName" placeholder="First Name" value={profile.firstName} onChange={handleChange} required className={`p-3 border border-[${COLORS.ACCENT_GREEN}] rounded-lg focus:ring-2 focus:ring-[${COLORS.CTA_GREEN}] bg-white/50`} />
//           <input type="text" name="lastName" placeholder="Last Name" value={profile.lastName} onChange={handleChange} required className={`p-3 border border-[${COLORS.ACCENT_GREEN}] rounded-lg focus:ring-2 focus:ring-[${COLORS.CTA_GREEN}] bg-white/50`} />
//           <input type="tel" name="mobile" placeholder="Mobile Phone Number" value={profile.mobile} onChange={handleChange} required className={`p-3 border border-[${COLORS.ACCENT_GREEN}] rounded-lg focus:ring-2 focus:ring-[${COLORS.CTA_GREEN}] bg-white/50`} />
//           <select name="investorType" value={profile.investorType} onChange={handleChange} className={`p-3 border border-[${COLORS.ACCENT_GREEN}] rounded-lg focus:ring-2 focus:ring-[${COLORS.CTA_GREEN}] bg-white`}>

//             <option value="Institutional">Institutional Investor</option>
//             <option value="HNW">High Net Worth Individual</option>
//           </select>
//         </div>

//         <h2 className={`text-2xl font-semibold text-[${COLORS.TEXT_DARK}] mt-8 mb-4 border-b pb-2`}>Bank & Payout Details</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <input type="text" name="bankName" placeholder="Bank Name" value={profile.bankName} onChange={handleChange} required className={`p-3 border border-[${COLORS.ACCENT_GREEN}] rounded-lg focus:ring-2 focus:ring-[${COLORS.CTA_GREEN}] bg-white/50`} />
//           <input type="text" name="account" placeholder="Account Number" value={profile.account} onChange={handleChange} required className={`p-3 border border-[${COLORS.ACCENT_GREEN}] rounded-lg focus:ring-2 focus:ring-[${COLORS.CTA_GREEN}] bg-white/50`} />

//         </div>
//         <div className="mt-4 flex items-center justify-between">
//           <p className="text-gray-600">Payout Account Status:</p>
//           <StatusBadge status={profile.payoutVerified} />
//         </div>

//         <button
//           type="submit"
//           className={`mt-6 px-6 py-3 rounded-xl bg-[${COLORS.CTA_GREEN}] text-white font-semibold shadow-md hover:bg-opacity-90 transition`}
//         >
//           Save Profile Changes
//         </button>
//       </form>

//       {/* Documents & KYC */}
//       <div className={`p-6 bg-[${COLORS.CARD_WHITE}] rounded-xl shadow-lg border border-[${COLORS.ACCENT_GREEN}]`}>
//         <h2 className={`text-2xl font-semibold text-[${COLORS.TEXT_DARK}] mb-4 border-b pb-2`}>KYC Documents Status</h2>
//         <ul className="space-y-3">
//           {kycDocs.map((doc, index) => (
//             <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//               <span className={`text-[${COLORS.TEXT_DARK}]`}>{doc.name}</span>
//               <div className="flex items-center space-x-3">
//                 <StatusBadge status={doc.status} />
//                 {doc.status === 'Rejected' && (
//                   <button className="text-red-600 hover:text-red-800 font-medium">Re-Upload</button>
//                 )}
//                 {doc.status === 'Pending Review' && (
//                   <button className="text-gray-500 font-medium cursor-default">View Document</button>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//         <p className="mt-4 text-sm text-gray-500">Need to upload a new document? Use the <strong>Re-Upload</strong> button if a document is rejected by Admin.</p>
//       </div>
//     </div>
//   );
// };

// // --- MAIN APPLICATION ---

// export default function FinancierDashboard({ setRole }) {
//     const [view, setView] = useState('Dashboard');
//   const [isNavOpen, setIsNavOpen] = useState(false); // For mobile menu
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     setRole(null);
//     navigate('/login');
//   };

//   const renderView = () => {
//     switch (view) {
//       case 'Dashboard':
//         return <DashboardView setView={setView} />;
//       case 'Marketplace':
//         return <MarketplaceView />;
//       case 'My Offers':
//         return <MyOffersView />;
//       case 'Profile':
//         return <ProfileView />;
//       default:
//         return <DashboardView setView={setView} />;
//     }
//   };

//   const navItems = [
//     { label: 'Dashboard', icon: Menu },
//     { label: 'Marketplace', icon: Search },
//     { label: 'My Offers', icon: Briefcase },
//     { label: 'Profile', icon: User },
//   ];

//   return (
//     // Tailwind Config and Base Layout
//     <div className={`min-h-screen bg-[${COLORS.BG_PRIMARY}] font-sans`}>
//       <script src="https://cdn.tailwindcss.com"></script>
//       {/* Configure colors for dynamic use */}
//       <style>{`
//         body { font-family: 'Inter', sans-serif; }
//         .bg-primary { background-color: ${COLORS.BG_PRIMARY}; }
//       `}</style>
      
//       {/* Header (Top Navigation) */}
//       <header className={`sticky top-0 z-40 bg-white shadow-sm border-b border-[${COLORS.ACCENT_GREEN}]/50`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
//           <div className="flex items-center">
//             <h1 className={`text-2xl font-bold text-[${COLORS.CTA_GREEN}]`}>NPLin Financier Portal</h1>
//           </div>
//           <div className="hidden md:flex items-center space-x-4">
//             <span className={`text-sm text-[${COLORS.TEXT_DARK}] font-medium`}>Welcome, Frank!</span>
//             <StatusBadge status={dummyData.accountStatus} />
//           </div>
//           <button
//             className="md:hidden text-[${COLORS.TEXT_DARK}]"
//             onClick={() => setIsNavOpen(!isNavOpen)}
//             aria-label="Toggle navigation"
//           >
//             <Menu size={24} />
//           </button>
//         </div>
//       </header>

//       <div className="flex max-w-7xl mx-auto">
//         {/* Sidebar Navigation */}
//         <aside
//           className={`fixed inset-y-0 left-0 transform ${isNavOpen ? 'translate-x-0' : '-translate-x-full'} 
//             md:sticky md:top-20 md:translate-x-0 transition-transform duration-300 ease-in-out 
//             w-64 bg-[${COLORS.CARD_WHITE}] p-6 border-r border-[${COLORS.ACCENT_GREEN}] z-30 md:z-auto md:shadow-none shadow-xl md:self-start`}

//         >
//           <div className="space-y-3 pt-4">
//             {navItems.map((item) => (
//               <NavItem
//                 key={item.label}
//                 view={item.label}
//                 setView={(v) => { setView(v); setIsNavOpen(false); }}
//                 icon={item.icon}
//                 label={item.label}
//               />
//             ))}
         

//             {/* Export Button */}
//              <a
//                 href="#"
//                 className={`flex items-center w-full py-3 px-6 rounded-lg transition duration-200 text-left text-sm font-medium 
//                 text-gray-500 hover:bg-gray-100 mt-6 border-t pt-4 border-dashed border-gray-300`}
//               >
//                 <DollarSign size={20} className="mr-3" />
//                 Export to Sheets (Simulated)
//               </a>
//                           {/* Logout Button */}
//             <button
//               onClick={handleLogout}
//               className={`flex items-center w-full py-3 px-6 rounded-lg transition duration-200 text-left text-sm font-medium 
//               text-red-600 hover:bg-red-100/50 mt-2`}
//             >
//               <LogOut size={20} className="mr-3" />
//               Logout
//             </button>

//           </div>
//         </aside>

//         {/* Main Content Area */}
//         <main className="flex-1 p-4 md:p-8 overflow-y-auto">
//           {renderView()}
//         </main>
//       </div>
      
//       {/* Custom Confirmation Modal (Replaces alert()) */}
//       <div 
//         id="custom-confirm-modal" 
//         className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-xl z-50 transition-opacity duration-300 hidden opacity-100"
//       >
//         <p id="custom-confirm-message" className="font-semibold"></p>
//       </div>
//     </div>
//   );
// }

