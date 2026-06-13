import { useTranslation } from '../context/TranslationContext';
import { useVeloCity } from '../context/VeloCityContext';
import { motion } from 'framer-motion';
import { Fuel, QrCode, Smartphone, Shield, MapPin, Clock, Zap, Users, Wallet, Bell, BarChart3, Star, ArrowLeft, Home } from 'lucide-react';
import { fadeUp, fadeIn, staggerContainer, scaleIn, cardHoverLift } from '../animations';
import Button from '../components/Button';
import './InfoPage.css';

export default function Features() {
  const { t } = useTranslation();
  const { setPage } = useVeloCity();

  const features = [
    {
      icon: QrCode,
      title: 'QR Code Fuel Cards',
      description: 'Each vehicle receives a unique QR code that enables instant verification at fuel stations. No paper cards, no fraud.',
      color: '#06D6A0'
    },
    {
      icon: Smartphone,
      title: 'Mobile App',
      description: 'Book fuel slots, track transactions, and manage your fleet all from your smartphone.',
      color: '#3A86FF'
    },
    {
      icon: Shield,
      title: 'Anti-Fraud System',
      description: 'Our digital seal technology prevents black market activities and ensures fuel reaches legitimate drivers.',
      color: '#FF6B35'
    },
    {
      icon: MapPin,
      title: 'Live Station Tracking',
      description: 'See real-time fuel availability at all registered stations. Never wait in line again.',
      color: '#8338EC'
    },
    {
      icon: Clock,
      title: 'Smart Booking',
      description: 'Book your fuel slot in advance. Get SMS notifications when its time to fill up.',
      color: '#06D6A0'
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Scan QR code and verify driver identity in seconds. Fuel dispensed immediately.',
      color: '#3A86FF'
    },
    {
      icon: Users,
      title: 'Fleet Management',
      description: 'Fleet owners can register and manage multiple vehicles, track all transactions in one place.',
      color: '#FF6B35'
    },
    {
      icon: Wallet,
      title: 'Digital Wallet',
      description: 'Prepaid digital wallet system. Track spending, manage fuel budgets easily.',
      color: '#8338EC'
    },
    {
      icon: Bell,
      title: 'SMS Alerts',
      description: 'Receive instant notifications for booking confirmations, refueling reminders, and transaction receipts.',
      color: '#06D6A0'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics for station managers, fleet owners, and administrators.',
      color: '#3A86FF'
    },
    {
      icon: Star,
      title: 'Revenue Sharing',
      description: 'Transparent revenue distribution between stations, municipalities, and system operators.',
      color: '#FF6B35'
    },
    {
      icon: Fuel,
      title: 'Multiple Vehicle Types',
      description: 'Support for Bajaj, automobiles, and trucks with appropriate fuel allocation limits.',
      color: '#8338EC'
    }
  ];

  return (
    <div className="info-page">
      <div className="page-nav">
        <Button variant="ghost" size="sm" onClick={() => setPage('landing')}><ArrowLeft size={18} /> Back</Button>
        <Button variant="ghost" size="sm" onClick={() => setPage('landing')}><Home size={18} /></Button>
      </div>
      <div className="info-hero">
        <motion.h1 
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Features
        </motion.h1>
        <motion.p 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          Complete fuel management solution with cutting-edge technology
        </motion.p>
      </div>

      <div className="info-section">
        <h2>Everything you need</h2>
        <p>
          VeloCity provides a comprehensive suite of features designed to modernize fuel distribution
          and eliminate inefficiencies in Ethiopia's fuel ecosystem.
        </p>
      </div>

      <motion.div 
        className="features-grid"
        variants={staggerContainer(0.08)}
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
            <div className="feature-icon" style={{ backgroundColor: `${feature.color}20`, color: feature.color }}>
              <feature.icon size={28} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="info-section">
        <h2>Who is it for?</h2>
        <motion.div 
          className="audience-cards"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="audience-card" variants={fadeUp} {...cardHoverLift}>
            <Users size={32} />
            <h3>Drivers</h3>
            <p>Register your vehicle, book fuel slots, and track your fuel usage with instant SMS notifications.</p>
          </motion.div>
          <motion.div className="audience-card" variants={fadeUp} {...cardHoverLift}>
            <Wallet size={32} />
            <h3>Fleet Owners</h3>
            <p>Manage multiple vehicles, track all transactions, and manage your fleet from one dashboard.</p>
          </motion.div>
          <motion.div className="audience-card" variants={fadeUp} {...cardHoverLift}>
            <MapPin size={32} />
            <h3>Station Managers</h3>
            <p>Track fuel inventory, manage workers, view sales analytics, and optimize operations.</p>
          </motion.div>
          <motion.div className="audience-card" variants={fadeUp} {...cardHoverLift}>
            <BarChart3 size={32} />
            <h3>Administrators</h3>
            <p>Oversee all stations, manage municipalities, monitor transactions, and ensure compliance.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
