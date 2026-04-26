import { getDoctorsData } from "./data";
import DoctorList from "./DoctorList";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Doctor Directory - Find Your Specialist",
  description: "Discover top-rated specialists tailored to your preferences, birth plans, and cultural needs.",
};

export default async function HomePage() {
  const doctors = await getDoctorsData();

  return (
    <main className="min-h-screen bg-[#F8FAFC] selection:bg-blue-100 p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col gap-8 pb-8 border-b border-slate-200/80 relative">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
              <Sparkles className="w-3 h-3" />
              <span>Smart Directory</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Find Your Perfect
              </span> Doctor
            </h1>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed">
              Discover top-rated specialists tailored to your preferences, birth plans, and cultural needs.
            </p>
          </div>
        </div>

        {/* List Section */}
        <DoctorList initialDoctors={doctors} />
      </div>
    </main>
  );
}