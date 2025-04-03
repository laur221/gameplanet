import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Game Planet - Magazin de Periferice Gaming și PC",
  description: "Magazinul tău de încredere pentru periferice gaming, PC-uri, laptopuri și chei pentru jocuri. Găsește cele mai bune produse la prețuri competitive.",
  keywords: "gaming, periferice, PC, laptop, chei jocuri, magazin online",
};

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <div className="flex-grow">
          {children}
        </div>
        <Newsletter />
        <Footer />
      </body>
    </html>
  );
}
