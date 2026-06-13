import { useTranslation } from '../context/TranslationContext';
import { useVeloCity } from '../context/VeloCityContext';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, User, Database, Bell, Mail, Trash2, ArrowLeft, Home } from 'lucide-react';
import { fadeUp, fadeIn } from '../animations';
import Button from '../components/Button';
import './InfoPage.css';

export default function Privacy() {
  const { t } = useTranslation();
  const { setPage } = useVeloCity();

  const sections = [
    {
      title: 'Information We Collect',
      icon: Database,
      content: `We collect information you provide directly to us, including:
• Name and contact information (phone number, email)
• Vehicle information (plate number, type, tank capacity)
• Transaction history and fuel booking records
• Location data when you use our app
• Photos for driver verification`
    },
    {
      title: 'How We Use Your Information',
      icon: Eye,
      content: `We use the information we collect to:
• Provide and maintain our fuel management services
• Process your fuel transactions and bookings
• Send you SMS notifications about your bookings
• Verify your identity at fuel stations
• Improve and optimize our services
• Communicate with you about updates and support`
    },
    {
      title: 'Information Sharing',
      icon: User,
      content: `We may share your information with:
• Fuel stations you book with (for verification)
• Municipalities (for regulatory compliance)
• Service providers who assist us in operating our platform
We do NOT sell your personal information to third parties.`
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: `We implement appropriate technical and organizational measures to protect your personal information, including:
• Encryption of data in transit and at rest
• Regular security audits
• Access controls and authentication
• Secure storage of QR codes and transaction records`
    },
    {
      title: 'Your Rights',
      icon: User,
      content: `You have the right to:
• Access your personal information
• Correct inaccurate data
• Request deletion of your data
• Opt-out of marketing communications
• Export your data in a portable format`
    },
    {
      title: 'Contact Us',
      icon: Mail,
      content: `If you have any questions about this Privacy Policy, please contact us at:
• Email: privacy@velocityet.com
• Phone: +251 912 345 678
• Address: Addis Ababa, Ethiopia`
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
          Privacy Policy
        </motion.h1>
        <motion.p 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          Your privacy is important to us
        </motion.p>
      </div>

      <div className="info-section">
        <p className="intro-text">
          This Privacy Policy describes how VeloCity ("we", "us", or "our") collects, uses, and 
          shares your personal information when you use our fuel management platform.
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
