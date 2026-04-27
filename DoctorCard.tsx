"use client";

import { useState, forwardRef } from "react";
import { Doctor } from "./types";
import { MapPin, Phone, Mail, Star, HeartPulse, Bookmark, GraduationCap, MessageCircle } from "lucide-react";
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
            className="group relative bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5 overflow-hidden"
        >
            {/* Decorative Background Blob */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Header: Name and Sentiment */}
            <div className="relative flex justify-between items-start gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {doctor.Name}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg">
                        <HeartPulse className="w-3.5 h-3.5" />
                        <span>{doctor.Specialty}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-100/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm">
                        <Star className="w-3.5 h-3.5 mr-1.5 fill-emerald-500 text-emerald-500" />
                        {doctor.SentimentScore}/10
                    </div>
                    <button
                        onClick={() => setIsSaved(!isSaved)}
                        className={`p-2 rounded-full transition-all duration-300 ${isSaved ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-500'}`}
                    >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Contact & Location Details */}
            <div className="space-y-3 relative">
                {doctor.Degrees && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors shrink-0">
                            <GraduationCap className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-snug">{doctor.Degrees}</span>
                    </div>
                )}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors shrink-0">
                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">{doctor.Location}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors shrink-0">
                            <Phone className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{doctor.Phone || "N/A"}</span>
                    </div>
                    {doctor.WhatsApp && (
                        <a href={`https://wa.me/${doctor.WhatsApp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group/wa">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl group-hover/wa:bg-green-100 dark:group-hover/wa:bg-green-900/40 transition-colors shrink-0">
                                <MessageCircle className="w-4 h-4 text-green-500 transition-colors" />
                            </div>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400 group-hover/wa:underline">Chat on WhatsApp</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Tags / Metrics */}
            <div className="relative pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap gap-2">
                    {doctor.Vbac && <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">VBAC: {doctor.Vbac}</span>}
                    {doctor.Purdah && <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">Purdah: {doctor.Purdah}</span>}
                    {doctor.Interventions && <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">Interventions: {doctor.Interventions}</span>}
                </div>
            </div>

            {/* Feedback Snippet */}
            {doctor.Feedback && (
                <div className="relative mt-auto pt-2">
                    <div className="relative p-4 bg-gradient-to-br from-blue-50/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-800/20 rounded-2xl rounded-tl-none border border-blue-100/50 dark:border-slate-700/50 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                        {/* Decorative Quote Mark */}
                        <span className="absolute -top-3 left-0 text-3xl text-blue-200 dark:text-slate-600 font-serif leading-none select-none">
                            &quot;
                        </span>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium italic line-clamp-2 relative z-10 leading-relaxed">
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