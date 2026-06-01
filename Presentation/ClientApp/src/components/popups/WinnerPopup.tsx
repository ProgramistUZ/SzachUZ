// TODO(Zyta): polish WinnerPopup — display headline animation and rematch button.
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import type { Color } from '@/lib/signalr/contracts';
import { Modal } from './Modal';

interface WinnerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  winner: Color | 'draw' | null;
}

export function WinnerPopup({ isOpen, onClose, winner }: WinnerPopupProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen || winner === 'draw' || winner === null) return;
    void confetti({
      particleCount: 160,
      spread: 100,
      startVelocity: 45,
      origin: { y: 0.6 },
    });
  }, [isOpen, winner]);

  const titleKey: 'white' | 'black' | 'draw' =
    winner === 'white' ? 'white' : winner === 'black' ? 'black' : 'draw';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t(`popup.winner.${titleKey}`)}>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={onClose}>
          {t('popup.winner.close')}
        </button>
      </div>
    </Modal>
  );
}
