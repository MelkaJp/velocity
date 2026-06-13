import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Fuel, Sparkles, Menu, X, Sun, Moon,
  MessageCircle, Smartphone, Monitor, Map, Shield, 
  Zap, Route, AlertTriangle, ChevronRight, User
} from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import { useTheme } from '../context/ThemeContext';

import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { language, changeLanguage, languages } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginClick = () => {
    navigate('/signin');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

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
      color: '#e94560',
    },
    {
      icon: Smartphone,
      title: 'Telegram Mini App',
      description: 'Rich visual dashboard for managing your fuel wallet and digital receipts.',
      color: '#00d9ff',
    },
    {
      icon: Monitor,
      title: 'Driver WebApp',
      description: 'Desktop portal for fleet owners to manage vehicles and track expenses.',
      color: '#7b2cbf',
    },
    {
      icon: Map,
      title: 'Native Mobile',
      description: 'GPS-powered live station maps with push notifications for slot reminders.',
      color: '#ff6b35',
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
        <div className="landing-blob landing-blob-1" />
        <div className="landing-blob landing-blob-2" />
        <div className="landing-blob landing-blob-3" />
        <div className="landing-blob landing-blob-4" />
      </div>

      {/* Horizontal Navigation */}
      <header className="horizontal-nav">
        <div className="nav-container">
          <motion.div 
            className="nav-logo"
            whileHover={{ scale: 1.02 }}
          >
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="logo-icon">
                <Fuel size={22} />
              </div>
              <span className="logo-text">VeloCity</span>
            </Link>
          </motion.div>

          <nav className="nav-links">
            <Link to="/features" className="nav-link">Features</Link>
            <Link to="/security" className="nav-link">Security</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>

          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="lang-selector">
              <select 
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="lang-dropdown"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native}
                  </option>
                ))}
              </select>
            </div>
            <button className="nav-action-btn secondary" onClick={handleLoginClick}>Sign In</button>
            <button className="nav-action-btn primary" onClick={handleSignupClick}>Get Started</button>
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
<motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Fuel.
              <span className="accent">Controlled.</span>
              Transparent.
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
            
            <div className="hero-actions">
              <motion.button 
                type="button"
                className="hero-btn primary"
                onClick={handleSignupClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
              <motion.button 
                type="button"
                className="hero-btn secondary"
                onClick={handleLoginClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
            </div>

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
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
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
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="feature-icon">
                <feature.icon size={28} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
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

      {/* Protocol Section */}
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
            <div className="card-details">
              <p>For Bajaj and motorcycles. Digital verification, instant SMS alerts, priority booking.</p>
            </div>
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
            <div className="card-details">
              <p>For cars and minibuses. Fleet management, transaction history, revenue tracking.</p>
            </div>
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
            <div className="card-details">
              <p>For trucks and heavy vehicles. Bulk fuel tracking, inspection alerts.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Fuel Management?</h2>
          <p>Join thousands of drivers, station owners, and municipalities using VeloCity.</p>
          <div className="cta-buttons">
            <Link to="/auth?mode=register" className="btn btn-primary">
              Get Started Now <ChevronRight size={18} />
            </Link>
            <Link to="/features" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-nav">
          </div>
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
              <Link to="/features">Features</Link>
              <Link to="/security">Security</Link>
              <Link to="/pricing">Pricing</Link>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/careers">Careers</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/cookies">Cookies</Link>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <a href="https://twitter.com/velocityet" target="_blank" rel="noopener">Twitter</a>
              <a href="https://t.me/velocityet" target="_blank" rel="noopener">Telegram</a>
              <Link to="/contact">Support</Link>
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