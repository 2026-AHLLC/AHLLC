"use client";

import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import Section from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured: boolean;
  cta: Route;
};

const plans: PricingPlan[] = [
  {
    name: "Starter",
    price: "$999",
    description: "Perfect for small businesses getting online.",
    featured: false,
    cta: "/contact",
    features: [
      "Professional Website",
      "Mobile Responsive",
      "Basic SEO",
      "Contact Forms",
      "Google Maps",
      "30 Days Support",
    ],
  },
  {
    name: "Growth",
    price: "$2,499",
    description: "Our most popular package for growing businesses.",
    featured: true,
    cta: "/contact",
    features: [
      "Everything in Starter",
      "AI Integration",
      "Advanced SEO",
      "Analytics Dashboard",
      "Speed Optimization",
      "90 Days Support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for larger organizations.",
    featured: false,
    cta: "/contact",
    features: [
      "Custom Software",
      "Business Automation",
      "AI Consulting",
      "Dedicated Support",
      "API Integrations",
      "Ongoing Development",
    ],
  },
];

export default function Pricing() {
  return (
    <Section spacing="xl">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Badge variant="gradient">Pricing</Badge>

          <h2 className="mt-6 text-5xl font-black text-white">
            Simple, Transparent Pricing
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl text-zinc-400">
            Choose the plan that best fits your business. Every project is
            designed to deliver measurable value and long-term growth.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              variant={plan.featured ? "feature" : "glass"}
              className={`flex flex-col rounded-3xl p-8 ${
                plan.featured ? "border-blue-500" : ""
              }`}
            >
              <h3 className="text-2xl font-bold text-white">
                {plan.name}
              </h3>

              <p className="mt-4 text-5xl font-black text-white">
                {plan.price}
              </p>

              <p className="mt-4 text-zinc-400">
                {plan.description}
              </p>

              <ul className="mt-8 space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-zinc-300"
                  >
                    <Check className="h-5 w-5 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className="mt-10"
                variant={plan.featured ? "default" : "outline"}
              >
                <Link href={plan.cta}>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}