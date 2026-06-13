import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, User, Sparkles, Zap, Fuel, CreditCard, Truck, Shield, HelpCircle } from 'lucide-react';
import './ChatBot.css';

const faqData = [
  {
    category: 'Getting Started',
    icon: 'User',
    qa: [
      { q: 'How do I create an account?', a: 'Click "Create Account" on the login page. Choose your role (Driver, Fleet Owner, etc.), fill in your details, and verify your email/phone with the 6-digit code sent to you.' },
      { q: 'What documents do I need to register a vehicle?', a: 'You need your vehicle license plate number, a photo for verification, and your phone number. Optionally, you can join a driver association.' },
      { q: 'How does the QR code work?', a: 'Each vehicle gets a static QR code printed once and attached to the vehicle. This holds your vehicle data. For each refueling session, you generate a time-limited refuel quota QR code that expires after use.' },
    ],
  },
  {
    category: 'Fueling & Payments',
    icon: 'Fuel',
    qa: [
      { q: 'How do I refuel at a station?', a: 'Arrive at the station, show your static vehicle QR or generate a refuel quota QR from your driver portal. The station worker scans it, verifies your identity, and dispenses the fuel. Payment is deducted from your fuel wallet.' },
      { q: 'How do I add funds to my wallet?', a: 'Go to the Fuel Wallet tab in your Driver Portal, click "Add Funds," enter the amount, and confirm. You can also transfer funds between your vehicles.' },
      { q: 'What if I run out of wallet balance at the station?', a: 'Your wallet must have sufficient balance before fuel is dispensed. You can top up remotely from the Driver Portal before arriving at the station.' },
      { q: 'How are fuel prices calculated?', a: 'Fuel prices are set in USD and converted to ETB at the current rate. A 3% integrity fee is applied per transaction.' },
    ],
  },
  {
    category: 'Subscription Plans',
    icon: 'CreditCard',
    qa: [
      { q: 'What subscription plans are available?', a: 'Basic (1,000 ETB/mo, 50L/day), Premium (2,500 ETB/mo, 150L/day), and Enterprise (5,000 ETB/mo, unlimited). Higher tiers give larger daily fuel limits and priority queue access.' },
      { q: 'How do I upgrade my subscription?', a: 'Go to the Refuel tab in your Driver Portal, find your vehicle in the Subscription section, and click on the tier you want. The change takes effect immediately.' },
      { q: 'What happens if I exceed my daily fuel limit?', a: 'The system blocks the transaction if it exceeds your tier\'s daily limit. You can upgrade your plan to unlock higher limits.' },
    ],
  },
  {
    category: 'Vehicles & Fleet',
    icon: 'Truck',
    qa: [
      { q: 'Can I register multiple vehicles?', a: 'Yes, fleet owners can register multiple vehicles. Each vehicle gets its own QR code, wallet, and subscription.' },
      { q: 'How do fleet owners manage drivers?', a: 'Fleet owners can view all vehicles, monitor fuel consumption per vehicle, set individual limits, and track spending across the entire fleet.' },
      { q: 'What is the vehicle QR code used for?', a: 'The static QR code is printed and attached to the vehicle. Station workers scan it to identify the vehicle and driver before dispensing fuel.' },
    ],
  },
  {
    category: 'Stations & Queue',
    icon: 'Settings',
    qa: [
      { q: 'How do I find a station with available fuel?', a: 'Use the Refuel tab in your Driver Portal to view live station queues and estimated wait times. Stations show fuel availability status (Full, Half, Low, None).' },
      { q: 'How does the queue system work?', a: 'When you request refueling, you\'re added to the station\'s queue. The system estimates your wait time based on the number of vehicles ahead. Your position updates in real time.' },
      { q: 'Can I schedule an appointment?', a: 'Yes, you can book an appointment which assigns you to a station with available fuel. Appointments are batched in groups of 5 with 10-minute windows starting at 6:00 AM.' },
    ],
  },
  {
    category: 'Security & Support',
    icon: 'Shield',
    qa: [
      { q: 'How is my account protected?', a: 'Accounts are protected by password authentication. Suspicious activity (rapid refills, unusual patterns) is detected automatically and flagged for review.' },
      { q: 'What should I do if I suspect fuel theft?', a: 'Report it immediately via the "Report Issue" button in the Escalation Workflow. Station managers and municipality admins will review and take action.' },
      { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login screen, enter your registered email, and follow the reset link sent to your inbox.' },
    ],
  },
];

const greetings = [
  /^(hi|hello|hey|good morning|good afternoon|good evening|yo|sup|howdy)/i,
];

const thanks = [
  /^(thanks|thank you|thx|ty|appreciate it)/i,
];

const keywords = faqData.flatMap(cat =>
  cat.qa.map(item => ({
    words: item.q.toLowerCase().replace(/[?.,!]/g, '').split(' ').filter(w => w.length > 2),
    answer: item.a,
    question: item.q,
  }))
);

const quickActions = [
  { label: 'Create Account', icon: User, keywords: 'create account register sign up' },
  { label: 'How to Refuel', icon: Fuel, keywords: 'refuel fuel station how to' },
  { label: 'Subscription Plans', icon: CreditCard, keywords: 'subscription plan pricing tier' },
  { label: 'Fleet Management', icon: Truck, keywords: 'fleet vehicle multiple drivers' },
  { label: 'Report Issue', icon: Shield, keywords: 'report theft issue problem security' },
];

function findAnswer(input) {
  const text = input.toLowerCase().replace(/[?.,!]/g, '');
  if (greetings.some(r => r.test(text))) return { answer: 'Hello! How can I help you with VeloCity today? You can ask me about fueling, accounts, subscriptions, or pick a quick topic below.', isGreeting: true };
  if (thanks.some(r => r.test(text))) return { answer: "You're welcome! Is there anything else I can help you with?", isThanks: true };

  let bestScore = 0;
  let bestMatch = null;
  const inputWords = text.split(' ').filter(w => w.length > 2);

  for (const entry of keywords) {
    let score = 0;
    for (const w of inputWords) {
      for (const kw of entry.words) {
        if (w === kw) score += 3;
        else if (w.includes(kw) || kw.includes(w)) score += 1.5;
        else if (kw.startsWith(w) || w.startsWith(kw)) score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestScore >= 2 && bestMatch) {
    return { answer: bestMatch.answer, relatedQuestion: bestMatch.question };
  }

  return {
    answer: "I'm not sure I understand. Try asking about: creating an account, refueling at a station, subscription plans, managing your fleet, or reporting an issue. Or pick a topic below!",
    fallback: true,
  };
}

const iconMap = { User, Fuel, CreditCard, Truck, Shield, HelpCircle };

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm VeloCity Assistant. Ask me anything about fueling, accounts, subscriptions, or pick a topic below.", quickActions: true },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const addMessage = (text, role) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  const handleSend = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    addMessage(msg, 'user');
    setTyping(true);

    setTimeout(() => {
      const result = findAnswer(msg);
      setTyping(false);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: result.answer,
        relatedQuestion: result.relatedQuestion,
        quickActions: result.fallback || result.isGreeting,
      }]);
    }, 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="cb-floating">
      <div className="cb-header">
        <div className="cb-header-left">
          <div className="cb-avatar"><Bot size={18} /></div>
          <div>
            <div className="cb-title">VeloCity Assistant</div>
            <div className="cb-status"><span className="cb-dot" /> Online</div>
          </div>
        </div>
        <button className="cb-close" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="cb-messages" ref={listRef}>
        {messages.map((m, i) => (
          <div key={i} className={`cb-msg ${m.role === 'bot' ? 'cb-msg--bot' : 'cb-msg--user'}`}>
            {m.role === 'bot' && (
              <div className="cb-msg-avatar"><Bot size={14} /></div>
            )}
            <div className="cb-bubble">
              <p>{m.text}</p>
              {m.relatedQuestion && <div className="cb-related">Related: {m.relatedQuestion}</div>}
              {m.quickActions && (
                <div className="cb-actions">
                  {quickActions.map((act, ai) => {
                    const IconComp = iconMap[act.icon] || HelpCircle;
                    return (
                      <button key={ai} className="cb-action-btn" onClick={() => handleSend(act.keywords.split(' ')[0])}>
                        <IconComp size={13} /> {act.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="cb-msg cb-msg--bot">
            <div className="cb-msg-avatar"><Bot size={14} /></div>
            <div className="cb-bubble cb-typing">
              <span className="cb-typing-dot" />
              <span className="cb-typing-dot" />
              <span className="cb-typing-dot" />
            </div>
          </div>
        )}
      </div>

      <div className="cb-input-bar">
        <input
          ref={inputRef}
          className="cb-input"
          placeholder="Ask me anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="cb-send" onClick={() => handleSend()} disabled={!input.trim()}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
