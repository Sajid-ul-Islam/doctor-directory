"use client";

import { useState, useEffect } from "react";

type Company = {
    Name: string;
    Website: string;
    Email: string;
    [key: string]: any;
};

export default function AdminDashboard() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/companies");
            const data = await res.json();
            setCompanies(data);
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const res = await fetch("/api/admin/refresh", { method: "POST" });
            if (!res.ok) throw new Error("Failed to refresh data");
            alert("Data refreshed successfully!");
            await fetchCompanies();
        } catch (error) {
            console.error("Refresh failed", error);
            alert("Error refreshing data. Please check Vercel logs.");
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Enriched Companies Data</h1>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md disabled:opacity-50 transition"
                >
                    {refreshing ? "Scraping..." : "Run Manual Refresh"}
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500 animate-pulse">Loading data...</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">Company Name</th>
                                <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">Website</th>
                                <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {companies.map((company, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-700">{company.Name}</td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {company.Website ? (
                                            <a href={company.Website.startsWith('http') ? company.Website : `https://${company.Website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                                {company.Website}
                                            </a>
                                        ) : "N/A"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{company.Email || <span className="text-gray-400">Not Found</span>}</td>
                                </tr>
                            ))}
                            {companies.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
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