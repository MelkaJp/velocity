import { motion } from 'framer-motion';
import { fadeUp, cardHoverLift } from '../animations';
import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, change, color, delay = 0 }) {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');

  return (
    <motion.div
      className="stat-card"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...cardHoverLift}
    >
      <div className="stat-card-icon" style={{ background: `${color}18`, color }}>
        <Icon size={22} />
      </div>
      <div className="stat-card-body">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-value">{value}</span>
      </div>
      {change && (
        <span className={`stat-card-change ${isPositive ? 'up' : isNegative ? 'down' : ''}`}>
          {change}
        </span>
      )}
    </motion.div>
  );
}
