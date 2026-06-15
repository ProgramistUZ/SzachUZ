import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Color } from '@/lib/signalr/contracts';
import { useEasterEgg } from '@/lib/easter-egg/hook';
import { Modal } from './Modal';

interface WinnerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRematch?: () => void;
  winner: Color | 'draw' | null;
  playerColor?: Color;
  reason?: string | null;
}

const BURST_INTERVAL_MS = 1100;
const BURSTS = 4;

export function WinnerPopup({ isOpen, onClose, onRematch, winner, playerColor, reason }: WinnerPopupProps) {
  const { t } = useTranslation();
  const { surprise } = useEasterEgg();

  const iWon = winner !== 'draw' && winner !== null && winner === playerColor;
  const titleText =
    winner === 'draw'
      ? t('popup.winner.draw')
      : iWon
        ? (winner === 'black' && surprise ? '??? wygrywa!' : t('popup.winner.youWin'))
        : t('popup.winner.youLose');

  useEffect(() => {
    if (!isOpen || !iWon) return;
    let cancelled = false;
    const fire = () => {
      void confetti({ particleCount: 140, spread: 90, startVelocity: 42, origin: { y: 0.6 } });
    };
    fire();
    let count = 0;
    const id = window.setInterval(() => {
      if (cancelled) return;
      count += 1;
      if (count > BURSTS) { window.clearInterval(id); return; }
      fire();
    }, BURST_INTERVAL_MS);
    return () => { cancelled = true; window.clearInterval(id); };
  }, [isOpen, iWon]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titleText} titleClassName="mb-4 pt-4 font-display text-5xl font-semibold text-center tracking-tight">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="flex flex-col items-center gap-6 py-2 text-center"
      >
        {reason && (
          <p className="text-sm text-muted dark:text-muted-dark">
            {t(`popup.winner.reason.${reason}`, reason)}
          </p>
        )}
        <div className="flex justify-center gap-2">
          {onRematch && (
            <motion.button
              type="button"
              className="btn-primary"
              onClick={onRematch}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              {t('popup.winner.rematch')}
            </motion.button>
          )}
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t('popup.winner.close')}
          </button>
        </div>
      </motion.div>
    </Modal>
  );
}
