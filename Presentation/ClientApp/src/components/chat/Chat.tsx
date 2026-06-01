// TODO(Zyta): polish Chat — animated message entries, auto-scroll on new message.
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ChatMessage {
  id: string;
  text: string;
  at: number;
}

interface ChatProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  disabled: boolean;
}

export function Chat({ messages, onSend, disabled }: ChatProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || disabled) return;
    onSend(text);
    setDraft('');
  };

  return (
    <section className="glass flex h-72 flex-col gap-2 p-4">
      <header className="text-sm font-semibold uppercase tracking-wider text-muted dark:text-muted-dark">
        {t('chat.title')}
      </header>
      <ul className="flex-1 overflow-y-auto pr-1 text-sm">
        {messages.length === 0 ? (
          <li className="py-2 text-center text-muted dark:text-muted-dark">{t('chat.empty')}</li>
        ) : (
          messages.map((m) => (
            <li key={m.id} className="py-1">
              {m.text}
            </li>
          ))
        )}
      </ul>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('chat.placeholder')}
          disabled={disabled}
          className="flex-1 rounded-xl border border-ink/15 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
        />
        <button type="submit" className="btn-primary" disabled={disabled || !draft.trim()}>
          {t('chat.send')}
        </button>
      </form>
    </section>
  );
}
