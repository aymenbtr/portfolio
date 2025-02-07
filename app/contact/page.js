'use client'
import { useEffect, useState } from 'react';
import { Trash2, Mail, Calendar, User, Loader2 } from 'lucide-react';

export default function ContactPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    async function fetchContacts() {
        try {
            const response = await fetch('http://localhost:3000/api/contacts');
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            setError('Failed to load contacts');
        } finally {
            setLoading(false);
        }
    }

    async function deleteContact(id) {
        try {
            await fetch(`http://localhost:3000/api/contacts/${id}`, {
                method: 'DELETE',
            });
            setContacts(contacts.filter(contact => contact._id !== id));
        } catch (error) {
            setError('Failed to delete contact');
        }
    }

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

    if (error) {
        return (
            <div className="m-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Contact Messages
                    </h1>
                    <p className="text-gray-600">
                        {contacts.length} {contacts.length === 1 ? 'message' : 'messages'} received
                    </p>
                </div>

                <div className="space-y-8">
                    {contacts.map((contact) => (
                        <div 
                            key={contact._id} 
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <User className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                                {contact.full_name}
                                            </h2>
                                        </div>
                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <p className="text-sm">{contact.email}</p>
                                        </div>
                                        <div className="flex items-center space-x-3 text-gray-500">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <span className="text-sm">
                                                {new Date(contact.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteContact(contact._id)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                                        aria-label="Delete message"
                                    >
                                        <Trash2 className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                                    </button>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                        {contact.subject}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {contact.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {contacts.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
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