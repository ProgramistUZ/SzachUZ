// TODO(Zyta): final theme toggle with framer-motion sun/moon crossfade.
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/lib/theme/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className="btn-ghost"
      onClick={toggle}
      aria-label={theme === 'dark' ? t('topbar.theme.light') : t('topbar.theme.dark')}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
