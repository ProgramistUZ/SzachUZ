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
    if (state.winner) setShowWinner(true);
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
            <StatusBanner status={statusKey(state.status, isPlayersTurn)} />
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

type StatusKey = 'yourTurn' | 'opponentTurn' | 'waiting' | null;

function statusKey(
  status: ReturnType<typeof useChessHub>['state']['status'],
  isPlayersTurn: boolean,
): StatusKey {
  if (status === 'playing') return isPlayersTurn ? 'yourTurn' : 'opponentTurn';
  if (status === 'lobby') return 'waiting';
  return null;
}

function StatusBanner({ status }: { status: StatusKey }) {
  const { t } = useTranslation();
  if (!status) return null;
  return (
    <div className="text-sm font-medium uppercase tracking-wider text-muted dark:text-muted-dark">
      {t(`board.${status}`)}
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
