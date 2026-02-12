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
  const isMobile = window.innerWidth <= 640;

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(
          rgba(0,0,0,0.55),
          rgba(0,0,0,0.55)
        ), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: isMobile ? "36px 16px" : "64px 16px",
        borderRadius: "var(--radius)",
        color: "white"
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: isMobile ? 26 : 42,
            margin: 0
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              fontSize: isMobile ? 14 : 18,
              opacity: 0.9,
              marginTop: 8
            }}
          >
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}