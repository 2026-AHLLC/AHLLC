import Link from "next/link";
import {
  ArrowRight,
  Check,
  CreditCard,
  HelpCircle,
} from "lucide-react";

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

const CALENDAR_URL = "https://cal.com/john-egan-2025/30min";

const plans = [
  {
    name: "Starter",
    price: "$999",
    description:
      "For small businesses ready to improve their online presence.",
    features: [
      "Professional website",
      "Basic SEO setup",
      "Lead capture system",
      "30 days of support",
    ],
    cta: "Purchase Starter",
    paymentLink:
      "https://buy.stripe.com/aFaeVc21163DcEh6dw1ZS01",
    featured: false,
  },
  {
    name: "Growth",
    price: "$1,999",
    description:
      "For businesses that need a complete growth system.",
    features: [
      "Custom website",
      "Advanced SEO",
      "CRM integration",
      "Business automation",
      "90 days of support",
    ],
    cta: "Purchase Growth",
    paymentLink:
      "https://buy.stripe.com/8x25kCfRRcs1eMpdFY1ZS02",
    featured: true,
  },
  {
    name: "Scale",
    price: "$3,999",
    description:
      "For businesses requiring custom automation and software.",
    features: [
      "Custom software development",
      "AI automation systems",
      "Advanced integrations",
      "Growth strategy",
      "Priority support",
    ],
    cta: "Purchase Scale",
    paymentLink:
      "https://buy.stripe.com/00wbJ0bBB77HeMp9pI1ZS03",
    featured: false,
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
  {
    q: "Is payment processed securely?",
    a: "Yes. Payments are securely processed through Stripe. AH LLC does not directly store your card details.",
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
                className={`relative flex h-full flex-col rounded-3xl p-8 ${
                  plan.featured
                    ? "border-blue-500 bg-zinc-900 shadow-xl shadow-blue-500/10"
                    : "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                {plan.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
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

                <ul className="mt-8 flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <Check
                        className="mt-0.5 h-5 w-5 shrink-0 text-green-400"
                        aria-hidden="true"
                      />

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
                  variant={plan.featured ? "default" : "outline"}
                >
                  <a
                    href={plan.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${plan.cta} securely through Stripe`}
                  >
                    <CreditCard
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    {plan.cta}
                    <ArrowRight
                      className="ml-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  </a>
                </Button>

                <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
                  Secure checkout powered by Stripe
                </p>
              </Card>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-zinc-500">
            Package pricing covers the listed scope. Additional
            features, integrations, content, or custom requirements may
            require a separate proposal.
          </p>
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
                    <HelpCircle
                      className="mt-1 h-6 w-6 shrink-0 text-blue-400"
                      aria-hidden="true"
                    />

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
              Every business is different. Schedule a free consultation
              and we will recommend the right solution based on your
              goals, timeline, and budget.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
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
                <a
                  href={CALENDAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a Free Consultation
                  <ArrowRight
                    className="ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
                </a>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}