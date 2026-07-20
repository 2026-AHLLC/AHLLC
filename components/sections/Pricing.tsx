import Link from "next/link";
import { ArrowRight, Check, CreditCard } from "lucide-react";

import Section from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "$999",
    description:
      "For small businesses ready to establish a professional online presence.",
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
      "For businesses that need a complete website, marketing, and automation system.",
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
      "For businesses requiring advanced AI automation, integrations, and custom software.",
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
] as const;

export default function Pricing() {
  return (
    <Section spacing="xl" id="pricing">
      <div className="mx-auto max-w-4xl text-center">
        <Badge variant="gradient" className="mb-6">
          Pricing
        </Badge>

        <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          Simple, Transparent Pricing
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          Choose the package that best matches your current goals. Every
          plan is designed to create measurable business value through
          better websites, automation, and growth systems.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-3">
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

            <h3 className="text-3xl font-bold text-white">
              {plan.name}
            </h3>

            <div className="mt-4 text-4xl font-black text-white">
              {plan.price}
            </div>

            <p className="mt-5 leading-7 text-zinc-400">
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

      <div className="mt-10 text-center">
        <p className="text-sm leading-6 text-zinc-500">
          Need a custom scope or ongoing monthly service?
        </p>

        <Button
          asChild
          variant="link"
          className="mt-2 text-cyan-400 hover:text-cyan-300"
        >
          <Link href="/pricing">
            View full pricing and FAQs
            <ArrowRight
              className="ml-2 h-4 w-4"
              aria-hidden="true"
            />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
