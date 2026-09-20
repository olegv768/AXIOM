import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TRANSLATIONS, TranslationKey, Lang } from './translations';

const STORAGE_KEY = 'axiom_language_v1';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ru',
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved === 'ru' || saved === 'en') ? saved : 'ru';
    } catch {
      return 'ru';
    }
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {}
  };

  const t = (key: TranslationKey): string => {
    return TRANSLATIONS[lang][key] ?? TRANSLATIONS['ru'][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
