export const dictionaries = {
    en: {
        smartDirectory: "Smart Directory",
        findPerfect: "Find Your Perfect",
        specialist: "Specialist",
        heroDesc: "Discover top-rated gynecologists and obstetricians tailored to your preferences, birth plans, and cultural needs.",
        trusted: "Trusted Directory",
        verified: "Verified Specialists",
        searchPlaceholder: "Search by name, specialty, or clinic...",
        filters: "Filters",
    },
    bn: {
        smartDirectory: "স্মার্ট ডিরেক্টরি",
        findPerfect: "খুঁজে নিন আপনার সঠিক",
        specialist: "বিশেষজ্ঞ",
        heroDesc: "আপনার পছন্দ, জন্ম পরিকল্পনা এবং সাংস্কৃতিক চাহিদার উপর ভিত্তি করে শীর্ষস্থানীয় গাইনোকোলজিস্ট এবং অবস্টেট্রিশিয়ান খুঁজুন।",
        trusted: "নির্ভরযোগ্য ডিরেক্টরি",
        verified: "যাচাইকৃত বিশেষজ্ঞ",
        searchPlaceholder: "নাম, বিশেষত্ব বা ক্লিনিক দিয়ে খুঁজুন...",
        filters: "ফিল্টার",
    }
} as const;

export type Locale = keyof typeof dictionaries;