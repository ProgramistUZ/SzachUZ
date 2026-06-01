import { createContext } from 'react';

export interface EasterEggContextValue {
  surprise: boolean;
}

export const EasterEggContext = createContext<EasterEggContextValue>({ surprise: false });
