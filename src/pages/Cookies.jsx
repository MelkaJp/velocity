import { useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { useVeloCity } from '../context/VeloCityContext';
import { motion } from 'framer-motion';
import { Cookie, Settings, Bell, Eye, XCircle, CheckCircle, ArrowLeft, Home } from 'lucide-react';
import { fadeUp, fadeIn, staggerContainer, cardHoverLift } from '../animations';
import './InfoPage.css';

export default function Cookies() {
  const { t } = useTranslation();
  const { setPage } = useVeloCity();
  const [cookiePref, setCookiePref] = useState(null);

  const cookieTypes = [
    {
      name: 'Essential Cookies',
      description: 'Required for the platform to function properly',
      examples: 'Authentication tokens, session data, security settings',
      required: true
    },
    {
      name: 'Analytics Cookies',
      description: 'Help us understand how users interact with our platform',
      examples: 'Page views, session duration, navigation patterns',
      required: false
    },
    {
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization',
      examples: 'Language preferences, saved bookings, vehicle history',
      required: false
    },
    {
      name: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements',
      examples: 'Campaign performance, user engagement',
      required: false
    }
  ];

  const sections = [
    {
      title: 'What Are Cookies?',
      content: `Cookies are small text files that are stored on your device when you use VeloCity. 
They help the platform remember your preferences and provide a better user experience.`
    },
    {
      title: 'How We Use Cookies',
      content: `We use cookies for various purposes:
• To keep you logged in securely
• To remember your vehicle and booking preferences
• To analyze platform performance and usage
• To improve our services based on user feedback
• To provide personalized content and recommendations`
    },
    {
      title: 'Managing Cookies',
      content: `You can control or delete cookies through your browser settings:
• Chrome: Settings > Privacy > Cookies
• Firefox: Options > Privacy > Cookies
• Safari: Preferences > Privacy > Cookies
• Edge: Settings > Cookies

Please note that removing cookies may affect platform functionality.`
    },
    {
      title: 'Updates to This Policy',
      content: `We may update this Cookie Policy from time to time. Any changes will be posted on this page.`
    }
  ];

  return (
    <div className="info-page">
      <div className="page-nav">
        <button onClick={() => setPage('landing')} className="back-btn"><ArrowLeft size={18} /> Back</button>
        <button onClick={() => setPage('landing')} className="home-btn"><Home size={18} /></button>
      </div>
      <div className="info-hero">
        <motion.h1 
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Cookie Policy
        </motion.h1>
        <motion.p 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          How we use cookies to improve your experience
        </motion.p>
      </div>

      <div className="info-section">
        <p className="intro-text">
          This Cookie Policy explains what cookies are and how VeloCity uses them. 
          Last updated: April 13, 2026
        </p>
      </div>

      <div className="info-section">
        <h2>Types of Cookies We Use</h2>
        <motion.div 
          className="cookies-grid"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {cookieTypes.map((cookie, index) => (
            <motion.div key={index} className="cookie-card" variants={fadeUp} {...cardHoverLift}>
              <div className="cookie-header">
                <h3>{cookie.name}</h3>
                {cookie.required ? (
                  <span className="required-badge">Required</span>
                ) : (
                  <span className="optional-badge">Optional</span>
                )}
              </div>
              <p>{cookie.description}</p>
              <span className="cookie-examples">{cookie.examples}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="info-section">
          <h2>
            {section.title.includes('What') ? <Cookie size={24} /> : <Settings size={24} />}
            {section.title}
          </h2>
          <div className="policy-content">
            {section.content.split('\n').map((line, i) => (
              line.trim() ? <p key={i}>{line}</p> : <br key={i} />
            ))}
          </div>
        </div>
      ))}

      <div className="info-section">
        <h2>Your Choices</h2>
        <p>
          You can manage your cookie preferences at any time:
        </p>
        <div className="cookie-actions">
          <button className="cookie-btn accept" onClick={() => setCookiePref('all')}>
            <CheckCircle size={18} /> {cookiePref === 'all' ? 'Accepted!' : 'Accept All'}
          </button>
          <button className="cookie-btn reject" onClick={() => setCookiePref('essential')}>
            <XCircle size={18} /> {cookiePref === 'essential' ? 'Saved!' : 'Reject Non-Essential'}
          </button>
        </div>
      </div>
    </div>
  );
}
