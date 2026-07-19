"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Your message could not be sent. Please try again."
        );
      }

      form.reset();
      setStatus({
        type: "success",
        message: "Thank you. Your message has been sent successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your message could not be sent. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" autoComplete="name" placeholder="John Smith" minLength={2} maxLength={100} required />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" autoComplete="organization" placeholder="ABC Company" maxLength={120} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(555) 555-5555" maxLength={40} />
        </div>
      </div>

      <div>
        <Label htmlFor="service">Service Needed</Label>
        <Input id="service" name="service" placeholder="Website Development, SEO, AI Consulting..." maxLength={150} required />
      </div>

      <div>
        <Label htmlFor="message">Project Details</Label>
        <Textarea id="message" name="message" rows={7} placeholder="Tell us about your project..." minLength={10} maxLength={5000} required />
      </div>

      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>

      <div aria-live="polite" aria-atomic="true">
        {status.type === "success" && (
          <p className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            {status.message}
          </p>
        )}
        {status.type === "error" && (
          <p className="text-sm text-red-400">{status.message}</p>
        )}
      </div>
    </form>
  );
}
