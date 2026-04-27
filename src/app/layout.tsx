import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import Navbar from "./Navbar";
import { cookies } from "next/headers";
import { Locale } from "./dictionaries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Natural Birth",
  description: "Natural Birth Directory - Empowering Your Journey",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <Navbar currentLocale={locale} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
