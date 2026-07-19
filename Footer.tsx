"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";

type FooterLink = {
  name: string;
  href: Route;
};

const services: FooterLink[] = [
  {
    name: "Website Design",
    href: "/services/website-development",
  },
  {
    name: "AI Consulting",
    href: "/services/ai-consulting",
  },
  {
    name: "Business Automation",
    href: "/services/business-automation",
  },
  {
    name: "SEO",
    href: "/services/seo",
  },
];

const company: FooterLink[] = [
  {
    name: "Portfolio",
    href: "/portfolio",
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

const resources: FooterLink[] = [
  {
    name: "Free AI Audit",
    href: "/free-audit",
  },
];

const socials = [
  {
    icon: Facebook,
    href: "#",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "#",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "#",
    label: "LinkedIn",
  },
  {
    icon: Github,
    href: "#",
    label: "GitHub",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-3xl font-black tracking-tight text-white"
            >
              AH LLC
            </Link>

            <p className="mt-5 max-w-md leading-7 text-zinc-400">
              Helping businesses grow with AI automation, modern websites, SEO,
              and intelligent software solutions.
            </p>

            <div className="mt-8 space-y-3 text-sm text-zinc-400">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <a href="mailto:hello@ahllc.biz">hello@ahllc.biz</a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <a href="tel:+16315551234">(631) 555-1234</a>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>Long Island, New York</span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 text-zinc-400 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Services</h3>

            <ul className="mt-6 space-y-4">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
                  >
                    {item.name}
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Company</h3>

            <ul className="mt-6 space-y-4">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
                  >
                    {item.name}
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Resources</h3>

            <ul className="mt-6 space-y-4">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
                  >
                    {item.name}
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-8 text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} AH LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
