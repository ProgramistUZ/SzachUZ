import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';

interface CodePopupProps {
  isOpen: boolean;
  onClose: () => void;
  joinCode: string | null;
}

const COPIED_TIMEOUT_MS = 1500;

export function CodePopup({ isOpen, onClose, joinCode }: CodePopupProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!joinCode) return;
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPIED_TIMEOUT_MS);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('popup.code.title')}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted dark:text-muted-dark">{t('popup.code.hint')}</p>
        <motion.div
          key={joinCode ?? 'empty'}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="rounded-xl bg-white/60 px-4 py-6 text-center font-mono text-3xl tracking-widest dark:bg-white/5"
        >
          {joinCode ?? '—'}
        </motion.div>
        <div className="relative flex justify-end gap-2">
          <AnimatePresence>
            {copied && (
              <motion.span
                role="status"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute -top-7 right-0 rounded-md bg-accent px-2 py-1 text-xs font-medium text-white shadow-md"
              >
                {t('popup.code.copied')}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.button
            type="button"
            className="btn-primary"
            onClick={handleCopy}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            disabled={!joinCode}
          >
            {t('popup.code.copy')}
          </motion.button>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t('popup.code.close')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
