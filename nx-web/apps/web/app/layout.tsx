import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { APP_NAME, cn } from "@nx-web/shared";
import Providers from "../providers";
import Navbar from "../components/common/Navbar";
import CookieConsentBanner from "../components/common/CookieConsentBanner";
import Footer from "../components/common/Footer";
import { Toaster } from "@components/sonner";

import "./global.css"

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
