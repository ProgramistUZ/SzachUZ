import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AppShellProps {
  topBar: ReactNode;
  board: ReactNode;
  sidePanel: ReactNode;
  popups?: ReactNode;
}

export function AppShell({ topBar, board, sidePanel, popups }: AppShellProps) {
  return (
    <div className="relative min-h-full overflow-hidden">
      <BackgroundMesh />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
        {topBar}
        <main className="flex flex-1 flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
          <section className="flex w-full max-w-[640px] flex-col items-center gap-4">
            {board}
          </section>
          <aside className="flex w-full max-w-md flex-col gap-4 lg:w-[360px]">{sidePanel}</aside>
        </main>
      </div>
      {popups}
    </div>
  );
}

function BackgroundMesh() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-mesh-light opacity-90 blur-3xl dark:opacity-0"
        animate={{ scale: [1, 1.04, 1], x: ['0%', '2%', '0%'], y: ['0%', '-2%', '0%'] }}
        transition={{ duration: 22, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-mesh-dark opacity-0 blur-3xl dark:opacity-90"
        animate={{ scale: [1, 1.05, 1], x: ['0%', '-2%', '0%'], y: ['0%', '2%', '0%'] }}
        transition={{ duration: 26, ease: 'easeInOut', repeat: Infinity }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:18px_18px] dark:[background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)]"
      />
    </>
  );
}
