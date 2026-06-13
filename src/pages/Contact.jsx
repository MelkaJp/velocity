import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import './InfoPage.css';

export default function Contact() {
  const contactInfo = [
    { icon: Phone, title: 'Phone', value: '+251 912 345 678' },
    { icon: Mail, title: 'Email', value: 'support@velocity.et' },
    { icon: MapPin, title: 'Address', value: 'Addis Ababa, Ethiopia' },
    { icon: Clock, title: 'Hours', value: '24/7 Support' },
  ];

  return (
    <div className="info-page">
      <div className="page-nav">
        <Link to="/" className="back-btn"><ArrowLeft size={18} /> Back</Link>
        <Link to="/" className="home-btn"><Home size={18} /></Link>
      </div>
      <div className="info-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Contact Us
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Get in touch with our team
        </motion.p>
      </div>

      <div className="info-section">
        <div className="contact-grid">
          {contactInfo.map((item, index) => (
            <motion.div 
              key={index}
              className="contact-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <item.icon size={28} />
              <h3>{item.title}</h3>
              <p>{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h2>Send us a Message</h2>
        <form className="contact-form">
          <div className="form-row">
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Email Address" />
          </div>
          <textarea placeholder="Your Message" rows="5"></textarea>
          <button type="submit" className="btn-primary">
            <MessageSquare size={18} />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}