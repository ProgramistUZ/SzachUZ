import { motion } from 'framer-motion';
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
  const {
    state,
    createGame,
    joinGame,
    setReady,
    unsetReady,
    makeMove,
    getMoves,
    sendMessage,
    resetError,
  } = useChessHub();

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
  const timerInactive = state.status !== 'playing' && state.status !== 'ended';

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
              totalSeconds={state.gameLength}
              inactive={timerInactive}
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
              totalSeconds={state.gameLength}
              inactive={timerInactive}
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
              playerColor={state.playerColor}
              reason={state.winReason}
            />
            <LobbyReadyOverlay
              isOpen={state.status === 'lobby' && state.lobbyFull}
              iAmReady={state.iAmReady}
              opponentReady={state.opponentReady}
              onReady={() => void setReady()}
              onUnready={() => void unsetReady()}
            />
          </>
        }
      />
      <CountdownOverlay countdown={state.countdown} />
      {state.opponentDisconnected && state.status === 'playing' && <OpponentDisconnectedBanner />}
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

function LobbyReadyOverlay({
  isOpen,
  iAmReady,
  opponentReady,
  onReady,
  onUnready,
}: {
  isOpen: boolean;
  iAmReady: boolean;
  opponentReady: boolean;
  onReady: () => void;
  onUnready: () => void;
}) {
  const { t } = useTranslation();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass surface-noise flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl p-8 text-center shadow-2xl">
        <p className="font-display text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
          {t('popup.ready.title')}
        </p>
        <p className="text-sm text-muted dark:text-muted-dark">{t('popup.ready.hint')}</p>
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between rounded-lg border border-ink/10 px-4 py-2.5 dark:border-white/10">
            <span className="text-sm font-medium text-ink dark:text-ink-dark">
              {t('popup.ready.you')}
            </span>
            {iAmReady ? (
              <span className="text-xs font-semibold text-success">
                {t('popup.ready.youAreReady')}
              </span>
            ) : (
              <span className="h-2 w-2 rounded-full bg-muted" />
            )}
          </div>
          <div className="flex items-center justify-between rounded-lg border border-ink/10 px-4 py-2.5 dark:border-white/10">
            <span className="text-sm text-muted dark:text-muted-dark">
              {t('popup.ready.opponent')}
            </span>
            {opponentReady ? (
              <span className="text-xs font-semibold text-success">
                {t('popup.ready.opponentIsReady')}
              </span>
            ) : (
              <span className="text-xs text-muted dark:text-muted-dark">
                {t('popup.ready.waitingForOpponent')}
              </span>
            )}
          </div>
        </div>
        {!iAmReady ? (
          <motion.button
            type="button"
            className="btn-primary w-full"
            onClick={onReady}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            {t('popup.ready.ready')}
          </motion.button>
        ) : (
          <div className="flex w-full flex-col items-center gap-3">
            <p className="animate-pulse text-sm text-muted dark:text-muted-dark">
              {t('popup.ready.waitingForOpponent')}
            </p>
            <button type="button" className="btn-ghost text-sm" onClick={onUnready}>
              {t('popup.ready.unready')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CountdownOverlay({ countdown }: { countdown: number | null }) {
  if (countdown === null) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        key={countdown}
        initial={{ scale: 1.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex flex-col items-center gap-3"
      >
        <span className="font-display text-[8rem] font-bold leading-none text-white drop-shadow-2xl">
          {countdown}
        </span>
      </motion.div>
    </div>
  );
}

function OpponentDisconnectedBanner() {
  const { t } = useTranslation();
  return (
    <div className="fixed left-1/2 top-20 z-40 -translate-x-1/2 rounded-xl border border-danger/40 bg-danger/10 px-5 py-3 text-sm font-medium text-danger backdrop-blur-md">
      {t('popup.disconnected.opponentLeft')}
    </div>
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
