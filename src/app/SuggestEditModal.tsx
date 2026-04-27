"use client";

import { useState } from "react";
import { Edit3, X, Send } from "lucide-react";

interface SuggestEditModalProps {
    doctorName: string;
}

export default function SuggestEditModal({ doctorName }: SuggestEditModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        suggestedPhone: "",
        suggestedEmail: "",
        suggestedLocation: "",
        comments: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/suggest-edit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doctorName, ...formData })
            });

            if (!res.ok) throw new Error("Failed to submit");
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
                <Edit3 className="w-4 h-4" />
                Suggest an edit
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Suggest Edit</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Updating information for <span className="font-semibold text-slate-700 dark:text-slate-300">{doctorName}</span>
                        </p>

                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thank You!</h3>
                                <p className="text-slate-500 mt-2 text-sm">Your suggestion has been recorded for review.</p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold rounded-xl transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Correct Phone Number</label>
                                    <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.suggestedPhone} onChange={e => setFormData({ ...formData, suggestedPhone: e.target.value })} placeholder="e.g. 017XXXXXXXX" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Correct Email</label>
                                    <input type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.suggestedEmail} onChange={e => setFormData({ ...formData, suggestedEmail: e.target.value })} placeholder="doctor@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Correct Location / Hospital</label>
                                    <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.suggestedLocation} onChange={e => setFormData({ ...formData, suggestedLocation: e.target.value })} placeholder="Hospital Name, District" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Additional Notes</label>
                                    <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" value={formData.comments} onChange={e => setFormData({ ...formData, comments: e.target.value })} placeholder="Any other details we should know?" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || (!formData.suggestedPhone && !formData.suggestedEmail && !formData.suggestedLocation && !formData.comments)}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex justify-center items-center gap-2"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Suggestion"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
