"use client";

import { MapPin, Navigation } from "lucide-react";

interface LocationMapProps {
    location: string;
}

export default function LocationMap({ location }: LocationMapProps) {
    if (!location || location === "No info") return null;

    // Using Google Maps generic search embed (No API key required)
    const encodedLocation = encodeURIComponent(location);
    const mapSrc = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col gap-4">
            <div className="flex justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Chamber Location</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-md">{location}</p>
                </div>
                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                >
                    <Navigation className="w-4 h-4" />
                    <span className="hidden sm:inline">Get Directions</span>
                </a>
            </div>

            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative bg-slate-100 dark:bg-slate-800 animate-pulse-once">
                <iframe
                    title="Doctor Chamber Location"
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                />
            </div>
        </div>
    );
}
