"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Globe2,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  auditFocus: string;
  challenge: string;
  goal: string;
  budget: string;
  timeline: string;
  consent: boolean;
  companyWebsite: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  auditFocus: "",
  challenge: "",
  goal: "",
  budget: "",
  timeline: "",
  consent: false,
  companyWebsite: "",
};

const auditFeatures = [
  {
    icon: Globe2,
    title: "Website conversion",
    description:
      "Review messaging, structure, calls to action, trust signals, and mobile usability.",
  },
  {
    icon: Search,
    title: "SEO visibility",
    description:
      "Identify technical and content opportunities that can improve search performance.",
  },
  {
    icon: Bot,
    title: "AI and automation",
    description:
      "Find repetitive processes that can be streamlined with AI-powered workflows.",
  },
  {
    icon: TrendingUp,
    title: "Growth priorities",
    description:
      "Receive a practical list of the highest-leverage improvements to make first.",
  },
];

function normalizeWebsite(value: string) {
  const website = value.trim();

  if (!website) {
    return "";
  }

  return /^https?:\/\//i.test(website)
    ? website
    : `https://${website}`;
}

export default function FreeAuditPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const completion = useMemo(() => {
    const fields = [
      form.name,
      form.email,
      form.company,
      form.auditFocus,
      form.challenge,
      form.goal,
      form.timeline,
    ];

    const completed = fields.filter(
      (value) => value.trim().length > 0,
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [form]);

  function updateField<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.consent) {
      setError(
        "Please confirm that AH LLC may contact you about your audit request.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/free-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          website: normalizeWebsite(form.website),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Your audit request could not be submitted.",
        );
      }

      router.push("/free-audit/success");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Your audit request could not be submitted.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.16),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(37,99,235,0.14),transparent_32%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              <Sparkles className="h-4 w-4" />
              Free business growth audit
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find the fastest path to{" "}
              <span className="text-cyan-400">more leads</span>{" "}
              and smarter growth.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              AH LLC will review your website, SEO, marketing,
              automation, and AI opportunities, then identify the
              strongest next steps for your business.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {auditFeatures.map(
                ({ icon: Icon, title, description }) => (
                  <article
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur"
                  >
                    <Icon className="h-5 w-5 text-cyan-400" />
                    <h2 className="mt-4 font-semibold">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {description}
                    </p>
                  </article>
                ),
              )}
            </div>

            <div className="mt-8 flex items-start gap-3 text-sm text-zinc-400">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <p>
                No obligation and no automated sales pressure. Your
                information is used only to review and respond to your
                request.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900/85 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-cyan-400">
                    Business audit request
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    Tell us about your business
                  </h2>
                </div>

                <span className="text-sm text-zinc-400">
                  {completion}% complete
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-[width] duration-300"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className="absolute left-[-9999px] h-px w-px overflow-hidden"
                aria-hidden="true"
              >
                <label htmlFor="companyWebsite">
                  Leave this field blank
                </label>
                <input
                  id="companyWebsite"
                  name="companyWebsite"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.companyWebsite}
                  onChange={(event) =>
                    updateField(
                      "companyWebsite",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <TextInput
                  label="Your name"
                  required
                  value={form.name}
                  onChange={(value) => updateField("name", value)}
                  placeholder="John Egan"
                  autoComplete="name"
                />

                <TextInput
                  label="Business name"
                  required
                  value={form.company}
                  onChange={(value) =>
                    updateField("company", value)
                  }
                  placeholder="Your company"
                  autoComplete="organization"
                />

                <TextInput
                  label="Email address"
                  required
                  type="email"
                  value={form.email}
                  onChange={(value) => updateField("email", value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />

                <TextInput
                  label="Phone number"
                  type="tel"
                  value={form.phone}
                  onChange={(value) => updateField("phone", value)}
                  placeholder="(631) 555-0123"
                  autoComplete="tel"
                />
              </div>

              <TextInput
                label="Website"
                type="text"
                value={form.website}
                onChange={(value) => updateField("website", value)}
                placeholder="yourbusiness.com"
                inputMode="url"
              />

              <SelectInput
                label="What should we review?"
                required
                value={form.auditFocus}
                onChange={(value) =>
                  updateField("auditFocus", value)
                }
                options={[
                  ["", "Select an audit focus"],
                  ["complete", "Complete business growth audit"],
                  ["website", "Website design and conversion"],
                  ["seo", "SEO and search visibility"],
                  ["automation", "Business automation"],
                  ["ai", "AI consulting and implementation"],
                  ["marketing", "Digital marketing and leads"],
                  ["software", "Custom software"],
                ]}
              />

              <TextareaInput
                label="What is your biggest business challenge?"
                required
                value={form.challenge}
                onChange={(value) =>
                  updateField("challenge", value)
                }
                placeholder="Example: We get traffic, but very few visitors contact us."
              />

              <TextareaInput
                label="What result would make this audit valuable?"
                required
                value={form.goal}
                onChange={(value) => updateField("goal", value)}
                placeholder="Example: A clear plan to generate more qualified leads and automate follow-up."
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <SelectInput
                  label="Estimated budget"
                  value={form.budget}
                  onChange={(value) =>
                    updateField("budget", value)
                  }
                  options={[
                    ["", "Not sure yet"],
                    ["under-1000", "Under $1,000"],
                    ["1000-2500", "$1,000–$2,500"],
                    ["2500-5000", "$2,500–$5,000"],
                    ["5000-10000", "$5,000–$10,000"],
                    ["10000-plus", "$10,000+"],
                  ]}
                />

                <SelectInput
                  label="Desired timeline"
                  required
                  value={form.timeline}
                  onChange={(value) =>
                    updateField("timeline", value)
                  }
                  options={[
                    ["", "Select a timeline"],
                    ["asap", "As soon as possible"],
                    ["30-days", "Within 30 days"],
                    ["60-90-days", "Within 60–90 days"],
                    ["researching", "Researching options"],
                  ]}
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                <input
                  type="checkbox"
                  required
                  checked={form.consent}
                  onChange={(event) =>
                    updateField("consent", event.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900 accent-cyan-400"
                />
                <span className="text-sm leading-6 text-zinc-300">
                  I agree that AH LLC may contact me by email or
                  phone regarding this audit request.
                </span>
              </label>

              {error ? (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200"
                >
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-4 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending request…
                  </>
                ) : (
                  <>
                    Get my free audit
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                <CheckCircle2 className="h-4 w-4" />
                Typical response time: one business day
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "text" | "email" | "tel";
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url";
};

function TextInput({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
}: TextInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-200">
        {label}
        {required ? (
          <span className="ml-1 text-cyan-400">*</span>
        ) : null}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/70 focus:ring-4 focus:ring-cyan-400/10"
      />
    </label>
  );
}

type SelectInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
  required?: boolean;
};

function SelectInput({
  label,
  value,
  onChange,
  options,
  required = false,
}: SelectInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-200">
        {label}
        {required ? (
          <span className="ml-1 text-cyan-400">*</span>
        ) : null}
      </span>

      <select
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/70 focus:ring-4 focus:ring-cyan-400/10"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

type TextareaInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
};

function TextareaInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: TextareaInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-200">
        {label}
        {required ? (
          <span className="ml-1 text-cyan-400">*</span>
        ) : null}
      </span>

      <textarea
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-y rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/70 focus:ring-4 focus:ring-cyan-400/10"
      />
    </label>
  );
}
