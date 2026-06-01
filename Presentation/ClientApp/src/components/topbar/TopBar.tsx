// TODO(Zyta): final TopBar — Join/Code/Settings buttons with cog icon, glass styling, framer-motion hover/tap.
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
    <header className="glass flex items-center justify-between gap-2 px-4 py-3">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{t('app.title')}</h1>
      <nav className="flex items-center gap-2">
        <button type="button" className="btn-ghost" onClick={onOpenJoin}>
          {t('topbar.join')}
        </button>
        <button type="button" className="btn-ghost" onClick={onOpenCode} disabled={!hasJoinCode}>
          {t('topbar.code')}
        </button>
        <button type="button" className="btn-primary" onClick={onOpenSettings}>
          {t('topbar.settings')}
        </button>
      </nav>
    </header>
  );
}
