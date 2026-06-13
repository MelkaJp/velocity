import { useTranslation } from '../context/TranslationContext';
import { useVeloCity } from '../context/VeloCityContext';
import { motion } from 'framer-motion';
import { Fuel, MapPin, Phone, Mail, Clock, Shield, Zap, Users, ArrowLeft, Home } from 'lucide-react';
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
        <button onClick={() => setPage('landing')} className="back-btn"><ArrowLeft size={18} /> Back</button>
        <button onClick={() => setPage('landing')} className="home-btn"><Home size={18} /></button>
      </div>
      <div className="info-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          About VeloCity
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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

      <div className="info-stats">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            className="stat-box"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="info-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-item"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <feature.icon size={24} />
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
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