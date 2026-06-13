import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowLeft, Home } from 'lucide-react';
import { useVeloCity } from '../context/VeloCityContext';
import { fadeUp, fadeIn, staggerContainer } from '../animations';
import './InfoPage.css';

export default function Contact() {
  const { setPage } = useVeloCity();
  const [formMsg, setFormMsg] = useState('');
  const [formSent, setFormSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setFormMsg('Thank you! We will get back to you soon.');
    setTimeout(() => setFormSent(false), 5000);
  };

  const contactInfo = [
    { icon: Phone, title: 'Phone', value: '+251 912 345 678' },
    { icon: Mail, title: 'Email', value: 'support@velocity.et' },
    { icon: MapPin, title: 'Address', value: 'Addis Ababa, Ethiopia' },
    { icon: Clock, title: 'Hours', value: '24/7 Support' },
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
          Contact Us
        </motion.h1>
        <motion.p 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          Get in touch with our team
        </motion.p>
      </div>

      <div className="info-section">
        <motion.div 
          className="contact-grid"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {contactInfo.map((item, index) => (
            <motion.div 
              key={index}
              className="contact-item"
              variants={fadeUp}
            >
              <item.icon size={28} />
              <h3>{item.title}</h3>
              <p>{item.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="info-section">
        <h2>Send us a Message</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Email Address" required />
          </div>
          <textarea placeholder="Your Message" rows="5" required></textarea>
          {formSent && <div className="form-success">{formMsg}</div>}
          <button type="submit" className="btn-primary" disabled={formSent}>
            <MessageSquare size={18} />
            {formSent ? 'Message Sent!' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}