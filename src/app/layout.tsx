import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'WorldAtlas v2.0 - Explore Countries, Maps & Demographics',
  description:
    'High-performance Next.js explorer for all 250 countries and territories with instant search, interactive comparison, trivia quiz, and detailed demographics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f2e8cf] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white transition-colors duration-150">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
        <footer className="border-t border-[#e2d5b5] dark:border-slate-800 bg-[#f2e8cf]/80 dark:bg-slate-950/80 py-6 text-center text-xs text-slate-600 dark:text-slate-400">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[100px] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              WorldAtlas v2.0 • Next.js 15, React 19 & Tailwind CSS
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              All 250 Countries • Zero-Latency Offline Dataset
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
