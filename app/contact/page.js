'use client'

import { useEffect, useState, useCallback } from 'react';
import { Trash2, Mail, Calendar, User, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-nqge.vercel.app/contact';

function ContactCard({ contact, onDelete, isDeleting }) {
    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
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
                        onClick={() => onDelete(contact._id)}
                        disabled={isDeleting}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        aria-label="Delete message"
                    >
                        {isDeleting ? (
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
    );
}

export default function ContactPage() {
    const [state, setState] = useState({
        contacts: [],
        loading: true,
        error: null,
        deletingId: null,
        refreshing: false
    });

    const fetchContacts = useCallback(async () => {
        setState(prev => ({ ...prev, refreshing: true }));
        try {
            const response = await fetch(`${API_URL}/api/contacts`);
            if (!response.ok) throw new Error('Failed to fetch contacts');
            const data = await response.json();
            setState(prev => ({
                ...prev,
                contacts: data,
                error: null,
                loading: false,
                refreshing: false
            }));
        } catch (_) { // Changed from catch(err)
            setState(prev => ({
                ...prev,
                error: 'Failed to fetch contacts',
                loading: false,
                refreshing: false
            }));
        }
    }, []);

    const deleteContact = useCallback(async (id) => {
        setState(prev => ({ ...prev, deletingId: id }));
        try {
            const response = await fetch(`${API_URL}/api/contacts/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete contact');
            setState(prev => ({
                ...prev,
                contacts: prev.contacts.filter(contact => contact._id !== id),
                deletingId: null
            }));
        } catch (_) { // Changed from catch(err)
            setState(prev => ({
                ...prev,
                error: 'Failed to delete contact',
                deletingId: null
            }));
        }
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    if (state.loading) {
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
                        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                        <p className="mt-2 text-gray-600">
                            {state.contacts.length} {state.contacts.length === 1 ? 'message' : 'messages'} received
                        </p>
                    </div>
                    <button
                        onClick={fetchContacts}
                        disabled={state.refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${state.refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {state.error && (
                    <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-red-600">{state.error}</p>
                    </div>
                )}

                <div className="space-y-6">
                    {state.contacts.map((contact) => (
                        <ContactCard
                            key={contact._id}
                            contact={contact}
                            onDelete={deleteContact}
                            isDeleting={state.deletingId === contact._id}
                        />
                    ))}

                    {state.contacts.length === 0 && !state.error && (
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
