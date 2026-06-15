# SzachUZ

<div align="center">

<img src="https://img.shields.io/badge/chess-♛-8b5cf6?style=for-the-badge&labelColor=1e1b4b" alt="Chess" />

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SignalR](https://img.shields.io/badge/SignalR-realtime-00A86B?style=for-the-badge&logo=microsoft&logoColor=white)](https://dotnet.microsoft.com/apps/aspnet/signalr)

[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](./Presentation/Dockerfile)
[![License](https://img.shields.io/github/license/ProgramistUZ/SzachUZ?style=for-the-badge&color=8b5cf6)](./LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/ProgramistUZ/SzachUZ?style=for-the-badge&color=8b5cf6)](https://github.com/ProgramistUZ/SzachUZ/commits/master)

*A real-time multiplayer chess application built as a university project.*

</div>

---

## Features

- **Real-time gameplay** — moves, timers, and chat sync instantly via SignalR WebSockets
- **Lobby system** — share a 6-character code to invite a friend; both players confirm ready before the game starts
- **Countdown** — a 3-second animated countdown fires after both players are ready
- **Chess clock** — configurable per-game time control; backend-authoritative timer with per-second updates
- **Move validation** — full server-side rule enforcement including check, checkmate, and illegal-move detection
- **Game over detection** — timeout and checkmate both trigger an end-game popup with a personalised win/lose message
- **Reconnection** — refreshing the page drops you back into the same game without losing state
- **Dark mode** — system-aware theme with a manual toggle
- **i18n** — Polish and English, auto-detected from the browser
- **Easter egg** 🐣

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 10, SignalR, Clean Architecture (Domain / Application / Infrastructure / Presentation) |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion |
| Real-time | ASP.NET Core SignalR (WebSockets) |
| State | `useReducer` + custom `useChessHub` hook |
| i18n | i18next + react-i18next |
| Containerisation | Docker + Docker Compose |
| Testing | xUnit (backend domain & infrastructure) |

## Architecture

```
SzachUZ-src/
├── Domain/           # Entities, value objects, interfaces — no dependencies
├── Application/      # Use cases, service interfaces
├── Infrastructure/   # SignalR notifiers, in-memory repository, validators
├── Presentation/     # ASP.NET Core host, SignalR hubs, SPA proxy
│   └── ClientApp/    # React + TypeScript frontend (Vite)
└── Tests/            # xUnit test suite
```

The backend follows **Clean Architecture** — the domain has zero external dependencies and all game logic (move validation, timers, state machine) lives there. SignalR hubs are thin orchestrators that delegate to the application layer.

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)

### Run locally

```bash
# Clone
git clone https://github.com/ProgramistUZ/SzachUZ.git
cd SzachUZ

# Start the backend (also launches the Vite dev server via SpaProxy)
dotnet run --project Presentation
```

The app will be available at `http://localhost:3000`.

### Run with Docker

```bash
docker compose up --build
```

### Run tests

```bash
dotnet test
```

## How to Play

1. Open the app and click **New Game** — pick your colour and time control.
2. Share the generated **6-character code** with your opponent.
3. Your opponent clicks **Join** and enters the code.
4. Both players click **Ready** — a 3-second countdown starts, then the game begins.
5. Click a piece to see legal moves highlighted, then click a destination square to move.

## Contributing

Pull requests are welcome. For larger changes please open an issue first.

## License

Distributed under the terms of the [LICENSE](./LICENSE) file in this repository.
