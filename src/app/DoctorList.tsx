"use client";

import { useState } from "react";
import { Doctor } from "../../types";
import { Search, MapPin, Phone, Mail, User } from "lucide-react";

export default function DoctorList({ initialDoctors }: { initialDoctors: Doctor[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = initialDoctors.filter((doctor) => {
    const query = searchQuery.toLowerCase();
    return (
      (doctor.Name?.toLowerCase().includes(query) ?? false) ||
      (doctor.Specialty?.toLowerCase().includes(query) ?? false) ||
      (doctor.Location?.toLowerCase().includes(query) ?? false)
    );
  });

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm text-gray-900"
          placeholder="Search by name, specialty, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    {doctor.Name || "Unnamed Doctor"}
                  </h3>
                  {doctor.Specialty && (
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase rounded-full border border-blue-100">
                      {doctor.Specialty}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mt-4 flex-grow">
                {doctor.Location && (
                  <p className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    <span>{doctor.Location}</span>
                  </p>
                )}
                {doctor.Phone && (
                  <p className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                    <a href={`tel:${doctor.Phone}`} className="hover:text-blue-600 transition-colors">
                      {doctor.Phone}
                    </a>
                  </p>
                )}
                {doctor.Email && (
                  <p className="flex items-center gap-3 w-full overflow-hidden">
                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                    <a href={`mailto:${doctor.Email}`} className="hover:text-blue-600 transition-colors truncate block">
                      {doctor.Email}
                    </a>
                  </p>
                )}
              </div>

              <a 
                href={doctor.Email ? `mailto:${doctor.Email}` : (doctor.Phone ? `tel:${doctor.Phone}` : '#')}
                className="mt-6 w-full bg-slate-900 text-white rounded-xl py-3 font-medium hover:bg-blue-600 transition-colors focus:ring-4 focus:ring-blue-200 text-center block"
              >
                Contact
              </a>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl border border-gray-200 border-dashed text-center py-16 text-gray-500">
            <Search className="h-10 w-10 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">No doctors found</p>
            <p>We couldn't find anyone matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
