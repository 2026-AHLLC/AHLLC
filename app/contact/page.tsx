import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata = {
  title: "Contact AH LLC",
  description:
    "Contact AH LLC to discuss AI consulting, website development, SEO, business automation, digital marketing, or custom software development.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl" background="gradient">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="gradient" className="mb-6">
              Contact AH LLC
            </Badge>

            <h1 className="text-5xl font-black text-white md:text-6xl">
              Let's Build Something Great Together
            </h1>

            <p className="mt-8 text-xl leading-8 text-zinc-300">
              Whether you need a new website, AI solutions, SEO,
              automation, or custom software, we'd love to learn more
              about your business and goals.
            </p>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Form */}

            <Card
              variant="glass"
              className="rounded-3xl p-8 lg:col-span-2"
            >
              <h2 className="mb-8 text-3xl font-bold text-white">
                Send Us a Message
              </h2>

              <form className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name</Label>

                    <Input
                      id="name"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">
                      Company
                    </Label>

                    <Input
                      id="company"
                      placeholder="ABC Company"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="email">
                      Email Address
                    </Label>

                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      Phone Number
                    </Label>

                    <Input
                      id="phone"
                      placeholder="(555) 555-5555"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="service">
                    Service Needed
                  </Label>

                  <Input
                    id="service"
                    placeholder="Website Development, SEO, AI Consulting..."
                  />
                </div>

                <div>
                  <Label htmlFor="message">
                    Project Details
                  </Label>

                  <Textarea
                    id="message"
                    rows={7}
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button size="lg" className="w-full">
                  Send Message
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Card>

            {/* Contact Info */}

            <div className="space-y-6">
              <Card
                variant="feature"
                className="rounded-3xl p-8"
              >
                <Mail className="mb-4 h-8 w-8 text-blue-400" />

                <h3 className="text-xl font-bold text-white">
                  Email
                </h3>

                <p className="mt-3 text-zinc-400">
                  hello@ahllc.biz
                </p>
              </Card>

              <Card
                variant="feature"
                className="rounded-3xl p-8"
              >
                <Phone className="mb-4 h-8 w-8 text-blue-400" />

                <h3 className="text-xl font-bold text-white">
                  Phone
                </h3>

                <p className="mt-3 text-zinc-400">
                  (631) 205-3515
                </p>
              </Card>

              <Card
                variant="feature"
                className="rounded-3xl p-8"
              >
                <MapPin className="mb-4 h-8 w-8 text-blue-400" />

                <h3 className="text-xl font-bold text-white">
                  Location
                </h3>

                <p className="mt-3 text-zinc-400">
                  Long Island, New York
                </p>
              </Card>

              <Card
                variant="feature"
                className="rounded-3xl p-8"
              >
                <Clock className="mb-4 h-8 w-8 text-blue-400" />

                <h3 className="text-xl font-bold text-white">
                  Hours
                </h3>

                <p className="mt-3 text-zinc-400">
                  Monday – Friday
                  <br />
                  9:00 AM – 6:00 PM
                </p>
              </Card>
            </div>
          </div>
        </Section>

        <Section background="muted">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-white">
              Ready to Grow Your Business?
            </h2>

            <p className="mt-6 text-lg text-zinc-400">
              Every project begins with a conversation. We'll learn
              about your business, discuss your goals, and recommend
              practical solutions that fit your budget and timeline.
            </p>

            <Button size="lg" className="mt-10">
              Schedule a Free Consultation
            </Button>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}