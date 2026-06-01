import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.language.startsWith('pl') ? 'PL' : 'EN';
  const next = current === 'PL' ? 'en' : 'pl';

  return (
    <motion.button
      type="button"
      className="btn-ghost min-w-[3rem]"
      onClick={() => void i18n.changeLanguage(next)}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={t('topbar.language')}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="inline-block font-mono text-sm font-semibold"
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
