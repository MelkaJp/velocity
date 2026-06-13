import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Fuel, CreditCard, Truck, Shield, HelpCircle, User } from 'lucide-react';
import './ChatBot.css';

const knowledgeBase = [
  { q: 'How do I create an account', a: 'Click "Create Account" on the login page. Choose your role (Driver, Fleet Owner, etc.), fill in your details, and verify your email/phone with the 6-digit code sent to you.' },
  { q: 'What documents do I need to register a vehicle', a: 'You need your vehicle license plate number, a photo for verification, and your phone number. Optionally, you can join a driver association.' },
  { q: 'How does the QR code work', a: 'Each vehicle gets a static QR code printed once and attached to the vehicle. This holds your vehicle data. For each refueling session, you generate a time-limited refuel quota QR code that expires after use.' },
  { q: 'How do I refuel at a station', a: 'Arrive at the station, show your static vehicle QR or generate a refuel quota QR from your driver portal. The station worker scans it, verifies your identity, and dispenses the fuel. Payment is deducted from your fuel wallet.' },
  { q: 'How do I add funds to my wallet', a: 'Go to the Fuel Wallet tab in your Driver Portal, click "Add Funds," enter the amount, and confirm. You can also transfer funds between your vehicles.' },
  { q: 'What if I run out of wallet balance', a: 'Your wallet must have sufficient balance before fuel is dispensed. You can top up remotely from the Driver Portal before arriving at the station.' },
  { q: 'How are fuel prices calculated', a: 'Fuel prices are set in USD and converted to ETB at the current rate. A 3% integrity fee is applied per transaction, distributed among the municipality, developer, station worker, and station admin.' },
  { q: 'What subscription plans are available', a: 'Basic (1,000 ETB/mo, 50L/day), Premium (2,500 ETB/mo, 150L/day), and Enterprise (5,000 ETB/mo, unlimited). Higher tiers give larger daily fuel limits and priority queue access.' },
  { q: 'How do I upgrade my subscription', a: 'Go to the Refuel tab in your Driver Portal, find your vehicle in the Subscription section, and click on the tier you want. The change takes effect immediately.' },
  { q: 'What happens if I exceed my daily fuel limit', a: 'The system blocks the transaction if it exceeds your tier\'s daily limit. You can upgrade your plan to unlock higher limits.' },
  { q: 'Can I register multiple vehicles', a: 'Yes, fleet owners can register multiple vehicles. Each vehicle gets its own QR code, wallet, and subscription.' },
  { q: 'How do fleet owners manage drivers', a: 'Fleet owners can view all vehicles, monitor fuel consumption per vehicle, set individual limits, and track spending across the entire fleet.' },
  { q: 'What is the vehicle QR code used for', a: 'The static QR code is printed and attached to the vehicle. Station workers scan it to identify the vehicle and driver before dispensing fuel.' },
  { q: 'How do I find a station with available fuel', a: 'Use the Refuel tab in your Driver Portal to view live station queues and estimated wait times. Stations show fuel availability status (Full, Half, Low, None).' },
  { q: 'How does the queue system work', a: 'When you request refueling, you\'re added to the station\'s queue. The system estimates your wait time based on the number of vehicles ahead. Your position updates in real time.' },
  { q: 'Can I schedule an appointment', a: 'Yes, you can book an appointment which assigns you to a station with available fuel. Appointments are batched in groups of 5 with 10-minute windows starting at 6:00 AM.' },
  { q: 'How is my account protected', a: 'Accounts are protected by password authentication. Suspicious activity (rapid refills, unusual patterns) is detected automatically and flagged for review.' },
  { q: 'What should I do if I suspect fuel theft', a: 'Report it immediately via the "Report Issue" button in the Escalation Workflow. Station managers and municipality admins will review and take action.' },
  { q: 'How do I reset my password', a: 'Click "Forgot Password" on the login screen, enter your registered email, and follow the reset link sent to your inbox.' },
  { q: 'Who do I contact for technical issues', a: 'Use the WhatsApp or Telegram buttons in the Help panel to reach our support team. You can also call us directly.' },
  { q: 'What is the fuel wallet', a: 'Your fuel wallet stores pre-paid funds used to pay for fuel at stations. You add money to it and it deducts automatically when you refuel.' },
  { q: 'What is the integrity fee', a: 'A 3% fee per transaction distributed among the municipality (1%), developer (1%), station worker (0.5%), and station admin (0.5%) to ensure system transparency.' },
  { q: 'What roles are available', a: 'Roles include Driver, Fleet Owner, Station Manager, Station Worker, Municipality Admin, and Developer Admin. Each has different permissions and access levels.' },
  { q: 'How do drivers earn money', a: 'Drivers earn through the system\'s integrity fee distribution and can also receive direct payments for services.' },
  { q: 'What happens if my fuel is stolen', a: 'Report suspected theft through the Escalation Workflow. The system detects unusual patterns (rapid refills, abnormal volumes) and flags them for review.' },
  { q: 'Can I transfer fuel between vehicles', a: 'No, fuel cannot be directly transferred between vehicles. However, you can transfer wallet funds between your vehicles using the Fuel Wallet tab.' },
  { q: 'What is a refuel quota QR code', a: 'A time-limited, single-use QR code generated for each refueling session. It expires after use to prevent unauthorized refueling.' },
  { q: 'How do station workers verify identity', a: 'Station workers scan your vehicle QR code and verify your face matches the registered photo before dispensing fuel.' },
  { q: 'What are the station fuel statuses', a: 'Stations show fuel availability as: Full (plenty), Half (moderate), Low (limited), or None (out of fuel).' },
  { q: 'How do I view my transaction history', a: 'Go to your Driver Portal and navigate to the Transactions or Fuel Wallet section to see your full history.' },
];

const synonyms = {
  create: ['make', 'register', 'sign up', 'setup', 'open', 'start', 'new'],
  account: ['profile', 'login', 'user', 'registration'],
  refuel: ['fuel', 'gas', 'fill', 'refill', 'pump', 'gasoline', 'diesel', 'gas up'],
  wallet: ['balance', 'funds', 'money', 'payment', 'credit', 'prepaid', 'account balance'],
  subscription: ['plan', 'tier', 'package', 'pricing', 'premium', 'upgrade', 'basic', 'enterprise'],
  vehicle: ['car', 'truck', 'auto', 'automobile', 'fleet', 'van', 'bus'],
  station: ['gas station', 'fuel station', 'pump', 'depot', 'petrol station'],
  queue: ['line', 'wait', 'waiting', 'appointment', 'schedule', 'booking', 'slot'],
  security: ['protect', 'safe', 'secure', 'privacy', 'theft', 'fraud', 'unauthorized'],
  password: ['reset', 'forgot', 'change', 'update password', 'credentials'],
  driver: ['role', 'driver account', 'driver portal', 'driver dashboard'],
  fleet: ['fleet owner', 'multiple vehicles', 'company vehicles', 'manage fleet'],
  qr: ['qr code', 'barcode', 'scan', 'scan code', 'refuel qr'],
  price: ['cost', 'rate', 'fee', 'pricing', 'payment', 'charge', 'amount'],
};

const quickActions = [
  { label: 'Create Account', icon: User, keywords: 'create account register sign up' },
  { label: 'How to Refuel', icon: Fuel, keywords: 'refuel fuel station how to' },
  { label: 'Subscription Plans', icon: CreditCard, keywords: 'subscription plan pricing tier' },
  { label: 'Fleet Management', icon: Truck, keywords: 'fleet vehicle multiple drivers' },
  { label: 'Report Issue', icon: Shield, keywords: 'report theft issue problem security' },
];

const iconMap = { User, Fuel, CreditCard, Truck, Shield, HelpCircle };

function buildKeywordIndex() {
  const index = [];
  for (const entry of knowledgeBase) {
    const qWords = entry.q.toLowerCase().replace(/[?.,!]/g, '').split(' ').filter(w => w.length > 2);
    const expanded = new Set();
    for (const w of qWords) {
      expanded.add(w);
      for (const [category, syns] of Object.entries(synonyms)) {
        if (w.includes(category) || category.includes(w) || syns.some(s => s.includes(w) || w.includes(s))) {
          syns.forEach(s => expanded.add(s));
          expanded.add(category);
        }
      }
    }
    index.push({ words: [...expanded], answer: entry.a, question: entry.q });
  }
  return index;
}

const keywordIndex = buildKeywordIndex();

function localFindAnswer(text) {
  const clean = text.toLowerCase().replace(/[?.,!]/g, '');
  const inputWords = clean.split(' ').filter(w => w.length > 2);

  let bestScore = 0;
  let bestMatch = null;

  for (const entry of keywordIndex) {
    let score = 0;
    for (const iw of inputWords) {
      for (const kw of entry.words) {
        if (iw === kw) score += 4;
        else if (iw.includes(kw) || kw.includes(iw)) score += 2;
        else if (iw.startsWith(kw.slice(0, 4)) || kw.startsWith(iw.slice(0, 4))) score += 1.5;
        else {
          const iw3 = iw.slice(0, 3);
          const kw3 = kw.slice(0, 3);
          if (iw3 === kw3) score += 1;
        }
      }
    }
    score = score / Math.max(1, entry.words.length);
    if (score > bestScore) { bestScore = score; bestMatch = entry; }
  }

  if (bestScore >= 1.5 && bestMatch) {
    return { answer: bestMatch.answer, relatedQuestion: bestMatch.question, score: bestScore };
  }

  const allAnswers = knowledgeBase.map(k => k.a);
  const randomAnswer = allAnswers[Math.floor(Math.random() * allAnswers.length)];
  return {
    answer: `That's a great question! Here's what I can tell you about VeloCity: ${randomAnswer}`,
    fallback: true,
    score: 0,
  };
}

const HF_API = 'https://api-inference.huggingface.co/models/google/flan-t5-large';
const VELOCITY_CONTEXT = 'VeloCity is a fuel access ecosystem in Ethiopia. Users can register vehicles, get QR codes, refuel at stations using a fuel wallet, manage subscriptions (Basic/Premium/Enterprise), and track queues. Roles: Driver, Fleet Owner, Station Manager, Worker, Municipality Admin, Developer Admin. Fuel priced in USD converted to ETB with 3% integrity fee.';

async function queryAI(text) {
  const prompt = `Context: ${VELOCITY_CONTEXT}\nQuestion: ${text}\nAnswer the question briefly and helpfully about VeloCity:`;
  try {
    const res = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_length: 150, temperature: 0.3 } }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.error) return null;
    const answer = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
    if (answer) {
      const cleanAnswer = answer.replace(prompt, '').replace(/^["'\s]+|["'\s]+$/g, '').trim();
      if (cleanAnswer.length > 10) return cleanAnswer;
    }
    return null;
  } catch {
    return null;
  }
}

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your VeloCity AI Assistant. Ask me anything about the system — fueling, accounts, subscriptions, fleet management, and more!", quickActions: true },
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

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setTyping(true);

    const clean = msg.toLowerCase().replace(/[?.,!]/g, '').trim();
    const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|yo|sup|howdy)/i.test(clean);
    const isThanks = /^(thanks|thank you|thx|ty|appreciate it|cheers)/i.test(clean);

    if (isGreeting) {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: "Hello! I can help you with anything about VeloCity — accounts, fueling, subscriptions, fleet management, appointments, and more. What would you like to know?", quickActions: true }]);
      return;
    }
    if (isThanks) {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: "You're welcome! Is there anything else you'd like to know about VeloCity?" }]);
      return;
    }

    const local = localFindAnswer(clean);
    let botAnswer = null;

    if (local.score >= 3) {
      botAnswer = local.answer;
    } else {
      const aiAnswer = await queryAI(msg);
      if (aiAnswer) {
        botAnswer = aiAnswer;
      } else if (local.score >= 1.5) {
        botAnswer = local.answer;
      } else {
        botAnswer = `${local.answer.replace('That\'s a great question! Here\'s what I can tell you about VeloCity: ', '')}`;
      }
    }

    setTyping(false);
    setMessages(prev => [...prev, {
      role: 'bot',
      text: botAnswer,
      relatedQuestion: local.relatedQuestion,
      quickActions: local.score === 0 && !local.relatedQuestion,
    }]);
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
            <div className="cb-title">VeloCity AI Assistant</div>
            <div className="cb-status"><span className="cb-dot" /> Online · AI Powered</div>
          </div>
        </div>
        <button className="cb-close" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="cb-messages" ref={listRef}>
        {messages.map((m, i) => (
          <div key={i} className={`cb-msg ${m.role === 'bot' ? 'cb-msg--bot' : 'cb-msg--user'}`}>
            {m.role === 'bot' && <div className="cb-msg-avatar"><Bot size={14} /></div>}
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
          placeholder="Ask me anything about VeloCity..."
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
