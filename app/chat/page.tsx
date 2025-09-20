'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/SocketContext';
import {
    createOrGetChat,
    getUserChats,
    getChatMessages,
    getChatMessagesPaginated,
    getOlderChatMessages,
    subscribeToNewMessages,
    subscribeToUserChats,
    Chat,
    ChatMessage
} from '../../lib/chatService';
import toast from 'react-hot-toast';

const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const { sendMessage, markAsRead, setCurrentChat, setOnChatPage, chats, loading } = useChat();
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [lastMessageDoc, setLastMessageDoc] = useState<any>(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showChatList, setShowChatList] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const unsubscribeNewMessages = useRef<(() => void) | null>(null);
    const isInitialLoad = useRef<boolean>(true);
    const currentChatIdRef = useRef<string | null>(null);
    
    // Firebase configuration check - must be before any early returns
    const [firebaseError, setFirebaseError] = useState<string | null>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setOnChatPage(true);
        return () => {
            setCurrentChat(null);
            setOnChatPage(false);
        };
    }, [setOnChatPage]);

    // Check Firebase configuration
    useEffect(() => {
        const checkFirebase = async () => {
            try {
                // Try to access Firestore to check if it's configured
                const { db } = await import('../../lib/firebase');
                if (!db) {
                    setFirebaseError('Firebase not configured');
                }
            } catch (error) {
                setFirebaseError('Firebase configuration error');
            }
        };
        
        checkFirebase();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            markAsRead(selectedChat.id!);
            
            if (currentChatIdRef.current !== selectedChat.id) {
                currentChatIdRef.current = selectedChat.id!;
                loadInitialMessages(selectedChat.id!);
                setupNewMessagesListener(selectedChat.id!);
            }
            setCurrentChat(selectedChat.id!);
            
            // On mobile, hide chat list when a chat is selected
            if (isMobile) {
                setShowChatList(false);
            }
        } else {
            currentChatIdRef.current = null;
            setCurrentChat(null);
            setMessages([]);
            setHasMoreMessages(false);
            setLastMessageDoc(null);
            
            // On mobile, show chat list when no chat is selected
            if (isMobile) {
                setShowChatList(true);
            }
        }
        return () => {
            if (unsubscribeNewMessages.current) {
                unsubscribeNewMessages.current();
            }
        };
    }, [selectedChat, isMobile]);


    const loadInitialMessages = async (chatId: string) => {
        setLoadingMessages(true);
        isInitialLoad.current = true;
        try {
            const { messages: initialMessages, lastDoc, hasMore } = await getChatMessagesPaginated(chatId, 20);
            const reversedMessages = [...initialMessages].reverse();
            setMessages(reversedMessages);
            setLastMessageDoc(lastDoc);
            setHasMoreMessages(hasMore);
            
            setTimeout(() => {
                isInitialLoad.current = false;
            }, 200);
        } catch (error) {
            console.error('Error loading initial messages:', error);
            setHasMoreMessages(false);
        } finally {
            setLoadingMessages(false);
        }
    };

    const loadMoreMessages = async () => {
        if (!selectedChat || loadingMessages || !hasMoreMessages) {
            return;
        }
        
        setLoadingMessages(true);
        
        const container = messagesContainerRef.current;
        const previousScrollHeight = container?.scrollHeight || 0;
        const previousScrollTop = container?.scrollTop || 0;
        
        try {
            const oldestMessage = messages[0];
            if (!oldestMessage) {
                setHasMoreMessages(false);
                return;
            }
            
            const { messages: olderMessages, hasMore } = await getOlderChatMessages(
                selectedChat.id!, 
                20, 
                oldestMessage.timestamp
            );
            
            if (olderMessages.length > 0) {
                const reversedOlderMessages = [...olderMessages].reverse();
                setMessages(prev => [...reversedOlderMessages, ...prev]);
                setHasMoreMessages(hasMore);
                
                setTimeout(() => {
                    if (container) {
                        const newScrollHeight = container.scrollHeight;
                        const scrollDiff = newScrollHeight - previousScrollHeight;
                        container.scrollTop = previousScrollTop + scrollDiff;
                    }
                }, 50);
            } else {
                setHasMoreMessages(false);
            }
        } catch (error) {
            console.error('Error loading more messages:', error);
            setHasMoreMessages(false);
        } finally {
            setLoadingMessages(false);
        }
    };

    const setupNewMessagesListener = (chatId: string) => {
        unsubscribeNewMessages.current = subscribeToNewMessages(chatId, (newMessage) => {
            setMessages(prev => {
                // Check if this is a real message replacing an optimistic one
                const optimisticIndex = prev.findIndex(msg => 
                    msg.id?.startsWith('temp-') && 
                    msg.senderId === newMessage.senderId && 
                    msg.content === newMessage.content
                );
                
                if (optimisticIndex !== -1) {
                    // Replace the optimistic message with the real one
                    const newMessages = [...prev];
                    newMessages[optimisticIndex] = newMessage;
                    return newMessages;
                } else {
                    // Check if message already exists (avoid duplicates)
                    const messageExists = prev.some(msg => msg.id === newMessage.id);
                    if (!messageExists) {
                        return [...prev, newMessage];
                    }
                }
                return prev;
            });
            setTimeout(() => scrollToBottom(), 100);
        });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat || sending || !user) return;

        const messageContent = newMessage.trim();
        setSending(true);
        
        // Optimistically add the message to the UI immediately
        const optimisticMessage: ChatMessage = {
            id: `temp-${Date.now()}`, // Temporary ID
            senderId: user._id,
            senderName: user.name,
            content: messageContent,
            timestamp: { toDate: () => new Date() } as any, // Temporary timestamp
            read: false,
            messageType: 'text'
        };
        
        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage('');
        setTimeout(() => scrollToBottom(), 100);
        
        try {
            await sendMessage(selectedChat.id!, messageContent, user.name);
            // The real-time listener will replace the optimistic message with the real one
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Remove the optimistic message on error
            setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
            
            if (error instanceof Error && error.message.includes('Firebase is not initialized')) {
                toast.error('Chat feature is not configured. Please set up Firebase.');
            } else {
                toast.error('Failed to send message');
            }
        } finally {
            setSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;
        setShowScrollToBottom(!isNearBottom && messages.length > 5);
    };

    const formatTime = (timestamp: any) => {
        const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp: any) => {
        const now = new Date();
        const messageDate = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
        const diffInHours = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return formatTime(timestamp);
        } else if (diffInHours < 168) {
            return messageDate.toLocaleDateString([], { weekday: 'short' });
        } else {
            return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen gradient-bg p-5 pt-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center py-12">
                            <div className="glass-effect p-8 rounded-2xl max-w-md mx-auto">
                                <div className="text-4xl mb-4 animate-spin">⏳</div>
                                <p className="text-white text-xl">Loading chats...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    // Check if Firebase is not configured
    const isFirebaseNotConfigured = !!firebaseError;

    return (
        <ProtectedRoute>
            <div className="min-h-screen gradient-bg p-5 pt-20">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 text-center animate-fade-in-up">
                        <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-4">
                            💬 Chat
                        </h1>
                        <p className="text-xl text-gray-200 text-shadow">
                            Connect with other food enthusiasts
                        </p>
                    </div>

                    <div className="glass-effect rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {isFirebaseNotConfigured ? (
                            <div className="p-8 text-center">
                                <div className="text-6xl mb-4">🔥</div>
                                <h2 className="text-2xl font-bold text-white mb-4">Firebase Setup Required</h2>
                                <p className="text-gray-200 mb-6">
                                    The chat feature requires Firebase Firestore to be configured.
                                </p>
                                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                                    <p className="text-yellow-200 text-sm">
                                        <strong>Setup Instructions:</strong>
                                    </p>
                                    <ol className="text-yellow-200 text-sm mt-2 text-left max-w-md mx-auto">
                                        <li>1. Create a Firebase project</li>
                                        <li>2. Enable Firestore Database</li>
                                        <li>3. Add environment variables to .env.local</li>
                                        <li>4. Restart your development server</li>
                                    </ol>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    See <code className="bg-gray-800 px-2 py-1 rounded">FIREBASE_SETUP.md</code> for detailed instructions.
                                </p>
                            </div>
                        ) : (

                            <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] md:h-[600px]">
                                {/* Chat List */}
                                <div className={`w-full md:w-1/3 border-r border-white/20 bg-white/5 flex flex-col ${isMobile && !showChatList ? 'hidden' : 'h-full'}`}>
                                    <div className="p-4 border-b border-white/20 flex-shrink-0">
                                        <h2 className="text-white text-lg font-semibold">Conversations</h2>
                                    </div>
                                    <div className="overflow-y-auto flex-1">
                                        {chats.length === 0 ? (
                                            <div className="p-4 text-center text-gray-400">
                                                <div className="text-4xl mb-2">💬</div>
                                                <p>No conversations yet</p>
                                                <p className="text-sm">Start chatting with other users!</p>
                                            </div>
                                        ) : (
                                            chats.map((chat) => {
                                                const otherParticipantId = chat.participants.find(id => id !== user?._id);
                                                const otherParticipantName = otherParticipantId ? chat.participantNames[otherParticipantId] : 'Unknown';
                                                // Don't show unread count for the currently selected chat
                                                const unreadCount = (user && selectedChat?.id !== chat.id) ? (chat.unreadCount[user._id] || 0) : 0;

                                                return (
                                                    <div
                                                        key={chat.id}
                                                        onClick={() => setSelectedChat(chat)}
                                                        className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/10 transition-colors ${selectedChat?.id === chat.id ? 'bg-white/20' : ''
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                                                {otherParticipantName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                    <h3 className="text-white font-medium truncate">
                                                                        {otherParticipantName}
                                                                    </h3>
                                                                    {unreadCount > 0 && (
                                                                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                                                            {unreadCount}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-400 text-sm truncate">
                                                                    {chat.lastMessage?.content || 'No messages yet'}
                                                                </p>
                                                                {chat.lastMessageAt && (
                                                                    <p className="text-gray-500 text-xs">
                                                                        {formatDate(chat.lastMessageAt)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* Chat Interface */}
                                <div className={`w-full md:w-2/3 flex flex-col min-h-0 ${isMobile && showChatList ? 'hidden' : 'h-full'}`}>
                                    {selectedChat ? (
                                        <>
                                            {/* Chat Header */}
                                            <div className="p-4 border-b border-white/20 bg-white/5 flex-shrink-0">
                                                <div className="flex items-center space-x-3">
                                                    {isMobile && (
                                                        <button
                                                            onClick={() => setSelectedChat(null)}
                                                            className="text-white hover:text-yellow-400 transition-colors"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {(() => {
                                                            const otherParticipantId = selectedChat.participants.find(id => id !== user?._id);
                                                            const otherParticipantName = otherParticipantId ? selectedChat.participantNames[otherParticipantId] : 'Unknown';
                                                            return otherParticipantName.charAt(0).toUpperCase();
                                                        })()}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-medium">
                                                            {(() => {
                                                                const otherParticipantId = selectedChat.participants.find(id => id !== user?._id);
                                                                return otherParticipantId ? selectedChat.participantNames[otherParticipantId] : 'Unknown';
                                                            })()}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Messages */}
                                            <div 
                                                ref={messagesContainerRef}
                                                className="flex-1 overflow-y-auto p-4 space-y-4 relative min-h-0"
                                                onScroll={handleScroll}
                                            >
                                                {/* Load more button or loading indicator */}
                                                {hasMoreMessages && !loadingMessages && messages.length > 0 && (
                                                    <div className="text-center py-2">
                                                        <button
                                                            onClick={loadMoreMessages}
                                                            className="text-blue-400 hover:text-blue-300 text-sm px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-blue-400/30"
                                                        >
                                                            📜 Load older messages
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                {loadingMessages && (
                                                    <div className="text-center text-gray-400 py-2">
                                                        <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mx-auto"></div>
                                                        <p className="text-xs mt-1">Loading older messages...</p>
                                                    </div>
                                                )}
                                                
                                                {messages.length === 0 && !loadingMessages ? (
                                                    <div className="text-center text-gray-400 py-8">
                                                        <div className="text-4xl mb-2">💬</div>
                                                        <p>No messages yet</p>
                                                        <p className="text-sm">Start the conversation!</p>
                                                    </div>
                                                ) : (
                                                    messages.map((message, index) => (
                                                        <div
                                                            key={message.id || index}
                                                            className={`flex ${message.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            <div
                                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.senderId === user?._id
                                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                                                        : 'bg-white/20 text-white'
                                                                    }`}
                                                            >
                                                                <p className="text-sm">{message.content}</p>
                                                                <p className={`text-xs mt-1 ${message.senderId === user?._id ? 'text-blue-100' : 'text-gray-400'
                                                                    }`}>
                                                                    {formatTime(message.timestamp)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                                <div ref={messagesEndRef} />
                                                
                                                {/* Scroll to bottom button */}
                                                {showScrollToBottom && (
                                                    <button
                                                        onClick={scrollToBottom}
                                                        className="fixed bottom-24 right-8 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                                                        title="Scroll to bottom"
                                                    >
                                                        ↓
                                                    </button>
                                                )}
                                            </div>

                                            {/* Message Input */}
                                            <div className="p-4 border-t border-white/20 flex-shrink-0">
                                                <form onSubmit={handleSendMessage} className="flex space-x-3">
                                                    <input
                                                        type="text"
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        placeholder="Type a message..."
                                                        className="flex-1 px-4 py-2 bg-white/20 text-white placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        disabled={sending}
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={!newMessage.trim() || sending}
                                                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${!newMessage.trim() || sending
                                                                ? 'bg-gray-500 cursor-not-allowed'
                                                                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover-lift'
                                                            } text-white`}
                                                    >
                                                        {sending ? '⏳' : '📤'}
                                                    </button>
                                                </form>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-gray-400">
                                            <div className="text-center">
                                                <div className="text-6xl mb-4">💬</div>
                                                <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
                                                <p>Choose a chat from the list to start messaging</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default ChatPage;
