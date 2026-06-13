import { motion } from 'framer-motion';
import { fadeUp } from '../animations';
import './EmptyState.css';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      className="empty-state"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {Icon && (
        <div className="empty-state-icon">
          <Icon size={40} />
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </motion.div>
  );
}
