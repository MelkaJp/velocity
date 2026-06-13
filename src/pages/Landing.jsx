import { useVeloCity } from '../context/VeloCityContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  BarChart3,
  Star,
  ChevronDown,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import Auth from './Auth';
import './Landing.css';

export default function Landing() {
  const { setPage } = useVeloCity();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [openFaq, setOpenFaq] = useState(null);

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

  const testimonials = [
    {
      name: 'Tadesse A.',
      role: 'Bajaj Driver',
      text: 'No more waiting in long queues. I book my slot and get notified when it\'s my turn. Game changer!',
      rating: 5,
    },
    {
      name: 'Sara M.',
      role: 'Fleet Owner',
      text: 'Managing 15 vehicles was a nightmare. Now I track all fuel expenses from my phone in real-time.',
      rating: 5,
    },
    {
      name: 'Bekele W.',
      role: 'Station Manager',
      text: 'The QR verification system eliminated the black market at our station. Revenue is up 30%.',
      rating: 5,
    },
  ];

  const faqs = [
    { q: 'How do I register my vehicle?', a: 'Click "Get Started" and fill in your details. You will receive a unique QR code for fuel verification.' },
    { q: 'How do I book a fuel slot?', a: 'After registration, log in to your dashboard and select your preferred station and time slot.' },
    { q: 'Is the service available across Ethiopia?', a: 'We are expanding rapidly. Currently operational in Addis Ababa and 5 regional capitals.' },
    { q: 'What if I miss my appointment?', a: 'You can reschedule from your dashboard. Repeated no-shows may affect your booking priority.' },
    { q: 'How does the revenue sharing work?', a: 'A small percentage of each transaction is automatically distributed to municipalities, stations, and workers.' },
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
            <motion.button 
              className="btn-ghost"
              onClick={() => setPage('features')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Learn More</span>
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

      <section className="testimonials">
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Trusted by Thousands
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Hear from our community of drivers, fleet owners, and station managers
          </motion.p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="testimonial-stars">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
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

      <section className="faq-section">
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Everything you need to know about VeloCity
          </motion.p>
        </div>
        <div className="faq-container">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className={`faq-item ${openFaq === i ? 'open' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <ChevronDown size={20} className={`faq-arrow ${openFaq === i ? 'rotated' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Transform Fuel Distribution?</h2>
          <p>Join thousands of drivers, fleet owners, and station managers already using VeloCity.</p>
          <div className="cta-actions">
            <button className="btn-primary" onClick={handleSignupClick}>
              Get Started <ChevronRight size={18} />
            </button>
            <button className="btn-secondary" onClick={() => setPage('contact')}>
              Contact Sales
            </button>
          </div>
        </motion.div>
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
            <div className="footer-contact">
              <a href="mailto:support@velocity.et"><Mail size={14} /> support@velocity.et</a>
              <a href="tel:+251912345678"><Phone size={14} /> +251 912 345 678</a>
            </div>
          </div>
          
          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>Product</h4>
              <button onClick={() => setPage('features')}>Features</button>
              <button onClick={() => setPage('security')}>Security</button>
              <button onClick={() => setPage('pricing')}>Pricing</button>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <button onClick={() => setPage('about')}>About</button>
              <button onClick={() => setPage('contact')}>Contact</button>
              <button onClick={() => setPage('careers')}>Careers</button>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <button onClick={() => setPage('privacy')}>Privacy</button>
              <button onClick={() => setPage('terms')}>Terms</button>
              <button onClick={() => setPage('cookies')}>Cookies</button>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <button onClick={() => window.open('https://twitter.com', '_blank')}>
                <ExternalLink size={12} /> Twitter
              </button>
              <button onClick={() => window.open('https://linkedin.com', '_blank')}>
                <ExternalLink size={12} /> LinkedIn
              </button>
              <button onClick={() => window.open('https://t.me', '_blank')}>
                <ExternalLink size={12} /> Telegram
              </button>
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