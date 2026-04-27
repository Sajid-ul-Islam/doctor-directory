import { getDoctorsData } from "./data";
import DoctorList from "./DoctorList";
import { Sparkles, ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";
import { dictionaries, Locale } from "./dictionaries";

export const metadata = {
  title: "Natural Birth - Find Your Specialist",
  description: "Discover top-rated specialists tailored to your preferences, birth plans, and cultural needs.",
};

export default async function HomePage() {
  const doctors = await getDoctorsData();

  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
  const t = dictionaries[locale];

  return (
    <main className="min-h-screen bg-transparent dark:bg-slate-950 selection:bg-blue-100 dark:selection:bg-blue-900/50 p-4 md:p-8 lg:p-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 pb-12 border-b border-slate-200/80 dark:border-slate-800/80 relative">
          <div className="space-y-6 max-w-2xl flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-800/50">
              <Sparkles className="w-3 h-3" />
              <span>{t.smartDirectory}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                {t.findPerfect}
              </span><br />
              {t.specialist}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-lg">
              {t.heroDesc}
            </p>
          </div>

          {/* Hero Cover Photo Section */}
          <div className="flex-1 w-full max-w-md lg:max-w-none relative mt-4 lg:mt-0 group">
            <style>{`
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
                100% { transform: translateY(0px); }
              }
            `}</style>
            <div
              className="aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-blue-50 dark:bg-slate-900 relative"
              style={{ animation: 'float 6s ease-in-out infinite' }}
            >
              {/* NOTE: We are using a standard <img> tag to avoid next.config.js external domain restrictions. */}
              <img
                src="https://image.pollinations.ai/prompt/A%203D%20animated%20Pixar%20style%20illustration%20of%20a%20friendly%20female%20Muslim%20doctor%20wearing%20a%20hijab%20and%20a%20white%20coat%20with%20a%20stethoscope,%20smiling%20warmly,%20soft%20blue%20background?width=800&height=800&nologo=true"
                alt="AI Generated 3D Hijabi Gynecologist"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Trusted Directory</p>
                <p className="text-base font-black text-slate-800 dark:text-slate-200">{t.verified}</p>
              </div>
            </div>
          </div>
        </div>

        {/* List Section */}
        <DoctorList initialDoctors={doctors} locale={locale} />
      </div>
    </main>
  );
}