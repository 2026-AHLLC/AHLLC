import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";

export default function PortfolioPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <PortfolioHero />
        <PortfolioGrid />
      </main>

      <Footer />
    </>
  );
}