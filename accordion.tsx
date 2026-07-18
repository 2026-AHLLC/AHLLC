"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl",
      "transition-all duration-200",
      "hover:border-blue-500/30",
      className
    )}
    {...props}
  />
));

AccordionItem.displayName = AccordionPrimitive.Item.displayName;

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        [
          "group flex flex-1 items-center justify-between",
          "px-6 py-5",
          "text-left",
          "text-base font-semibold text-white",
          "transition-colors duration-200",
          "hover:text-blue-400",
          "focus:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-blue-500",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-zinc-950",
        ].join(" "),
        className
      )}
      {...props}
    >
      {children}

      <ChevronDown
        className="
          h-5
          w-5
          shrink-0
          text-zinc-400
          transition-transform
          duration-300
          group-data-[state=open]:rotate-180
        "
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName =
  AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      [
        "overflow-hidden",
        "text-zinc-400",
        "data-[state=closed]:animate-accordion-up",
        "data-[state=open]:animate-accordion-down",
      ].join(" "),
      className
    )}
    {...props}
  >
    <div className="px-6 pb-6 pt-1 leading-7">
      {children}
    </div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName =
  AccordionPrimitive.Content.displayName;

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};
