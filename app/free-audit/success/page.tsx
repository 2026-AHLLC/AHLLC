import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  Mail,
  ArrowRight,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Audit Submitted | AH LLC",
  description:
    "Your free AI Business Growth Audit has been received. We'll review your business and contact you with personalized recommendations.",
};

export default function AuditSuccessPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl" background="gradient">
          <div className="mx-auto max-w-4xl text-center">
            <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-green-500" />

            <Badge variant="gradient" className="mb-6">
              Audit Submitted
            </Badge>

            <h1 className="text-5xl font-black text-white md:text-6xl">
              Thank You!
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-zinc-300">
              We've received your Business Growth Audit request.
              Our team will review your information and prepare
              personalized recommendations designed to help your
              business grow.
            </p>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-3">
            <Card variant="feature" className="rounded-3xl p-8 text-center">
              <Mail className="mx-auto mb-5 h-10 w-10 text-blue-400" />

              <h3 className="text-2xl font-bold text-white">
                1. We Review
              </h3>

              <p className="mt-4 text-zinc-400 leading-7">
                We'll analyze your website, marketing, SEO,
                automation opportunities, and overall digital
                presence.
              </p>
            </Card>

            <Card variant="feature" className="rounded-3xl p-8 text-center">
              <CheckCircle2 className="mx-auto mb-5 h-10 w-10 text-green-400" />

              <h3 className="text-2xl font-bold text-white">
                2. We Prepare
              </h3>

              <p className="mt-4 text-zinc-400 leading-7">
                You'll receive practical recommendations and a
                prioritized action plan tailored to your business.
              </p>
            </Card>

            <Card variant="feature" className="rounded-3xl p-8 text-center">
              <Calendar className="mx-auto mb-5 h-10 w-10 text-purple-400" />

              <h3 className="text-2xl font-bold text-white">
                3. We Meet
              </h3>

              <p className="mt-4 text-zinc-400 leading-7">
                If you'd like, we'll walk through the audit together
                and discuss solutions that fit your goals and budget.
              </p>
            </Card>
          </div>
        </Section>

        <Section background="muted" spacing="xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-white">
              Want to Skip the Wait?
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Schedule a free strategy session now, and we'll review
              your business together while your audit is being
              prepared.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">
                  Schedule a Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/portfolio">
                  View Our Portfolio
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}