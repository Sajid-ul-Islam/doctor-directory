import * as cheerio from 'cheerio';
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, Baby, ShieldCheck, UserCheck, EyeOff, User, BadgeCheck, Globe } from "lucide-react";
import { getDoctorsData } from "../../data";
import RatingWidget from "../../RatingWidget";
import { Doctor } from "../../../../types";
import { cookies } from "next/headers";
import { dictionaries, Locale } from "../../dictionaries";

const SUPPORT_EMAIL = "support@yourdirectory.com"; // TODO: Update to your actual support email

// Helper function to fetch external insights (e.g., from NormalDeliveryBD.com)
async function fetchDoctorWebInsights(name: string, specialty?: string) {
  try {
    const query = encodeURIComponent(name);
    const res = await fetch(`https://normaldeliverybd.com/?s=${query}`, {
      next: { revalidate: 604800 } // Cache in Vercel for 1 week (604800 seconds)
    });
    const html = await res.text();

    const $ = cheerio.load(html);
    const isVerified = $('.search-results, .hentry, .post-content').length > 0;
    const extractedText = $('body').text();
    const phoneMatch = extractedText.match(/(?:\+88|01)[0-9\-\s]{9,13}/);
    const scrapedPhone = phoneMatch ? phoneMatch[0].trim() : null;

    return {
      isVerified: isVerified,
      scrapedPhone: scrapedPhone,
      snippet: isVerified
        ? `Records from Normal Delivery BD indicate that ${name} is an active practitioner supportive of normal delivery practices.`
        : `No direct match found on Normal Delivery BD for ${name}. However, they may be listed under a different variation or title.`,
      sourceUrl: `https://normaldeliverybd.com/?s=${query}`,
      googleSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(`${name} ${specialty || ''} doctor Bangladesh`.trim())}`
    };
  } catch (error) {
    console.error("Error scraping insights:", error);
    return {
      isVerified: false,
      scrapedPhone: null,
      snippet: `Unable to fetch live insights for ${name} at this moment.`,
      sourceUrl: `https://normaldeliverybd.com/?s=${encodeURIComponent(name)}`,
      googleSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(`${name} ${specialty || ''} doctor Bangladesh`.trim())}`
    };
  }
}

const formatDoctorName = (name?: string) => {
  if (!name) return "Unnamed Doctor";
  // Strips off any existing titles including repetitive or shorthand ones
  let cleanName = name.replace(/^(?:dr[.\s]+|d[.\s]+|doctor\s+|prof[.\s]+|professor\s+|ডাঃ\s*|ডা[.\s:]+|ড[.\s:]+|ডাক্তার\s+|প্রফেসর\s+|অধ্যাপক\s+)+/gi, '').trim();
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
  const doctor = doctors.find((d: Doctor) => d.Name === decodedName);

  if (!doctor) {
    notFound();
  }

  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
  const isBn = locale === "bn";
  // const t = dictionaries[locale] || dictionaries["en"]; // Ready for when you add translation keys

  const webInsights = await fetchDoctorWebInsights(doctor.Name, doctor.Specialty);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": formatDoctorName(doctor.Name),
    "medicalSpecialty": doctor.Specialty,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": doctor.Location
    },
    "telephone": doctor.Phone || webInsights.scrapedPhone || undefined,
    "email": doctor.Email || undefined,
    "url": webInsights.sourceUrl
  };

  return (
    <main className="min-h-screen bg-transparent dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> {isBn ? "ডিরেক্টরিতে ফিরে যান" : "Back to Directory"}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    {formatDoctorName(doctor.Name)}
                    {webInsights.isVerified && (
                      <span title="Verified via Normal Delivery BD">
                        <BadgeCheck className="w-8 h-8 text-blue-500 fill-blue-50 shrink-0" />
                      </span>
                    )}
                  </h1>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">{doctor.Specialty}</p>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 dark:text-slate-300 mt-8">
                {doctor.Location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.Location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="leading-relaxed hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                      title="View on Google Maps"
                    >
                      {doctor.Location}
                    </a>
                  </div>
                )}
                {(doctor.Phone || webInsights.scrapedPhone) && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                    <a href={`tel:${doctor.Phone || webInsights.scrapedPhone}`} className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">{doctor.Phone || webInsights.scrapedPhone}</a>
                    {!doctor.Phone && webInsights.scrapedPhone && (
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md font-semibold tracking-wide">From Web</span>
                    )}
                  </div>
                )}
                {doctor.Email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                    <a href={`mailto:${doctor.Email}`} className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">{doctor.Email}</a>
                  </div>
                )}
              </div>

              {/* Suggest Edit Block */}
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
                <p className="text-slate-500 dark:text-slate-400">Notice incorrect information?</p>
                <a href={`mailto:${SUPPORT_EMAIL}?subject=${isBn ? "আপডেট রিকোয়েস্ট" : "Update Request for"} ${formatDoctorName(doctor.Name)}`} className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  {isBn ? "সংশোধন প্রস্তাব করুন" : "Suggest an edit"}
                </a>
              </div>
            </div>

            {/* Approach & Practices */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200/60 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Care & Approach</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {doctor.Vbac && (
                  <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-2xl border border-green-100/50 dark:border-green-800/30">
                    <Baby className="h-6 w-6 text-green-600 mb-3" />
                    <p className="text-xs font-bold text-green-800 dark:text-green-500 uppercase tracking-wider mb-1">VBAC Support</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{doctor.Vbac}</p>
                  </div>
                )}
                {doctor.Purdah && (
                  <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-100/50 dark:border-purple-800/30">
                    <EyeOff className="h-6 w-6 text-purple-600 mb-3" />
                    <p className="text-xs font-bold text-purple-800 dark:text-purple-500 uppercase tracking-wider mb-1">Modesty / Purdah</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{doctor.Purdah}</p>
                  </div>
                )}
                {doctor.Presence && (
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
                    <UserCheck className="h-6 w-6 text-blue-600 mb-3" />
                    <p className="text-xs font-bold text-blue-800 dark:text-blue-500 uppercase tracking-wider mb-1">Doctor's Presence</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{doctor.Presence}</p>
                  </div>
                )}
                {doctor.Interventions && (
                  <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100/50 dark:border-amber-800/30">
                    <ShieldCheck className="h-6 w-6 text-amber-600 mb-3" />
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider mb-1">Interventions</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{doctor.Interventions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Web Insights & Verification */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200/60 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-500" />
                Web Insights
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5">
                {webInsights.snippet}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <a href={webInsights.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  View on Normal Delivery BD &rarr;
                </a>
                <a href={webInsights.googleSearchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  Search on Google &rarr;
                </a>
              </div>
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
