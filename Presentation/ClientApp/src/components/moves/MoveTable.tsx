// TODO(Zyta): polish MoveTable — last-move highlight, auto-scroll on new row.
import { useTranslation } from 'react-i18next';

export interface MoveRow {
  index: number;
  white: string | null;
  black: string | null;
}

interface MoveTableProps {
  moves: MoveRow[];
}

export function MoveTable({ moves }: MoveTableProps) {
  const { t } = useTranslation();

  return (
    <section className="glass flex max-h-64 flex-col gap-2 p-4">
      <header className="text-sm font-semibold uppercase tracking-wider text-muted dark:text-muted-dark">
        {t('moves.title')}
      </header>
      <div className="flex-1 overflow-y-auto">
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
              {moves.map((row) => (
                <tr key={row.index} className="border-t border-ink/5 dark:border-white/5">
                  <td className="py-1 text-muted dark:text-muted-dark">{row.index}.</td>
                  <td className="py-1 font-mono">{row.white ?? ''}</td>
                  <td className="py-1 font-mono">{row.black ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
