import { useState, useMemo, useEffect } from 'react';
import {
  MessageCircle, Send, Phone, X, HelpCircle, ChevronDown,
  Search, Mail, ThumbsUp, ExternalLink, FileText, CreditCard, Truck,
  Shield, Fuel, User, Settings, AlertCircle, Clock, LifeBuoy
} from 'lucide-react';
import './FloatingContact.css';

const faqData = [
  {
    category: 'Getting Started',
    icon: User,
    questions: [
      { q: 'How do I create an account?', a: 'Click "Create Account" on the login page. Choose your role (Driver, Fleet Owner, etc.), fill in your details, and verify your email/phone with the 6-digit code sent to you.' },
      { q: 'What documents do I need to register a vehicle?', a: 'You need your vehicle license plate number, a photo for verification, and your phone number. Optionally, you can join a driver association.' },
      { q: 'How does the QR code work?', a: 'Each vehicle gets a static QR code printed once and attached to the vehicle. This holds your vehicle data. For each refueling session, you generate a time-limited refuel quota QR code that expires after use.' },
    ],
  },
  {
    category: 'Fueling & Payments',
    icon: Fuel,
    questions: [
      { q: 'How do I refuel at a station?', a: 'Arrive at the station, show your static vehicle QR or generate a refuel quota QR from your driver portal. The station worker scans it, verifies your identity, and dispenses the fuel. Payment is deducted from your fuel wallet.' },
      { q: 'How do I add funds to my wallet?', a: 'Go to the Fuel Wallet tab in your Driver Portal, click "Add Funds," enter the amount, and confirm. You can also transfer funds between your vehicles.' },
      { q: 'What if I run out of wallet balance at the station?', a: 'Your wallet must have sufficient balance before fuel is dispensed. You can top up remotely from the Driver Portal before arriving at the station.' },
      { q: 'How are fuel prices calculated?', a: 'Fuel prices are set in USD and converted to ETB at the current rate. A 3% integrity fee is applied per transaction, distributed among the municipality, developer, station worker, and station admin.' },
    ],
  },
  {
    category: 'Subscription Plans',
    icon: CreditCard,
    questions: [
      { q: 'What subscription plans are available?', a: 'Basic (1,000 ETB/mo, 50L/day), Premium (2,500 ETB/mo, 150L/day), and Enterprise (5,000 ETB/mo, unlimited). Higher tiers give you larger daily fuel limits and priority queue access.' },
      { q: 'How do I upgrade my subscription?', a: 'Go to the Refuel tab in your Driver Portal, find your vehicle in the Subscription section, and click on the tier you want. The change takes effect immediately.' },
      { q: 'What happens if I exceed my daily fuel limit?', a: 'The system will block the transaction if it exceeds your tier\'s daily limit. You can upgrade your plan to unlock higher limits.' },
    ],
  },
  {
    category: 'Vehicles & Fleet',
    icon: Truck,
    questions: [
      { q: 'Can I register multiple vehicles?', a: 'Yes, fleet owners can register multiple vehicles. Each vehicle gets its own QR code, wallet, and subscription.' },
      { q: 'How do fleet owners manage drivers?', a: 'Fleet owners can view all vehicles, monitor fuel consumption per vehicle, set individual limits, and track spending across the entire fleet.' },
      { q: 'What is the vehicle QR code used for?', a: 'The static QR code is printed and attached to the vehicle. Station workers scan it to identify the vehicle and driver before dispensing fuel.' },
    ],
  },
  {
    category: 'Stations & Queue',
    icon: Settings,
    questions: [
      { q: 'How do I find a station with available fuel?', a: 'Use the Refuel tab in your Driver Portal to view live station queues and estimated wait times before heading out. Stations show fuel availability status (Full, Half, Low, None).' },
      { q: 'How does the queue system work?', a: 'When you request refueling, you\'re added to the station\'s queue. The system estimates your wait time based on the number of vehicles ahead. You\'ll see your position update in real time.' },
      { q: 'Can I schedule an appointment?', a: 'Yes, you can book an appointment which assigns you to a station with available fuel. Appointments are batched in groups of 5 with 10-minute windows starting at 6:00 AM.' },
    ],
  },
  {
    category: 'Security & Support',
    icon: Shield,
    questions: [
      { q: 'How is my account protected?', a: 'Accounts are protected by password authentication. Suspicious activity (rapid refills, unusual patterns) is detected automatically and flagged for review.' },
      { q: 'What should I do if I suspect fuel theft?', a: 'Report it immediately via the "Report Issue" button in the Escalation Workflow. Station managers and municipality admins will review and take action.' },
      { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login screen, enter your registered email, and follow the reset link sent to your inbox.' },
      { q: 'Who do I contact for technical issues?', a: 'Use the WhatsApp or Telegram buttons in this help panel to reach our support team. You can also call us directly.' },
    ],
  },
];

const contactChannels = [
  { icon: MessageCircle, href: 'https://wa.me/251911234567', color: '#25D366', label: 'WhatsApp', sub: 'Fastest response — usually within 5min' },
  { icon: Send, href: 'https://t.me/velocityfuel', color: '#0088cc', label: 'Telegram', sub: 'Join our community channel' },
  { icon: Phone, href: 'tel:+251911234567', color: '#64748b', label: 'Call Us', sub: '+251 911 234 567' },
  { icon: Mail, href: 'mailto:support@velocity.com', color: '#EF476F', label: 'Email', sub: 'support@velocity.com' },
];

const quickContact = contactChannels.slice(0, 3);

export default function FloatingContact() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('faq');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return faqData;
    const q = search.toLowerCase();
    return faqData.map(cat => ({
      ...cat,
      questions: cat.questions.filter(item =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      ),
    })).filter(cat => cat.questions.length > 0);
  }, [search]);

  const toggleQuestion = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const closeAll = () => {
    setHelpOpen(false);
    setContactOpen(false);
    setSearch('');
    setExpanded(null);
  };

  if (isMobile) {
    return (
      <>
        {helpOpen && <div className="help-overlay" onClick={closeAll} />}
        {helpOpen && (
          <div className="help-panel help-panel--mobile">
            <div className="help-panel-header">
              <HelpCircle size={20} />
              <span>Help & Support</span>
              <button className="help-panel-close" onClick={closeAll}><X size={18} /></button>
            </div>
            <div className="help-tabs">
              <button className={`help-tab ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}>
                <FileText size={14} /> FAQ
              </button>
              <button className={`help-tab ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>
                <MessageSquare size={14} /> Contact
              </button>
            </div>
            {activeTab === 'faq' && (
              <div className="help-faq">
                <div className="help-search">
                  <Search size={14} />
                  <input type="text" placeholder="Search FAQs..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="help-faq-list">
                  {filtered.length === 0 ? (
                    <div className="help-no-results">
                      <AlertCircle size={20} />
                      <p>No results for "{search}"</p>
                    </div>
                  ) : (
                    filtered.map((cat, ci) => (
                      <div key={ci} className="help-category">
                        <div className="help-category-header">
                          <cat.icon size={13} />
                          <span>{cat.category}</span>
                        </div>
                        {cat.questions.map((item, qi) => {
                          const id = `${ci}-${qi}`;
                          return (
                            <div key={id} className={`help-question ${expanded === id ? 'expanded' : ''}`}>
                              <button className="help-question-btn" onClick={() => toggleQuestion(id)}>
                                <span>{item.q}</span>
                                <ChevronDown size={14} className="help-chevron" />
                              </button>
                              {expanded === id && (
                                <div className="help-answer">
                                  <p>{item.a}</p>
                                  <button className="help-feedback" onClick={() => {}}>
                                    <ThumbsUp size={11} /> Helpful
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {activeTab === 'contact' && (
              <div className="help-contact">
                <p className="help-contact-intro">Choose how to reach us. We typically respond within minutes.</p>
                <div className="help-contact-list">
                  {contactChannels.map((opt, idx) => (
                    <a key={idx} href={opt.href} target="_blank" rel="noopener noreferrer" className="help-contact-card" style={{ borderLeftColor: opt.color }}>
                      <div className="help-contact-icon" style={{ background: opt.color }}><opt.icon size={18} /></div>
                      <div className="help-contact-info"><strong>{opt.label}</strong><span>{opt.sub}</span></div>
                      <ExternalLink size={14} className="help-contact-ext" />
                    </a>
                  ))}
                </div>
                <div className="help-response-time">
                  <Clock size={12} />
                  <span>Average response: &lt; 5 minutes</span>
                </div>
              </div>
            )}
            <div className="help-panel-footer">
              <span>VeloCity v{import.meta.env.VITE_APP_VERSION || '2.0'}</span>
            </div>
          </div>
        )}

        {contactOpen && (
          <div className="quick-contact-popup">
            {quickContact.map((opt, idx) => (
              <a key={idx} href={opt.href} target="_blank" rel="noopener noreferrer" className="quick-contact-item" style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="quick-contact-badge" style={{ background: opt.color }}><opt.icon size={18} /></div>
                <span>{opt.label}</span>
              </a>
            ))}
          </div>
        )}

        <div className="mobile-help-bar">
          <button className="mobile-help-btn" onClick={() => { setHelpOpen(true); setContactOpen(false); }}>
            <LifeBuoy size={20} />
            <span>Help</span>
          </button>
          <button className="mobile-help-btn" onClick={() => { setContactOpen(!contactOpen); setHelpOpen(false); }}>
            <MessageCircle size={20} />
            <span>Contact</span>
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="floating-contact">
      {helpOpen && (
        <div className="help-panel">
          <div className="help-panel-header">
            <HelpCircle size={22} />
            <span>Help & Support</span>
            <button className="help-panel-close" onClick={() => { setHelpOpen(false); setSearch(''); setExpanded(null); }}><X size={18} /></button>
          </div>
          <div className="help-tabs">
            <button className={`help-tab ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}>
              <FileText size={16} /> FAQ
            </button>
            <button className={`help-tab ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>
              <MessageSquare size={16} /> Contact
            </button>
          </div>
          {activeTab === 'faq' && (
            <div className="help-faq">
              <div className="help-search">
                <Search size={16} />
                <input type="text" placeholder="Search FAQs..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="help-faq-list">
                {filtered.length === 0 ? (
                  <div className="help-no-results">
                    <AlertCircle size={24} />
                    <p>No results for "{search}"</p>
                  </div>
                ) : (
                  filtered.map((cat, ci) => (
                    <div key={ci} className="help-category">
                      <div className="help-category-header">
                        <cat.icon size={16} />
                        <span>{cat.category}</span>
                      </div>
                      {cat.questions.map((item, qi) => {
                        const id = `${ci}-${qi}`;
                        return (
                          <div key={id} className={`help-question ${expanded === id ? 'expanded' : ''}`}>
                            <button className="help-question-btn" onClick={() => toggleQuestion(id)}>
                              <span>{item.q}</span>
                              <ChevronDown size={16} className="help-chevron" />
                            </button>
                            {expanded === id && (
                              <div className="help-answer">
                                <p>{item.a}</p>
                                <button className="help-feedback" onClick={() => {}}>
                                  <ThumbsUp size={12} /> Helpful
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === 'contact' && (
            <div className="help-contact">
              <p className="help-contact-intro">Choose how to reach us. We typically respond within minutes.</p>
              <div className="help-contact-list">
                {contactChannels.map((opt, idx) => (
                  <a key={idx} href={opt.href} target="_blank" rel="noopener noreferrer" className="help-contact-card" style={{ borderLeftColor: opt.color }}>
                    <div className="help-contact-icon" style={{ background: opt.color }}><opt.icon size={20} /></div>
                    <div className="help-contact-info"><strong>{opt.label}</strong><span>{opt.sub}</span></div>
                    <ExternalLink size={16} className="help-contact-ext" />
                  </a>
                ))}
              </div>
              <div className="help-response-time">
                <Clock size={14} />
                <span>Average response: &lt; 5 minutes</span>
              </div>
            </div>
          )}
          <div className="help-panel-footer">
            <span>VeloCity v{import.meta.env.VITE_APP_VERSION || '2.0'}</span>
          </div>
        </div>
      )}

      {contactOpen && (
        <div className="floating-contact-options">
          {quickContact.map((opt, idx) => (
            <a key={idx} href={opt.href} target="_blank" rel="noopener noreferrer" title={opt.label} className="floating-contact-link" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="floating-contact-icon" style={{ background: opt.color }}><opt.icon size={20} /></div>
            </a>
          ))}
        </div>
      )}

      <div className="floating-contact-buttons">
        {helpOpen || contactOpen ? (
          <button className="floating-contact-toggle close-btn" onClick={closeAll} aria-label="Close">
            <X size={22} />
          </button>
        ) : (
          <>
            <button className="floating-contact-toggle" onClick={() => setContactOpen(true)} aria-label="Contact" style={{ background: '#0088cc' }}>
              <MessageCircle size={20} />
            </button>
            <button className="floating-contact-toggle" onClick={() => setHelpOpen(true)} aria-label="Help">
              <LifeBuoy size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
