export function Badge({
    text,
    tone = "neutral"
  }: {
    text: string;
    tone?: "neutral" | "success" | "danger";
  }) {
    const colors: Record<string, string> = {
      neutral: "#6b7280",
      success: "#15803d",
      danger: "#b91c1c"
    };
  
    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          border: `1px solid ${colors[tone]}`,
          color: colors[tone]
        }}
      >
        {text}
      </span>
    );
  }
  