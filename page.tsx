"use client";

import { useState } from "react";
import DoctorCard from "../components/DoctorCard";
import { Doctor } from "../types";
import { Search } from "lucide-react";

// Temporary mock data for demonstration. 
// Replace this with your actual API fetch or database call.
const mockDoctors: Doctor[] = [
    {
        Name: "Dr. Sarah Jenkins",
        Specialty: "Obstetrics & Gynecology",
        Location: "123 Wellness Way, New York, NY",
        Phone: "(555) 123-4567",
        Email: "dr.jenkins@womenshealth.com",
        Vbac: "High Success",
        Purdah: "Accommodating",
        Interventions: "Low",
        Presence: "Attends 90% of births",
        Feedback: "Incredibly supportive during my entire labor. Respected all my birth plan wishes.",
        SentimentScore: 9.8,
    },
    {
        Name: "Dr. Michael Chen",
        Specialty: "Maternal-Fetal Medicine",
        Location: "88 Health Ave, San Francisco, CA",
        Phone: "(555) 987-6543",
        Email: "mchen@bayareamed.org",
        Vbac: "Supported",
        Purdah: "Standard",
        Interventions: "Moderate",
        Presence: "Shared practice",
        Feedback: "Very knowledgeable and made me feel safe during a high-risk pregnancy.",
        SentimentScore: 8.5,
    }
];

export default function DirectoryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredDoctors = mockDoctors.filter(
        (doc) =>
            doc.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.Specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.Location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header & Search Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Find a Doctor
                        </h1>
                        <p className="text-slate-500 text-sm md:text-base max-w-lg">
                            Discover top-rated specialists tailored to your preferences, birth plans, and cultural needs.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:max-w-md shrink-0">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm shadow-sm"
                            placeholder="Search by name, specialty, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid Section */}
                {filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doctor, index) => (
                            <DoctorCard key={index} doctor={doctor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
                        <p className="text-slate-500 text-lg font-medium">No doctors found matching your search.</p>
                    </div>
                )}
            </div>
        </main>
    );
}