import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from './components/layout/AppShell';
import { TopBar } from './components/topbar/TopBar';
import { LanguageSwitcher } from './components/topbar/LanguageSwitcher';
import { ThemeToggle } from './components/topbar/ThemeToggle';
import { Chessboard } from './components/board/Chessboard';
import { Timer } from './components/timer/Timer';
import { Chat } from './components/chat/Chat';
import { MoveTable, type MoveRow } from './components/moves/MoveTable';
import { SettingsPopup } from './components/popups/SettingsPopup';
import { JoinPopup } from './components/popups/JoinPopup';
import { CodePopup } from './components/popups/CodePopup';
import { WinnerPopup } from './components/popups/WinnerPopup';
import { useChessHub } from './lib/signalr/useChessHub';
import { useTheme } from './lib/theme/useTheme';

function App() {
  useTheme();
  const { t } = useTranslation();
  const { state, createGame, joinGame, makeMove, getMoves, sendMessage, resetError } =
    useChessHub();

  const [showSettings, setShowSettings] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    if (state.joinCode && state.status === 'lobby') setShowCode(true);
  }, [state.joinCode, state.status]);

  useEffect(() => {
    if (state.winner) {
      setShowWinner(true);
      window.sessionStorage.removeItem('szachuz.joinCode');
    }
  }, [state.winner]);

  const isPlayersTurn = state.whoseTurn === state.playerColor && state.status === 'playing';

  const moves = useMemo<MoveRow[]>(() => [], []);

  return (
    <>
      <AppShell
        topBar={
          <div className="flex items-center gap-2">
            <TopBar
              onOpenJoin={() => setShowJoin(true)}
              onOpenCode={() => setShowCode(true)}
              onOpenSettings={() => setShowSettings(true)}
              hasJoinCode={state.joinCode !== null}
              status={state.status}
              isConnected={state.isConnected}
            />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        }
        board={
          <>
            <Timer
              color={state.playerColor === 'white' ? 'black' : 'white'}
              seconds={state.playerColor === 'white' ? state.blackTime : state.whiteTime}
              isActive={state.whoseTurn !== state.playerColor && state.status === 'playing'}
            />
            <Chessboard
              board={state.board}
              playerColor={state.playerColor}
              isPlayersTurn={isPlayersTurn}
              possibleMoves={state.possibleMoves}
              lastMove={state.lastMove}
              checkPosition={null}
              onRequestMoves={(from) => void getMoves(from)}
              onMove={(from, to) => void makeMove(from, to)}
            />
            <Timer
              color={state.playerColor}
              seconds={state.playerColor === 'white' ? state.whiteTime : state.blackTime}
              isActive={state.whoseTurn === state.playerColor && state.status === 'playing'}
            />
            <TurnIndicator status={state.status} isPlayersTurn={isPlayersTurn} />
          </>
        }
        sidePanel={
          <>
            <MoveTable moves={moves} />
            <Chat
              messages={state.messages}
              onSend={(text) => void sendMessage(text)}
              disabled={state.status !== 'playing'}
            />
          </>
        }
        popups={
          <>
            <SettingsPopup
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
              onStart={(color, length) => void createGame(color, length)}
            />
            <JoinPopup
              isOpen={showJoin}
              onClose={() => setShowJoin(false)}
              onSubmit={(code) => {
                void joinGame(code);
                setShowJoin(false);
              }}
            />
            <CodePopup
              isOpen={showCode}
              onClose={() => setShowCode(false)}
              joinCode={state.joinCode}
            />
            <WinnerPopup
              isOpen={showWinner}
              onClose={() => setShowWinner(false)}
              winner={state.winner}
            />
          </>
        }
      />
      {state.errorMessage && (
        <ErrorToast
          message={state.errorMessage}
          onDismiss={resetError}
          fallback={t('errors.generic')}
        />
      )}
    </>
  );
}

function TurnIndicator({
  status,
  isPlayersTurn,
}: {
  status: ReturnType<typeof useChessHub>['state']['status'];
  isPlayersTurn: boolean;
}) {
  const { t } = useTranslation();
  if (status !== 'playing' && status !== 'lobby') return null;
  const key = status === 'lobby' ? 'waiting' : isPlayersTurn ? 'yourTurn' : 'opponentTurn';
  const palette =
    key === 'yourTurn'
      ? 'border-success/50 bg-success/10 text-success'
      : key === 'opponentTurn'
        ? 'border-regal/50 bg-regal/10 text-regal dark:text-regal-dark'
        : 'border-accent/50 bg-accent/10 text-accent dark:text-accent-dark';
  return (
    <div
      className={`relative inline-flex items-center gap-3 rounded-full border-2 px-5 py-2.5 backdrop-blur-md ${palette}`}
    >
      {key !== 'waiting' && (
        <span className="relative flex h-2.5 w-2.5">
          <span
            className={`absolute inline-flex h-full w-full animate-pulse-ring rounded-full opacity-70 ${
              key === 'yourTurn' ? 'bg-success' : 'bg-regal'
            }`}
          />
          <span
            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
              key === 'yourTurn' ? 'bg-success' : 'bg-regal'
            }`}
          />
        </span>
      )}
      <span className="text-sm font-semibold uppercase tracking-[0.18em]">{t(`board.${key}`)}</span>
    </div>
  );
}

function ErrorToast({
  message,
  onDismiss,
  fallback,
}: {
  message: string;
  onDismiss: () => void;
  fallback: string;
}) {
  useEffect(() => {
    const id = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(id);
  }, [onDismiss]);
  return (
    <div
      role="alert"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-danger px-4 py-2 text-sm text-white shadow-lg"
      onClick={onDismiss}
    >
      {message || fallback}
    </div>
  );
}

export default App;
