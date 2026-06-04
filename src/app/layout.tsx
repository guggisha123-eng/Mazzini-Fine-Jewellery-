import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mazzini Fine Jewellery - Adorn Yourself With Timeless Elegance",
  description: "Discover exquisite gold-plated jewellery at Mazzini Fine Jewellery. Handcrafted Kundan, Polki, and contemporary designs. Free shipping across India.",
  keywords: ["Mazzini", "Fine Jewellery", "Gold-Plated", "Kundan", "Polki", "Indian Jewellery", "Handcrafted"],
  authors: [{ name: "Mazzini Fine Jewellery" }],
  openGraph: {
    title: "Mazzini Fine Jewellery",
    description: "Adorn Yourself With Timeless Elegance",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased bg-[#1c1917] text-stone-100`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
