// TODO(Zyta): polish SettingsPopup — animated radio cards with piece icons, time slider, validation.
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Color } from '@/lib/signalr/contracts';
import { Modal } from './Modal';

type ColorChoice = Color | 'random';

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (color: Color, gameLengthSeconds: number) => void;
}

const PRESETS_SECONDS = [60, 180, 300, 600];

export function SettingsPopup({ isOpen, onClose, onStart }: SettingsPopupProps) {
  const { t } = useTranslation();
  const [color, setColor] = useState<ColorChoice>('white');
  const [seconds, setSeconds] = useState(300);

  const handleStart = () => {
    const resolvedColor: Color =
      color === 'random' ? (Math.random() < 0.5 ? 'white' : 'black') : color;
    onStart(resolvedColor, seconds);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('popup.settings.title')}>
      <div className="flex flex-col gap-4">
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t('popup.settings.time')}</legend>
          <div className="flex flex-wrap gap-2">
            {PRESETS_SECONDS.map((s) => (
              <button
                key={s}
                type="button"
                className={`btn-ghost ${seconds === s ? 'ring-2 ring-accent' : ''}`}
                onClick={() => setSeconds(s)}
              >
                {Math.round(s / 60)} {t('popup.settings.minutes')}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t('popup.settings.color')}</legend>
          <div className="flex gap-2">
            {(['white', 'black', 'random'] as const).map((c) => (
              <button
                key={c}
                type="button"
                className={`btn-ghost flex-1 ${color === c ? 'ring-2 ring-accent' : ''}`}
                onClick={() => setColor(c)}
              >
                {t(`popup.settings.${c}`)}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t('popup.settings.cancel')}
          </button>
          <button type="button" className="btn-primary" onClick={handleStart}>
            {t('popup.settings.start')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
