import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Mail,
  Plus,
  FileText,
  TrendingUp,
  User,
  LogOut,
  Users,
  Gavel,
  Briefcase,
  Contact,
  Store,
  DollarSign

} from 'lucide-react';

const sidebarConfig = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/admin/dashboard' },
    { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
    { id: 'assets', label: 'Asset Management', icon: Gavel, path: '/admin/assets' },
    { id: 'documents', label: 'Document Management', icon: FileText, path: '/admin/documents' },
    { id: 'offers', label: 'Offers Overview', icon: TrendingUp, path: '/admin/offers' },
    { id: 'profile', label: 'My Profile', icon: User, path: '/admin/profile' },

  ],
  borrower: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/borrower' },
    { id: 'my-assets', label: 'My Assets', icon: Briefcase, path: '/borrower/assets' },
    { id: 'register-asset', label: 'Register New Asset', icon: Plus, path: '/borrower/register-asset' },
    { id: 'my-offers', label: 'My Offers Received', icon: Mail, path: '/borrower/offers' },
    { id: 'documents', label: 'My Documents', icon: FileText, path: '/borrower/documents' },
    { id: 'transactions', label: 'My Transactions', icon: TrendingUp, path: '/borrower/transactions' },
    { id: 'communication', label: 'Communication', icon: Contact, path: '/borrower/communication' },
    { id: 'profile', label: 'My Profile', icon: User, path: '/profile' },

  ],
  financier: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/financier' },
    { id: 'marketplace', label: 'Asset Marketplace', icon: Store, path: '/financier/marketplace' },
    { id: 'my-offers-made', label: 'My Offers Made', icon: TrendingUp, path: '/financier/offers-made' },
    { id: 'record-transaction', label: 'Record Transaction', icon: DollarSign, path: '/financier/record-transaction' },
    { id: 'profile', label: 'My Profile', icon: User, path: '/profile' },
  ],
  lender: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/lender' },
    { id: 'asset-listings', label: 'Asset Listings', icon: Gavel, path: '/lender/assets'},
    { id: 'my-listed-assets', label: 'My Listed Assets', icon: Briefcase, path: '/lender/assets' },
    { id: 'register-asset', label: 'Register New Asset', icon: Plus, path: '/lender/register-asset' },
    { id: 'my-contact-requests', label: 'My Contact Requests', icon: Contact, path: '/lender/contact-requests' },
    { id: 'record-transaction', label: 'Record Transaction', icon: DollarSign, path: '/lender/record-transaction' },
    { id: 'profile', label: 'My Profile', icon: User, path: '/profile' },
  ],
  buyer: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/buyer/dashboard' },
    { id: 'marketplace', label: 'Repossessed Marketplace', icon: Store, path: '/buyer/marketplace' },
    { id: 'conversations', label: 'My Conversations', icon: Contact, path: '/buyer/conversations' },
    { id: 'record-transaction', label: 'Record Transaction', icon: DollarSign, path: '/buyer/record-transaction' },
    { id: 'profile', label: 'My Profile', icon: User, path: '/profile' },
  ],
};

const commonMenuItems = [
];

export default function ModernSidebar({ userRole = 'admin', onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeItem = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (location.pathname === '/profile') {
      return 'profile';
    }
    // For /admin/dashboard, segments are ['admin', 'dashboard']. We want 'dashboard'.
    // For /admin, segments are ['admin']. We want 'dashboard' as default.
    return pathSegments[1] || 'dashboard';

  }, [location.pathname]);

  const menuItems = useMemo(() => {
    const roleKey = userRole?.toLowerCase();
    const roleSpecificItems = sidebarConfig[roleKey] || [];
    return [...roleSpecificItems, ...commonMenuItems];
  }, [userRole]);

  const handleMenuClick = (id) => {
    const item = menuItems.find(i => i.id === id);
    if (item && item.path) {
      navigate(item.path);
    }
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const userDetails = {
    admin: { name: 'Admin User', avatar: '🛡️', color: 'from-green-500 to-green-700' },
    borrower: { name: 'Borrower', avatar: '👤', color: 'from-blue-500 to-blue-700' },
    financier: { name: 'Financier', avatar: '💰', color: 'from-purple-500 to-purple-700' },
    lender: { name: 'Lender', avatar: '🏦', color: 'from-indigo-500 to-indigo-700' },
    buyer: { name: 'Buyer', avatar: '🛒', color: 'from-teal-500 to-teal-700' },
  };

  const currentUser = userDetails[userRole?.toLowerCase()] || { name: 'Guest', avatar: '👤' };

  return (
    <>
      {/* Mobile Version - Right Side */}
      <div className="lg:hidden fixed top-0 right-0 h-full w-20 bg-white/40 backdrop-blur-xl border-l border-white/20 shadow-2xl z-50 rounded-l-3xl">
        <div className="flex flex-col items-center h-full py-6">
          {/* Profile */}
          <div className="mb-8">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentUser.color} flex items-center justify-center shadow-lg`}>
              <span className="text-white text-xl">{currentUser.avatar}</span>
            </div>
          </div>

          {/* Menu Icons */}
          <div className="flex-1 flex flex-col items-center space-y-6">
            {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                return (
                    <button 
                        key={item.id}
                        onClick={() => handleMenuClick(item.id)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                            isActive ? 'bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white shadow-lg' : 'text-[#4a6850] hover:bg-white/50'
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                    </button>
                );
            })}
          </div>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center shadow-lg hover:bg-red-200 transition-colors mt-auto"
          >
            <LogOut className="w-6 h-6 text-red-600" />
          </button>
        </div>
      </div>

      {/* Desktop Version - Left Side */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-80 bg-white/40 backdrop-blur-xl border-r border-white/20 shadow-2xl z-50 rounded-r-3xl">
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentUser.color} flex items-center justify-center shadow-lg`}>
                <span className="text-white text-2xl">{currentUser.avatar}</span>
              </div>
              <div>
                <p className="text-xs text-[#4a6850] mb-1">Good morning</p>
                <h2 className="text-lg font-semibold text-[#1a3d2e]">{currentUser.name}</h2>
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <div className="flex-1 mb-8">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-semibold text-[#4a6850] uppercase">Menu</span>
            </div>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = activeItem === item.id;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${isActive
                        ? 'bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-semibold shadow-lg transform scale-105' 
                        : 'text-[#4a6850] font-medium hover:bg-white/60 hover:scale-102'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {item.badge && (
                      <span className={`
                        text-xs font-semibold px-2 py-0.5 rounded-md
                        ${item.badgeColor || 'bg-white/30 text-gray-700'}
                        ${isActive && !item.badgeColor ? 'bg-white/20 text-white' : ''}
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Logout Button */}
          <div className="mt-auto">
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-700 font-semibold transition-all">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}