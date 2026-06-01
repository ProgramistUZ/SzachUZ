import { useContext } from 'react';
import { EasterEggContext, type EasterEggContextValue } from './context';

export function useEasterEgg(): EasterEggContextValue {
  return useContext(EasterEggContext);
}
