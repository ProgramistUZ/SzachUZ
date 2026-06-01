import { motion } from 'framer-motion';
import type { PositionDto } from '@/lib/signalr/contracts';

interface CheckOverlayProps {
  position: PositionDto | null;
  squareSize: number;
}

export function CheckOverlay({ position, squareSize }: CheckOverlayProps) {
  if (!position) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute animate-pulse-glow rounded-md ring-4 ring-danger"
      style={{
        top: position.row * squareSize,
        left: position.col * squareSize,
        width: squareSize,
        height: squareSize,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  );
}
