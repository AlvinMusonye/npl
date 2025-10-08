import React, { useState, useEffect, useRef } from 'react';
// IMPORT FIX: Ensure all imported icons are used correctly
import { FaBuilding, FaChartLine, FaHandshake, FaRobot, FaBolt, FaLock, FaStore, FaCheck } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { MdOutlineArrowRight } from 'react-icons/md';

// This component uses standard React features only.
export default function NPLinLanding() {
  const [isVisible, setIsVisible] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am Tunu, your virtual assistant. How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);



  const [isHopping, setIsHopping] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const chatContainerRef = useRef(null);


  // --- Utility Hooks & Logic ---
  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.2 } 
    );
    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const rafIdRef = useRef(null);
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);
  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Function to handle sending the message to the chatbot API
 // Function to handle sending the message to the chatbot API
// Function to handle sending the message to the chatbot API
const sendMessage = async () => {
  if (message.trim() === '') return;

  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000';
  const apiEndpoint = `${baseUrl}/api/chat/tunu/`;

  // Add the user message to the chat first
  setMessages(prev => [...prev, { sender: 'user', text: message }]);
  const userMessage = message; // Save current input before clearing
  setMessage('');
  setIsTyping(true);


  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log('Chatbot response:', data);

    // Append chatbot response to messages
    setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
  } catch (error) {
    console.error('Error sending message:', error);
    setMessages(prev => [
      ...prev,
      { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' },
    ]);
  } finally {
    setIsTyping(false);

  }
};

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

  const GlassCard = ({ children, className = "", blur = "backdrop-blur-3xl", ...props }) => (
    <div 
      className={`relative overflow-hidden rounded-[32px] ${blur} bg-white/30 border border-white/60 shadow-[0_25px_80px_rgba(15,42,29,0.2)] ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.1) 70%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px) saturate(180%) brightness(120%) contrast(110%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%) brightness(120%) contrast(110%)',
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.6),
          inset 0 -1px 0 rgba(255,255,255,0.2),
          0 25px 80px rgba(15,42,29,0.2),
          0 0 0 1px rgba(255,255,255,0.1)
        `,
      }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/25 to-transparent opacity-90"></div>
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/70 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/40 rounded-full blur-2xl"></div>
      <div className="absolute top-8 right-8 w-32 h-32 bg-white/50 rounded-full blur-xl"></div>
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-transparent via-white/60 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-white/40 to-transparent"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );

  const LiquidBlob = ({ className = "", size = "w-96 h-96", delay = 0, blur = "blur-3xl" }) => (
    <div 
      className={`absolute rounded-full opacity-40 blur-3xl animate-pulse ${size} ${className}`}
      style={{
        background: 'radial-gradient(circle, rgba(100, 160, 120, 0.5) 0%, rgba(160, 200, 170, 0.3) 40%, rgba(200, 230, 210, 0.15) 70%, transparent 90%)',
        animationDelay: `${delay}s`,
        animationDuration: '8s'
      }}
    ></div>
  );

  const Modal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <GlassCard className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{data.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0F2A1D] font-[var(--font-secondary)]">
                    {data.title}
                  </h2>
                  <p className="text-[#375534] text-lg mt-2">{data.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[#375534] hover:text-[#0F2A1D] transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-[#0F2A1D] mb-4 font-[var(--font-secondary)]">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {data.details.map((detail, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[#375534] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-[#375534] text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#0F2A1D] mb-4 font-[var(--font-secondary)]">
                  Benefits
                </h3>
                <ul className="space-y-3">
                  {data.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-[#375534] to-[#0F2A1D] rounded-full flex items-center justify-center flex-shrink-0">
                        {/* FIX: Use FaCheck icon here instead of nested SVG */}
                        <FaCheck className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[#375534] text-sm font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </GlassCard>
        </div>
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0] overflow-hidden relative">
      {/* Animated Liquid Background Elements */}
      <LiquidBlob className="top-0 right-0 transform translate-x-1/2 -translate-y-1/2" size="w-[400px] h-[400px]" blur="blur-2xl" />
      <LiquidBlob className="bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2" size="w-[500px] h-[500px]" delay={2} />
      
      {/* Navigation */}
      <nav className="relative z-20 py-6">
        <GlassCard className="mx-auto max-w-7xl px-8 py-4">
          <div className="flex items-center justify-between nav-smooth">
            <div className="text-2xl font-bold font-[var(--font-secondary)] text-[#0F2A1D]">
              NPLin
            </div>
            <div className="hidden md:flex space-x-8 text-[#375534] font-[var(--font-secondary)]">
              <a href="#marketplace" className="hover:text-[#0F2A1D] hover:scale-110 transition-transform duration-300 ease-out hover:font-bold">Marketplace</a>
              <a href="#solutions" className="hover:text-[#0F2A1D] hover:scale-110 transition-transform duration-300 ease-out hover:font-bold">Solutions</a>
              <a href="#technology" className="hover:text-[#0F2A1D] hover:scale-110 transition-transform duration-300 ease-out hover:font-bold">Technology</a>
              <a href="#contact" className="hover:text-[#0F2A1D] hover:scale-110 transition-transform duration-300 ease-out hover:font-bold">Contact</a>
            </div>
            <a href="/signup">
              <GlassCard className="px-6 py-2 bg-gradient-to-r from-[#375534] to-[#0F2A1D] text-black cursor-pointer hover:scale-105 transition-transform">
                Get Started
              </GlassCard>
            </a>
          </div>
        </GlassCard>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div 
                id="hero-text"
                className={`transition-all duration-300 ${isVisible['hero-text'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <h1 className="text-6xl lg:text-7xl font-bold font-[var(--font-secondary)] text-[#0F2A1D] leading-[1.1] mb-6">
                  The Future of 
                  <span className="bg-gradient-to-r from-[#6B9071] to-[#375534] bg-clip-text text-transparent"> Distressed Debt</span>
                  <span className="block">in Africa</span>
                </h1>
                <p className="text-xl text-[#375534] leading-relaxed font-[var(--font-primary)] max-w-2xl">
                  Transforming financial challenges into opportunities. NPLin bridges the gap between distressed assets and capital, creating a transparent ecosystem where everyone wins.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <GlassCard className="px-10 py-5 bg-gradient-to-r from-[#375534] to-[#0F2A1D] text-black cursor-pointer hover:scale-110 transition-transform ease-out inline-flex items-center justify-center">
                  <span className="font-bold tracking-wide">Explore Platform</span>
                </GlassCard>
                <a href="/signup">
                  <GlassCard className="px-10 py-5 text-[#0F2A1D] cursor-pointer hover:scale-110 transition-transform ease-out inline-flex items-center justify-center ring-1 ring-[#0F2A1D]/20">
                    <span className="font-bold tracking-wide">Get Started</span>
                  </GlassCard>
                </a>
              </div>
            </div>

            <div className="relative">
               <GlassCard className="p-0 h-96 overflow-hidden">
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
      <section id="solutions" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div 
            id="why-nplin"
            className={`text-center mb-16 transition-all duration-300 ${isVisible['why-nplin'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2 className="text-5xl font-bold font-[var(--font-secondary)] text-[#0F2A1D] mb-6">
              Why NPLin is Your Essential Partner
            </h2>
            <p className="text-xl text-[#375534] max-w-3xl mx-auto font-[var(--font-primary)]">
              We're not just a platform; we're a complete solution bridging distressed assets with opportunity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                key: "financialInstitutions",
                title: "Financial Institutions",
                description: "Maximize recovery rates and turn dormant portfolios into liquid capital through our vetted investor network.",
                  // FIX: Simplified icon usage
                  icon: <FaBuilding className="w-12 h-12 text-[#6B9071]" />,
                gradient: "from-[#6B9071]/20 to-[#AEC3B0]/20"
              },
              {
                key: "investors",
                title: "Investors & Asset Managers", 
                description: "Access curated NPL portfolios with ML-powered analytics for smarter, faster investment decisions.",
                  // FIX: Simplified icon usage
                  icon: <FaChartLine className="w-12 h-12 text-[#375534]" />,
                gradient: "from-[#375534]/20 to-[#6B9071]/20"
              },
              {
                key: "borrowers",
                title: "Borrowers",
                description: "Find fair resolution through restructuring solutions and financial counseling for a fresh start.",
                  // FIX: Simplified icon usage
                  icon: <FaHandshake className="w-12 h-12 text-[#AEC3B0]" />,
                gradient: "from-[#AEC3B0]/20 to-[#E3EED4]/20"
              }
            ].map((item, index) => (
               <GlassCard 
                key={index} 
                className={`p-8 hover:scale-105 transition-all duration-300 bg-gradient-to-br ${item.gradient} cursor-pointer`}
                onClick={() => setActiveModal(item.key)}
               >
                 <div className="mb-4">{item.icon}</div>
                 <h3 className="text-2xl font-bold font-[var(--font-secondary)] text-[#0F2A1D] mb-4">
                    {item.title}
                 </h3>
                 <p className="text-[#375534] leading-relaxed font-[var(--font-primary)]">
                    {item.description}
                 </p>
                 <button className="mt-4 text-[#0F2A1D] text-sm font-medium flex items-center">
                    Learn More
                    {/* FIX: Use the React Icon directly */}
                    <MdOutlineArrowRight className="w-5 h-5 ml-2" />
                 </button>
               </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="mt-8">
              <div className="relative h-[28rem] overflow-hidden rounded-[32px]">
                <img
                  src="/webimage2.jpeg"
                  alt="NPLin Marketplace Platform"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold font-[var(--font-secondary)] text-[#0F2A1D] mb-6">
                  The NPLin Marketplace
                </h2>
                <p className="text-xl text-[#375534] mb-6 font-[var(--font-primary)]">
                  Unlock hidden value from recovered assets through secure, transparent bidding processes.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { metric: "24 months to 3-6 months", label: "Reduced sale timeframe" },
                  { metric: "Higher recovery rates", label: "Than traditional methods" },
                  { metric: "Blockchain secured", label: "Verified transactions" }
                ].map((item, index) => (
                  <GlassCard key={index} className="p-6 bg-white/5">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#6B9071] to-[#375534] rounded-full flex items-center justify-center text-white font-bold">
                        <FaCheck /> {/* Using FaCheck for the tick */}
                      </div>
                      <div>
                        <div className="font-bold text-[#0F2A1D] text-lg font-[var(--font-secondary)]">
                          {item.metric}
                        </div>
                        <div className="text-[#375534] font-[var(--font-primary)]">
                          {item.label}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div 
            id="tech-header"
            className={`mb-16 transition-all duration-300 ${isVisible['tech-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2 className="text-5xl font-bold font-[var(--font-secondary)] text-[#0F2A1D] mb-6">
              Technology-Driven Excellence
            </h2>
            <p className="text-xl text-[#375534] max-w-3xl mx-auto font-[var(--font-primary)]">
              Powered by proprietary algorithms providing real-time market intelligence and predictive analytics.
            </p>
          </div>

          <GlassCard className="p-16 bg-gradient-to-br from-[#0F2A1D]/5 to-[#375534]/5">
            <div className="grid md:grid-cols-3 gap-8">
                {[
                  { 
                    key: "aiAnalytics",
                    title: "AI Analytics", 
                    icon: <FaRobot className="w-16 h-16 text-[#6B9071] mx-auto" />,
                    desc: "Machine learning algorithms for smarter decisions" 
                  },
                  { 
                    key: "realTimeData",
                    title: "Real-time Data", 
                    icon: <FaBolt className="w-16 h-16 text-[#375534] mx-auto" />,
                    desc: "Live market intelligence and risk assessments" 
                  },
                  { 
                    key: "securePlatform",
                    title: "Secure Platform", 
                    icon: <FaLock className="w-16 h-16 text-[#AEC3B0] mx-auto" />,
                    desc: "Blockchain-secured transactions and data protection" 
                  }
                ].map((tech, index) => (
                  <div 
                    key={index} 
                    className="text-center space-y-4 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setActiveModal(tech.key)}
                  >
                    <div className="mb-4">{tech.icon}</div>
                    <h3 className="text-2xl font-bold text-[#0F2A1D] font-[var(--font-secondary)]">
                      {tech.title}
                    </h3>
                    <p className="text-[#375534] font-[var(--font-primary)]">{tech.desc}</p>
                    <button className="mt-4 text-[#0F2A1D] text-sm font-medium flex items-center justify-center">
                      Learn More
                      {/* FIX: Use the React Icon directly */}
                      <MdOutlineArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <GlassCard className="p-16 bg-gradient-to-br from-[#375534]/10 to-[#0F2A1D]/10">
            <h2 className="text-5xl font-bold font-[var(--font-secondary)] text-[#0F2A1D] mb-6">
            Ready to Transform Your Financial Strategy? <FaCheck className="inline-block text-[#375534]" />
            </h2>
            <p className="text-xl text-[#375534] mb-8 font-[var(--font-primary)]">
              Join the future of distressed debt management. Whether you're optimizing portfolios, seeking opportunities, or need a fresh start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/signup">
                <GlassCard className="px-12 py-4 bg-gradient-to-r from-[#375534] to-[#0F2A1D] text-black cursor-pointer hover:scale-105 transition-transform">
                <span className="font-bold text-lg">Get Started</span>
              </GlassCard>
              </a>
              <GlassCard className="px-12 py-4 text-[#0F2A1D] cursor-pointer hover:scale-105 transition-transform">
                <span className="font-bold text-lg">Contact Us</span>
              </GlassCard>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <GlassCard className="p-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0F2A1D] font-[var(--font-secondary)] mb-4">
                NPLin
              </div>
              <p className="text-[#375534] font-[var(--font-primary)]">
                Transforming Africa's financial landscape, one asset at a time.
              </p>
              <div className="flex justify-center space-x-8 mt-6 text-[#375534]">
                <a href="#" className="hover:text-[#0F2A1D]">Privacy</a>
                <a href="#" className="hover:text-[#0F2A1D]">Terms</a>
                <a href="#" className="hover:text-[#0F2A1D]">Support</a>
              </div>
            </div>
          </GlassCard>
        </div>
      </footer>

      {/* Tunu Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Widget */}
        {isChatOpen && (
  <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-xl flex flex-col">
    <div className="p-4 border-b font-bold text-[#0F2A1D]">NPLin Chatbot</div>

    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 h-64">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-2 rounded-xl text-sm ${
            msg.sender === 'user'
              ? 'bg-[#375534] text-white self-end text-right'
              : 'bg-gray-100 text-[#0F2A1D] self-start text-left'
          }`}
        >
          {msg.text}
        </div>
      ))}
            {isTyping && (
        <div className="p-2 rounded-xl text-sm bg-gray-100 text-[#0F2A1D] self-start text-left">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></span>
          </div>
        </div>
      )}

    </div>

    <div className="flex border-t p-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-2 outline-none text-[#0F2A1D]"
      />
      <button
        onClick={sendMessage}
        className="p-2 text-[#0F2A1D] hover:text-[#375534]"
      >
        <IoSend />
      </button>
    </div>
  </div>
)}

        {/* Chat Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-16 h-16 rounded-full bg-gradient-to-r from-[#375534] to-[#0F2A1D] text-white flex items-center justify-center shadow-2xl transition-all duration-300 ease-in-out ${isHopping ? 'animate-hop' : ''} `}
        >
                  <FaRobot className="w-8 h-8" />

        </button>
      </div>

      {/* Modal is outside of the scrollable content */}
      <Modal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        data={activeModal ? modalData[activeModal] : null} 
      />
    </div>
  );
}