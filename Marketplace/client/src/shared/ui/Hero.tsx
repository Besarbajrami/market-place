import React from "react";

export function Hero({
  title,
  subtitle,
  backgroundImage,
  children
}: {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(
          rgba(0,0,0,0.55),
          rgba(0,0,0,0.55)
        ), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "64px 16px",
        borderRadius: "var(--radius)",
        color: "white"
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 42, margin: 0 }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 18, opacity: 0.9, marginTop: 8 }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
