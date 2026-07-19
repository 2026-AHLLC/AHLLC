import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import BookingCalendar from "@/components/booking/BookingCalendar";

import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Book a Free Consultation | AH LLC",
  description:
    "Schedule a free consultation with AH LLC to discuss your website, SEO, AI, automation, or digital marketing project.",
};

export default function BookingPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl" background="gradient">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="gradient" className="mb-6">
              Free Consultation
            </Badge>

            <h1 className="text-5xl font-black text-white md:text-6xl">
              Schedule a Call With AH LLC
            </h1>

            <p className="mt-6 text-xl leading-8 text-zinc-300">
              Choose a convenient time to discuss your business,
              website, marketing, AI, or automation needs.
            </p>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="mx-auto max-w-5xl">
            <BookingCalendar />
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}