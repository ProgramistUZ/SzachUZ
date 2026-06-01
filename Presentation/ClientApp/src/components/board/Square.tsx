import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface SquareProps {
  id: string;
  isLight: boolean;
  isSelected: boolean;
  isPossibleMove: boolean;
  isLastMove: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  children?: ReactNode;
}

export function Square({
  id,
  isLight,
  isSelected,
  isPossibleMove,
  isLastMove,
  isHighlighted,
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
        isOver && 'brightness-110',
      )}
    >
      {isLastMove && (
        <span aria-hidden className="absolute inset-0 bg-yellow-300/25 dark:bg-yellow-300/15" />
      )}
      {isSelected && (
        <span aria-hidden className="absolute inset-0 bg-accent/30 ring-2 ring-accent" />
      )}
      {isPossibleMove && (
        <span
          aria-hidden
          className="absolute h-3 w-3 rounded-full bg-accent/70 shadow-md ring-2 ring-white/50 dark:ring-black/30"
        />
      )}
      {children}
    </button>
  );
}
