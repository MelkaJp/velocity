import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
  style,
}) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (loading || disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    onClick?.(e);
  };

  const cls = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    loading ? 'btn-loading' : '',
    disabled ? 'btn-disabled' : '',
    fullWidth ? 'btn-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      type={type}
      className={cls}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={!loading && !disabled ? { scale: 1.02 } : {}}
      whileTap={!loading && !disabled ? { scale: 0.98 } : {}}
      style={style}
    >
      <span className="btn-ripples">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="btn-ripple"
            style={{ left: r.x, top: r.y }}
          />
        ))}
      </span>
      <span className="btn-content">
        {loading && <Loader2 className="btn-spinner" size={size === 'sm' ? 14 : 18} />}
        {!loading && icon && <span className="btn-icon">{icon}</span>}
        {children && <span className="btn-text">{children}</span>}
      </span>
    </motion.button>
  );
}
