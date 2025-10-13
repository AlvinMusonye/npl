import React, { useState, useEffect, useRef } from 'react';
// IMPORT FIX: Ensure all imported icons are used correctly
import { FaBuilding, FaChartLine, FaHandshake, FaRobot, FaBolt, FaLock, FaStore, FaCheck } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { MdOutlineArrowRight } from 'react-icons/md';

// This component uses standard React features only.
export default function NPLinLanding() {
  const [isVisible, setIsVisible] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // --- Botpress Chatbot Integration ---
  useEffect(() => {
    // Create and inject the Botpress scripts
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js';
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2025/10/11/11/20251011110129-N2EX1M7E.js';
    script2.defer = true;
    document.body.appendChild(script2);

    // Cleanup function to remove scripts and widget when the component unmounts
    return () => {
      if (document.body.contains(script1)) {
        document.body.removeChild(script1);
      }
      if (document.body.contains(script2)) {
        document.body.removeChild(script2);
      }
      const bpContainer = document.getElementById('botpress-webchat-container');
      if (bpContainer) {
        bpContainer.remove();
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            // Once an element is visible, keep it that way
            [entry.target.id]: prev[entry.target.id] || entry.isIntersecting
          }));
        });
      },
      { threshold: 0.2 } 
    );
    // Only observe the elements that have on-scroll animations
    const animatedElements = document.querySelectorAll('#hero-text, #why-nplin, #marketplace-header, #social-proof, #tech-header, #cta-card, #action-steps');
    animatedElements.forEach((el) => {
      observer.observe(el);
    });
    return () => animatedElements.forEach((el) => observer.unobserve(el));
  }, []);

  const rafIdRef = useRef(null);
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const modalData = {
    // ... (modalData content remains the same)
    financialInstitutions: {
      title: "Financial Institutions",
      icon: "🏦",
      description: "Maximize recovery rates and turn dormant portfolios into liquid capital through our vetted investor network.",
      details: [
        "Portfolio Optimization: Transform non-performing loans into liquid assets with our AI-driven recovery strategies",
        "Risk Assessment: Advanced analytics to evaluate and categorize distressed assets for optimal pricing",
        "Investor Network: Access to pre-vetted institutional investors and asset managers",
        "Compliance Tools: Automated reporting and regulatory compliance for all transactions",
        "Recovery Analytics: Real-time tracking of recovery rates and portfolio performance",
        "Custom Solutions: Tailored strategies for different asset types and market conditions"
      ],
      benefits: [
        "Average 40% improvement in recovery rates",
        "Reduced time-to-sale from 24 months to 3-6 months",
        "Automated compliance and reporting",
        "Access to global investor network"
      ]
    },
    investors: {
      title: "Investors & Asset Managers",
      icon: "📈",
      description: "Access curated NPL portfolios with ML-powered analytics for smarter, faster investment decisions.",
      details: [
        "Curated Portfolios: Pre-screened and analyzed NPL portfolios with detailed risk profiles",
        "ML Analytics: Machine learning algorithms for predictive modeling and risk assessment",
        "Due Diligence Tools: Comprehensive data analysis and portfolio evaluation tools",
        "Market Intelligence: Real-time market trends and pricing insights",
        "Investment Strategies: AI-powered recommendations for portfolio diversification",
        "Performance Tracking: Advanced analytics for monitoring investment performance"
      ],
      benefits: [
        "Access to premium NPL opportunities",
        "AI-powered investment recommendations",
        "Reduced due diligence time by 60%",
        "Higher returns through data-driven decisions"
      ]
    },
    borrowers: {
      title: "Borrowers",
      icon: "🤝",
      description: "Find fair resolution through restructuring solutions and financial counseling for a fresh start.",
      details: [
        "Debt Restructuring: Flexible payment plans and loan modification options",
        "Financial Counseling: Professional guidance for debt management and financial planning",
        "Mediation Services: Neutral third-party mediation for fair resolution",
        "Credit Repair: Assistance with credit score improvement and financial recovery",
        "Legal Support: Access to legal resources and debt settlement options",
        "Financial Education: Educational resources for long-term financial health"
      ],
      benefits: [
        "Fair and transparent resolution process",
        "Professional financial guidance",
        "Flexible payment options",
        "Credit score improvement support"
      ]
    },
    aiAnalytics: {
      title: "AI Analytics",
      icon: "🤖",
      description: "Machine learning algorithms for smarter decisions",
      details: [
        "Predictive Modeling: Advanced algorithms that predict loan performance and recovery rates",
        "Risk Assessment: AI-powered risk scoring for accurate asset valuation",
        "Pattern Recognition: Machine learning to identify trends and opportunities",
        "Automated Insights: Real-time analysis and recommendations",
        "Portfolio Optimization: AI-driven strategies for maximizing returns",
        "Fraud Detection: Advanced algorithms to identify and prevent fraudulent activities"
      ],
      benefits: [
        "95% accuracy in risk prediction",
        "Automated decision-making processes",
        "Real-time insights and recommendations",
        "Reduced manual analysis time by 80%"
      ]
    },
    realTimeData: {
      title: "Real-time Data",
      icon: "⚡",
      description: "Live market intelligence and risk assessments",
      details: [
        "Market Monitoring: Real-time tracking of market conditions and trends",
        "Risk Alerts: Instant notifications for significant risk changes",
        "Price Discovery: Live pricing data for accurate asset valuation",
        "Market Intelligence: Comprehensive market analysis and reporting",
        "Performance Metrics: Real-time tracking of portfolio performance",
        "Regulatory Updates: Automated compliance monitoring and updates"
      ],
      benefits: [
        "Instant market updates and alerts",
        "Accurate real-time pricing",
        "Proactive risk management",
        "Automated compliance monitoring"
      ]
    },
    securePlatform: {
      title: "Secure Platform",
      icon: "🔐",
      description: "Blockchain-secured transactions and data protection",
      details: [
        "Blockchain Security: Immutable transaction records using distributed ledger technology",
        "Data Encryption: End-to-end encryption for all data transmission and storage",
        "Identity Verification: Multi-factor authentication and biometric security",
        "Audit Trails: Complete transaction history and audit capabilities",
        "Regulatory Compliance: Built-in compliance with financial regulations",
        "Privacy Protection: Advanced privacy controls and data protection measures"
      ],
      benefits: [
        "100% secure transaction processing",
        "Immutable transaction records",
        "Advanced privacy protection",
        "Full regulatory compliance"
      ]
    },
    marketplace: {
      title: "NPLin Marketplace",
      icon: "🏪",
      description: "Unlock hidden value from recovered assets through secure, transparent bidding processes.",
      details: [
        "Asset Listing: Comprehensive asset information with detailed documentation",
        "Bidding System: Transparent and secure bidding processes",
        "Due Diligence: Complete asset analysis and valuation reports",
        "Transaction Management: Streamlined purchase and sale processes",
        "Payment Processing: Secure and automated payment handling",
        "Asset Tracking: Real-time tracking of asset status and ownership"
      ],
      benefits: [
        "Transparent and fair bidding",
        "Comprehensive asset information",
        "Secure transaction processing",
        "Streamlined purchase process"
      ]
    }
  };

  const GlassCard = ({ children, className = "", ...props }) => (
    <div 
      className={`relative rounded-3xl bg-white/50 border border-gray-200 shadow-xl transition-all duration-500 ease-in-out hover:shadow-2xl hover:shadow-[#40916c]/40 ${className}`}
      {...props}
    >
      <div className="relative h-full">{children}</div>
    </div>
  );

  const Modal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-gray-100 shadow-2xl border border-gray-200/50">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <div className="text-black pr-6">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {data.title}
                  </h2>
                  <p className="text-gray-600 text-lg mt-2">{data.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-black mb-4">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {data.details.map((detail, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[#40916c] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-black mb-4">
                  Benefits
                </h3>
                <ul className="space-y-3">
                  {data.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] rounded-full flex items-center justify-center flex-shrink-0">
                        {/* FIX: Use FaCheck icon here instead of nested SVG */}
                        <FaCheck className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[#375534] text-sm font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const ContactFormModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      // Placeholder for form submission logic
      console.log("Contact form submitted");
      onClose();
      // You can add a success message here
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <div className="relative w-full max-w-lg bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl p-8 border border-gray-200/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-black">Contact Us</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" id="name" name="name" required className="w-full px-4 py-2 bg-white/80 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#40916c] outline-none transition" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" id="email" name="email" required className="w-full px-4 py-2 bg-white/80 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#40916c] outline-none transition" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea id="message" name="message" rows="4" required className="w-full px-4 py-2 bg-white/80 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#40916c] outline-none transition"></textarea>
            </div>
            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] text-black font-bold rounded-xl cursor-pointer hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Navigation */}
      <nav className="relative z-20 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-4 rounded-3xl bg-white/80 backdrop-blur-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between nav-smooth">
            <div className="text-3xl font-bold text-black">
              NPLin
            </div>
            <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
              <a href="#marketplace" className="hover:text-black transition-colors">Marketplace</a>
              <a href="#solutions" className="hover:text-black transition-colors">Solutions</a>
              <a href="#technology" className="hover:text-black transition-colors">Technology</a>
              <a href="#resources" className="hover:text-black transition-colors">Resources</a>
              <a href="#contact" className="hover:text-black transition-colors">Contact</a>
            </div>
            <a href="/signup">
              <button className="px-6 py-2 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] text-black rounded-xl cursor-pointer hover:scale-105 transition-transform shadow-md hover:shadow-lg">
                Get Started
              </button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div 
                id="hero-text"
                className={`transition-all duration-1000 ease-in-out ${isVisible['hero-text'] ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-10 scale-95 blur-sm'}`}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-black leading-tight mb-6">
                  The Future of Distressed Assets:
                  <span className="bg-gradient-to-r from-[#40916c] to-[#1b4332] bg-clip-text text-transparent"> Fast, Fair, and Transparent.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
                  NPLin transforms non-performing loans and repossessed assets into liquid capital through a secure, data-driven marketplace, ensuring maximum recovery for lenders and fair resolutions for borrowers.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#marketplace">
                  <button className="px-10 py-4 text-black bg-white font-bold tracking-wide rounded-xl cursor-pointer hover:scale-105 transition-transform ease-out inline-flex items-center justify-center border border-gray-300 shadow-md hover:shadow-lg">
                    Explore the Marketplace
                  </button>
                </a>
              </div>
            </div>

            <div className="relative">
               <GlassCard className={`p-0 h-96 overflow-hidden transition-all duration-1000 ease-in-out delay-200 ${isVisible['hero-text'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
                 <img
                    src="/web image.jpeg" 
                    alt="NPLin Platform Preview"
                    className="w-full h-full object-cover object-center"
                 />
               </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Why NPLin Section */}
      <section id="solutions" className="py-20 relative z-10 bg-gradient-to-br from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 border-t border-gray-200/80 pt-20">
          <div 
            id="why-nplin"
            className={`text-center mb-16 transition-all duration-1000 ease-in-out ${isVisible['why-nplin'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 blur-sm'}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              The NPLin Marketplace: Unlocking Value for All Stakeholders
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              A transparent, efficient, and regulatory-compliant platform designed to resolve the global challenge of non-performing assets. We minimize the value destruction of traditional liquidation by providing a secure environment for competitive sales, ensuring better outcomes for every party involved.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                key: "financialInstitutions",
                title: "Financial Institutions (Lenders)",
                description: "Maximize recovery rates and turn dormant portfolios into liquid capital. Reduce holding costs and operational expenses.",
                  icon: <FaBuilding className="w-12 h-12 text-[#40916c]" />,
                gradient: "from-green-50 to-green-100"
              },
              {
                key: "investors",
                title: "Investors & Asset Managers", 
                description: "Access curated NPL inventories with transparent documentation and professional valuations. Make smarter, faster decisions with ML-powered analytics.",
                  icon: <FaChartLine className="w-12 h-12 text-[#40916c]" />,
                gradient: "from-blue-50 to-blue-100"
              },
              {
                key: "borrowers",
                title: "Borrowers (Debt Resolution)",
                description: "Avoid losing assets and regain control over your financial future. Access flexible repayment solutions and better settlement terms than forced repossession.",
                  icon: <FaHandshake className="w-12 h-12 text-[#40916c]" />,
                gradient: "from-yellow-50 to-yellow-100"
              }
            ].map((item, index) => (
               <GlassCard 
                key={index} 
                className={`p-8 hover:scale-105 cursor-pointer hover:bg-white/70 transition-all duration-700 ease-in-out ${isVisible['why-nplin'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onClick={() => setActiveModal(item.key)}
               >
                 <div className="mb-4">{item.icon}</div>
                 <h3 className="text-2xl font-bold text-black mb-4">
                    {item.title}
                 </h3>
                 <p className="text-gray-600 leading-relaxed">
                    {item.description}
                 </p>
                 <button className="mt-4 text-black text-sm font-medium flex items-center group-hover:text-[#40916c]">
                    {item.key === 'financialInstitutions' ? 'Learn How Lenders Win →' : item.key === 'investors' ? 'Access Investment Opportunities →' : 'Find Your Resolution →'}
                    {/* FIX: Use the React Icon directly */}
                    <MdOutlineArrowRight className="w-5 h-5 ml-2" />
                 </button>
               </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-20 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div 
            id="marketplace-header"
            className={`text-center mb-16 transition-all duration-1000 ease-in-out ${isVisible['marketplace-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 blur-sm'}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Curated Inventory: Assets Available on NPLin
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Each listing includes comprehensive due diligence reports, condition reports, and professional valuation data to ensure fully informed decision-making.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Real Estate",
                description: "Residential, commercial, and land properties with detailed condition and mortgage default reports.",
                icon: <FaBuilding className="w-10 h-10 text-[#40916c]" />
              },
              {
                title: "Motor Vehicles",
                description: "Cars, trucks, and specialty vehicles reclaimed due to loan default, featuring comprehensive inspection data.",
                icon: <FaStore className="w-10 h-10 text-[#40916c]" />
              },
              {
                title: "Business Assets",
                description: "Machinery, equipment, and other collateral tied to commercial loans, accompanied by operational history and maintenance records.",
                icon: <FaChartLine className="w-10 h-10 text-[#40916c]" />
              }
            ].map((asset, index) => (
              <GlassCard 
                key={index} 
                className={`p-8 text-center transition-all duration-700 ease-in-out ${isVisible['marketplace-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}>
                <div className="flex justify-center mb-4">
                  {asset.icon}
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">
                  {asset.title}
                </h3>
                <p className="text-gray-600">
                  {asset.description}
                </p>
              </GlassCard>
            ))}
          </div>
          <div 
            id="social-proof"
            className={`mt-24 text-center p-10 rounded-3xl bg-gradient-to-br from-gray-50 to-green-50/50 border border-gray-200 shadow-inner transition-all duration-1000 ease-in-out ${isVisible['social-proof'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <h3 className="text-3xl font-bold text-black mb-6">Social Proof & Quick Wins</h3>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-6 bg-white/80 rounded-2xl border border-gray-200 shadow-xl text-black"><strong>Reduced Time-to-Sale:</strong> from 24 months to 3-6 months</div>
              <div className="p-6 bg-white/80 rounded-2xl border border-gray-200 shadow-xl text-black"><strong>Higher Recovery Rates:</strong> than traditional liquidation methods</div>
              <div className="p-6 bg-white/80 rounded-2xl border border-gray-200 shadow-xl text-black"><strong>Secure Transactions:</strong> Blockchain-secured and data-verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20 relative z-10 bg-gradient-to-br from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <div 
            id="tech-header"
            className={`mb-16 transition-all duration-1000 ease-in-out ${isVisible['tech-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 blur-sm'}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Technology-Driven Excellence: Secure & Data-Powered
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is built on proprietary algorithms that provide real-time market intelligence and predictive analytics, ensuring integrity and speed across all transactions. We ensure Fair Valuation through professional, industry-standard appraisals at the point of listing.
            </p>
          </div>

          <div className="p-16 bg-gray-50 rounded-3xl border border-gray-200">
            <div className="grid md:grid-cols-3 gap-8">
                {[
                  { 
                    key: "aiAnalytics",
                    title: "Tunu Ai Assistant", 
                    icon: <FaRobot className="w-16 h-16 text-[#40916c] mx-auto" />,
                    desc: "Get instant answers and guidance on distressed assets, market trends, and platform features with our intelligent virtual assistant." 
                  },
                  { 
                    key: "securePlatform",
                    title: "Secure Platform", 
                    icon: <FaLock className="w-16 h-16 text-[#40916c] mx-auto" />,
                    desc: "Blockchain-secured transactions, advanced escrow systems, and strict data protection to safeguard all parties and prevent post-sale disputes." 
                  },
                  { 
                    key: "regulatoryCompliance",
                    title: "Regulatory Compliance",
                    icon: <FaCheck className="w-16 h-16 text-[#40916c] mx-auto" />,
                    desc: "Full adherence to international accounting standards (IFRS) and local regulations, supported by legal advisor collaboration."
                  }
                ].map((tech, index) => (
                  <div 
                    key={index} 
                    className={`text-center space-y-4 cursor-pointer hover:scale-105 transition-all duration-700 ease-in-out ${isVisible['tech-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                    onClick={() => setActiveModal(tech.key)}
                  >
                    <div className="mb-4">{tech.icon}</div>
                    <h3 className="text-2xl font-bold text-black">
                      {tech.title}
                    </h3>
                    <p className="text-gray-600">{tech.desc}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
          <GlassCard 
            id="cta-card"
            className={`p-8 md:p-12 bg-gradient-to-br from-gray-50/50 to-green-50/20 transition-all duration-1000 ease-in-out ${isVisible['cta-card'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} shadow-2xl hover:shadow-[#40916c]/50`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Ready to Transform Your Financial Strategy?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-12">
              Join the marketplace that is transforming Africa’s financial challenges into sustainable growth. Whether you are optimizing portfolio recovery or seeking a fresh start by resolving debt.
            </p>
            <div id="action-steps" className="grid md:grid-cols-3 gap-8 mb-12 text-left">
              <div 
                className={`p-6 bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl hover:shadow-[#40916c]/30 transition-all duration-700 ease-in-out ${isVisible['cta-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: '200ms' }}
              >
                <h4 className="font-bold text-lg mb-2 text-black">List Assets</h4>
                <p className="text-sm text-black">Easily upload your assets with professional support and set your desired sale terms.</p>
              </div>
              <div 
                className={`p-6 bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl hover:shadow-[#40916c]/30 transition-all duration-700 ease-in-out ${isVisible['cta-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: '350ms' }}
              >
                <h4 className="font-bold text-lg mb-2 text-black">Browse Opportunities</h4>
                <p className="text-sm text-black">Discover verified, high-value assets with transparent documentation for investment.</p>
              </div>
              <div 
                className={`p-6 bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl hover:shadow-[#40916c]/30 transition-all duration-700 ease-in-out ${isVisible['cta-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: '500ms' }}
              >
                <h4 className="font-bold text-lg mb-2 text-black">Connect with Experts</h4>
                <p className="text-sm text-black">Access our vetted network of legal and financial professionals for seamless resolution.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setIsContactModalOpen(true)} className="px-12 py-4 text-black bg-white font-bold text-lg rounded-xl cursor-pointer hover:scale-105 transition-transform border border-gray-300 shadow-xl hover:shadow-2xl">
                Contact Us
              </button>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-4">
                NPLin
              </div>
              <p className="text-gray-600">
                Transforming Africa's financial landscape, one asset at a time.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-6 text-gray-500">
                <a href="#" className="hover:text-black">Privacy Policy</a>
                <a href="#" className="hover:text-black">Terms of Service</a>
                <a href="#" className="hover:text-black">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal is outside of the scrollable content */}
      <Modal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        data={activeModal ? modalData[activeModal] : null} 
      />
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}