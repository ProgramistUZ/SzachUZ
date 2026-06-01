import { AnimatePresence, motion } from 'framer-motion';
import type { PositionDto } from '@/lib/signalr/contracts';

const PARTICLE_COUNT = 12;

interface CaptureFxProps {
  position: PositionDto | null;
  /** Square edge length in px (matches Chessboard layout). */
  squareSize: number;
}

export function CaptureFx({ position, squareSize }: CaptureFxProps) {
  return (
    <AnimatePresence>
      {position && (
        <motion.div
          key={`${position.row}-${position.col}`}
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: position.row * squareSize,
            left: position.col * squareSize,
            width: squareSize,
            height: squareSize,
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
            const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
            const distance = squareSize * 0.6;
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(255,200,80,0.9)]"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  opacity: 0,
                  scale: 0.4,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
