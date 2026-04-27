"use client";

import { useState, forwardRef } from "react";
import { Doctor } from "./types";
import { MapPin, Phone, Mail, Star, HeartPulse, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

const DoctorCard = forwardRef<HTMLDivElement, { doctor: Doctor;[key: string]: any }>(({ doctor, ...props }, ref) => {
    const [isSaved, setIsSaved] = useState(false);

    return (
        <motion.div
            ref={ref}
            {...props}
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6 overflow-hidden"
        >
            {/* Decorative Background Blob */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Header: Name and Sentiment */}
            <div className="relative flex justify-between items-start gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        {doctor.Name}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-lg">
                        <HeartPulse className="w-3.5 h-3.5" />
                        <span>{doctor.Specialty}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100/50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm">
                        <Star className="w-3.5 h-3.5 mr-1.5 fill-emerald-500 text-emerald-500" />
                        {doctor.SentimentScore}/10
                    </div>
                    <button
                        onClick={() => setIsSaved(!isSaved)}
                        className={`p-2 rounded-full transition-all duration-300 ${isSaved ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500'}`}
                    >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Contact & Location Details */}
            <div className="space-y-3 relative">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors shrink-0">
                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 leading-snug">{doctor.Location}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors shrink-0">
                        <Phone className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">{doctor.Phone}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors shrink-0">
                        <Mail className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 truncate">{doctor.Email}</span>
                </div>
            </div>

            {/* Tags / Metrics */}
            <div className="relative pt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-2">
                    {doctor.Vbac && <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">VBAC: {doctor.Vbac}</span>}
                    {doctor.Purdah && <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">Purdah: {doctor.Purdah}</span>}
                    {doctor.Interventions && <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">Interventions: {doctor.Interventions}</span>}
                    {doctor.Presence && <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">Presence: {doctor.Presence}</span>}
                </div>
            </div>

            {/* Feedback Snippet */}
            {doctor.Feedback && (
                <div className="relative mt-auto pt-2">
                    <div className="relative p-4 bg-gradient-to-br from-blue-50/50 to-slate-50/50 rounded-2xl rounded-tl-none border border-blue-100/50 group-hover:border-blue-200 transition-colors">
                        {/* Decorative Quote Mark */}
                        <span className="absolute -top-3 left-0 text-3xl text-blue-200 font-serif leading-none select-none">
                            &quot;
                        </span>
                        <p className="text-sm text-slate-600 font-medium italic line-clamp-2 relative z-10 leading-relaxed">
                            {doctor.Feedback}
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
});

DoctorCard.displayName = "DoctorCard";

export default DoctorCard;