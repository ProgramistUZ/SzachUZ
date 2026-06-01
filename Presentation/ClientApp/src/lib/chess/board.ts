import type { BoardState, PieceCode } from '@/lib/signalr/contracts';

export const BOARD_SIZE = 8;

export const INITIAL_BOARD: BoardState = [
  ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
  ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];

export function isWhitePiece(piece: PieceCode): boolean {
  return piece.startsWith('w');
}

export function isBlackPiece(piece: PieceCode): boolean {
  return piece.startsWith('b');
}

export function pieceColor(piece: PieceCode): 'white' | 'black' | null {
  if (isWhitePiece(piece)) return 'white';
  if (isBlackPiece(piece)) return 'black';
  return null;
}
