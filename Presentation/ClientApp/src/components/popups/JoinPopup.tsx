// TODO(Zyta): polish JoinPopup — animated focus ring, shake on invalid input, error message.
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';

interface JoinPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

export function JoinPopup({ isOpen, onClose, onSubmit }: JoinPopupProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const trimmed = code.trim();
  const isValid = trimmed.length >= 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(trimmed);
    setCode('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('popup.join.title')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t('popup.join.placeholder')}
          className="rounded-xl border border-ink/15 bg-white/60 px-4 py-3 text-center font-mono text-lg tracking-widest dark:border-white/10 dark:bg-white/5"
        />
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t('popup.join.cancel')}
          </button>
          <button type="submit" className="btn-primary" disabled={!isValid}>
            {t('popup.join.submit')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
