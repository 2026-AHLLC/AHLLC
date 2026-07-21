"use client";

import type { Route } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Menu,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = {
  title: string;
  href: Route;
  description: string;
};

const navigation: NavItem[] = [
  {
    title: "Home",
    href: "/",
    description: "Return to the AH LLC homepage.",
  },
  {
    title: "Services",
    href: "/services",
    description: "Explore AI, websites, automation, SEO, and software.",
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    description: "See selected client work and digital projects.",
  },
  {
    title: "Pricing",
    href: "/pricing",
    description: "Compare packages and secure checkout options.",
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Start a conversation about your project.",
  },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-3"
          aria-label="AH LLC home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <Sparkles
              className="h-4 w-4 text-cyan-400"
              aria-hidden="true"
            />
          </span>

          <span className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tight text-white">
              AH LLC
            </span>
            <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:block">
              AI • Automation • Growth
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              {item.title}
            </Link>
          ))}

          <Button asChild>
            <Link href="/free-audit">
              Free Audit
              <ArrowRight
                className="ml-2 h-4 w-4"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:text-white"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[88vw] max-w-sm border-white/10 bg-zinc-950 p-0 text-white"
            >
              <div className="flex min-h-full flex-col">
                <SheetHeader className="border-b border-white/10 px-6 py-6 text-left">
                  <SheetTitle className="flex items-center gap-3 text-white">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                      <Sparkles
                        className="h-5 w-5 text-cyan-400"
                        aria-hidden="true"
                      />
                    </span>

                    <span>
                      <span className="block text-lg font-black">
                        AH LLC
                      </span>
                      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        AI • Automation • Growth
                      </span>
                    </span>
                  </SheetTitle>

                  <SheetDescription className="pt-3 leading-6 text-zinc-400">
                    Digital systems built to help your business operate
                    smarter and grow faster.
                  </SheetDescription>
                </SheetHeader>

                <nav
                  className="flex-1 px-4 py-5"
                  aria-label="Mobile navigation"
                >
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <SheetClose asChild key={item.title}>
                        <Link
                          href={item.href}
                          className="group flex min-h-16 items-center justify-between rounded-2xl border border-transparent px-4 py-3 transition hover:border-white/10 hover:bg-white/[0.04]"
                        >
                          <span>
                            <span className="block text-base font-semibold text-white">
                              {item.title}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-zinc-500">
                              {item.description}
                            </span>
                          </span>

                          <ArrowRight
                            className="ml-4 h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-400"
                            aria-hidden="true"
                          />
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </nav>

                <div className="border-t border-white/10 bg-zinc-900/40 p-5">
                  <SheetClose asChild>
                    <Button
                      asChild
                      size="lg"
                      className="w-full rounded-xl"
                    >
                      <Link href="/free-audit">
                        Get Your Free Business Audit
                        <ArrowRight
                          className="ml-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      </Link>
                    </Button>
                  </SheetClose>

                  <p className="mt-3 text-center text-xs leading-5 text-zinc-500">
                    No obligation. Get clear recommendations for your
                    website, marketing, and automation.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
