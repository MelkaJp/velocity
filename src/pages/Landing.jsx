import { useVeloCity } from '../context/VeloCityContext';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import { 
  Fuel, Shield, Route, AlertTriangle,
  MessageCircle, Smartphone, Monitor, Map,
  Sparkles, ChevronRight, Zap,
  Star, ChevronDown, Phone, Mail, ExternalLink
} from 'lucide-react';
import {
  fadeUp, fadeIn, scaleIn, staggerContainer,
  cardHoverLift, cardHoverScale, accordionContent,
  smoothEase,
} from '../animations';
import {
  useScrollAnimation, useParallax, useCountUp, useMouseParallax,
} from '../animations';
import Auth from './Auth';
import './Landing.css';

export default function Landing() {
  const { setPage } = useVeloCity();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [openFaq, setOpenFaq] = useState(null);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);

  useParallax(heroRef, 0.15);
  useScrollAnimation(featuresRef, { type: 'fade-in-up' });

  const vehicles = useCountUp(2847, { duration: 2500 });
  const stations = useCountUp(42, { duration: 1500 });

  const protStyle = useMouseParallax(heroRef, 0.3);

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
    { value: vehicles.count.toLocaleString(), label: 'Vehicles', ref: vehicles.ref },
    { value: stations.count, label: 'Stations', ref: stations.ref },
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
            whileHover={{ scale: 1.05 }}
            transition={smoothEase}
          >
            <div className="logo-icon">
              <Fuel size={20} />
            </div>
            <span className="logo-text">VeloCity</span>
          </motion.div>
          <div className="header-actions">
            <Button variant="ghost" size="sm" onClick={handleLoginClick}>Sign In</Button>
            <Button variant="primary" size="sm" onClick={handleSignupClick}>Get Started</Button>
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
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="hero-badge"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
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
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            The complete digital solution for fuel distribution management in Ethiopia. 
            QR-based authentication, real-time tracking, and automated revenue sharing.
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Button variant="primary" size="lg" onClick={handleSignupClick}>
              Get Started <ChevronRight size={18} />
            </Button>
            <Button variant="secondary" size="lg" onClick={handleLoginClick}>
              Sign In
            </Button>
            <Button variant="ghost" size="lg" onClick={() => setPage('features')}>
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-stats"
          ref={statsRef}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="hero-stat"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <span className="stat-number" ref={stat.ref || null}>{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="section-header">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Omni-Channel Access
        </motion.h2>
        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Multiple entry points ensuring accessibility regardless of device or tech literacy
        </motion.p>
      </section>

      <section className="features" ref={featuresRef}>
        <motion.div 
          className="features-grid"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={fadeUp}
              {...cardHoverLift}
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
        </motion.div>
      </section>

      <section className="testimonials">
        <div className="section-header">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Trusted by Thousands
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Hear from our community of drivers, fleet owners, and station managers
          </motion.p>
        </div>
        <motion.div 
          className="testimonials-grid"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="testimonial-card"
              variants={fadeUp}
              {...cardHoverLift}
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
        </motion.div>
      </section>

      <section className="section-header">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Deep Solutions
        </motion.h2>
        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Address the core problems of corruption, congestion, and financial leakage
        </motion.p>
      </section>

      <section className="solutions">
        <motion.div 
          className="solutions-grid"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              className="solution-card"
              variants={scaleIn}
              {...cardHoverScale}
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
        </motion.div>
      </section>

      <section className="section-header">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Protocol
        </motion.h2>
        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Specialized security measures for different vehicle types
        </motion.p>
      </section>

      <section className="protocol">
        <motion.div 
          className="protocol-grid"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="protocol-card green"
            variants={fadeUp}
            {...cardHoverLift}
          >
            <div className="protocol-icon">
              <Fuel size={28} />
            </div>
            <h3>Green QR</h3>
            <p>Bajaj · Max 50L</p>
          </motion.div>
          <motion.div 
            className="protocol-card blue"
            variants={fadeUp}
            {...cardHoverLift}
          >
            <div className="protocol-icon">
              <Fuel size={28} />
            </div>
            <h3>Blue QR</h3>
            <p>Automobile · Up to 150L</p>
          </motion.div>
          <motion.div 
            className="protocol-card black"
            variants={fadeUp}
            {...cardHoverLift}
          >
            <div className="protocol-icon">
              <Fuel size={28} />
            </div>
            <h3>Black QR</h3>
            <p>Heavy Truck · Up to 500L</p>
          </motion.div>
        </motion.div>
      </section>

      <section className="faq-section">
        <div className="section-header">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Everything you need to know about VeloCity
          </motion.p>
        </div>
        <motion.div 
          className="faq-container"
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className={`faq-item ${openFaq === i ? 'open' : ''}`}
              variants={fadeUp}
            >
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <motion.span
                  style={{ display: 'flex' }}
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    className="faq-answer"
                    variants={accordionContent}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="cta-section">
        <motion.div
          className="cta-content"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2>Ready to Transform Fuel Distribution?</h2>
          <p>Join thousands of drivers, fleet owners, and station managers already using VeloCity.</p>
          <div className="cta-actions">
            <Button variant="primary" size="lg" onClick={handleSignupClick}>
              Get Started <ChevronRight size={18} />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => setPage('contact')}>
              Contact Sales
            </Button>
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