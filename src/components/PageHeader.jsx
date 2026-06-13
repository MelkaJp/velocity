import { Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '../animations';
import './PageHeader.css';

export default function PageHeader({ title, subtitle, actions, breadcrumbs }) {
  return (
    <motion.div
      className="page-header"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {breadcrumbs && (
        <div className="page-breadcrumbs">
          <span className="breadcrumb-item" onClick={() => {}}>
            <Home size={14} />
            Dashboard
          </span>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="breadcrumb-item">
              <span className="breadcrumb-sep">/</span>
              {crumb}
            </span>
          ))}
        </div>
      )}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
    </motion.div>
  );
}
