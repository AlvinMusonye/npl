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
  <div className={`relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-lg ${className}`} {...props}>
    <div className="relative z-10">{children}</div>
  </div>
);

const ConversationItem = ({ conv, onSelect, isActive }) => {
    const { other_party, last_message, last_message_timestamp, unread_count } = conv;
    const Icon = other_party.role === 'ADMIN' ? Shield : User;

    return (
        <button 
            onClick={() => onSelect(conv)}
            className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${isActive ? 'bg-white shadow-md' : 'hover:bg-gray-100'}`}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-700" />
                    <span className="font-bold text-black">{other_party.name}</span>
                </div>
                {unread_count > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{unread_count}</span>
                )}
            </div>
            <p className="text-sm text-gray-600 truncate mt-2">{last_message}</p>
            <p className="text-xs text-gray-500 text-right mt-1">{new Date(last_message_timestamp).toLocaleTimeString()}</p>
        </button>
    );
};

const ChatBubble = ({ message, isOwnMessage }) => (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${isOwnMessage ? 'bg-gradient-to-br from-[#d8f3dc] to-[#40916c] text-black' : 'bg-gray-100 text-black'}`}>
            <p className="text-sm ">{message.text}</p>
            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-gray-700' : 'text-gray-500'}`}>{new Date(message.timestamp).toLocaleTimeString()}</p>
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
        <div className="min-h-screen bg-white">
            <div className="flex min-h-screen">
                <ModernSidebar userRole="buyer" onLogout={handleLogout} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
                    <div className="w-full h-[88vh] flex bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                        {/* Conversations List */}
                        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50/50">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-black">Conversations</h2>
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
                                    <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border">
                                            {selectedConv.other_party.role === 'ADMIN' ? <Shield className="w-6 h-6 text-black" /> : <User className="w-6 h-6 text-black" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-black">{selectedConv.other_party.name}</h3>
                                            <p className="text-sm text-gray-600">{selectedConv.other_party.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                        {selectedConv.messages.map(msg => (
                                            <ChatBubble key={msg.id} message={msg} isOwnMessage={msg.sender.role === 'BUYER'} />
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    <div className="p-4 border-t border-gray-200 flex gap-3">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-3 bg-gray-100 rounded-xl border border-gray-300 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#40916c]"
                                        />
                                        <button onClick={handleSendMessage} className="px-5 py-3 bg-gradient-to-r from-[#d8f3dc] to-[#40916c] text-black font-bold rounded-xl">
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
                                    <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                                    <h3 className="text-2xl font-bold text-black">Select a Conversation</h3>
                                    <p className="text-gray-500 mt-2">Choose a conversation from the left panel to view messages.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}