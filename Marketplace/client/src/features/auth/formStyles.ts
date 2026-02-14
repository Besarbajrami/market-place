import React from "react";

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text-primary)",
  fontSize: 14,
  outline: "none",
  transition: "var(--transition-base)"
};

export const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 13,
  color: "var(--text-muted)"
};

export const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: 10,
  border: "none",
  background: "var(--primary)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  transition: "var(--transition-base)"
};
