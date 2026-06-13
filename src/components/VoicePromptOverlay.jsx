import { useEffect, useState } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { Volume2, VolumeX, Languages } from 'lucide-react';
import './VoicePromptOverlay.css';

const prompts = {
  scanQR: {
    en: 'Please scan your QR code at the pump.',
    am: 'እባክዎ የQR ኮድዎን በፓምፑ ላይ ያንብቡ።',
    or: 'Mee koodii QR keessanii pampa irratti scan godhaa.',
  },
  fueling: {
    en: 'Fueling in progress. Please wait.',
    am: 'ነዳጅ እየተሞላ ነው። እባክዎ ይጠብቁ።',
    or: 'Biddeen guutami jira. Maaloo eegaa.',
  },
  complete: {
    en: 'Fueling complete. Thank you.',
    am: 'ነዳጅ መሙላት ተጠናቀቀ። አመሰግናለሁ።',
    or: 'Biddeen guutamee xumurame. Galatoomi.',
  },
  error: {
    en: 'Error. Please contact the station attendant.',
    am: 'ስህተት። እባክዎ የጣቢያውን አገልጋይ ያነጋግሩ።',
    or: 'Dogoggora. Maaloo hojjataa buufataa bilifadhaa.',
  },
};

export default function VoicePromptOverlay({ active, promptKey, onClose }) {
  const { speakPrompt, state } = useVeloCity();
  const [enabled, setEnabled] = useState(true);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (active && promptKey && enabled && prompts[promptKey]) {
      const text = prompts[promptKey][lang] || prompts[promptKey].en;
      speakPrompt(text, lang);
    }
  }, [active, promptKey, enabled, lang, speakPrompt]);

  if (!active || !promptKey) return null;

  const text = prompts[promptKey]?.[lang] || prompts[promptKey]?.en || '';

  return (
    <div className="voice-overlay">
      <div className="voice-card">
        <div className="voice-header">
          <button className="voice-lang-btn" onClick={() => {
            const langs = ['en', 'am', 'or'];
            const idx = langs.indexOf(lang);
            setLang(langs[(idx + 1) % langs.length]);
          }}>
            <Languages size={16} />
            {lang === 'en' ? 'EN' : lang === 'am' ? 'አማ' : 'Oromo'}
          </button>
          <button className="voice-toggle" onClick={() => setEnabled(!enabled)}>
            {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
        <div className="voice-text">
          <Volume2 size={24} className="voice-icon" />
          <p>{text}</p>
        </div>
        {onClose && (
          <button className="voice-close" onClick={onClose}>Dismiss</button>
        )}
      </div>
    </div>
  );
}
