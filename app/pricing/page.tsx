import Link from "next/link";
import { Check, ArrowRight, HelpCircle } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Pricing | AH LLC",
  description:
    "Transparent pricing for website development, AI consulting, SEO, business automation, digital marketing, and custom software.",
};

const plans = [
  {
    name: "Starter",
    price: "Starting at $1,500",
    featured: false,
    description:
      "Ideal for startups and small businesses looking to establish a professional online presence.",
    features: [
      "Professional Website",
      "Mobile Responsive Design",
      "Basic SEO Setup",
      "Contact Forms",
      "Google Analytics",
      "30 Days Support",
    ],
  },
  {
    name: "Growth",
    price: "Starting at $3,500",
    featured: true,
    description:
      "Our most popular package for businesses focused on lead generation and growth.",
    features: [
      "Everything in Starter",
      "Advanced SEO",
      "AI Integration",
      "Business Automation",
      "Performance Optimization",
      "Conversion Optimization",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom Quote",
    featured: false,
    description:
      "Tailored solutions for organizations needing AI, automation, software, and ongoing consulting.",
    features: [
      "Custom Software",
      "AI Assistants",
      "CRM Integration",
      "Automation Workflows",
      "Dedicated Consulting",
      "Priority Development",
      "Long-Term Support",
    ],
  },
];

const faqs = [
  {
    q: "Do you offer fixed-price projects?",
    a: "Yes. Many website projects have fixed pricing after discovery. Larger software and AI engagements are quoted based on scope.",
  },
  {
    q: "Do you offer monthly plans?",
    a: "Yes. SEO, digital marketing, website maintenance, and AI consulting are available as ongoing monthly services.",
  },
  {
    q: "Can you work with my existing website?",
    a: "Absolutely. We can improve, redesign, or extend your current website instead of rebuilding from scratch.",
  },
  {
    q: "How long do projects take?",
    a: "Most websites launch within 2–6 weeks. Larger custom software and automation projects vary depending on complexity.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl" background="gradient">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="gradient" className="mb-6">
              Pricing
            </Badge>

            <h1 className="text-5xl font-black text-white md:text-6xl">
              Simple, Transparent Pricing
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-zinc-300">
              Whether you need a professional website, AI-powered
              automation, SEO, or custom software, we offer flexible
              solutions designed around your business goals.
            </p>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative rounded-3xl p-8 ${
                  plan.featured
                    ? "border-blue-500 bg-zinc-900 shadow-xl shadow-blue-500/10"
                    : "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                {plan.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}

                <h2 className="text-3xl font-bold text-white">
                  {plan.name}
                </h2>

                <div className="mt-4 text-4xl font-black text-white">
                  {plan.price}
                </div>

                <p className="mt-5 text-zinc-400">
                  {plan.description}
                </p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3"
                    >
                      <Check className="h-5 w-5 text-green-400" />
                      <span className="text-zinc-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="mt-10 w-full"
                  size="lg"
                >
                  <Link href="/contact">
                    Request Proposal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </Section>

        <Section background="muted" spacing="xl">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <Badge variant="outline">FAQ</Badge>

              <h2 className="mt-4 text-4xl font-bold text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq) => (
                <Card
                  key={faq.q}
                  className="rounded-2xl p-6"
                >
                  <div className="flex gap-4">
                    <HelpCircle className="mt-1 h-6 w-6 text-blue-400" />

                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {faq.q}
                      </h3>

                      <p className="mt-3 leading-7 text-zinc-400">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-white">
              Not Sure Which Plan Fits?
            </h2>

            <p className="mt-6 text-lg text-zinc-400">
              Every business is different. Schedule a free consultation,
              and we'll recommend the right solution based on your goals,
              timeline, and budget.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/free-audit">
                  Free Business Audit
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
              >
                <Link href="/contact">
                  Contact Us
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