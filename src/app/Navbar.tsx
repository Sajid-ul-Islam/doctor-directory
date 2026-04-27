"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Languages } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { switchLanguage } from "./actions";

export default function Navbar({ currentLocale }: { currentLocale: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => setMounted(true), []);

    const toggleLanguage = () => {
        const nextLang = currentLocale === "en" ? "bn" : "en";
        startTransition(() => {
            switchLanguage(nextLang);
        });
    };

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="font-black text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">N</div>
                    Natural Birth
                </Link>

                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={toggleLanguage}
                        disabled={isPending}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 disabled:opacity-50"
                        title="Switch Language"
                    >
                        <Languages className="w-5 h-5" />
                        <span className="hidden sm:inline">{currentLocale === "en" ? "EN / বাংলা" : "বাংলা / EN"}</span>
                    </button>

                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}