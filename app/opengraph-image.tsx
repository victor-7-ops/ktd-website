import { ImageResponse } from "next/og";

export const alt = "KIDZ THESE DAYS — Cebu City Indie Pop-Rock";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0F",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        {/* Amber accent bar */}
        <div
          style={{
            width: 80,
            height: 4,
            background: "#E8A838",
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontFamily: "sans-serif",
            fontWeight: 900,
            fontSize: 96,
            color: "#F0EDE6",
            lineHeight: 0.9,
            letterSpacing: "-2px",
          }}
        >
          KIDZ THESE DAYS
        </div>
        <div
          style={{
            fontFamily: "sans-serif",
            fontWeight: 400,
            fontSize: 28,
            color: "#E8A838",
            marginTop: 24,
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          Cebu City Indie Pop-Rock
        </div>
        <div
          style={{
            fontFamily: "sans-serif",
            fontWeight: 300,
            fontSize: 20,
            color: "#F0EDE6",
            opacity: 0.5,
            marginTop: 16,
          }}
        >
          We aim to flip that script.
        </div>
      </div>
    ),
    { ...size }
  );
}
