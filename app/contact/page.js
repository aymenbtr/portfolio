'use client'
import { useEffect, useState } from 'react';
import { Trash2, Mail, Calendar, User, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

export default function ContactPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Replace with your actual API URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-nqge.vercel.app/contact';

    const fetchContacts = async () => {
        try {
            setRefreshing(true);
            const response = await fetch(`${API_URL}/api/contacts`);
            if (!response.ok) throw new Error('Failed to fetch contacts');
            const data = await response.json();
            setContacts(data);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [API_URL]); // Added API_URL as a dependency

    const deleteContact = async (id) => {
        try {
            setIsDeleting(id);
            const response = await fetch(`${API_URL}/api/contacts/${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) throw new Error('Failed to delete contact');
            
            setContacts(prev => prev.filter(contact => contact._id !== id));
        } catch (error) {
            setError('Failed to delete contact. Please try again.');
        } finally {
            setIsDeleting(null);
        }
    };

    // Rest of the component remains the same...
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    <p className="text-gray-600 font-medium">Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Contact Messages
                        </h1>
                        <p className="mt-2 text-gray-600">
                            {contacts.length} {contacts.length === 1 ? 'message' : 'messages'} received
                        </p>
                    </div>
                    <button
                        onClick={() => fetchContacts()}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                <div className="space-y-6">
                    {contacts.map((contact) => (
                        <div 
                            key={contact._id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start flex-wrap gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <User className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {contact.full_name}
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Mail className="h-4 w-4" />
                                            <a href={`mailto:${contact.email}`} className="text-sm hover:text-blue-500">
                                                {contact.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm">
                                                {formatDate(contact.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteContact(contact._id)}
                                        disabled={isDeleting === contact._id}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                        aria-label="Delete message"
                                    >
                                        {isDeleting === contact._id ? (
                                            <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                                        ) : (
                                            <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500" />
                                        )}
                                    </button>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-900">
                                        {contact.subject}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {contact.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {contacts.length === 0 && !error && (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                            <Mail className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No messages yet</h3>
                            <p className="mt-2 text-gray-500">Messages will appear here once received.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
