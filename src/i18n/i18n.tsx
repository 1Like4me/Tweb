import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Lang, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, isLangId } from './languages';
import { enDict } from './dictionaries/en';
import { roDict } from './dictionaries/ro';

export interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const formatMessage = (template: string, vars?: Record<string, string | number>) => {
  if (!vars) return template;
  return Object.keys(vars).reduce((acc, k) => {
    return acc.replaceAll(`{${k}}`, String(vars[k]));
  }, template);
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLangId(stored) ? stored : 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [lang]);

  const t = useCallback<I18nContextType['t']>(
    (key, vars) => {
      const dict = lang === 'ro' ? roDict : enDict;
      const template = dict[key] ?? enDict[key] ?? key;
      return formatMessage(template, vars);
    },
    [lang]
  );

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const value = useMemo<I18nContextType>(
    () => ({
      lang,
      setLang,
      t,
      supportedLanguages: SUPPORTED_LANGUAGES
    }),
    [lang, setLang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
};

