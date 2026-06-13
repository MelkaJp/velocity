import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme = 'dark', onToggle, className = '' }) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggle}
      className={`theme-toggle-btn ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon size={18} className="theme-toggle-icon moon" />
      ) : (
        <Sun size={18} className="theme-toggle-icon sun" />
      )}
    </button>
  );
}
