import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { APP_NAME, cn } from "@nx-web/shared";
import Providers from "../providers";
import Navbar from "../components/common/Navbar";
import CookieConsentBanner from "../components/common/CookieConsentBanner";
import Footer from "../components/common/Footer";
import { Toaster } from "@components/sonner";
import darkLogo from "@web/public/ImageHive-logo-dark.png";

import "./global.css";
import ScrollToTopButton from "@web/app/service/_components/ScrollToTopButton";
import PageNavigationLoadingBar from "@web/app/_components/PageNavigationLoadingBar";
import { getUserTheme } from "@web/app/_queries";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
   title: APP_NAME,
   description: "A photo and media sharing platform",
   icons: darkLogo.src,
};

export default async function RootLayout({
                                            children,
                                         }: Readonly<{
   children: React.ReactNode;
}>) {
   const userTheme = await getUserTheme();

   return (
      <html style={{ colorScheme: userTheme ?? `dark` }} suppressHydrationWarning lang="en">
      <head>
      </head>
      <Providers>
         <body className={cn(`min-h-screen font-sans antialiased  `, inter.className)}>
         <PageNavigationLoadingBar />
         <Navbar />
         {children}
         <Toaster />
         <CookieConsentBanner />
         <ScrollToTopButton />
         <Footer />
         </body>
      </Providers>
      </html>
   );
}
