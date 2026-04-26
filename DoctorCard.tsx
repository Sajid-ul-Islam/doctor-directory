import { Doctor } from "../types";
import { MapPin, Phone, Mail, Star, HeartPulse } from "lucide-react";

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow duration-300 flex flex-col gap-4">
            {/* Header: Name and Sentiment */}
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                        {doctor.Name}
                    </h3>
                    <p className="text-sm font-medium text-blue-600 flex items-center gap-1.5 mt-1.5">
                        <HeartPulse className="w-4 h-4" />
                        {doctor.Specialty}
                    </p>
                </div>
                <div className="flex items-center shrink-0 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {doctor.SentimentScore}/10
                </div>
            </div>

            {/* Contact & Location Details */}
            <div className="space-y-2.5 text-sm text-slate-600">
                <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{doctor.Location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{doctor.Phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{doctor.Email}</span>
                </div>
            </div>

            {/* Tags / Metrics */}
            <div className="flex flex-wrap gap-2 mt-2">
                {doctor.Vbac && <span className="bg-slate-50 border border-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">VBAC: {doctor.Vbac}</span>}
                {doctor.Purdah && <span className="bg-slate-50 border border-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">Purdah: {doctor.Purdah}</span>}
                {doctor.Interventions && <span className="bg-slate-50 border border-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">Interventions: {doctor.Interventions}</span>}
                {doctor.Presence && <span className="bg-slate-50 border border-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">Presence: {doctor.Presence}</span>}
            </div>

            {/* Feedback Snippet */}
            {doctor.Feedback && (
                <div className="mt-auto pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500 italic line-clamp-2">
                        "{doctor.Feedback}"
                    </p>
                </div>
            )}
        </div>
    );
}