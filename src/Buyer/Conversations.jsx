import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { Send, MessageSquare, User, Shield, LogOut } from 'lucide-react';

// =========================================================================
// 1. SAMPLE DATA (Placeholder)
// =========================================================================
const sampleConversations = [
    {
        id: "conv_lender_1",
        other_party: { name: "John Seller (Lender)", role: "LENDER" },
        last_message: "Yes, the vehicle is available for viewing tomorrow.",
        last_message_timestamp: "2023-10-30T10:00:00Z",
        unread_count: 1,
        messages: [
            { id: 'msg1', text: 'Hello, I am interested in the Toyota Land Cruiser KDA 555Z.', sender: { role: 'BUYER' }, timestamp: '2023-10-30T09:55:00Z' },
            { id: 'msg2', text: 'Yes, the vehicle is available for viewing tomorrow.', sender: { role: 'LENDER' }, timestamp: '2023-10-30T10:00:00Z' },
        ]
    },
    {
        id: "conv_lender_2",
        other_party: { name: "Jane Properties", role: "LENDER" },
        last_message: "The price is firm, but we can discuss payment terms.",
        last_message_timestamp: "2023-10-29T15:30:00Z",
        unread_count: 0,
        messages: [
             { id: 'msg3', text: 'Is the price for the Ngong property negotiable?', sender: { role: 'BUYER' }, timestamp: '2023-10-29T15:25:00Z' },
             { id: 'msg4', text: 'The price is firm, but we can discuss payment terms.', sender: { role: 'LENDER' }, timestamp: '2023-10-29T15:30:00Z' },
        ]
    },
    {
        id: "conv_admin_1",
        other_party: { name: "NPLin Support", role: "ADMIN" },
        last_message: "Your account has been successfully verified.",
        last_message_timestamp: "2023-10-28T11:05:00Z",
        unread_count: 0,
        messages: [
            { id: 'msg5', text: 'Your account has been successfully verified.', sender: { role: 'ADMIN' }, timestamp: '2023-10-28T11:05:00Z' }
        ]
    }
];

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

const ConversationItem = ({ conv, onSelect, isActive }) => {
    const { other_party, last_message, last_message_timestamp, unread_count } = conv;
    const Icon = other_party.role === 'ADMIN' ? Shield : User;

    return (
        <button 
            onClick={() => onSelect(conv)}
            className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${isActive ? 'bg-white/50 shadow-lg' : 'hover:bg-white/30'}`}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#1a3d2e]" />
                    <span className="font-bold text-[#1a3d2e]">{other_party.name}</span>
                </div>
                {unread_count > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{unread_count}</span>
                )}
            </div>
            <p className="text-sm text-[#4a6850] truncate mt-2">{last_message}</p>
            <p className="text-xs text-[#4a6850]/70 text-right mt-1">{new Date(last_message_timestamp).toLocaleTimeString()}</p>
        </button>
    );
};

const ChatBubble = ({ message, isOwnMessage }) => (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${isOwnMessage ? 'bg-[#6B9071]/80 text-white' : 'bg-white/60'}`}>
            <p className="text-sm">{message.text}</p>
            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-white/70' : 'text-[#4a6850]/70'}`}>{new Date(message.timestamp).toLocaleTimeString()}</p>
        </div>
    </div>
);

// =========================================================================
// 3. MAIN CONVERSATIONS PAGE COMPONENT
// =========================================================================

export default function ConversationsPage({ setRole }) {
    const [conversations, setConversations] = useState(sampleConversations);
    const [selectedConv, setSelectedConv] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [selectedConv]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConv) return;
        // This is a placeholder. In a real app, you would send this to the backend.
        const sentMessage = {
            id: `msg_${Date.now()}`,
            text: newMessage,
            sender: { role: 'BUYER' },
            timestamp: new Date().toISOString(),
        };
        const updatedConv = {
            ...selectedConv,
            messages: [...selectedConv.messages, sentMessage],
            last_message: newMessage,
            last_message_timestamp: new Date().toISOString(),
        };
        setSelectedConv(updatedConv);
        setConversations(conversations.map(c => c.id === updatedConv.id ? updatedConv : c));
        setNewMessage('');
    };

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F2E0] via-[#C8E6C8] to-[#B0DAB0]">
            <div className="flex min-h-screen">
                <ModernSidebar userRole="buyer" onLogout={handleLogout} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
                    <GlassCard className="w-full h-[88vh] flex">
                        {/* Conversations List */}
                        <div className="w-1/3 border-r border-white/30 flex flex-col">
                            <div className="p-4 border-b border-white/30">
                                <h2 className="text-2xl font-bold text-[#1a3d2e]">Conversations</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                {conversations.map(conv => (
                                    <ConversationItem 
                                        key={conv.id} 
                                        conv={conv} 
                                        onSelect={setSelectedConv}
                                        isActive={selectedConv?.id === conv.id}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Chat Window */}
                        <div className="w-2/3 flex flex-col">
                            {selectedConv ? (
                                <>
                                    <div className="p-4 border-b border-white/30 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                                            {selectedConv.other_party.role === 'ADMIN' ? <Shield className="w-6 h-6 text-[#1a3d2e]" /> : <User className="w-6 h-6 text-[#1a3d2e]" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-[#1a3d2e]">{selectedConv.other_party.name}</h3>
                                            <p className="text-sm text-[#4a6850]">{selectedConv.other_party.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                        {selectedConv.messages.map(msg => (
                                            <ChatBubble key={msg.id} message={msg} isOwnMessage={msg.sender.role === 'BUYER'} />
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    <div className="p-4 border-t border-white/30 flex gap-3">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-[#1a3d2e] placeholder-[#4a6850]/70 outline-none focus:ring-2 focus:ring-[#6B9071]"
                                        />
                                        <button onClick={handleSendMessage} className="px-5 py-3 bg-gradient-to-r from-[#6B9071] to-[#4a6850] text-white font-bold rounded-xl">
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
                                    <MessageSquare className="w-16 h-16 text-[#4a6850]/50 mb-4" />
                                    <h3 className="text-2xl font-bold text-[#1a3d2e]">Select a Conversation</h3>
                                    <p className="text-[#4a6850] mt-2">Choose a conversation from the left panel to view messages.</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </main>
            </div>
        </div>
    );
}