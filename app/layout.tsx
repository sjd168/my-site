import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Blog",
  description: "A minimal Next.js + Markdown blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <header className="border-b border-black/5 dark:border-white/[.08]">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
            <Link className="font-semibold tracking-tight" href="/">
              My Blog
            </Link>
            <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
              <Link className="hover:underline" href="/">
                Home
              </Link>
              <Link className="hover:underline" href="/blog">
                Blog
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-black/5 py-10 text-center text-sm text-zinc-600 dark:border-white/[.08] dark:text-zinc-400">
          <div className="mx-auto w-full max-w-3xl px-6">
            © {new Date().getFullYear()} My Blog
          </div>
        </footer>
      </body>
    </html>
  );
}
