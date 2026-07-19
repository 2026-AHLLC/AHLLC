import Link from "next/link";
import {
  ArrowRight,
  Megaphone,
  Search,
  PenSquare,
  Share2,
  Mail,
  BarChart3,
  Target,
  CheckCircle2,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Digital Marketing Services | AH LLC",
  description:
    "Grow your business with digital marketing strategies including SEO, content marketing, social media, paid advertising, email marketing, analytics, and AI-powered marketing automation.",
};

const services = [
  {
    icon: Search,
    title: "Search Marketing",
    description:
      "Increase visibility through SEO, local search optimization, and paid search campaigns.",
  },
  {
    icon: PenSquare,
    title: "Content Marketing",
    description:
      "Publish valuable content that builds trust, answers customer questions, and improves search rankings.",
  },
  {
    icon: Share2,
    title: "Social Media",
    description:
      "Create consistent social media strategies that strengthen your brand and engage your audience.",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description:
      "Automated email campaigns that nurture leads, increase customer retention, and drive repeat business.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description:
      "Track traffic, leads, conversions, and marketing performance with clear reporting and actionable insights.",
  },
  {
    icon: Target,
    title: "Lead Generation",
    description:
      "Build integrated marketing systems that consistently generate qualified leads for your business.",
  },
];

const benefits = [
  "Generate more qualified leads",
  "Increase website traffic",
  "Improve conversion rates",
  "Strengthen brand awareness",
  "Measure marketing ROI",
  "Create sustainable long-term growth",
];

export default function DigitalMarketingPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl" background="gradient">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="gradient"
              className="mb-6"
            >
              Digital Marketing
            </Badge>

            <h1 className="text-5xl font-black text-white md:text-6xl">
              Marketing That
              <br />
              Produces Measurable Growth
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-zinc-300">
              Great marketing isn't about chasing trends—it's about
              connecting with the right audience at the right time.
              We combine strategy, content, SEO, advertising, and AI
              automation to help businesses generate consistent,
              measurable growth.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">
                  Schedule a Marketing Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/free-audit">
                  Request a Marketing Audit
                </Link>
              </Button>
            </div>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-white">
              Complete Marketing Services
            </h2>

            <p className="mt-5 text-lg text-zinc-400">
              We build marketing systems designed to attract visitors,
              convert prospects, and create long-term customer
              relationships.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Card
                  key={service.title}
                  variant="feature"
                  className="rounded-3xl p-8"
                >
                  <Icon className="mb-6 h-10 w-10 text-blue-400" />

                  <h3 className="text-2xl font-bold text-white">
                    {service.title}
                  </h3>

                  <p className="mt-4 leading-7 text-zinc-400">
                    {service.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section
          spacing="xl"
          background="muted"
        >
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold text-white">
                Marketing Built Around Results
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Every business is different. Instead of offering
                one-size-fits-all campaigns, we build marketing
                strategies tailored to your goals, industry,
                competition, and ideal customers.
              </p>

              <div className="mt-8 grid gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-400" />

                    <span className="text-zinc-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Card
              variant="glass"
              className="rounded-3xl p-10"
            >
              <Megaphone className="mb-6 h-12 w-12 text-blue-400" />

              <h3 className="text-3xl font-bold text-white">
                Free Marketing Assessment
              </h3>

              <p className="mt-6 leading-8 text-zinc-400">
                We'll evaluate your current marketing efforts,
                website, search visibility, social media presence,
                and lead generation strategy, then provide practical
                recommendations for improving your results.
              </p>

              <Button
                asChild
                size="lg"
                className="mt-10 w-full"
              >
                <Link href="/contact">
                  Request Your Assessment
                </Link>
              </Button>
            </Card>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}