import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cashcrow | Inventory Management",
  description: "Production-ready inventory management system built with Next.js, Tailwind v4, and Supabase.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="top-right" richColors closeButton duration={3000} />
      </body>
    </html>
  );
}
