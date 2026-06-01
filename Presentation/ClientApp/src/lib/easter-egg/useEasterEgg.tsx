import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { EasterEggContext } from './context';

const SECRET = 'nigger';
const BUFFER_LIMIT = SECRET.length;

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [surprise, setSurprise] = useState(false);

  useEffect(() => {
    let buffer = '';
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-BUFFER_LIMIT);
      if (buffer === SECRET) {
        setSurprise((prev) => !prev);
        buffer = '';
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(() => ({ surprise }), [surprise]);

  return <EasterEggContext.Provider value={value}>{children}</EasterEggContext.Provider>;
}
