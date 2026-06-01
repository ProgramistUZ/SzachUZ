import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Color } from '@/lib/signalr/contracts';
import { cn } from '@/lib/utils/cn';

const LOW_TIME_THRESHOLD_SECONDS = 10;

interface TimerProps {
  color: Color;
  seconds: number;
  isActive: boolean;
}

export function Timer({ color, seconds, isActive }: TimerProps) {
  const { t } = useTranslation();
  const isLow = seconds <= LOW_TIME_THRESHOLD_SECONDS;

  return (
    <motion.div
      className={cn(
        'glass flex items-center justify-between gap-3 px-4 py-2 font-mono text-2xl tabular-nums',
        isActive && 'ring-2 ring-accent',
        isLow && isActive && 'animate-shake text-danger',
      )}
      animate={isLow && isActive ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: 0.6, repeat: isLow && isActive ? Infinity : 0 }}
    >
      <span className="text-sm font-medium uppercase tracking-wider text-muted dark:text-muted-dark">
        {color === 'white' ? t('timer.white') : t('timer.black')}
      </span>
      <span aria-live="polite">{formatTime(seconds)}</span>
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
