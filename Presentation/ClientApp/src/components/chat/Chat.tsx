import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type FormEvent } from 'react';
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
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const handleSubmit = (e: FormEvent) => {
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
      <ul
        ref={listRef}
        className="flex-1 space-y-1.5 overflow-y-auto pr-1 text-sm"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <li className="py-2 text-center text-muted dark:text-muted-dark">{t('chat.empty')}</li>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                title={new Date(m.at).toLocaleTimeString()}
                className="rounded-lg bg-white/40 px-3 py-1.5 dark:bg-white/5"
              >
                {m.text}
              </motion.li>
            ))}
          </AnimatePresence>
        )}
      </ul>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('chat.placeholder')}
          disabled={disabled}
          className="flex-1 rounded-xl border border-ink/15 bg-white/60 px-3 py-2 text-sm disabled:opacity-60 dark:border-white/10 dark:bg-white/5"
        />
        <motion.button
          type="submit"
          className="btn-primary"
          disabled={disabled || !draft.trim()}
          whileHover={!disabled && draft.trim() ? { y: -1 } : undefined}
          whileTap={!disabled && draft.trim() ? { scale: 0.97 } : undefined}
        >
          {t('chat.send')}
        </motion.button>
      </form>
    </section>
  );
}
