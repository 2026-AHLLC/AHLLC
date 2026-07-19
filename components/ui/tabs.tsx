"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      [
        "inline-flex h-12 items-center",
        "rounded-2xl",
        "border border-white/10",
        "bg-zinc-900/70",
        "p-1",
        "backdrop-blur-xl",
      ].join(" "),
      className
    )}
    {...props}
  />
));

TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      [
        "inline-flex items-center justify-center",
        "rounded-xl",
        "px-5 py-2",
        "text-sm font-medium",
        "text-zinc-400",
        "transition-all duration-200",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-blue-500",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-zinc-950",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
        "data-[state=active]:bg-gradient-to-r",
        "data-[state=active]:from-blue-600",
        "data-[state=active]:via-violet-600",
        "data-[state=active]:to-cyan-500",
        "data-[state=active]:text-white",
        "data-[state=active]:shadow-lg",
        "hover:text-white",
      ].join(" "),
      className
    )}
    {...props}
  />
));

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      [
        "mt-6",
        "rounded-2xl",
        "border border-white/10",
        "bg-zinc-900/60",
        "p-6",
        "backdrop-blur-xl",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-blue-500",
      ].join(" "),
      className
    )}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
};
