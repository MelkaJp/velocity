import { useTranslation } from '../context/TranslationContext';
import { useVeloCity } from '../context/VeloCityContext';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, Database, Key, Bell, UserCheck, QrCode, AlertTriangle, CheckCircle, ArrowLeft, Home } from 'lucide-react';
import './InfoPage.css';

export default function Security() {
  const { t } = useTranslation();
  const { setPage } = useVeloCity();

  const securityFeatures = [
    {
      icon: QrCode,
      title: 'QR Code Verification',
      description: 'Every transaction is verified through unique QR codes that cannot be duplicated or forged.',
      color: '#06D6A0'
    },
    {
      icon: Lock,
      title: 'Encrypted Transactions',
      description: 'All data is encrypted using industry-standard protocols to protect user information.',
      color: '#3A86FF'
    },
    {
      icon: UserCheck,
      title: 'Driver Verification',
      description: 'Driver photos are captured and verified at the pump to ensure the right person is fueling.',
      color: '#FF6B35'
    },
    {
      icon: Eye,
      title: 'GPS Geofencing',
      description: 'Transactions are verified by GPS coordinates to ensure fuel is dispensed at legitimate stations.',
      color: '#8338EC'
    },
    {
      icon: Database,
      title: 'Secure Database',
      description: 'All transaction records are stored securely with backup and recovery options.',
      color: '#06D6A0'
    },
    {
      icon: Key,
      title: 'Role-Based Access',
      description: 'System supports multiple user roles with appropriate access controls for each level.',
      color: '#3A86FF'
    }
  ];

  const fraudPrevention = [
    'Real-time QR code validation at pump',
    'Driver photo verification',
    'GPS location matching',
    'Transaction logging and audit trails',
    'Automatic lockout for suspicious activity',
    'SMS verification for bookings'
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
          Security
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Enterprise-grade security to protect every transaction
        </motion.p>
      </div>

      <div className="info-section">
        <h2>Our Security Measures</h2>
        <p>
          VeloCity implements multiple layers of security to ensure that fuel reaches legitimate drivers
          and prevent black market activities.
        </p>
      </div>

      <div className="features-grid">
        {securityFeatures.map((feature, index) => (
          <motion.div 
            key={index}
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="feature-icon" style={{ backgroundColor: `${feature.color}20`, color: feature.color }}>
              <feature.icon size={28} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="info-section">
        <h2>Fraud Prevention</h2>
        <p>
          Our system is designed to prevent common fuel fraud methods:
        </p>
        <ul className="check-list">
          {fraudPrevention.map((item, index) => (
            <li key={index}>
              <CheckCircle size={20} color="#06D6A0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="info-section">
        <h2>Data Privacy</h2>
        <p>
          We take data privacy seriously. Your personal information is:
        </p>
        <ul className="check-list">
          <li>
            <CheckCircle size={20} color="#06D6A0" />
            Stored securely with encryption
          </li>
          <li>
            <CheckCircle size={20} color="#06D6A0" />
            Never sold to third parties
          </li>
          <li>
            <CheckCircle size={20} color="#06D6A0" />
            Accessible only to authorized personnel
          </li>
          <li>
            <CheckCircle size={20} color="#06D6A0" />
            Can be deleted upon request
          </li>
        </ul>
      </div>
    </div>
  );
}
