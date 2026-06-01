import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import type { PieceCode } from '@/lib/signalr/contracts';
import { cn } from '@/lib/utils/cn';

interface PieceProps {
  id: string;
  piece: PieceCode;
  isDraggable: boolean;
  onSelect: () => void;
}

export function Piece({ id, piece, isDraggable, onSelect }: PieceProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: !isDraggable,
  });

  if (piece === '') return null;

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
      }
    : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      layoutId={`piece-${id}`}
      onPointerDown={onSelect}
      data-dragging={isDragging || undefined}
      style={style}
      className={cn(
        'absolute inset-0 flex items-center justify-center',
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
      )}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      {...attributes}
      {...listeners}
    >
      <img
        src={`/pieces/${piece}.svg`}
        alt={piece}
        draggable={false}
        className="h-[88%] w-[88%] select-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]"
      />
    </motion.div>
  );
}
