import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Color } from '@/lib/signalr/contracts';
import { useEasterEgg } from '@/lib/easter-egg/hook';
import { blackLabel } from '@/lib/easter-egg/labels';
import { cn } from '@/lib/utils/cn';
import { Modal } from './Modal';

type ColorChoice = Color | 'random';

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (color: Color, gameLengthSeconds: number) => void;
}

const PRESETS_SECONDS = [60, 180, 300, 600] as const;
const MIN_SECONDS = 30;
const MAX_SECONDS = 30 * 60;

const COLOR_PREVIEWS: Record<ColorChoice, string | null> = {
  white: '/pieces/wK.svg',
  black: '/pieces/bK.svg',
  random: null,
};

export function SettingsPopup({ isOpen, onClose, onStart }: SettingsPopupProps) {
  const { t } = useTranslation();
  const { surprise } = useEasterEgg();
  const [color, setColor] = useState<ColorChoice>('white');
  const [seconds, setSeconds] = useState<number>(300);

  const clamped = Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, seconds));

  const handleStart = () => {
    const resolvedColor: Color =
      color === 'random' ? (Math.random() < 0.5 ? 'white' : 'black') : color;
    onStart(resolvedColor, clamped);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('popup.settings.title')}>
      <div className="flex flex-col gap-5">
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t('popup.settings.time')}</legend>
          <div className="flex flex-wrap gap-2">
            {PRESETS_SECONDS.map((s) => {
              const selected = seconds === s;
              return (
                <motion.button
                  key={s}
                  type="button"
                  className={cn('btn-ghost', selected && 'ring-2 ring-accent')}
                  onClick={() => setSeconds(s)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {Math.round(s / 60)} {t('popup.settings.minutes')}
                </motion.button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t('popup.settings.color')}</legend>
          <div className="grid grid-cols-3 gap-2">
            {(['white', 'black', 'random'] as const).map((c) => {
              const selected = color === c;
              const preview = COLOR_PREVIEWS[c];
              return (
                <motion.button
                  key={c}
                  type="button"
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border border-ink/10 bg-white/40 px-3 py-4 text-sm font-medium transition dark:border-white/10 dark:bg-white/5',
                    selected ? 'ring-2 ring-accent' : 'hover:bg-white/60 dark:hover:bg-white/10',
                  )}
                  onClick={() => setColor(c)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  aria-pressed={selected}
                >
                  {preview ? (
                    <img src={preview} alt="" className="h-10 w-10" />
                  ) : (
                    <span aria-hidden className="text-3xl leading-none">
                      ?
                    </span>
                  )}
                  <span>
                    {c === 'black'
                      ? blackLabel(t('popup.settings.black'), surprise)
                      : t(`popup.settings.${c}`)}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t('popup.settings.cancel')}
          </button>
          <motion.button
            type="button"
            className="btn-primary"
            onClick={handleStart}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            {t('popup.settings.start')}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}
