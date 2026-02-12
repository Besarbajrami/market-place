import React from "react";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: window.innerWidth <= 640 ? "12px" : "16px",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
  
