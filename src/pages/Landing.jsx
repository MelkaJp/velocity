import { useVeloCity } from '../context/VeloCityContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Fuel, 
  Shield, 
  Route, 
  Wallet, 
  AlertTriangle,
  MessageCircle, 
  Smartphone, 
  Monitor, 
  Map,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Zap,
  Lock,
  BarChart3
} from 'lucide-react';
import Auth from './Auth';
import './Landing.css';

export default function Landing() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuth(true);
  };

  const handleSignupClick = () => {
    setAuthMode('register');
    setShowAuth(true);
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  if (showAuth) {
    return <Auth initialMode={authMode} onClose={handleCloseAuth} />;
  }

  const stats = [
    { value: '2,847', label: 'Vehicles' },
    { value: '42', label: 'Stations' },
    { value: '156K', label: 'Transactions' },
    { value: '24/7', label: 'Support' },
  ];

  const features = [
    {
      icon: MessageCircle,
      title: 'Telegram Bot',
      description: 'Lightning-fast text interface for instant bookings and real-time station status checks.',
      color: '#00d4aa',
    },
    {
      icon: Smartphone,
      title: 'Telegram Mini App',
      description: 'Rich visual dashboard for managing your fuel wallet and digital receipts.',
      color: '#6366f1',
    },
    {
      icon: Monitor,
      title: 'Driver WebApp',
      description: 'Desktop portal for fleet owners to manage vehicles and track expenses.',
      color: '#f472b6',
    },
    {
      icon: Map,
      title: 'Native Mobile',
      description: 'GPS-powered live station maps with push notifications for slot reminders.',
      color: '#3b82f6',
    },
  ];

  const solutions = [
    {
      icon: Shield,
      title: 'Anti-Black Market',
      description: 'Digital seal inventory reconciliation with volumetric guard alerts.',
      category: 'corruption',
    },
    {
      icon: Route,
      title: 'Smart Routing',
      description: 'Time windows & geographic load balancing to prevent station congestion.',
      category: 'congestion',
    },
    {
      icon: Zap,
      title: 'Instant SMS Alerts',
      description: 'Get instant notifications when your fuel slot is ready.',
      category: 'financial',
    },
    {
      icon: AlertTriangle,
      title: 'Saddle Tank Defense',
      description: 'Volumetric alerts when capacity limits are exceeded.',
      category: 'fraud',
    },
  ];

  return (
    <div className="landing">
      <div className="landing-bg">
        <div className="landing-glow-main" />
        <div className="landing-glow-accent" />
        <div className="landing-ring" />
      </div>
      
      <header className="landing-header">
        <div className="header-container">
          <motion.div 
            className="header-logo"
            whileHover={{ scale: 1.02 }}
          >
            <div className="logo-icon">
              <Fuel size={20} />
            </div>
            <span className="logo-text">VeloCity</span>
          </motion.div>
          <div className="header-actions">
            <button className="btn-login" onClick={handleLoginClick}>Sign In</button>
            <button className="btn-signup" onClick={handleSignupClick}>Get Started</button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-bg">
          <div className="hero-glow-main" />
          <div className="hero-glow-accent" />
          <div className="hero-ring" />
        </div>

        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="hero-badge"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={14} />
            <span>Fuel Access Ecosystem</span>
          </motion.div>
          
          <h1 className="hero-title">
            Fuel.
            <span className="accent">Controlled.</span>
            <span className="accent-blue">Transparent.</span>
          </h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            The complete digital solution for fuel distribution management in Ethiopia. 
            QR-based authentication, real-time tracking, and automated revenue sharing.
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button 
              className="btn-primary"
              onClick={handleSignupClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Get Started</span>
              <ChevronRight size={18} />
            </motion.button>
            <motion.button 
              className="btn-secondary"
              onClick={handleLoginClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Sign In</span>
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="hero-stat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <span className="stat-number">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        </section>

      <section className="section-header">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Omni-Channel Access
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Multiple entry points ensuring accessibility regardless of device or tech literacy
        </motion.p>
      </section>

      <section className="features">
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="feature-icon"
                style={{ 
                  background: `${feature.color}20`,
                  color: feature.color 
                }}
              >
                <feature.icon size={28} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-header">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Deep Solutions
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Address the core problems of corruption, congestion, and financial leakage
        </motion.p>
      </section>

      <section className="solutions">
        <div className="solutions-grid">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              className="solution-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="solution-header">
                <solution.icon size={22} />
                <span className={`solution-tag ${solution.category}`}>
                  {solution.category}
                </span>
              </div>
              <h3>{solution.title}</h3>
              <p>{solution.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-header">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Protocol
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Specialized security measures for different vehicle types
        </motion.p>
      </section>

      <section className="protocol">
        <div className="protocol-grid">
          <motion.div 
            className="protocol-card green"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="protocol-icon">
              <Fuel size={28} />
            </div>
            <h3>Green QR</h3>
            <p>Bajaj · Max 50L</p>
          </motion.div>
          <motion.div 
            className="protocol-card blue"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="protocol-icon">
              <Fuel size={28} />
            </div>
            <h3>Blue QR</h3>
            <p>Automobile · Up to 150L</p>
          </motion.div>
          <motion.div 
            className="protocol-card black"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="protocol-icon">
              <Fuel size={28} />
            </div>
            <h3>Black QR</h3>
            <p>Heavy Truck · Up to 500L</p>
          </motion.div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <Fuel size={24} />
              </div>
              <span>VeloCity</span>
            </div>
            <p>The complete digital solution for fuel distribution management in Ethiopia.</p>
          </div>
          
          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Security</a>
              <a href="#">Pricing</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Careers</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">Telegram</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <span>© 2026 VeloCity. All rights reserved.</span>
            <span>Fuel. Controlled. Transparent.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}