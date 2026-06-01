import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { useEffect, useMemo, useState } from 'react';
import type { BoardState, Color, PieceCode, PositionDto } from '@/lib/signalr/contracts';
import { BOARD_SIZE, pieceColor } from '@/lib/chess/board';
import { positionFromSquareId, positionsEqual, squareId } from '@/lib/chess/notation';
import { Square } from './Square';
import { Piece } from './Piece';
import { CaptureFx } from './CaptureFx';
import { CheckOverlay } from './CheckOverlay';

const SQUARE_SIZE = 68;
const FILES_LIGHT = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

interface ChessboardProps {
  board: BoardState;
  playerColor: Color;
  isPlayersTurn: boolean;
  possibleMoves: PositionDto[];
  lastMove: { from: PositionDto; to: PositionDto } | null;
  checkPosition: PositionDto | null;
  onRequestMoves: (from: PositionDto | null) => void;
  onMove: (from: PositionDto, to: PositionDto) => void;
}

export function Chessboard({
  board,
  playerColor,
  isPlayersTurn,
  possibleMoves,
  lastMove,
  checkPosition,
  onRequestMoves,
  onMove,
}: ChessboardProps) {
  const [selected, setSelected] = useState<PositionDto | null>(null);
  const [capture, setCapture] = useState<PositionDto | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const previousBoardRef = usePrevious(board);
  useEffect(() => {
    if (!lastMove || !previousBoardRef) return;
    const target = previousBoardRef[lastMove.to.row]?.[lastMove.to.col] ?? '';
    if (target !== '' && pieceColor(target) !== pieceColor(getPiece(board, lastMove.to))) {
      setCapture(lastMove.to);
      const id = window.setTimeout(() => setCapture(null), 500);
      return () => window.clearTimeout(id);
    }
    return;
  }, [board, lastMove, previousBoardRef]);

  const handleSquareClick = (pos: PositionDto) => {
    const piece = getPiece(board, pos);
    if (selected && positionsEqual(selected, pos)) {
      setSelected(null);
      onRequestMoves(null);
      return;
    }
    if (selected && possibleMoves.some((m) => positionsEqual(m, pos))) {
      onMove(selected, pos);
      setSelected(null);
      onRequestMoves(null);
      return;
    }
    if (piece !== '' && pieceColor(piece) === playerColor && isPlayersTurn) {
      setSelected(pos);
      onRequestMoves(pos);
      return;
    }
    setSelected(null);
    onRequestMoves(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const fromId = String(event.active.id);
    const toId = event.over ? String(event.over.id) : null;
    const from = positionFromSquareId(fromId);
    const to = toId ? positionFromSquareId(toId) : null;
    if (!from || !to) {
      setSelected(null);
      onRequestMoves(null);
      return;
    }
    if (possibleMoves.some((m) => positionsEqual(m, to))) {
      onMove(from, to);
    }
    setSelected(null);
    onRequestMoves(null);
  };

  const renderedRows = useMemo(() => {
    const rows: number[] = Array.from({ length: BOARD_SIZE }, (_, i) => i);
    return playerColor === 'white' ? rows : [...rows].reverse();
  }, [playerColor]);

  const renderedCols = useMemo(() => {
    const cols: number[] = Array.from({ length: BOARD_SIZE }, (_, i) => i);
    return playerColor === 'white' ? cols : [...cols].reverse();
  }, [playerColor]);

  const lastRowIndex = BOARD_SIZE - 1;
  const lastColIndex = 0;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent/15 via-regal/10 to-accent/15 blur-2xl dark:from-accent-dark/25 dark:via-regal-dark/15 dark:to-accent-dark/25"
      />
      <div
        className="glass-strong surface-noise relative overflow-hidden rounded-3xl p-3 shadow-board dark:shadow-board-dark"
        style={{ width: SQUARE_SIZE * BOARD_SIZE + 24 }}
      >
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            className="relative grid overflow-hidden rounded-xl ring-1 ring-black/15 dark:ring-white/10"
            style={{
              width: SQUARE_SIZE * BOARD_SIZE,
              height: SQUARE_SIZE * BOARD_SIZE,
              gridTemplateColumns: `repeat(${BOARD_SIZE}, ${SQUARE_SIZE}px)`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, ${SQUARE_SIZE}px)`,
            }}
          >
            {renderedRows.flatMap((row) =>
              renderedCols.map((col) => {
                const id = squareId(row, col);
                const piece = getPiece(board, { row, col });
                const isLight = (row + col) % 2 === 0;
                const isSelected = selected !== null && positionsEqual(selected, { row, col });
                const isPossibleMove = possibleMoves.some((m) => positionsEqual(m, { row, col }));
                const targetPiece = getPiece(board, { row, col });
                const isCaptureTarget =
                  isPossibleMove &&
                  targetPiece !== '' &&
                  pieceColor(targetPiece) !== null &&
                  pieceColor(targetPiece) !== playerColor;
                const isLastMove =
                  !!lastMove &&
                  (positionsEqual(lastMove.from, { row, col }) ||
                    positionsEqual(lastMove.to, { row, col }));

                const fileLabel = row === lastRowIndex ? FILES_LIGHT[col] : undefined;
                const rankLabel = col === lastColIndex ? String(BOARD_SIZE - row) : undefined;

                return (
                  <Square
                    key={id}
                    id={id}
                    isLight={isLight}
                    isSelected={isSelected}
                    isPossibleMove={isPossibleMove && !isCaptureTarget}
                    isCaptureTarget={isCaptureTarget}
                    isLastMove={isLastMove}
                    isHighlighted={false}
                    fileLabel={fileLabel}
                    rankLabel={rankLabel}
                    onClick={() => handleSquareClick({ row, col })}
                  >
                    {piece !== '' && (
                      <Piece
                        id={id}
                        piece={piece}
                        isDraggable={pieceColor(piece) === playerColor && isPlayersTurn}
                        onSelect={() => {
                          setSelected({ row, col });
                          onRequestMoves({ row, col });
                        }}
                      />
                    )}
                  </Square>
                );
              }),
            )}
            <CaptureFx position={capture} squareSize={SQUARE_SIZE} />
            <CheckOverlay position={checkPosition} squareSize={SQUARE_SIZE} />
          </div>
        </DndContext>
      </div>
    </div>
  );
}

function getPiece(board: BoardState, pos: PositionDto): PieceCode {
  return board[pos.row]?.[pos.col] ?? '';
}

function usePrevious<T>(value: T): T | undefined {
  const [previous, setPrevious] = useState<T | undefined>(undefined);
  useEffect(() => {
    setPrevious(value);
  }, [value]);
  return previous;
}
