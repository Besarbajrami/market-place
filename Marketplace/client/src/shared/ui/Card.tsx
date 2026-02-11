import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  padding?: number;
};

export function Card({
  children,
  padding = 16,
  style,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding,
        boxShadow: "var(--shadow)",
        cursor: rest.onClick ? "pointer" : undefined,
        ...style, // allow caller overrides
      }}
    >
      {children}
    </div>
  );
}
