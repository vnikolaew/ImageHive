import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/consts";
import Navbar from "@/components/common/Navbar";
import Providers from "@/providers";
import "./globals.css";
import Footer from "@/components/common/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
   title: APP_NAME,
   description: "A photo-sharing app",
};

export default function RootLayout({
                                      children,
                                   }: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html suppressHydrationWarning lang="en">
      <head><title>{APP_NAME}</title></head>
      <body className={cn(`min-h-screen font-sans antialiased `, inter.className)}>
      <Providers>
         <Navbar />
         {children}
         <Toaster />
         <Footer />
      </Providers>
      </body>
      </html>
   );
}
