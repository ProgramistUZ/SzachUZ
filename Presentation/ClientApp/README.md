# SzachUZ — frontend (ClientApp)

Vite + React 19 + TypeScript + Tailwind CSS, komunikacja z `Presentation/Hubs/ChessHub.cs` przez SignalR.

## Wymagania
- Node.js 20+ (zalecane 22 LTS)
- Backend SzachUZ uruchomiony lokalnie (domyślnie `http://localhost:5000`)

## Setup
```bash
cd Presentation/ClientApp
npm install
cp .env.example .env        # opcjonalnie, jeśli chcesz nadpisać URL hubu
npm run dev                  # http://localhost:3000
```

## Skrypty
- `npm run dev` — Vite dev server (HMR)
- `npm run build` — produkcyjny build do `dist/`
- `npm run preview` — preview produkcyjnego build'u
- `npm run typecheck` — `tsc -b --noEmit`
- `npm run lint` — ESLint (zero warnings)
- `npm run format` / `format:check` — Prettier

## Konfiguracja
URL hubu SignalR czytany jest z `import.meta.env.VITE_HUB_URL`.
- Default w produkcji: same-origin `/chesshub` (gdy backend serwuje SPA).
- Default w dev: `http://localhost:5000/chesshub` (CORS w `Program.cs` dopuszcza `localhost:3000`).

## Architektura
```
src/
├─ lib/signalr     # otypowany kontrakt hubu + connection factory + useChessHub hook
├─ lib/chess       # plansza, notacja
├─ lib/theme       # useTheme (dark/light, persist)
├─ lib/utils/cn    # tailwind-merge helper
├─ i18n            # react-i18next (PL/EN), klucze hierarchiczne
├─ components
│  ├─ layout       # AppShell + animowane tło
│  ├─ board        # Chessboard, Square, Piece, CaptureFx, CheckOverlay
│  ├─ timer        # Timer z low-time pulsem
│  ├─ topbar       # TopBar, LanguageSwitcher, ThemeToggle (Zyta)
│  ├─ chat         # Chat (Zyta)
│  ├─ moves        # MoveTable (Zyta)
│  └─ popups       # Modal base, SettingsPopup, JoinPopup, CodePopup, WinnerPopup (Zyta)
└─ App.tsx         # composition root
```

## Kontrakt SignalR
Zobacz `src/lib/signalr/contracts.ts`. Schema zsynchronizowana z aktualnym `Presentation/Hubs/ChessHub.cs`. Jeśli backend zmieni eventy/argumenty — zaktualizować ten plik.

## Podział pracy
- **Oliwer**: scaffold, SignalR, plansza, Timer, AppShell, i18n base, dark mode infra, App composition.
- **Zyta**: TopBar, LanguageSwitcher, ThemeToggle, popupy (Modal/Settings/Join/Code/Winner), Chat, MoveTable, finalne tłumaczenia własnych komponentów. Pliki mają znaczniki `TODO(Zyta)` z konkretnymi instrukcjami.

Patch z bazą Zyty: `patches/zyta-side-panel.patch` + `patches/README-zyta.md`.

## Wow-factor
- Animowany gradient mesh w tle (Framer Motion).
- Glassmorphism panele.
- Pieces z `layoutId` (płynne tweenowanie po `MoveMade`).
- Particle burst przy biciu (`CaptureFx`).
- Pulsujący glow przy szachu (`CheckOverlay`).
- Confetti przy wygranej (`canvas-confetti`).
- Timer pulse + shake przy <10s.
- `prefers-reduced-motion` wyłącza FX.
