import { useTheme } from './ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "10px 16px",
        borderRadius: 12,
        border: theme === 'dark' 
          ? "1px solid rgba(255, 255, 255, 0.2)" 
          : "1px solid #e2e8f0",
        background: theme === 'dark' 
          ? "rgba(255, 255, 255, 0.1)" 
          : "#ffffff",
        color: theme === 'dark' ? "#fff" : "#475569",
        fontSize: 20,
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = theme === 'dark'
          ? "rgba(255, 255, 255, 0.15)"
          : "#f8fafc";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = theme === 'dark'
          ? "rgba(255, 255, 255, 0.1)"
          : "#ffffff";
        e.currentTarget.style.transform = "scale(1)";
      }}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
