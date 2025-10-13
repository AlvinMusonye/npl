import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ModernSidebar from '../components/Sidebar';
import { Send, MessageSquare, User, Shield, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const ConversationItem = ({ conv, onSelect, isActive }) => {
    const { other_party, last_message, unread_count } = conv;
    const Icon = other_party?.role === 'ADMIN' ? Shield : User;

    return (
        <button
            onClick={() => onSelect(conv)}
            className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${isActive ? 'bg-white shadow-md' : 'hover:bg-gray-100'}`}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-700" />
                    <span className="font-bold text-black">{other_party?.name || 'Unknown'}</span>
                </div>
                {unread_count > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{unread_count}</span>
                )}
            </div>
            <p className="text-sm text-gray-600 truncate mt-2">{last_message?.content || 'No messages yet'}</p>
            <p className="text-xs text-gray-500 text-right mt-1">{last_message?.timestamp ? new Date(last_message.timestamp).toLocaleTimeString() : ''}</p>
        </button>
    );
};

const ChatBubble = ({ message, isOwnMessage }) => (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${isOwnMessage ? 'bg-gradient-to-br from-[#d8f3dc] to-[#40916c] text-black' : 'bg-gray-100 text-black'}`}>
            <p className="text-sm text-black">{message.content}</p>
            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-black/70' : 'text-black/70'}`}>{message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}</p>
        </div>
    </div>
);

export default function CommunicationsPage({ setRole, userRole }) {
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState({ convs: true, messages: false });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const fetchConversations = async () => {
            setLoading(prev => ({ ...prev, convs: true }));
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken || !currentUser) throw new Error('Authentication token not found.');
                const response = await fetch(`${API_BASE_URL}/api/conversations/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch conversations.');
                const data = await response.json();
                
                const processedData = data.map(conv => {
                    const other_party = conv.participants.find(p => p.id !== currentUser.id);
                    return { ...conv, other_party: { name: `${other_party?.first_name} ${other_party?.last_name}`, role: other_party?.role } };
                });

                setConversations(processedData);

                const params = new URLSearchParams(location.search);
                const convIdToOpen = params.get('convId');
                if (convIdToOpen) {
                    const convToSelect = processedData.find(c => c.id === convIdToOpen);
                    if (convToSelect) setSelectedConv(convToSelect);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(prev => ({ ...prev, convs: false }));
            }
        };
        fetchConversations();
    }, [currentUser?.id, location.search]);

    useEffect(() => {
        if (!selectedConv) return;

        const fetchMessages = async () => {
            setLoading(prev => ({ ...prev, messages: true }));
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`${API_BASE_URL}/api/conversations/${selectedConv.id}/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch messages.');
                const data = (await response.json()).messages;
                setMessages(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(prev => ({ ...prev, messages: false }));
            }
        };
        fetchMessages();
    }, [selectedConv]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConv) return;
        
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/conversations/${selectedConv.id}/send-message/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage }),
            });
            if (!response.ok) throw new Error('Failed to send message.');
            const sentMessage = await response.json();
            setMessages(prev => [...prev, sentMessage]);
            setNewMessage('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="flex min-h-screen">
                <ModernSidebar userRole={userRole} onLogout={handleLogout} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-80 lg:mr-0 mr-20 transition-all duration-300">
                    <div className="w-full h-[88vh] flex bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                        {/* Conversations List */}
                        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50/50">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-black">Conversations</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                {loading.convs ? <div className="text-center p-4 text-gray-600">Loading...</div> :
                                    error ? <div className="text-center p-4 text-red-600">{error}</div> :
                                    conversations.map(conv => (
                                        <ConversationItem 
                                            key={conv.id} 
                                            conv={conv} 
                                            onSelect={setSelectedConv}
                                            isActive={selectedConv?.id === conv.id}
                                        />
                                    ))
                                }
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
                                            <h3 className="font-bold text-lg text-black">{selectedConv.other_party?.name}</h3>
                                            <p className="text-sm text-gray-600">{selectedConv.other_party?.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                        {loading.messages ? <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-gray-600" /></div> :
                                            messages && messages.map(msg => (
                                                <ChatBubble key={msg.id} message={msg} isOwnMessage={msg.sender?.id === currentUser.id} />
                                            ))
                                        }
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