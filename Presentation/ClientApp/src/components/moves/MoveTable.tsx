import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils/cn';

export interface MoveRow {
  index: number;
  white: string | null;
  black: string | null;
}

interface MoveTableProps {
  moves: MoveRow[];
  highlightLastRow?: boolean;
}

export function MoveTable({ moves, highlightLastRow = true }: MoveTableProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [moves.length]);

  return (
    <section className="glass flex max-h-64 flex-col gap-2 p-4">
      <header className="text-sm font-semibold uppercase tracking-wider text-muted dark:text-muted-dark">
        {t('moves.title')}
      </header>
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {moves.length === 0 ? (
          <p className="py-2 text-center text-sm text-muted dark:text-muted-dark">
            {t('moves.empty')}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted dark:text-muted-dark">
              <tr>
                <th className="w-8" />
                <th className="font-medium">{t('moves.white')}</th>
                <th className="font-medium">{t('moves.black')}</th>
              </tr>
            </thead>
            <tbody>
              {moves.map((row, i) => {
                const isLast = i === moves.length - 1;
                return (
                  <motion.tr
                    key={row.index}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className={cn(
                      'border-t border-ink/5 dark:border-white/5',
                      highlightLastRow && isLast && 'bg-accent/15',
                    )}
                  >
                    <td className="py-1 text-muted dark:text-muted-dark">{row.index}.</td>
                    <td className="py-1 font-mono">{row.white ?? ''}</td>
                    <td className="py-1 font-mono">{row.black ?? ''}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
