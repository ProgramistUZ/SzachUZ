import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Color } from '@/lib/signalr/contracts';
import { Modal } from './Modal';

interface WinnerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRematch?: () => void;
  winner: Color | 'draw' | null;
}

const BURST_INTERVAL_MS = 1100;
const BURSTS = 4;

export function WinnerPopup({ isOpen, onClose, onRematch, winner }: WinnerPopupProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen || winner === null || winner === 'draw') return;
    let cancelled = false;
    const fire = () => {
      void confetti({
        particleCount: 140,
        spread: 90,
        startVelocity: 42,
        origin: { y: 0.6 },
      });
    };
    fire();
    let count = 0;
    const id = window.setInterval(() => {
      if (cancelled) return;
      count += 1;
      if (count > BURSTS) {
        window.clearInterval(id);
        return;
      }
      fire();
    }, BURST_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [isOpen, winner]);

  const titleKey: 'white' | 'black' | 'draw' =
    winner === 'white' ? 'white' : winner === 'black' ? 'black' : 'draw';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t(`popup.winner.${titleKey}`)}>
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="flex flex-col items-center gap-6 py-2 text-center"
      >
        <p className="font-display text-5xl font-semibold tracking-tight">
          {t(`popup.winner.${titleKey}`)}
        </p>
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
