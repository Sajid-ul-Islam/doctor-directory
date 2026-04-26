"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Doctor } from "../../types";
import { Search, MapPin, Phone, Mail, User, Baby, ShieldCheck, UserCheck, EyeOff, ChevronDown, Filter, X, Sparkles, ThumbsUp, BadgeCheck } from "lucide-react";
import Link from "next/link";
import Fuse from "fuse.js";
import { dictionaries, Locale } from "./dictionaries";

const formatDoctorName = (name?: string) => {
  if (!name) return "Unnamed Doctor";
  // Strips off any existing titles including repetitive or shorthand ones
  let cleanName = name.replace(/^(?:dr[.\s]+|d[.\s]+|doctor\s+|prof[.\s]+|professor\s+|ডাঃ\s*|ডা[.\s:]+|ড[.\s:]+|ডাক্তার\s+|প্রফেসর\s+|অধ্যাপক\s+)+/gi, '').trim();
  // Capitalizes English words
  cleanName = cleanName.replace(/\b\w/g, c => c.toUpperCase());
  // Checks if the string contains any Bengali characters
  const isBengali = /[\u0980-\u09FF]/.test(cleanName);
  return (isBengali ? "ডাঃ " : "Dr. ") + cleanName;
};

export default function DoctorList({ initialDoctors, locale = "en" }: { initialDoctors: Doctor[], locale?: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [vbacOnly, setVbacOnly] = useState(false);
  const [purdahOnly, setPurdahOnly] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  const t = dictionaries[locale as Locale] || dictionaries["en"];

  const hasActiveFilters = searchQuery || selectedLocation !== "All Locations" || vbacOnly || purdahOnly;



  // Normalize and extract unique locations
  const locations = ["All Locations", ...Array.from(new Set(initialDoctors.map(d => {
    const parts = d.Location.split(",");
    return parts[parts.length - 1].trim();
  }).filter(Boolean)))].sort();

  // ML/NLP: Smart Intent Parser
  // This extracts filter preferences from the natural language search string
  useEffect(() => {
    const query = searchQuery.toLowerCase();

    // Detect Location Intents
    locations.forEach(loc => {
      if (loc !== "All Locations" && query.includes(loc.toLowerCase()) && selectedLocation === "All Locations") {
        setSelectedLocation(loc);
      }
    });

    // Detect Category Intents
    if ((query.includes("vbac") || query.includes("ভিব্যাক")) && !vbacOnly) {
      setVbacOnly(true);
    }
    if ((query.includes("purdah") || query.includes("পর্দা") || query.includes("porda")) && !purdahOnly) {
      setPurdahOnly(true);
    }
  }, [searchQuery, locations, selectedLocation, vbacOnly, purdahOnly]);

  // NLP: Fuzzy Search Configuration
  const fuse = new Fuse(initialDoctors, {
    keys: ["Name", "Specialty", "Location", "Feedback"],
    threshold: 0.4, // Adjust for more/less fuzzy matching
    distance: 100,
  });

  const filteredDoctors = useMemo(() => {
    let results = initialDoctors;

    // Apply Fuzzy Search if query exists
    if (searchQuery) {
      // Use fuzzy search results
      results = fuse.search(searchQuery).map(r => r.item);
    }

    // Apply Hard Filters
    return results.filter((doctor) => {
      const matchesLocation = selectedLocation === "All Locations" ||
        doctor.Location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesVbac = !vbacOnly || (doctor.Vbac?.toLowerCase().includes("হ্যাঁ") || doctor.Vbac?.toLowerCase().includes("yes"));

      const matchesPurdah = !purdahOnly || (doctor.Purdah?.toLowerCase().includes("হ্যাঁ") || doctor.Purdah?.toLowerCase().includes("yes") || doctor.Purdah?.toLowerCase().includes("জি"));

      return matchesLocation && matchesVbac && matchesPurdah;
    });
  }, [searchQuery, selectedLocation, vbacOnly, purdahOnly, initialDoctors]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !hasActiveFilters && displayLimit < filteredDoctors.length) {
        setDisplayLimit(prev => prev + 12);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasActiveFilters, displayLimit, filteredDoctors.length]);

  const doctorsToShow = hasActiveFilters
    ? filteredDoctors
    : filteredDoctors.slice(0, displayLimit);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLocation("All Locations");
    setVbacOnly(false);
    setPurdahOnly(false);
    setDisplayLimit(12);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm text-gray-900 dark:text-white"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDisplayLimit(12);
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl border transition-all font-medium ${showFilters || selectedLocation !== "All Locations" || vbacOnly || purdahOnly
            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
            : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
            }`}
        >
          <Filter className="h-5 w-5" />
          {t.filters} {(vbacOnly || purdahOnly || selectedLocation !== "All Locations") && "•"}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="block w-full p-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* VBAC Toggle */}
            <div className="flex flex-col justify-center">
              <label className="flex items-center cursor-pointer gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={vbacOnly}
                    onChange={() => setVbacOnly(!vbacOnly)}
                  />
                  <div className={`block w-12 h-7 rounded-full transition-colors ${vbacOnly ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-700'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${vbacOnly ? 'translate-x-5' : ''}`}></div>
                </div>
                <div className="text-sm font-bold text-gray-700 dark:text-slate-300">VBAC Support Only</div>
              </label>
            </div>

            {/* Purdah Toggle */}
            <div className="flex flex-col justify-center">
              <label className="flex items-center cursor-pointer gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={purdahOnly}
                    onChange={() => setPurdahOnly(!purdahOnly)}
                  />
                  <div className={`block w-12 h-7 rounded-full transition-colors ${purdahOnly ? 'bg-purple-500' : 'bg-gray-300 dark:bg-slate-700'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${purdahOnly ? 'translate-x-5' : ''}`}></div>
                </div>
                <div className="text-sm font-bold text-gray-700 dark:text-slate-300">Purdah Friendly Only</div>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Found <span className="font-bold text-gray-900 dark:text-white">{filteredDoctors.length}</span> matching specialists
            </span>
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Reset All
            </button>
          </div>
        </div>
      )}

      {/* Results Label for Active Filters */}
      {(selectedLocation !== "All Locations" || vbacOnly || purdahOnly || searchQuery) && (
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 mb-4">
          {selectedLocation !== "All Locations" && (
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-blue-100 dark:border-blue-800/50">
              {selectedLocation} <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLocation("All Locations")} />
            </span>
          )}
          {vbacOnly && (
            <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-100 dark:border-green-800/50">
              VBAC <X className="h-3 w-3 cursor-pointer" onClick={() => setVbacOnly(false)} />
            </span>
          )}
          {purdahOnly && (
            <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-purple-100 dark:border-purple-800/50">
              Purdah <X className="h-3 w-3 cursor-pointer" onClick={() => setPurdahOnly(false)} />
            </span>
          )}
        </div>
      )}

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctorsToShow.length > 0 ? (
          doctorsToShow.map((doctor, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                      {formatDoctorName(doctor.Name)}
                      <span title="Verified via Normal Delivery BD">
                        <BadgeCheck className="h-5 w-5 text-blue-500 fill-blue-50 shrink-0" />
                      </span>
                    </h3>
                    {doctor.SentimentScore > 2 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-full border border-amber-200 dark:border-amber-800/50">
                        <Sparkles className="h-3 w-3" />
                        Highly Recommended
                      </span>
                    )}
                    {searchQuery && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full border border-blue-100 dark:border-blue-800/50">
                        AI Match
                      </span>
                    )}
                  </div>
                  {doctor.Specialty && (
                    <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide uppercase rounded-full border border-blue-100 dark:border-blue-800/50">
                      {doctor.Specialty}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-600 dark:text-slate-400 mt-2 flex-grow">
                {doctor.Location && (
                  <p className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.Location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                    >
                      {doctor.Location}
                    </a>
                  </p>
                )}

                {/* New Highlighted Fields */}
                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-50 dark:border-slate-800 mt-4">
                  {doctor.Vbac && (
                    <div className="flex items-start gap-3 bg-green-50/50 dark:bg-green-900/10 p-2 rounded-lg">
                      <Baby className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-green-700 dark:text-green-500 uppercase tracking-wider">VBAC Support</p>
                        <p className="text-xs text-gray-700 dark:text-slate-400 line-clamp-2">{doctor.Vbac}</p>
                      </div>
                    </div>
                  )}
                  {doctor.Purdah && (
                    <div className="flex items-start gap-3 bg-purple-50/50 dark:bg-purple-900/10 p-2 rounded-lg">
                      <EyeOff className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-purple-700 dark:text-purple-500 uppercase tracking-wider">Purdah/Modesty</p>
                        <p className="text-xs text-gray-700 dark:text-slate-400 line-clamp-2">{doctor.Purdah}</p>
                      </div>
                    </div>
                  )}
                  {doctor.Presence && (
                    <div className="flex items-start gap-3 bg-blue-50/50 dark:bg-blue-900/10 p-2 rounded-lg">
                      <UserCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-blue-700 dark:text-blue-500 uppercase tracking-wider">Doctor's Presence</p>
                        <p className="text-xs text-gray-700 dark:text-slate-400 line-clamp-2">{doctor.Presence}</p>
                      </div>
                    </div>
                  )}
                  {doctor.Interventions && (
                    <div className="flex items-start gap-3 bg-amber-50/50 dark:bg-amber-900/10 p-2 rounded-lg">
                      <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider">Approach</p>
                        <p className="text-xs text-gray-700 dark:text-slate-400 line-clamp-2">{doctor.Interventions}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-2">
                  {doctor.Phone && (
                    <p className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                      <a href={`tel:${doctor.Phone}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {doctor.Phone}
                      </a>
                    </p>
                  )}
                  {doctor.Email && (
                    <p className="flex items-center gap-3 w-full overflow-hidden">
                      <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                      <a href={`mailto:${doctor.Email}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block">
                        {doctor.Email}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/doctor/${encodeURIComponent(doctor.Name || 'unknown')}`}
                  className="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl py-3 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 text-center block"
                >
                  View Profile
                </Link>
                <a
                  href={doctor.Email ? `mailto:${doctor.Email}` : (doctor.Phone ? `tel:${doctor.Phone}` : '#')}
                  className="flex-1 bg-slate-900 dark:bg-blue-600 text-white rounded-xl py-3 font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 text-center block"
                >
                  Contact
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 border-dashed text-center py-16 text-gray-500 dark:text-slate-400">
            <Search className="h-10 w-10 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">No doctors found</p>
            <p>We couldn't find anyone matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {!hasActiveFilters && displayLimit < filteredDoctors.length && (
        <div ref={lastElementRef} className="flex justify-center pt-12 pb-8">
          <div className="flex items-center gap-2 text-blue-600 font-semibold animate-pulse">
            <Sparkles className="h-5 w-5" />
            Loading more specialists...
          </div>
        </div>
      )}
    </div>
  );
}
