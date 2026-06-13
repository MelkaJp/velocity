import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, Send, CheckCircle } from 'lucide-react';
import './InfoPage.css';

export default function Careers() {
  const { t } = useTranslation();

  const openings = [
    {
      title: 'Senior Backend Engineer',
      department: 'Engineering',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-time',
      salary: '25,000 - 35,000 ETB / month',
      description: 'Build and maintain our backend APIs and database systems.'
    },
    {
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-time',
      salary: '20,000 - 28,000 ETB / month',
      description: 'Create beautiful and responsive user interfaces.'
    },
    {
      title: 'Mobile Developer',
      department: 'Engineering',
      location: 'Remote / Addis Ababa',
      type: 'Full-time',
      salary: '22,000 - 30,000 ETB / month',
      description: 'Develop our Android and iOS mobile applications.'
    },
    {
      title: 'Sales Representative',
      department: 'Sales',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-time',
      salary: '15,000 + Commission',
      description: 'Drive adoption of VeloCity among fuel stations and fleet owners.'
    },
    {
      title: 'Customer Support',
      department: 'Support',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-time',
      salary: '12,000 - 18,000 ETB / month',
      description: 'Help drivers and station managers with their questions and issues.'
    },
    {
      title: 'Partnership Manager',
      department: 'Business Development',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-time',
      salary: '30,000 - 40,000 ETB / month',
      description: 'Build partnerships with municipalities and fuel companies.'
    }
  ];

  const benefits = [
    'Competitive salary',
    'Health insurance',
    'Flexible working hours',
    'Remote work options',
    'Professional development',
    'Team building events',
    'Free lunch on Fridays',
    'Annual performance bonus'
  ];

  return (
    <div className="info-page">
      <div className="info-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Careers
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Join our team and help transform fuel distribution in Ethiopia
        </motion.p>
      </div>

      <div className="info-section">
        <h2>Why Work With Us?</h2>
        <p>
          At VeloCity, we're building something meaningful. We offer competitive compensation,
          a great work environment, and the chance to make a real impact on Ethiopia's fuel ecosystem.
        </p>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <CheckCircle size={20} color="#06D6A0" />
              {benefit}
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h2>Open Positions</h2>
        <p>
          We're looking for talented people to join our growing team.
        </p>
      </div>

      <div className="jobs-list">
        {openings.map((job, index) => (
          <motion.div 
            key={index}
            className="job-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="job-header">
              <h3>{job.title}</h3>
              <span className="job-dept">{job.department}</span>
            </div>
            <p className="job-desc">{job.description}</p>
            <div className="job-meta">
              <span><MapPin size={16} /> {job.location}</span>
              <span><Clock size={16} /> {job.type}</span>
              <span><DollarSign size={16} /> {job.salary}</span>
            </div>
            <button className="job-btn">
              <Send size={16} /> Apply Now
            </button>
          </motion.div>
        ))}
      </div>

      <div className="info-section">
        <h2>Don't see the right role?</h2>
        <p>
          We're always looking for talented people. Send your CV to careers@velocityet.com
          and we'll keep you in mind for future opportunities.
        </p>
      </div>
    </div>
  );
}
