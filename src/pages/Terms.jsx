import { useTranslation } from '../context/TranslationContext';
import { useVeloCity } from '../context/VeloCityContext';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Shield, User, Car, Fuel, Mail, ArrowLeft, Home } from 'lucide-react';
import { fadeUp, fadeIn } from '../animations';
import Button from '../components/Button';
import './InfoPage.css';

export default function Terms() {
  const { t } = useTranslation();
  const { setPage } = useVeloCity();

  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: FileText,
      content: `By accessing and using VeloCity, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, you should not use our service.`
    },
    {
      title: 'Description of Service',
      icon: Fuel,
      content: `VeloCity is a digital fuel management platform that provides:
• QR code-based vehicle registration
• Fuel slot booking and scheduling
• Transaction verification at fuel stations
• SMS notifications for drivers
• Fleet management for fleet owners
• Analytics and reporting for stations and administrators`
    },
    {
      title: 'User Responsibilities',
      icon: User,
      content: `As a user of VeloCity, you agree to:
• Provide accurate and complete registration information
• Keep your account credentials secure
• Not share your QR code with others
• Not use the service for illegal purposes
• Not attempt to manipulate or fraud the system
• Report any suspicious activity immediately`
    },
    {
      title: 'Driver Obligations',
      icon: Car,
      content: `When using VeloCity as a driver, you must:
• Register your legitimate vehicle(s) only
• Present your QR code when filling fuel
• Not exceed your vehicle's tank capacity
• Keep your contact information updated
• Not resell or transfer fuel to others`
    },
    {
      title: 'Station Manager Obligations',
      icon: Shield,
      content: `Fuel station managers must:
• Verify driver identity before dispensing fuel
• Record accurate transaction amounts
• Maintain adequate fuel inventory
• Report any suspicious transactions
• Ensure workers are properly trained`
    },
    {
      title: 'Limitation of Liability',
      icon: AlertTriangle,
      content: `VeloCity shall not be liable for:
• Any indirect, incidental, or consequential damages
• Loss of profits, data, or other intangible losses
• Service interruptions or failures
• Actions of third parties
• User negligence or misconduct`
    },
    {
      title: 'Termination',
      icon: FileText,
      content: `We reserve the right to terminate your account if:
• You violate these terms
• You engage in fraudulent activities
• Your vehicle is found to be illegally registered
• You abuse or misuse the platform
• Required by law or regulation`
    },
    {
      title: 'Changes to Terms',
      icon: FileText,
      content: `We may modify these terms at any time. Continued use of VeloCity after changes 
means you accept the new terms. We will notify users of significant changes via email or SMS.`
    },
    {
      title: 'Contact',
      icon: Mail,
      content: `For questions about these Terms of Service, please contact:
• Email: legal@velocityet.com
• Phone: +251 912 345 678`
    }
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
          Terms of Service
        </motion.h1>
        <motion.p 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          Rules and guidelines for using VeloCity
        </motion.p>
      </div>

      <div className="info-section">
        <p className="intro-text">
          These Terms of Service govern your use of the VeloCity platform. Please read them carefully 
          before using our service.
        </p>
        <p className="intro-text">
          Last updated: April 13, 2026
        </p>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="info-section">
          <h2>
            <section.icon size={24} />
            {section.title}
          </h2>
          <div className="policy-content">
            {section.content.split('\n').map((line, i) => (
              line.trim() ? <p key={i}>{line}</p> : <br key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
