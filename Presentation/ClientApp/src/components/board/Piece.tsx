import { useDraggable } from '@dnd-kit/core';
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

  const style: React.CSSProperties = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
        transition: 'none',
      }
    : { transform: 'translate3d(0, 0, 0)' };

  return (
    <div
      ref={setNodeRef}
      onPointerDown={isDraggable ? onSelect : undefined}
      data-dragging={isDragging || undefined}
      style={style}
      className={cn(
        'absolute inset-0 flex items-center justify-center',
        isDraggable
          ? 'pointer-events-auto cursor-grab active:cursor-grabbing'
          : 'pointer-events-none',
      )}
      {...attributes}
      {...listeners}
    >
      <img
        src={`/pieces/${piece}.svg`}
        alt={piece}
        draggable={false}
        className="h-[88%] w-[88%] select-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]"
      />
    </div>
  );
}
