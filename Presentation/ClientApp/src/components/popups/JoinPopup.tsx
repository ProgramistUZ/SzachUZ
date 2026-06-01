import { motion } from 'framer-motion';
import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils/cn';
import { Modal } from './Modal';

interface JoinPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  errorMessage?: string | null;
}

const MIN_CODE_LENGTH = 4;
const VALID_CHARS = /^[A-Z0-9]*$/;

export function JoinPopup({ isOpen, onClose, onSubmit, errorMessage }: JoinPopupProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [shake, setShake] = useState(0);

  useEffect(() => {
    if (!isOpen) setCode('');
  }, [isOpen]);

  useEffect(() => {
    if (errorMessage) setShake((n) => n + 1);
  }, [errorMessage]);

  const trimmed = code.trim();
  const isValid = trimmed.length >= MIN_CODE_LENGTH && VALID_CHARS.test(trimmed);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setShake((n) => n + 1);
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('popup.join.title')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <motion.input
          key={shake}
          animate={shake > 0 ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          type="text"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t('popup.join.placeholder')}
          aria-invalid={!isValid && code.length > 0}
          className={cn(
            'rounded-xl border bg-white/60 px-4 py-3 text-center font-mono text-lg tracking-widest transition dark:bg-white/5',
            errorMessage ? 'border-danger focus:ring-danger' : 'border-ink/15 dark:border-white/10',
          )}
        />
        {errorMessage && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-danger"
          >
            {errorMessage}
          </motion.p>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t('popup.join.cancel')}
          </button>
          <motion.button
            type="submit"
            className="btn-primary"
            disabled={!isValid}
            whileHover={isValid ? { y: -1 } : undefined}
            whileTap={isValid ? { scale: 0.97 } : undefined}
          >
            {t('popup.join.submit')}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
