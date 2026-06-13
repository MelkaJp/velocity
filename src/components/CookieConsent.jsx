import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('velocity_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('velocity_cookie_consent', JSON.stringify({
      essential: true, analytics: true, functional: true,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent-inner">
        <Cookie size={18} className="cookie-icon" />
        <p className="cookie-text">
          We use cookies to enhance your experience and analyze site traffic.
        </p>
        <div className="cookie-actions">
          <button onClick={acceptAll} className="cookie-accept-btn">
            Accept
          </button>
          <button onClick={() => setIsVisible(false)} className="cookie-dismiss-btn" aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
