"use client";

import { useState, useEffect, useCallback } from "react";
import { Doctor } from "../../../types";

export default function AdminDashboard() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/companies");
            const data = await res.json();
            setDoctors(data);
        } catch (error) {
            console.error("Failed to fetch doctors", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const res = await fetch("/api/admin/refresh", { method: "POST" });
            if (!res.ok) throw new Error("Failed to refresh data");
            alert("Data refreshed successfully!");
            await fetchDoctors();
        } catch (error) {
            console.error("Refresh failed", error);
            alert("Error refreshing data. Please check Vercel logs.");
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Natural Birth Admin</h1>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium disabled:opacity-50 transition-all shadow-sm active:scale-95"
                >
                    {refreshing ? "Scraping..." : "Run Manual Refresh"}
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><p className="text-slate-500 dark:text-slate-400 animate-pulse font-medium">Loading dataset...</p></div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-left">
                            <tr>
                                <th className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 dark:text-slate-200">Doctor Name</th>
                                <th className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 dark:text-slate-200">Degrees</th>
                                <th className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 dark:text-slate-200">Medical College</th>
                                <th className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 dark:text-slate-200">Email</th>
                                <th className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 dark:text-slate-200">WhatsApp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {doctors.map((doc, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-5 py-4 text-slate-900 dark:text-slate-100 font-medium">{doc.Name}</td>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{doc.Degrees || "-"}</td>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{doc.MedicalCollege || "-"}</td>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{doc.Email || <span className="text-slate-400 dark:text-slate-600">N/A</span>}</td>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                                        {doc.WhatsApp ? (
                                            <a href={`https://wa.me/${doc.WhatsApp}`} target="_blank" rel="noreferrer" className="text-green-600 hover:underline">
                                                +{doc.WhatsApp}
                                            </a>
                                        ) : "-"}
                                    </td>
                                </tr>
                            ))}
                            {doctors.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No data available. Run a manual refresh to build the initial CSV.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
