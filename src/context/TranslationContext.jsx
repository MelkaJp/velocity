import { createContext, useContext, useState, useEffect } from 'react';
import { dictionary } from '../data/dictionary';

export const languages = [
  { code: 'en', name: 'English', native: 'English', dir: 'ltr' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ', dir: 'ltr' },
  { code: 'or', name: 'Afaan Oromo', native: 'Afaan Oromoo', dir: 'ltr' },
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [dir, setDir] = useState('ltr');

  useEffect(() => {
    const saved = localStorage.getItem('velocity_language');
    if (saved && languages.find(l => l.code === saved)) {
      setLanguage(saved);
      const lang = languages.find(l => l.code === saved);
      setDir(lang?.dir || 'ltr');
    }
  }, []);

  const changeLanguage = (lang) => {
    const found = languages.find(l => l.code === lang);
    if (found) {
      setLanguage(lang);
      setDir(found.dir || 'ltr');
      localStorage.setItem('velocity_language', lang);
    }
  };

  const t = (key, fallback = '') => {
    try {
      if (dictionary && dictionary[key]) {
        const translation = dictionary[key][language];
        if (translation) return translation;
        const english = dictionary[key].en;
        if (english) return english;
      }
    } catch (e) {
      console.log('Translation error for key:', key);
    }
    return fallback || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    dir,
    languages,
    dictionary
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
}