import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#09090b",
          color: "white",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontSize: 72,
          fontWeight: 800,
        }}
      >
        <div>AH LLC</div>

        <div
          style={{
            fontSize: 36,
            color: "#60a5fa",
            marginTop: 24,
          }}
        >
          AI • Websites • Automation
        </div>
      </div>
    ),
    size
  );
}
