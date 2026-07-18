import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/sections/Hero";
import TrustedBy from "@/components/sections/TrustedBy";
import Services from "@/components/sections/Services";
import Features from "@/components/sections/Features";
import Stats from "@/components/sections/Stats";
import Portfolio from "@/components/sections/Portfolio";
import AIConsultant from "@/components/sections/AIConsultant";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "AH LLC | AI Automation, Websites & Business Growth",
  description:
    "Grow your business with AI-powered automation, modern websites, local SEO, video marketing, and intelligent business solutions from AH LLC.",

  keywords: [
    "AI Automation",
    "Website Design",
    "SEO",
    "AI Receptionist",
    "Business Automation",
    "Marketing Agency",
    "Long Island",
    "Web Development",
    "Lead Generation",
    "AH LLC",
  ],

  openGraph: {
    title: "AH LLC",
    description:
      "Grow your business with AI, automation, websites, and marketing.",
    url: "https://ahllc.biz",
    siteName: "AH LLC",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AH LLC",
    description:
      "AI Automation • Websites • SEO • Business Growth",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-zinc-950 text-white">

        {/* Animated background */}
        <div className="absolute inset-0 -z-10">

          <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[160px]" />

          <div className="absolute right-0 top-[300px] h-[700px] w-[700px] rounded-full bg-violet-600/20 blur-[180px]" />

          <div className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[160px]" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <Hero />

        <TrustedBy />

        <Services />

        <Features />

        <Stats />

        <Portfolio />

        <AIConsultant />

        <Testimonials />

        <Pricing />

        <CTA />

      </main>

      <Footer />
    </>
  );
}
