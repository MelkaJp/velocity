import { useTranslation } from '../context/TranslationContext';
import { useVeloCity } from '../context/VeloCityContext';
import { motion } from 'framer-motion';
import { Fuel, Check, X, Star, Users, Building2, MapPin, ArrowLeft, Home } from 'lucide-react';
import './InfoPage.css';

export default function Pricing() {
  const { t } = useTranslation();
  const { setPage } = useVeloCity();

  const handleSignup = (planName) => {
    setPage('landing');
    setTimeout(() => {
      const el = document.querySelector('.btn-signup');
      if (el) el.click();
    }, 100);
  };

  const plans = [
    {
      name: 'Driver',
      price: '1,000',
      period: 'ETB / Yearly',
      description: 'For individual drivers',
      icon: Fuel,
      color: '#06D6A0',
      features: [
        { name: 'Vehicle registration', included: true },
        { name: 'QR code fuel card', included: true },
        { name: 'SMS notifications', included: true },
        { name: 'Book fuel slots', included: true },
        { name: 'Transaction history', included: true },
        { name: 'Fleet management', included: false },
        { name: 'Priority booking', included: false },
      ]
    },
    {
      name: 'Fleet Owner',
      price: '3,000',
      period: 'ETB / Yearly',
      description: 'For fleet businesses',
      icon: Users,
      color: '#3A86FF',
      popular: true,
      features: [
        { name: 'Vehicle registration', included: true },
        { name: 'QR code fuel card', included: true },
        { name: 'SMS notifications', included: true },
        { name: 'Book fuel slots', included: true },
        { name: 'Transaction history', included: true },
        { name: 'Fleet management', included: true },
        { name: 'Priority booking', included: true },
      ]
    },
    {
      name: 'Station',
      price: '5,000',
      period: 'ETB / Yearly',
      description: 'For fuel stations',
      icon: MapPin,
      color: '#FF6B35',
      features: [
        { name: 'QR code scanning', included: true },
        { name: 'Transaction verification', included: true },
        { name: 'Inventory management', included: true },
        { name: 'Worker management', included: true },
        { name: 'Sales analytics', included: true },
        { name: 'API access', included: false },
        { name: 'Priority support', included: false },
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For municipalities',
      icon: Building2,
      color: '#8338EC',
      features: [
        { name: 'QR code scanning', included: true },
        { name: 'Transaction verification', included: true },
        { name: 'Inventory management', included: true },
        { name: 'Worker management', included: true },
        { name: 'Sales analytics', included: true },
        { name: 'API access', included: true },
        { name: 'Priority support', included: true },
      ]
    }
  ];

  return (
    <div className="info-page">
      <div className="page-nav">
        <button onClick={() => setPage('landing')} className="back-btn"><ArrowLeft size={18} /> {t('back', 'Back')}</button>
        <button onClick={() => setPage('landing')} className="home-btn"><Home size={18} /></button>
      </div>
      <div className="info-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('pricing', 'Pricing')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t('pricingSubtitle', 'Simple, transparent pricing for everyone')}
        </motion.p>
      </div>

      <div className="info-section">
        <h2>{t('choosePlan', 'Choose your plan')}</h2>
        <p>
          {t('pricingDesc', "Whether you're a driver, fleet owner, or station manager, we have a plan that fits your needs.")}
        </p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <motion.div 
            key={index}
            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <div className="pricing-icon" style={{ backgroundColor: `${plan.color}20`, color: plan.color }}>
              <plan.icon size={32} />
            </div>
            <h3>{plan.name}</h3>
            <div className="pricing-price">
              <span className="price">{plan.price}</span>
              <span className="period">{plan.period}</span>
            </div>
            <p className="pricing-desc">{plan.description}</p>
            <ul className="pricing-features">
              {plan.features.map((feature, i) => (
                <li key={i} className={feature.included ? 'included' : 'not-included'}>
                  {feature.included ? <Check size={18} /> : <X size={18} />}
                  {feature.name}
                </li>
              ))}
            </ul>
            <button 
              className="pricing-btn" 
              style={{ backgroundColor: plan.color }}
              onClick={() => handleSignup(plan.name)}
            >
              {plan.price === 'Custom' ? 'Contact Us' : 'Sign Up'}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="info-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>Is there a registration fee?</h4>
            <p>Driver registration is completely free. You only pay for fuel as you use it.</p>
          </div>
          <div className="faq-item">
            <h4>Can I switch plans later?</h4>
            <p>Yes, you can upgrade or downgrade your plan at any time from your dashboard.</p>
          </div>
          <div className="faq-item">
            <h4>What payment methods are accepted?</h4>
            <p>We accept mobile money (M-Pesa), bank transfers, and cash at designated locations.</p>
          </div>
          <div className="faq-item">
            <h4>Is there a free trial for paid plans?</h4>
            <p>Yes, we offer a 14-day free trial for Fleet Owner and Station plans.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
