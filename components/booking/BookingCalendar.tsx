"use client";

import Cal from "@calcom/embed-react";

export default function BookingCalendar() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
      <Cal
        calLink="YOUR-CAL-USERNAME/free-consultation"
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