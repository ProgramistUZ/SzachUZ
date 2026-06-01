import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface SquareProps {
  id: string;
  isLight: boolean;
  isSelected: boolean;
  isPossibleMove: boolean;
  isCaptureTarget: boolean;
  isLastMove: boolean;
  isHighlighted: boolean;
  fileLabel?: string;
  rankLabel?: string;
  onClick: () => void;
  children?: ReactNode;
}

export function Square({
  id,
  isLight,
  isSelected,
  isPossibleMove,
  isCaptureTarget,
  isLastMove,
  isHighlighted,
  fileLabel,
  rankLabel,
  onClick,
  children,
}: SquareProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <button
      type="button"
      ref={setNodeRef}
      onClick={onClick}
      data-square={id}
      className={cn(
        'relative flex aspect-square select-none items-center justify-center transition-colors',
        isLight ? 'bg-board-light dark:bg-board-light-dm' : 'bg-board-dark dark:bg-board-dark-dm',
        isHighlighted && 'ring-2 ring-inset ring-accent',
        isOver && !isCaptureTarget && 'brightness-110',
        isOver && isCaptureTarget && 'brightness-125',
      )}
    >
      {fileLabel && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute bottom-0.5 right-1 font-mono text-[10px] font-bold uppercase tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]',
            isLight
              ? 'text-board-dark/85 dark:text-amber-200'
              : 'text-board-light/95 dark:text-amber-100',
          )}
        >
          {fileLabel}
        </span>
      )}
      {rankLabel && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute left-1 top-0.5 font-mono text-[10px] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]',
            isLight
              ? 'text-board-dark/85 dark:text-amber-200'
              : 'text-board-light/95 dark:text-amber-100',
          )}
        >
          {rankLabel}
        </span>
      )}
      {isLastMove && (
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-amber-300/40 to-amber-500/20 dark:from-amber-400/25 dark:to-amber-600/15"
        />
      )}
      {isSelected && (
        <span
          aria-hidden
          className="absolute inset-0 bg-accent/35 shadow-[inset_0_0_24px_rgba(167,122,74,0.45)] ring-[3px] ring-inset ring-accent"
        />
      )}
      {isPossibleMove && !isCaptureTarget && (
        <span
          aria-hidden
          className="pointer-events-none absolute h-3.5 w-3.5 rounded-full bg-accent/85 shadow-[0_0_12px_rgba(167,122,74,0.7)] ring-2 ring-white/60 dark:ring-black/40"
        />
      )}
      {isCaptureTarget && <CaptureTargetOverlay />}
      {children}
    </button>
  );
}

function CaptureTargetOverlay() {
  return (
    <>
      <span
        aria-hidden
        className="bg-gradient-radial pointer-events-none absolute inset-0 from-danger/40 to-transparent"
        style={{
          background:
            'radial-gradient(circle at center, rgba(239,68,68,0.45) 0%, rgba(239,68,68,0.12) 55%, transparent 75%)',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-1 animate-pulse-glow rounded-md shadow-[0_0_22px_rgba(239,68,68,0.7),inset_0_0_18px_rgba(239,68,68,0.5)] ring-[3px] ring-danger/90"
      />
      <CornerBrackets />
    </>
  );
}

function CornerBrackets() {
  const base =
    'pointer-events-none absolute h-2.5 w-2.5 border-danger drop-shadow-[0_0_4px_rgba(239,68,68,0.9)]';
  return (
    <>
      <span aria-hidden className={cn(base, 'left-0.5 top-0.5 border-l-[3px] border-t-[3px]')} />
      <span aria-hidden className={cn(base, 'right-0.5 top-0.5 border-r-[3px] border-t-[3px]')} />
      <span aria-hidden className={cn(base, 'bottom-0.5 left-0.5 border-b-[3px] border-l-[3px]')} />
      <span
        aria-hidden
        className={cn(base, 'bottom-0.5 right-0.5 border-b-[3px] border-r-[3px]')}
      />
    </>
  );
}
