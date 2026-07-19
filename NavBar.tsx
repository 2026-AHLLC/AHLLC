"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "AI Solutions", href: "/ai" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Pricing", href: "/pricing" },
  { name: "Resources", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-zinc-950/75 border-b border-white/10 shadow-xl"
            : "bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Logo */}

          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>

            <div>
              <div className="font-bold tracking-tight text-white text-xl">
                AH LLC
              </div>

              <div className="text-xs text-zinc-400">
                AI • Automation • Growth
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-sm font-medium transition ${
                    active
                      ? "text-white"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {item.name}

                  {active && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full bg-blue-500"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}

          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-2xl"
            >
              Get Free Growth Plan
            </Link>
          </div>

          {/* Mobile */}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-white lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col px-8 pt-28">
              <nav className="space-y-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block text-2xl font-semibold ${
                      pathname === item.href
                        ? "text-blue-400"
                        : "text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-10">
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 text-lg font-semibold text-white"
                >
                  Get Free Growth Plan
                </Link>
              </div>

              <div className="mt-auto pb-10 text-center text-sm text-zinc-500">
                © {new Date().getFullYear()} AH LLC
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
