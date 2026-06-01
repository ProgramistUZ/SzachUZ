// TODO(Zyta): polish CodePopup — animated "Copied!" inline toast.
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';

interface CodePopupProps {
  isOpen: boolean;
  onClose: () => void;
  joinCode: string | null;
}

export function CodePopup({ isOpen, onClose, joinCode }: CodePopupProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!joinCode) return;
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('popup.code.title')}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted dark:text-muted-dark">{t('popup.code.hint')}</p>
        <div className="rounded-xl bg-white/60 px-4 py-6 text-center font-mono text-3xl tracking-widest dark:bg-white/5">
          {joinCode ?? '—'}
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-primary" onClick={handleCopy}>
            {copied ? t('popup.code.copied') : t('popup.code.copy')}
          </button>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t('popup.code.close')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
