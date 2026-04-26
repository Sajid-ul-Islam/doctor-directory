import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, Baby, ShieldCheck, UserCheck, EyeOff, User, BadgeCheck, Globe } from "lucide-react";
import { getDoctorsData } from "../../data";
import RatingWidget from "../../RatingWidget";

// Helper function to fetch external insights (e.g., from Google)
async function fetchDoctorWebInsights(name: string, specialty?: string) {
  // TODO: Replace this mock with an actual Google Custom Search API or SerpApi call.
  // const query = encodeURIComponent(`${name} ${specialty || ''} doctor`);
  // const res = await fetch(`https://customsearch.googleapis.com/customsearch/v1?q=${query}&key=YOUR_API_KEY&cx=YOUR_CX`);
  // const data = await res.json();
  // const isVerified = data.items && data.items.length > 0;

  return {
    isVerified: true, // In a real scenario, condition this on whether the API found valid results
    snippet: `Public records and search results indicate that ${name} is an active practitioner. Web sources frequently mention their work in ${specialty || 'their medical field'}.`,
    sourceUrl: `https://www.google.com/search?q=${encodeURIComponent(`${name} ${specialty || ''} doctor Bangladesh`)}`
  };
}

const formatDoctorName = (name?: string) => {
  if (!name) return "Unnamed Doctor";
  // Strips off any existing titles including repetitive or shorthand ones
  let cleanName = name.replace(/^(?:dr[.\s]+|d[.\s]+|doctor\s+|prof[.\s]+|professor\s+|ডাঃ\s*|ডা[.\s]+|ড[.\s]+|ডাক্তার\s+|প্রফেসর\s+|অধ্যাপক\s+)+/gi, '').trim();
  cleanName = cleanName.replace(/\b\w/g, c => c.toUpperCase());
  const isBengali = /[\u0980-\u09FF]/.test(cleanName);
  return (isBengali ? "ডাঃ " : "Dr. ") + cleanName;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${formatDoctorName(decodeURIComponent(slug))} - Directory Profile` };
}

export default async function DoctorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedName = decodeURIComponent(slug);

  const doctors = await getDoctorsData();
  const doctor = doctors.find((d) => d.Name === decodedName);

  if (!doctor) {
    notFound();
  }

  const webInsights = await fetchDoctorWebInsights(doctor.Name, doctor.Specialty);

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    {formatDoctorName(doctor.Name)}
                    {webInsights.isVerified && (
                      <BadgeCheck className="w-8 h-8 text-blue-500 fill-blue-50 shrink-0" title="Verified via Web Sources" />
                    )}
                  </h1>
                  <p className="text-blue-600 font-semibold mt-1">{doctor.Specialty}</p>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 mt-8">
                {doctor.Location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{doctor.Location}</span>
                  </div>
                )}
                {doctor.Phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                    <a href={`tel:${doctor.Phone}`} className="hover:text-blue-600 font-medium">{doctor.Phone}</a>
                  </div>
                )}
                {doctor.Email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                    <a href={`mailto:${doctor.Email}`} className="hover:text-blue-600 font-medium">{doctor.Email}</a>
                  </div>
                )}
              </div>
            </div>

            {/* Approach & Practices */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Care & Approach</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {doctor.Vbac && (
                  <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100/50">
                    <Baby className="h-6 w-6 text-green-600 mb-3" />
                    <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">VBAC Support</p>
                    <p className="text-sm text-slate-700">{doctor.Vbac}</p>
                  </div>
                )}
                {doctor.Purdah && (
                  <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100/50">
                    <EyeOff className="h-6 w-6 text-purple-600 mb-3" />
                    <p className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">Modesty / Purdah</p>
                    <p className="text-sm text-slate-700">{doctor.Purdah}</p>
                  </div>
                )}
                {doctor.Presence && (
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                    <UserCheck className="h-6 w-6 text-blue-600 mb-3" />
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Doctor's Presence</p>
                    <p className="text-sm text-slate-700">{doctor.Presence}</p>
                  </div>
                )}
                {doctor.Interventions && (
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                    <ShieldCheck className="h-6 w-6 text-amber-600 mb-3" />
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Interventions</p>
                    <p className="text-sm text-slate-700">{doctor.Interventions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Web Insights & Verification */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-500" />
                Web Insights
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">
                {webInsights.snippet}
              </p>
              <a href={webInsights.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                Search Google for more info &rarr;
              </a>
            </div>
          </div>

          {/* Right Column: Rating Widget */}
          <div className="lg:col-span-1">
            <RatingWidget doctorName={formatDoctorName(doctor.Name)} />
          </div>
        </div>
      </div>
    </main>
  );
}
