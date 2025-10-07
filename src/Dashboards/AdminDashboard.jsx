import React, { useState, useMemo } from 'react';
import { Building, TrendingUp, Handshake, Bot, Zap, Lock, Store, Check, X, ArrowUp, ArrowDown, Minus, Menu, XCircle, FileText, Shield, Gavel, Wallet, CreditCard, LayoutDashboard, Users, Settings, List } from 'lucide-react';

// =========================================================================
// 1. REUSABLE UI COMPONENTS (Glassmorphism & Layout)
// =========================================================================

// Glass Card Component
const GlassCard = ({ children, className = "", ...props }) => (
  <div 
    className={`relative overflow-hidden rounded-3xl bg-white/40 border border-white/60 shadow-xl ${className}`}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    }}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-80"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

// Header Component
const DashboardHeader = ({ title, subtitle }) => (
  <header className="pb-4 mb-8 border-b border-[#6B9071]/30">
    <h1 className="text-3xl font-bold text-[#1a3d2e]">{title}</h1>
    <p className="mt-1 text-sm text-[#4a6850]">{subtitle}</p>
  </header>
);

// =========================================================================
// 2. DASHBOARD PAGE COMPONENTS
// =========================================================================

const queueIcons = {
  'KYC Verification': FileText,
  'Valuation Review': Gavel,
  'Dispute Cases': X,
  'TUNU Handoffs': Bot,
  'Payout Approvals': Wallet,
  'Asset Moderation': Store,
};

const QueueCard = ({ name, count, priority, link, color, icon }) => {
  const Icon = queueIcons[name] || FileText;
  return (
    <a href={link} onClick={(e) => e.preventDefault()} className="block hover:scale-105 transition-all duration-300 ease-out">
      <GlassCard className="p-6 hover:shadow-2xl">
        <div className="flex justify-between items-start">
          <div className='flex items-center space-x-3'>
            <div className={`p-3 rounded-2xl ${color.bg} bg-opacity-20`}>
              <Icon className={`w-6 h-6 ${color.text}`} />
            </div>
            <div>
              <div className="text-sm font-medium text-[#4a6850]">{name}</div>
              <div className="mt-1 text-3xl font-bold text-[#1a3d2e]">{count}</div>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${color.bg} text-white shadow-md`}>
            {priority}
          </span>
        </div>
        <div className="mt-4 flex items-center text-sm font-medium text-[#6B9071] hover:text-[#4a6850] transition-colors">
          Review Queue <ArrowUp className="w-4 h-4 ml-1 rotate-45" />
        </div>
      </GlassCard>
    </a>
  );
};

const CriticalQueues = ({ queues }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
    {queues.map((queue) => (
      <QueueCard key={queue.name} {...queue} />
    ))}
  </div>
);

const trendIcons = { up: ArrowUp, down: ArrowDown, flat: Minus };
const trendClasses = { up: 'text-green-600', down: 'text-red-600', flat: 'text-gray-500' };

const MetricCard = ({ title, value, change, trend, icon: Icon }) => {
  const TrendIcon = trendIcons[trend] || Minus;
  const TrendColor = trendClasses[trend] || trendClasses.flat;

  return (
    <GlassCard className="p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-[#4a6850]">{title}</div>
        <div className="p-3 rounded-2xl bg-[#C8E6C8]/50">
          <Icon className='w-6 h-6 text-[#6B9071]' />
        </div>
      </div>
      <div className="mt-3 text-4xl font-extrabold text-[#1a3d2e]">{value}</div>
      {change && (
        <div className={`mt-3 flex items-center text-sm font-medium ${TrendColor}`}>
          <TrendIcon className="w-4 h-4 mr-1" />
          {change}
        </div>
      )}
    </GlassCard>
  );
};

const MarketplaceHealth = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <MetricCard
      title="Active Listings"
      value={metrics.activeListings.value}
      change={`vs. last month: ${metrics.activeListings.change}`}
      trend={metrics.activeListings.trend}
      icon={Store}
    />
    <MetricCard
      title="Total GMV Listed (30 Days)"
      value={metrics.totalGMV.value}
      change={`vs. last month: ${metrics.totalGMV.change}`}
      trend={metrics.totalGMV.trend}
      icon={CreditCard}
    />
    <MetricCard
      title="Avg Time-to-Sale"
      value={metrics.avgTimeSale.value}
      change={`vs. last month: ${metrics.avgTimeSale.change}`}
      trend={metrics.avgTimeSale.trend}
      icon={TrendingUp}
    />
    <MetricCard
      title="Sell-Through Rate (STR)"
      value={metrics.sellThroughRate.value}
      change={`Target: 80%`}
      trend={metrics.sellThroughRate.value.includes('78%') ? 'flat' : 'up'} 
      icon={TrendingUp}
    />
  </div>
);

const ComplianceItem = ({ icon: Icon, title, value, isUrgent = false }) => (
  <div className="flex items-center justify-between py-4 border-b border-[#C8E6C8]/50 last:border-b-0 hover:bg-white/30 transition-colors px-2 rounded-lg">
    <div className="flex items-center">
      <div className={`p-2 rounded-xl ${isUrgent ? 'bg-red-100' : 'bg-[#C8E6C8]/50'}`}>
        <Icon className={`w-5 h-5 ${isUrgent ? 'text-red-500' : 'text-[#6B9071]'}`} />
      </div>
      <span className="text-sm text-[#4a6850] ml-3 font-medium">{title}</span>
    </div>
    <span className={`text-lg font-bold ${isUrgent ? 'text-red-600' : 'text-[#1a3d2e]'}`}>{value}</span>
  </div>
);

const ComplianceWatch = ({ data }) => (
  <GlassCard className="p-6 h-full">
    <h3 className="text-xl font-bold text-[#1a3d2e] mb-6">Risk & Compliance</h3>
    <ComplianceItem 
      icon={Shield} 
      title="SARs Flagged (Review)" 
      value={data.sarsFlagged} 
      isUrgent={data.sarsFlagged > 0} 
    />
    <ComplianceItem 
      icon={Wallet} 
      title="Pending Escrow Value" 
      value={data.pendingEscrow} 
    />
    <ComplianceItem 
      icon={FileText} 
      title="Doc Inconsistencies" 
      value={data.docInconsistencies} 
      isUrgent={data.docInconsistencies > 5} 
    />
    <ComplianceItem 
      icon={Lock} 
      title="Lien Discrepancies" 
      value={data.lienDiscrepancies} 
      isUrgent={data.lienDiscrepancies > 0} 
    />
  </GlassCard>
);

const TunuStatCard = ({ title, value, colorClass, icon: Icon }) => (
  <GlassCard className="p-6 text-center hover:scale-105 transition-all duration-300">
    <div className={`mx-auto mb-4 w-16 h-16 rounded-2xl ${colorClass} bg-opacity-20 flex items-center justify-center`}>
      <Icon className={`w-8 h-8 ${colorClass}`} />
    </div>
    <div className="text-3xl font-bold text-[#1a3d2e]">{value}</div>
    <div className="text-sm text-[#4a6850] mt-2">{title}</div>
  </GlassCard>
);

const TunnuPerformance = ({ data }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <TunuStatCard
      title="Containment Rate"
      value={data.containmentRate}
      colorClass="text-green-600"
      icon={Check}
    />
    <TunuStatCard
      title="User Satisfaction"
      value={data.satisfaction}
      colorClass="text-yellow-500"
      icon={Handshake}
    />
    <TunuStatCard
      title="High Distress Flags (24h)"
      value={data.distressFlags}
      colorClass="text-red-600"
      icon={Zap}
    />
    <TunuStatCard
      title="Listings Started via TUNU"
      value={data.conversionActions}
      colorClass="text-[#4a6850]"
      icon={Building}
    />
  </div>
);

const OverviewPage = ({ data }) => (
  <>
    <DashboardHeader 
      title="Executive Dashboard Overview" 
      subtitle="Real-time monitoring of critical queues, marketplace health, and compliance risks." 
    />

    <section className="mt-8">
      <h2 className="text-2xl font-semibold text-[#1a3d2e] mb-6 flex items-center">
        <span className="text-2xl mr-2">🔥</span> Critical Action Required (SLA Priority)
      </h2>
      <CriticalQueues queues={data.queues} />
    </section>
    
    <div className="mt-10 lg:grid lg:grid-cols-3 lg:gap-8">
      <div className="lg:col-span-2">
        <section>
          <h2 className="text-2xl font-semibold text-[#1a3d2e] mb-6 flex items-center">
            <span className="text-2xl mr-2">📈</span> Marketplace Health & Liquidity KPIs
          </h2>
          <MarketplaceHealth metrics={data.metrics} />
        </section>
      </div>
      
      <div className="lg:col-span-1 mt-8 lg:mt-0">
        <section>
          <h2 className="text-2xl font-semibold text-[#1a3d2e] mb-6 lg:opacity-0">Placeholder</h2>
          <ComplianceWatch data={data.compliance} />
        </section>
      </div>
    </div>

    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-[#1a3d2e] mb-6 flex items-center">
        <span className="text-2xl mr-2">🤖</span> TUNU Counsellor Performance
      </h2>
      <TunnuPerformance data={data.tunnu} />
    </section>
  </>
);

const QueuesPage = () => (
  <>
    <DashboardHeader 
      title="All Operational Queues" 
      subtitle="Detailed view of KYC, Valuation, Disputes, and Payout flows. Prioritize based on age and severity." 
    />
    <GlassCard className="p-8">
        <h3 className="text-xl font-bold text-[#1a3d2e] mb-4">Dispute Queue (3 Cases)</h3>
        <p className="text-[#4a6850] mb-4">The dispute resolution process requires human mediation. Click on the dispute ID to view evidence and mediation history.</p>
        <div className="h-64 bg-white/30 border-2 border-dashed border-[#6B9071]/40 rounded-2xl flex items-center justify-center text-[#4a6850]">
            [Data Table for Dispute Cases with SLA Status]
        </div>
    </GlassCard>
    <GlassCard className="p-8 mt-8">
        <h3 className="text-xl font-bold text-[#1a3d2e] mb-4">TUNU Handoffs (7 Urgent)</h3>
        <p className="text-[#4a6850] mb-4">Review all chatbot escalations, especially those flagged for high emotional distress or explicit legal requests.</p>
        <div className="h-64 bg-white/30 border-2 border-dashed border-[#6B9071]/40 rounded-2xl flex items-center justify-center text-[#4a6850]">
            [Data Table for TUNU Transcripts and Urgency Flags]
        </div>
    </GlassCard>
  </>
);

const UsersPage = () => (
    <>
      <DashboardHeader 
        title="Users & KYC Management" 
        subtitle="Manage user accounts, verify KYC documentation, and monitor AML/Sanctions lists." 
      />
      <GlassCard className="p-8">
          <h3 className="text-xl font-bold text-[#1a3d2e] mb-4">Pending KYC Verification (45 Users)</h3>
          <p className="text-[#4a6850] mb-4">Verify documents (ID, proof of address) to activate bidding/listing privileges.</p>
          <div className="h-96 bg-white/30 border-2 border-dashed border-[#6B9071]/40 rounded-2xl flex items-center justify-center text-[#4a6850]">
              [Data Table for KYC Queue - Borrower/Buyer Profiles]
          </div>
      </GlassCard>
    </>
  );

const AuctionsPage = () => (
    <>
      <DashboardHeader 
        title="Auction & Listing Manager" 
        subtitle="Monitor active, scheduled, and completed auctions. Manage reserve prices and settlement timelines." 
      />
      <GlassCard className="p-8">
          <h3 className="text-xl font-bold text-[#1a3d2e] mb-4">Active Auctions (15)</h3>
          <p className="text-[#4a6850] mb-4">Monitor real-time bidding for anti-sniping protection and bid integrity.</p>
          <div className="h-96 bg-white/30 border-2 border-dashed border-[#6B9071]/40 rounded-2xl flex items-center justify-center text-[#4a6850]">
              [Live Auction Monitoring Table with Real-time Bids]
          </div>
      </GlassCard>
    </>
  );

const CompliancePage = () => (
    <>
      <DashboardHeader 
        title="Advanced Compliance & Audit" 
        subtitle="Review security logs, audit trails, AML flags, and generate regulatory reports." 
      />
      <GlassCard className="p-8">
          <h3 className="text-xl font-bold text-[#1a3d2e] mb-4">Audit Log & Security Events</h3>
          <p className="text-[#4a6850] mb-4">Review every critical event (bid, fund transfer, document verification) for audit trail purposes.</p>
          <div className="h-96 bg-white/30 border-2 border-dashed border-[#6B9071]/40 rounded-2xl flex items-center justify-center text-[#4a6850]">
              [Detailed Audit Log Table and SARs Management]
          </div>
      </GlassCard>
    </>
  );

const SettingsPage = () => (
    <>
      <DashboardHeader 
        title="Platform Settings" 
        subtitle="Configure system parameters, fee structures, SLA targets, and user roles." 
      />
      <GlassCard className="p-8">
          <h3 className="text-xl font-bold text-[#1a3d2e] mb-4">System Configuration</h3>
          <p className="text-[#4a6850] mb-4">Update reserve fee percentage, anti-sniping duration (X minutes), and KYC requirements.</p>
          <div className="h-96 bg-white/30 border-2 border-dashed border-[#6B9071]/40 rounded-2xl flex items-center justify-center text-[#4a6850]">
              [Configuration Forms for System Parameters]
          </div>
      </GlassCard>
    </>
  );

// =========================================================================
// 3. SIDEBAR & MAIN COMPONENT LOGIC
// =========================================================================

const Sidebar = ({ isMenuOpen, setIsMenuOpen, currentPage, setCurrentPage }) => {
  const menuItems = [
    { key: 'overview', name: 'Overview', icon: LayoutDashboard, href: '#' },
    { key: 'queues', name: 'All Queues', icon: List, href: '/admin/queues' },
    { key: 'users', name: 'Users / KYC', icon: Users, href: '/admin/users' },
    { key: 'auctions', name: 'Auctions', icon: Gavel, href: '/admin/auctions' },
    { key: 'compliance', name: 'Compliance', icon: Shield, href: '/admin/compliance' },
    { key: 'settings', name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  const handleNavClick = (key) => {
    setCurrentPage(key);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Sidebar Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
           <GlassCard className="h-full rounded-none lg:rounded-r-[32px] p-6 flex flex-col">
            {/* Logo and Close Button */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-[#1a3d2e]">NPLin</h2>
                <p className="text-xs text-[#6B9071] mt-1">Admin Dashboard</p>
              </div>
              <button 
                className="lg:hidden text-[#4a6850] hover:text-[#1a3d2e] p-2 hover:bg-white/50 rounded-xl transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2 flex-1">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`w-full text-left flex items-center space-x-3 p-4 rounded-2xl transition-all duration-200
                    ${currentPage === item.key 
                      ? 'bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-semibold shadow-lg transform scale-105' 
                      : 'text-[#4a6850] font-medium hover:bg-white/60 hover:scale-102'}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>

            {/* Sign Out Button */}
            <div className="mt-auto pt-6 border-t border-[#C8E6C8]/50">
              <button className="w-full py-3 text-sm text-red-600 hover:text-red-800 hover:bg-red-50/50 rounded-xl transition-all duration-200 font-medium">
                Sign Out
              </button>
            </div>
        </GlassCard>
      </div>
    </>
  );
};

// --- SIMULATED DATA ---
const simulatedQueues = [
    { name: 'KYC Verification', count: 45, priority: 'High', link: '/admin/kyc-queue', color: { bg: 'bg-yellow-500', text: 'text-yellow-600' } },
    { name: 'Valuation Review', count: 18, priority: 'High', link: '/admin/valuation-queue', color: { bg: 'bg-yellow-400', text: 'text-yellow-500' } },
    { name: 'Dispute Cases', count: 3, priority: 'Urgent', link: '/admin/disputes-queue', color: { bg: 'bg-red-600', text: 'text-red-700' } },
    { name: 'TUNU Handoffs', count: 7, priority: 'Urgent', link: '/admin/counsellor-handoffs', color: { bg: 'bg-red-500', text: 'text-red-600' } },
    { name: 'Payout Approvals', count: 12, priority: 'Medium', link: '/admin/settlement-queue', color: { bg: 'bg-green-500', text: 'text-green-600' } },
];
const simulatedMetrics = { 
  activeListings: { value: '1,452', change: '+4%', trend: 'up' }, 
  totalGMV: { value: '$1.8M', change: '+12%', trend: 'up' }, 
  avgTimeSale: { value: '24 days', change: '-5%', trend: 'down' }, 
  sellThroughRate: { value: '78%', trend: 'flat' } 
};
const simulatedCompliance = { sarsFlagged: 3, pendingEscrow: '$310,000', docInconsistencies: 9, lienDiscrepancies: 2 };
const simulatedTunnu = { containmentRate: '85%', satisfaction: '4.6/5', distressFlags: 7, conversionActions: 52 };

// --- RENDER LOGIC ---

export default function AdminDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');

  const dashboardData = useMemo(() => ({
    queues: simulatedQueues.filter((q, index) => index < 5),
    metrics: simulatedMetrics,
    compliance: simulatedCompliance,
    tunnu: simulatedTunnu,
  }), []);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage data={dashboardData} />;
      case 'queues':
        return <QueuesPage />;
      case 'users':
        return <UsersPage />;
      case 'auctions':
        return <AuctionsPage />;
      case 'compliance':
        return <CompliancePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage data={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0]">
      
      <div className="flex min-h-screen">
        
        {/* Sidebar Component */}
        <Sidebar 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen} 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-72 transition-all duration-300">
          
          {/* Mobile Header / Menu Toggle */}
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h1 className="text-2xl font-bold text-[#1a3d2e]">NPLin Admin</h1>
            <button 
              className="text-[#1a3d2e] p-3 rounded-2xl bg-white/60 backdrop-blur-lg shadow-md hover:shadow-lg transition-all"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <GlassCard className="p-6 lg:p-10 mb-8 rounded-3xl w-full min-h-[85vh]">
            {renderPage()}
          </GlassCard>

          <footer className="text-center text-sm text-[#4a6850] mt-6">
              <p>&copy; 2024 NPLin Marketplace. All data real-time (simulated).</p>
          </footer>
        </main>
      </div>
    </div>
  );
}