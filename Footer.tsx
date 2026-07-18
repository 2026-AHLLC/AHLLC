"use client";

import Link from "next/link";
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

const services = [
  {
    name: "Website Design",
    href: "/services/websites",
  },
  {
    name: "AI Employees",
    href: "/services/ai-employees",
  },
  {
    name: "AI Receptionist",
    href: "/services/ai-receptionist",
  },
  {
    name: "Local SEO",
    href: "/services/local-seo",
  },
];

const company = [
  {
    name: "About",
    href: "/about",
  },
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

const resources = [
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "Case Studies",
    href: "/case-studies",
  },
  {
    name: "Resources",
    href: "/resources",
  },
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
          {/* Company */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-3xl font-black tracking-tight text-white"
            >
              AH LLC
            </Link>

            <p className="mt-5 max-w-md text-zinc-400 leading-7">
              Helping businesses grow with AI automation,
              modern websites, SEO, and intelligent software
              solutions.
            </p>

            <div className="mt-8 space-y-3 text-sm text-zinc-400">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <a
                  href="mailto:hello@ahllc.biz"
                  className="hover:text-white transition-colors"
                >
                  hello@ahllc.biz
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <a
                  href="tel:+16315551234"
                  className="hover:text-white transition-colors"
                >
                  (631) 555-1234
                </a>
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

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Services
            </h3>

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

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Company
            </h3>

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

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Resources
            </h3>

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

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-sm text-zinc-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} AH LLC. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms
            </Link>

            <Link
              href="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
