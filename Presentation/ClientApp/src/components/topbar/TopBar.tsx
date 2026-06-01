import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface TopBarProps {
  onOpenJoin: () => void;
  onOpenCode: () => void;
  onOpenSettings: () => void;
  hasJoinCode: boolean;
}

export function TopBar({ onOpenJoin, onOpenCode, onOpenSettings, hasJoinCode }: TopBarProps) {
  const { t } = useTranslation();
  return (
    <header className="glass flex flex-1 items-center justify-between gap-2 px-4 py-3">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{t('app.title')}</h1>
      <nav className="flex items-center gap-2">
        <motion.button
          type="button"
          className="btn-ghost"
          onClick={onOpenJoin}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          {t('topbar.join')}
        </motion.button>
        <motion.button
          type="button"
          className="btn-ghost"
          onClick={onOpenCode}
          disabled={!hasJoinCode}
          whileHover={hasJoinCode ? { y: -1 } : undefined}
          whileTap={hasJoinCode ? { scale: 0.97 } : undefined}
        >
          {t('topbar.code')}
        </motion.button>
        <motion.button
          type="button"
          className="btn-primary"
          onClick={onOpenSettings}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          aria-label={t('topbar.settings')}
        >
          <SettingsIcon />
          <span>{t('topbar.settings')}</span>
        </motion.button>
      </nav>
    </header>
  );
}

function SettingsIcon() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.36.49.94.79 1.51.84H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
