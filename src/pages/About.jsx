import { useTranslation } from '../context/TranslationContext';
import { useVeloCity } from '../context/VeloCityContext';
import { motion } from 'framer-motion';
import { Fuel, MapPin, Phone, Mail, Clock, Shield, Zap, Users, ArrowLeft, Home } from 'lucide-react';
import { fadeUp, fadeIn, staggerContainer, scaleIn } from '../animations';
import Button from '../components/Button';
import './InfoPage.css';

export default function About() {
  const { t } = useTranslation();
  const { setPage } = useVeloCity();

  const stats = [
    { value: '2,847', label: 'Vehicles Registered' },
    { value: '42', label: 'Active Stations' },
    { value: '156K+', label: 'Transactions' },
    { value: '99.9%', label: 'Uptime' },
  ];

  const features = [
    { icon: Zap, title: 'Instant SMS', desc: 'Get notified when your fuel slot is ready' },
    { icon: Shield, title: 'Anti-Fraud', desc: 'Digital seal prevents black market activities' },
    { icon: Users, title: 'Multi-User', desc: 'Fleet owners can manage all their drivers' },
    { icon: MapPin, title: 'Live Tracking', desc: 'Real-time station availability updates' },
  ];

  return (
    <div className="info-page">
      <div className="page-nav">
        <Button variant="ghost" size="sm" onClick={() => setPage('landing')}>
          <ArrowLeft size={18} /> Back
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setPage('landing')}>
          <Home size={18} />
        </Button>
      </div>
      <div className="info-hero">
        <motion.h1 
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          About VeloCity
        </motion.h1>
        <motion.p 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          Ethiopia's complete fuel distribution management ecosystem
        </motion.p>
      </div>

      <div className="info-section">
        <h2>Our Mission</h2>
        <p>
          VeloCity is a comprehensive digital solution designed to transform fuel distribution 
          in Ethiopia. By leveraging QR code technology and smart appointment booking, we ensure 
          fair access, reduce congestion at gas stations, and eliminate black market practices.
        </p>
      </div>

      <motion.div 
        className="info-stats"
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            className="stat-box"
            variants={fadeUp}
          >
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="info-section">
        <h2>Key Features</h2>
        <motion.div 
          className="features-grid"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-item"
              variants={scaleIn}
            >
              <feature.icon size={24} />
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="info-section">
        <h2>How It Works</h2>
        <ol className="steps-list">
          <li>Register your vehicle and select your fuel type</li>
          <li>Book an appointment at your preferred station</li>
          <li>Receive SMS notification when it's your turn</li>
          <li>Show your QR code and fill up - it's that simple!</li>
        </ol>
      </div>
    </div>
  );
}