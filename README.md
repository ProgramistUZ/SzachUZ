# SzachUZ

<div align="center">

<img src="https://img.shields.io/badge/chess-♛-8b5cf6?style=for-the-badge&labelColor=1e1b4b" alt="Chess" />

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SignalR](https://img.shields.io/badge/SignalR-realtime-00A86B?style=for-the-badge&logo=microsoft&logoColor=white)](https://dotnet.microsoft.com/apps/aspnet/signalr)
[![License](https://img.shields.io/github/license/ProgramistUZ/SzachUZ?style=for-the-badge&color=8b5cf6)](./LICENSE)

*A real-time multiplayer chess application built as a university project.*

</div>

---

## Features

- **Real-time gameplay** — moves, timers, and chat sync instantly via SignalR WebSockets
- **Lobby system** — share a 6-character code to invite a friend; both players confirm ready before the game starts
- **Countdown** — a 3-second animated countdown fires after both players are ready
- **Chess clock** — configurable per-game time control; backend-authoritative timer with per-second ticks
- **Full move validation** — server-side rule enforcement including check, checkmate, castling, en passant, and pawn promotion
- **Game over detection** — timeout and checkmate both trigger an end-game popup with a personalised win/lose message
- **Reconnection** — refreshing the page drops you back into the same game without losing state
- **Dark mode** — system-aware theme with a manual toggle
- **i18n** — Polish and English, auto-detected from the browser
- **Easter egg** 🐣

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 10, SignalR, Clean Architecture (Domain / Application / Infrastructure / Presentation) |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, dnd-kit |
| Real-time | ASP.NET Core SignalR (WebSockets) |
| State | `useReducer` + custom `useChessHub` hook |
| i18n | i18next + react-i18next |
| Testing | xUnit (backend domain & infrastructure) |

## Architecture

The backend follows **Clean Architecture** — the domain has zero external dependencies and all game logic lives there. SignalR hubs are thin orchestrators that delegate to the application layer.

```
SzachUZ-src/
├── Domain/           # Entities, value objects, interfaces — no dependencies
├── Application/      # Use cases, service interfaces, DTOs
├── Infrastructure/   # Repositories, validators, SignalR notifiers
├── Presentation/     # ASP.NET Core host, SignalR hub, SPA proxy
│   └── ClientApp/    # React + TypeScript frontend (Vite)
└── Tests/            # xUnit test suite
```

### Domain layer

Core chess entities with no external dependencies:

- **`ChessGame`** — aggregate root; owns the board, both timers, player assignments, and game state machine (`Waiting → Active → Finished`)
- **`ChessBoard`** — 8×8 grid; tracks piece positions and king locations for check detection
- **`PieceBase`** and concrete pieces: `Pawn`, `King`, `Queen`, `Rook`, `Bishop`, `Knight` — each piece owns its own move-generation and move-validation logic
- **`PlayerTimer`** — per-player countdown; fires a callback every second via `RunTimerAsync`, tracks `_remainingTime` and `_turnStartTime`
- **`Position`** — value object `(Row, Col)` with structural equality

Special rules implemented:
| Rule | Piece |
|---|---|
| Castling (king-side & queen-side) | `King` (tracks `HasMoved`) |
| En passant | `Pawn` (tracks `MoveCount`) |
| Pawn promotion | `Pawn` (auto-promotes to `Queen` on rank 8/1) |

Domain interfaces (implemented in Infrastructure):

| Interface | Purpose |
|---|---|
| `IMoveValidator` | `IsInCheck`, `IsInMate` |
| `IGameNotifier` | Push game events (check, checkmate) via SignalR |
| `IGameTimerNotifer` | Push timer ticks, game start/over, countdown, reconnect |
| `IGameRepository` | Persist games and player mappings |
| `IGameIdGenerator` | Generate 6-character join codes |
| `IPositionConverter` | Translate between UI coordinates and internal board coordinates |

### Application layer

- **`IGameService`** / **`GameService`** — single entry point for all hub actions: `CreateGame`, `AddToGame`, `MakeMove`, `GetAllPossibleMoves`, `SetPlayerReady`, `GetGameIdByConnection`, and more
- **`PositionDto`** — `{ row, col }` DTO crossing the hub boundary

### Infrastructure layer

- **`InMemoryGameRepository`** — thread-safe in-memory store backed by `ConcurrentDictionary`; separate dictionaries for games, join codes, player-color mappings, and ready-state sets
- **`MoveValidator`** — implements check/mate detection by cloning the board and testing all opponent moves
- **`SignalRGameTimerNotifer`** and **`GameNotifier`** — push SignalR events to game groups

### Presentation layer

- **`ChessHub`** — 9 invokable methods (see [SignalR contract](#signalr-contract) below); converts between UI coordinates and internal board coordinates
- **`ChessHubContextBridge`** — adapter that exposes `IHubContext<ChessHubBase>` to Infrastructure so notifiers remain framework-agnostic
- **SPA proxy** — in development, `dotnet run` starts the Vite dev server automatically via `SpaProxy`

## SignalR Contract

The hub is mounted at `/chesshub`.

### Client → Server

| Method | Parameters | Description |
|---|---|---|
| `CreateGame` | `color: 'White'\|'Black'`, `gameLength: number` | Creates a new lobby and returns a join code |
| `JoinGame` | `joinGameId: string` | Joins an existing lobby by 6-character code |
| `MakeMove` | `gameId`, `from: {row,col}`, `to: {row,col}` | Submits a move |
| `GetAllMoves` | `gameId`, `from: {row,col}` | Requests legal destinations for a piece |
| `SendMessage` | `gameId`, `message: string` | Sends a chat message |
| `PlayerReady` | `gameId` | Marks the player as ready |
| `PlayerUnready` | `gameId` | Unmarks ready state |

### Server → Client

| Event | Payload | When |
|---|---|---|
| `GameCreated` | `{ gameId, joinCode, yourColor }` | After `CreateGame` |
| `Joined` | `{ gameId, color }` | After `JoinGame` succeeds |
| `PlayerJoined` | `connectionId` | Broadcast to lobby when second player joins |
| `LobbyFull` | — | Lobby already has 2 players |
| `PlayerReady` / `PlayerUnready` | — | Ready-state change broadcast |
| `GameStarted` | — | Both players ready; countdown complete |
| `Countdown` | — | 3-second countdown tick |
| `MoveMade` | `BoardState` (12×8×8 grid of piece codes) | After every legal move |
| `ReciveMoves` | `PositionDto[]` | Legal destinations for requested piece |
| `UpdateTimer` | `{ player: 'white'\|'black', timeLeft: number }` | Every second during a game |
| `GameOver` | — | Timeout or checkmate |
| `GameEvent` | `{ player, reason }` | Check or checkmate notification |
| `ReciveMessage` | `string` | Chat message from opponent |
| `PlayerDisconnected` / `PlayerReconnected` | — | Connection lifecycle |
| `Error` | `string` | Validation or server error |

Board state uses piece codes: `wK wQ wR wB wN wP` (white), `bK bQ bR bB bN bP` (black), `''` (empty).

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) (22 LTS recommended)

### Run locally

```bash
git clone https://github.com/ProgramistUZ/SzachUZ.git
cd SzachUZ

# Start the backend — SpaProxy launches the Vite dev server automatically
dotnet run --project Presentation
```

The app will be available at `http://localhost:3000`. The backend API and SignalR hub run on `http://localhost:5000`.

To override the hub URL (e.g. when running the frontend standalone):

```bash
cd Presentation/ClientApp
cp .env.example .env   # sets VITE_HUB_URL=http://localhost:8080/chesshub
npm install
npm run dev
```

### Run tests

```bash
dotnet test
```

### Frontend scripts

```bash
npm run dev            # Vite dev server with HMR
npm run build          # tsc + Vite production build → dist/
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint, zero warnings allowed
npm run format         # Prettier write
npm run format:check   # Prettier check (runs in CI)
```

## How to Play

1. Open the app and click **New Game** — pick your colour and time control.
2. Share the generated **6-character code** with your opponent.
3. Your opponent clicks **Join** and enters the code.
4. Both players click **Ready** — a 3-second countdown starts, then the game begins.
5. Click a piece to see legal moves highlighted, then click a destination square to move.

## Testing

Tests live in `Tests/` and use **xUnit**. Coverage includes:

| Area | What's tested |
|---|---|
| `ChessBoard` | Piece placement, boundary positions |
| `Pawn` | Single/double step, diagonal capture, en passant, promotion |
| `King` | Movement, castling (king-side & queen-side) |
| `Queen`, `Rook`, `Bishop`, `Knight` | Move generation and illegal-move exceptions |
| `PositionConverter` | UI ↔ internal coordinate round-trips |
| `PositionParser` | String ↔ `Position` parsing |
| `GameIdGenerator` | Join code format and uniqueness |

## Contributing

Pull requests are welcome. For larger changes please open an issue first.

## License

Distributed under the terms of the [LICENSE](./LICENSE) file in this repository.
