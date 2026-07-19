"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "What services does AH LLC provide?",
    answer:
      "AH LLC specializes in AI consulting, custom websites, business automation, software development, local SEO, digital marketing, and custom AI integrations designed to help businesses increase efficiency and generate more customers.",
  },
  {
    question: "Do you build custom AI solutions?",
    answer:
      "Yes. We design AI assistants, customer support chatbots, workflow automation, document processing systems, and custom AI integrations tailored to your business goals.",
  },
  {
    question: "Can you redesign my existing website?",
    answer:
      "Absolutely. Whether your website needs a modern design, improved speed, better SEO, or higher conversion rates, we can redesign and optimize it while preserving your existing brand.",
  },
  {
    question: "Do you work with small businesses?",
    answer:
      "Yes. Most of our clients are small and medium-sized businesses looking to grow through technology, automation, and digital marketing.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on scope. Simple websites may take a few weeks, while custom software and AI implementations typically require several weeks or months depending on complexity.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes. We offer maintenance plans, software updates, hosting guidance, SEO improvements, AI optimization, and long-term consulting to ensure your business continues growing.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply schedule a free consultation. We'll discuss your goals, review your current systems, identify opportunities, and recommend the best solution for your business.",
  },
];

export default function FAQ() {
  return (
    <Section
      id="faq"
      spacing="xl"
      background="default"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Badge
          variant="gradient"
          className="mb-5"
        >
          Frequently Asked Questions
        </Badge>

        <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
          Have Questions?
        </h2>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          Here are answers to some of the most common questions
          about working with AH LLC.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-16 max-w-4xl"
      >
        <Accordion
          type="single"
          collapsible
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 backdrop-blur"
            >
              <AccordionTrigger className="py-6 text-left text-lg font-semibold text-white hover:no-underline">
                {faq.question}
              </AccordionTrigger>

              <AccordionContent className="pb-6 text-base leading-7 text-zinc-400">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      <div className="mx-auto mt-20 max-w-3xl rounded-3xl border border-white/10 bg-zinc-900/60 p-10 text-center backdrop-blur">
        <h3 className="text-3xl font-bold text-white">
          Still Have Questions?
        </h3>

        <p className="mt-4 text-lg text-zinc-400">
          Every business is different. Schedule a free consultation,
          and we'll discuss your goals, answer your questions, and
          recommend the right solution for your organization.
        </p>

        <Button
          asChild
          size="lg"
          className="mt-8"
        >
          <Link href="/contact">
            Schedule a Free Consultation

            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}