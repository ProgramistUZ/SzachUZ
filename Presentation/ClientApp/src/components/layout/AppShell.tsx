import { motion } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';

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
      <ParticleField />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col gap-6 px-4 py-6 lg:px-8">
        {topBar}
        <main className="flex flex-1 flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center xl:gap-12">
          <section className="flex w-full max-w-[640px] flex-col items-center gap-4">
            {board}
          </section>
          <aside className="flex w-full max-w-md flex-col gap-4 lg:w-[380px]">{sidePanel}</aside>
        </main>
      </div>
      {popups}
    </div>
  );
}

function BackgroundMesh() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 overflow-hidden">
      <motion.div
        className="absolute inset-[-10%] bg-mesh-light opacity-100 blur-[60px] dark:opacity-0"
        animate={{ scale: [1, 1.05, 1], x: ['0%', '2%', '0%'], y: ['0%', '-2%', '0%'] }}
        transition={{ duration: 22, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-[-10%] bg-mesh-dark opacity-0 blur-[60px] dark:opacity-100"
        animate={{ scale: [1, 1.06, 1], x: ['0%', '-2%', '0%'], y: ['0%', '2%', '0%'] }}
        transition={{ duration: 26, ease: 'easeInOut', repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-noise opacity-[0.14] mix-blend-overlay dark:opacity-[0.18]" />
      <div className="absolute inset-0 [background-image:radial-gradient(circle_at_50%_120%,rgba(91,63,229,0.15),transparent_55%)] dark:[background-image:radial-gradient(circle_at_50%_120%,rgba(139,111,255,0.2),transparent_55%)]" />
    </div>
  );
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; o: number }> =
      [];

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles.length = 0;
      const count = Math.min(60, Math.floor((width * height) / 30000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          r: Math.random() * 1.6 + 0.4,
          o: Math.random() * 0.5 + 0.2,
        });
      }
    };

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');
      const fill = isDark ? 'rgba(212, 165, 116, ' : 'rgba(167, 122, 74, ';
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${fill}${p.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    seed();
    draw();
    window.addEventListener('resize', () => {
      resize();
      seed();
    });

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-70"
    />
  );
}
