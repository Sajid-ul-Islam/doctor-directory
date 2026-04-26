"use client";

import { useState, useEffect, useMemo } from "react";
import DoctorCard from "./DoctorCard";
import DoctorCardSkeleton from "./DoctorCardSkeleton";
import { Doctor } from "./types";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// Adjust the import path depending on where you decide to place this file
import { getDoctorsData } from "./src/app/data";

const filterOptions = [
    { label: "High VBAC Success", key: "vbac" },
    { label: "Purdah Accommodating", key: "purdah" },
    { label: "Low Interventions", key: "interventions" },
];

export default function DirectoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
    const [selectedLocation, setSelectedLocation] = useState("All Locations");
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                const data = await getDoctorsData();
                setDoctors(data);
            } catch (error) {
                console.error("Failed to load doctors:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDoctors();
    }, []);

    const specialties = useMemo(() => {
        const uniqueSpecialties = new Set<string>();
        doctors.forEach((d) => {
            if (d.Specialty) {
                d.Specialty.split(",").forEach((s) => uniqueSpecialties.add(s.trim()));
            }
        });
        return ["All Specialties", ...Array.from(uniqueSpecialties)].sort();
    }, [doctors]);

    const locations = useMemo(() => {
        const uniqueLocations = new Set<string>();
        doctors.forEach((d) => {
            if (d.Location) {
                d.Location.split("|").forEach((l) => {
                    const parts = l.split(",");
                    const area = parts[parts.length - 1].trim();
                    if (area) uniqueLocations.add(area);
                });
            }
        });
        return ["All Locations", ...Array.from(uniqueLocations)].sort();
    }, [doctors]);

    const toggleFilter = (key: string) => {
        setActiveFilters(prev =>
            prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
        );
    };

    const filteredDoctors = doctors.filter((doc) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = (doc.Name?.toLowerCase() || "").includes(searchLower) ||
            (doc.Specialty?.toLowerCase() || "").includes(searchLower) ||
            (doc.Location?.toLowerCase() || "").includes(searchLower);

        // Check against active filters supporting both English and Bengali values
        const matchesSpecialty = selectedSpecialty === "All Specialties" || (doc.Specialty && doc.Specialty.includes(selectedSpecialty));
        const matchesLocation = selectedLocation === "All Locations" || (doc.Location && doc.Location.toLowerCase().includes(selectedLocation.toLowerCase()));
        const matchesVbac = activeFilters.includes("vbac") ? (doc.Vbac?.toLowerCase().includes("হ্যাঁ") || doc.Vbac?.toLowerCase().includes("yes")) : true;
        const matchesPurdah = activeFilters.includes("purdah") ? (doc.Purdah?.toLowerCase().includes("হ্যাঁ") || doc.Purdah?.toLowerCase().includes("yes") || doc.Purdah?.toLowerCase().includes("জি")) : true;
        const matchesInterventions = activeFilters.includes("interventions") ? (doc.Interventions?.toLowerCase().includes("low") || doc.Interventions?.toLowerCase().includes("কম")) : true;

        return matchesSearch && matchesSpecialty && matchesLocation && matchesVbac && matchesPurdah && matchesInterventions;
    });

    return (
        <main className="min-h-screen bg-[#F8FAFC] selection:bg-blue-100 p-4 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header & Search Section */}
                <div className="flex flex-col gap-8 pb-8 border-b border-slate-200/80 relative">
                    <div className="space-y-4 max-w-2xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                Find Your Perfect
                            </span> Doctor
                        </h1>
                        <p className="text-slate-500 text-base md:text-lg leading-relaxed">
                            Discover top-rated specialists tailored to your preferences, birth plans, and cultural needs.
                        </p>
                    </div>

                    {/* Search Bar & Filters */}
                    <div className="w-full max-w-4xl space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative group flex-grow">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-6 py-4 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-sm text-base md:text-lg"
                                    placeholder="Search by name, specialty, or location"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                                <select
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                    className="px-4 py-4 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-sm text-base md:text-lg min-w-[200px] cursor-pointer"
                                >
                                    {specialties.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="px-4 py-4 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-sm text-base md:text-lg min-w-[200px] cursor-pointer"
                                >
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Filter Chips */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {filterOptions.map(option => (
                                <button
                                    key={option.key}
                                    onClick={() => toggleFilter(option.key)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeFilters.includes(option.key) ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid Section */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {[...Array(6)].map((_, i) => (
                            <DoctorCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredDoctors.map((doctor) => (
                                <DoctorCard key={doctor.Name} doctor={doctor} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl border border-slate-200 border-dashed"
                    >
                        <div className="p-4 bg-slate-50 rounded-full mb-4">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No doctors found</h3>
                        <p className="text-slate-500 mt-2 max-w-sm text-base">We couldn&apos;t find any doctors matching your search criteria. Try adjusting your filters.</p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}