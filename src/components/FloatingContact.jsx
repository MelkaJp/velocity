import { useState } from 'react';
import { MessageCircle, Send, Phone, X, MessageSquare } from 'lucide-react';

const contactOptions = [
  {
    icon: MessageCircle,
    href: 'https://wa.me/251911234567',
    color: '#25D366',
    label: 'WhatsApp'
  },
  {
    icon: Send,
    href: 'https://t.me/velocityfuel',
    color: '#0088cc',
    label: 'Telegram'
  },
  {
    icon: Phone,
    href: 'tel:+251911234567',
    color: '#64748b',
    label: 'Call Us'
  },
];

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="floating-contact">
      {isOpen && (
        <div className="floating-contact-options">
          {contactOptions.map((option, idx) => (
            <a
              key={idx}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              title={option.label}
              className="floating-contact-link"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="floating-contact-icon" style={{ background: option.color }}>
                <option.icon size={20} />
              </div>
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="floating-contact-toggle"
        aria-label={isOpen ? 'Close contact' : 'Open contact'}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
