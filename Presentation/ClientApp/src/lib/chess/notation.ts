import type { PositionDto } from '@/lib/signalr/contracts';
import { BOARD_SIZE } from './board';

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

/** DOM/dnd-kit square id, e.g. "e4". */
export function squareId(row: number, col: number): string {
  return `${FILES[col]}${BOARD_SIZE - row}`;
}

export function positionFromSquareId(id: string): PositionDto | null {
  if (id.length !== 2) return null;
  const file = id[0]?.toLowerCase();
  const rank = Number.parseInt(id[1] ?? '', 10);
  const col = FILES.indexOf(file as (typeof FILES)[number]);
  if (col < 0 || Number.isNaN(rank)) return null;
  const row = BOARD_SIZE - rank;
  if (row < 0 || row >= BOARD_SIZE) return null;
  return { row, col };
}

export function positionsEqual(a: PositionDto, b: PositionDto): boolean {
  return a.row === b.row && a.col === b.col;
}
