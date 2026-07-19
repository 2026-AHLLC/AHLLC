"use client";

import Cal from "@calcom/embed-react";

export default function BookingCalendar() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
      <Cal
        calLink="https://cal.com/john-egan-2025"
        style={{
          width: "100%",
          height: "100%",
          overflow: "scroll",
        }}
        config={{
          layout: "month_view",
          theme: "dark",
        }}
      />
    </div>
  );
}