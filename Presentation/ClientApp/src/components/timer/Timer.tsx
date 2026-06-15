import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Color } from '@/lib/signalr/contracts';
import { useEasterEgg } from '@/lib/easter-egg/hook';
import { blackLabel } from '@/lib/easter-egg/labels';
import { cn } from '@/lib/utils/cn';

const LOW_TIME_THRESHOLD_SECONDS = 10;

interface TimerProps {
  color: Color;
  seconds: number;
  isActive: boolean;
  totalSeconds?: number;
  inactive?: boolean;
}

export function Timer({ color, seconds, isActive, totalSeconds = 300, inactive = false }: TimerProps) {
  const { t } = useTranslation();
  const { surprise } = useEasterEgg();
  const isLow = seconds <= LOW_TIME_THRESHOLD_SECONDS;
  const safe = Math.max(0, Math.min(totalSeconds, seconds));
  const ratio = totalSeconds > 0 ? safe / totalSeconds : 0;
  const circumference = 2 * Math.PI * 22;
  const dashOffset = circumference * (1 - ratio);

  const isWhite = color === 'white';

  return (
    <motion.div
      className={cn(
        'glass surface-noise relative flex items-center gap-4 px-5 py-3 transition-all',
        isActive && 'shadow-glow-accent ring-2 ring-accent/60',
        isLow && isActive && 'animate-shake ring-danger/70',
      )}
      animate={isLow && isActive ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={{ duration: 0.6, repeat: isLow && isActive ? Infinity : 0 }}
    >
      <div className="relative flex h-12 w-12 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            strokeWidth="3"
            className="stroke-ink/10 dark:stroke-white/10"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className={cn(
              'transition-colors',
              isLow
                ? 'stroke-danger'
                : isActive
                  ? 'stroke-accent'
                  : 'stroke-ink/30 dark:stroke-white/30',
            )}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: dashOffset,
              transition: 'stroke-dashoffset 0.5s ease-out',
            }}
          />
        </svg>
        <div
          className={cn(
            'h-5 w-5 rounded-full border-2 shadow-md',
            isWhite
              ? 'border-ink/20 bg-white'
              : 'border-white/20 bg-ink dark:border-white/30 dark:bg-zinc-900',
          )}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted dark:text-muted-dark">
          {isWhite ? t('timer.white') : blackLabel(t('timer.black'), surprise)}
        </span>
        <span
          aria-live="polite"
          className={cn(
            'font-mono text-3xl font-semibold tabular-nums leading-none tracking-tight',
            isLow && isActive ? 'text-danger' : 'text-ink dark:text-ink-dark',
          )}
        >
          {inactive ? '--:--' : formatTime(safe)}
        </span>
      </div>
      {isActive && (
        <motion.div
          aria-hidden
          className="ml-auto flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-accent dark:text-accent-dark"
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {t('timer.running')}
        </motion.div>
      )}
    </motion.div>
  );
}

function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (safe % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
