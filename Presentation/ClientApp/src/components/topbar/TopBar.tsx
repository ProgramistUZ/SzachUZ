import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { GameStatus } from '@/lib/signalr/useChessHub';
import { cn } from '@/lib/utils/cn';

interface TopBarProps {
  onOpenJoin: () => void;
  onOpenCode: () => void;
  onOpenSettings: () => void;
  hasJoinCode: boolean;
  status: GameStatus;
  isConnected: boolean;
}

export function TopBar({
  onOpenJoin,
  onOpenCode,
  onOpenSettings,
  hasJoinCode,
  status,
  isConnected,
}: TopBarProps) {
  const { t } = useTranslation();
  return (
    <header className="glass surface-noise relative flex flex-1 items-center justify-between gap-3 px-5 py-3.5">
      <div className="flex items-center gap-4">
        <Logo />
        <StatusBadge status={status} isConnected={isConnected} />
      </div>
      <nav className="flex items-center gap-2">
        <ToolbarButton onClick={onOpenJoin} icon={<JoinIcon />}>
          {t('topbar.join')}
        </ToolbarButton>
        <ToolbarButton onClick={onOpenCode} disabled={!hasJoinCode} icon={<CodeIcon />}>
          {t('topbar.code')}
        </ToolbarButton>
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

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <motion.div
        className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-regal shadow-glow-accent"
        whileHover={{ rotate: -6, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <span className="text-lg font-bold text-white">♛</span>
        <span className="absolute inset-0 rounded-lg bg-noise opacity-20 mix-blend-overlay" />
      </motion.div>
      <h1 className="text-gradient font-display text-2xl font-semibold tracking-tight">SzachUZ</h1>
    </div>
  );
}

function StatusBadge({ status, isConnected }: { status: GameStatus; isConnected: boolean }) {
  const { t } = useTranslation();
  const variant = !isConnected
    ? 'offline'
    : status === 'playing'
      ? 'playing'
      : status === 'lobby'
        ? 'lobby'
        : status === 'ended'
          ? 'ended'
          : 'idle';

  const labels: Record<typeof variant, string> = {
    offline: t('status.offline'),
    idle: t('status.idle'),
    lobby: t('status.lobby'),
    playing: t('status.playing'),
    ended: t('status.ended'),
  };

  const colors: Record<typeof variant, string> = {
    offline: 'bg-danger',
    idle: 'bg-muted',
    lobby: 'bg-accent',
    playing: 'bg-success',
    ended: 'bg-regal',
  };

  return (
    <div className="hidden items-center gap-2 rounded-full border border-ink/10 bg-white/40 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-ink/70 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-ink-dark/70 sm:flex">
      <span className="relative flex h-2.5 w-2.5">
        {(variant === 'playing' || variant === 'lobby') && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-pulse-ring rounded-full opacity-75',
              colors[variant],
            )}
          />
        )}
        <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', colors[variant])} />
      </span>
      <span>{labels[variant]}</span>
    </div>
  );
}

function ToolbarButton({
  onClick,
  disabled,
  children,
  icon,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      className="btn-ghost"
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
    >
      {icon}
      <span>{children}</span>
    </motion.button>
  );
}

function JoinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      width="16"
      height="16"
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
