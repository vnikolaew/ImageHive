import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/consts";
import Navbar from "@/components/common/Navbar";
import Providers from "@/providers";
import "./globals.css";
import Footer from "@/components/common/Footer";
import { Toaster } from "@/components/ui/sonner";
import CookieConsentBanner from "@/components/common/CookieConsentBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
   title: APP_NAME,
   description: "A photo and media sharing platform",
};

export default function RootLayout({
                                      children,
                                   }: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html suppressHydrationWarning lang="en">
      <head><title>{APP_NAME}</title></head>
      <Providers>
         <body className={cn(`min-h-screen font-sans antialiased `, inter.className)}>
         <Navbar />
         {children}
         <Toaster />
         <CookieConsentBanner />
         <Footer />
         </body>
      </Providers>
      </html>
   );
}
