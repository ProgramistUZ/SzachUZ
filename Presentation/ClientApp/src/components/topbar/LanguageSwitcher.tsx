// TODO(Zyta): final PL/EN switcher with framer-motion crossfade.
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const next = i18n.language.startsWith('pl') ? 'en' : 'pl';
  return (
    <button
      type="button"
      className="btn-ghost"
      onClick={() => void i18n.changeLanguage(next)}
      aria-label="Switch language"
    >
      {i18n.language.startsWith('pl') ? 'PL' : 'EN'}
    </button>
  );
}
