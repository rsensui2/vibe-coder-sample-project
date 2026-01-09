import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DORONUMA | 失敗を資産に変えるSNS",
  description: "過度なポジティブ文化に疲れたあなたへ。旅先や日常の失敗を共有し、笑いと共感に変えましょう。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-950 text-stone-200`}
        >
          <header className="border-b border-stone-800 bg-stone-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-900 bg-clip-text text-transparent">
                DORONUMA
              </Link>
              <nav className="flex items-center gap-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 text-sm font-medium hover:text-yellow-500 transition-colors">ログイン</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 text-sm font-medium bg-yellow-600 text-black rounded-full hover:bg-yellow-500 transition-colors">新規登録</button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t border-stone-800 py-8 bg-stone-900/30 mt-auto">
            <div className="container mx-auto px-4 text-center text-stone-500 text-sm">
              &copy; 2026 DORONUMA. 失敗は最高のエンターテインメント。
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
