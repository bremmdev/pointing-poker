import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pointing Poker",
  description: "Easily estimate tasks with your team using Pointing Poker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Toaster
        toastOptions={{
          classNames: {
            toast: "bg-orange-50 border border-orange-600",
            title: "text-orange-600 font-bold",
          },
        }}
      />
      <body className={`${inter.className} text-slate-950 text-base`}>
        <main className="w-11/12 md:w-5/6 max-w-4xl mx-auto py-8 md:py-12 relative">
          <div className="flex flex-col gap-6 relative">
            <h1 className="text-4xl text-orange-600 font-bold tracking-tighter">
              Pointing Poker
            </h1>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
