"use client";
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const ContactFormIntegration = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load messages whenever the component mounts or messages are updated
    useEffect(() => {
        const loadMessages = () => {
            try {
                const savedMessages = localStorage.getItem('contactMessages');
                if (savedMessages) {
                    const parsedMessages = JSON.parse(savedMessages);
                    // Sort messages by timestamp, newest first
                    parsedMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setMessages(parsedMessages);
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                setLoading(false);
            }
        };

        loadMessages();

        // Set up an interval to check for new messages every 5 seconds
        const interval = setInterval(loadMessages, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const deleteMessage = (id) => {
        try {
            const updatedMessages = messages.filter(msg => msg.id !== id);
            localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
            setMessages(updatedMessages);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Contact Messages Dashboard
                    </h1>
                    <span className="text-sm text-gray-500">
                        Total Messages: {messages.length}
                    </span>
                </div>

                {messages.length > 0 ? (
                    <div className="grid gap-4">
                        {messages.map((message) => (
                            <div key={message.id} 
                                className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            {message.subject}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {new Date(message.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => deleteMessage(message.id)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-300"
                                        aria-label="Delete message"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div className="space-y-3 text-gray-600">
                                    <p className="flex items-center">
                                        <span className="font-semibold min-w-20">From:</span>
                                        {message.full_name}
                                    </p>
                                    <p className="flex items-center">
                                        <span className="font-semibold min-w-20">Email:</span>
                                        <a href={`mailto:${message.email}`} 
                                           className="text-blue-500 hover:text-blue-700">
                                            {message.email}
                                        </a>
                                    </p>
                                    <div className="mt-4">
                                        <p className="font-semibold mb-2">Message:</p>
                                        <p className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                                            {message.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500">No messages received yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactFormIntegration;