import Link from "next/link";
import {
  ArrowRight,
  Search,
  MapPin,
  LineChart,
  FileText,
  Wrench,
  BarChart3,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "SEO Services | AH LLC",
  description:
    "Professional SEO services including local SEO, technical SEO, keyword research, content optimization, and Google Business Profile management.",
};

const services = [
  {
    icon: MapPin,
    title: "Local SEO",
    description:
      "Improve visibility in Google Maps and local search results to attract nearby customers.",
  },
  {
    icon: Search,
    title: "Keyword Research",
    description:
      "Identify the search terms your ideal customers are using and build a strategy around them.",
  },
  {
    icon: Wrench,
    title: "Technical SEO",
    description:
      "Improve site speed, crawlability, structured data, indexing, and Core Web Vitals.",
  },
  {
    icon: FileText,
    title: "Content Optimization",
    description:
      "Create and optimize content that answers customer questions and ranks for valuable searches.",
  },
  {
    icon: LineChart,
    title: "SEO Audits",
    description:
      "Comprehensive audits identifying opportunities to improve rankings and website performance.",
  },
  {
    icon: BarChart3,
    title: "Performance Reporting",
    description:
      "Monthly reporting with keyword rankings, traffic insights, conversions, and actionable recommendations.",
  },
];

const benefits = [
  "Higher Google rankings",
  "More qualified website visitors",
  "Improved Google Maps visibility",
  "Increased phone calls and leads",
  "Long-term organic traffic growth",
  "Data-driven optimization",
];

export default function SEOPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl" background="gradient">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="gradient" className="mb-6">
              Search Engine Optimization
            </Badge>

            <h1 className="text-5xl font-black text-white md:text-6xl">
              Get Found by the
              <br />
              Customers Searching for You
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-zinc-300">
              Search engine optimization helps your business appear where
              customers are already looking. We combine technical SEO,
              local optimization, and high-quality content to improve
              visibility and generate qualified leads.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">
                  Request an SEO Audit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/portfolio">
                  View Results
                </Link>
              </Button>
            </div>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-white">
              Complete SEO Services
            </h2>

            <p className="mt-5 text-lg text-zinc-400">
              Our SEO strategy combines technical improvements,
              content optimization, and local search to increase
              your online visibility.
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

        <Section spacing="xl" background="muted">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold text-white">
                Why Invest in SEO?
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Organic search continues to be one of the highest-return
                marketing channels. Effective SEO helps customers find
                your business when they're actively looking for your
                products or services.
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
              <TrendingUp className="mb-6 h-12 w-12 text-blue-400" />

              <h3 className="text-3xl font-bold text-white">
                Free SEO Audit
              </h3>

              <p className="mt-6 leading-8 text-zinc-400">
                We'll evaluate your website's technical health, search
                visibility, keyword opportunities, local SEO, and
                competitor landscape, then provide practical
                recommendations to improve your rankings.
              </p>

              <Button
                asChild
                size="lg"
                className="mt-10 w-full"
              >
                <Link href="/contact">
                  Request Your Free Audit
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