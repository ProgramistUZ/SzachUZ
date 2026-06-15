import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { HubConnection } from '@microsoft/signalr';
import { createConnection, HubConnectionState } from './connection';
import type {
  BoardState,
  Color,
  GameCreatedPayload,
  GameOverPayload,
  GameStartedPayload,
  GameStatePayload,
  JoinedPayload,
  PieceCode,
  PositionDto,
  UpdateTimerPayload,
} from './contracts';
import { INITIAL_BOARD } from '@/lib/chess/board';

export type GameStatus = 'idle' | 'connecting' | 'lobby' | 'playing' | 'ended';

interface ChatMessage {
  id: string;
  text: string;
  at: number;
}

export interface ChessHubState {
  status: GameStatus;
  isConnected: boolean;
  gameId: string | null;
  joinCode: string | null;
  playerColor: Color;
  whiteTime: number;
  blackTime: number;
  gameLength: number;
  whoseTurn: Color;
  lobbyFull: boolean;
  iAmReady: boolean;
  opponentReady: boolean;
  opponentDisconnected: boolean;
  countdown: number | null;
  board: BoardState;
  possibleMoves: PositionDto[];
  lastMove: { from: PositionDto; to: PositionDto } | null;
  messages: ChatMessage[];
  winner: Color | 'draw' | null;
  winReason: string | null;
  errorMessage: string | null;
}

type Action =
  | { type: 'connecting' }
  | { type: 'connected' }
  | { type: 'disconnected' }
  | { type: 'gameCreated'; payload: GameCreatedPayload }
  | { type: 'joined'; payload: JoinedPayload }
  | { type: 'playerJoined' }
  | { type: 'lobbyFull' }
  | { type: 'iAmReady' }
  | { type: 'iAmUnready' }
  | { type: 'opponentReady' }
  | { type: 'opponentUnready' }
  | { type: 'gameStarted'; payload: GameStartedPayload }
  | { type: 'boardUpdate'; payload: BoardState }
  | { type: 'movesReceived'; payload: PositionDto[] }
  | { type: 'clearPossibleMoves' }
  | { type: 'timerUpdate'; payload: UpdateTimerPayload }
  | { type: 'gameOver'; payload: GameOverPayload }
  | { type: 'gameState'; payload: GameStatePayload }
  | { type: 'countdown'; payload: number }
  | { type: 'playerDisconnected' }
  | { type: 'playerReconnected' }
  | { type: 'message'; payload: string }
  | { type: 'error'; payload: string }
  | { type: 'clearError' }
  | { type: 'setLastMove'; payload: { from: PositionDto; to: PositionDto } }
  | { type: 'reset' };

const INITIAL_STATE: ChessHubState = {
  status: 'idle',
  isConnected: false,
  gameId: null,
  joinCode: null,
  playerColor: 'white',
  whiteTime: 300,
  blackTime: 300,
  gameLength: 300,
  whoseTurn: 'white',
  lobbyFull: false,
  iAmReady: false,
  opponentReady: false,
  opponentDisconnected: false,
  countdown: null,
  board: INITIAL_BOARD,
  possibleMoves: [],
  lastMove: null,
  messages: [],
  winner: null,
  winReason: null,
  errorMessage: null,
};

function findKingThreshold(board: BoardState, color: Color): boolean {
  const kingCode: PieceCode = color === 'white' ? 'wK' : 'bK';
  for (const row of board) {
    for (const piece of row) {
      if (piece === kingCode) return true;
    }
  }
  return false;
}

function reducer(state: ChessHubState, action: Action): ChessHubState {
  switch (action.type) {
    case 'connecting':
      return { ...state, status: 'connecting', isConnected: false };
    case 'connected':
      return { ...state, isConnected: true, status: state.gameId ? state.status : 'idle' };
    case 'disconnected':
      return { ...state, isConnected: false };
    case 'gameCreated':
      return {
        ...state,
        status: 'lobby',
        gameId: action.payload.gameId,
        joinCode: action.payload.joinCode,
        playerColor: action.payload.yourColor,
        winner: null,
        errorMessage: null,
      };
    case 'joined':
      return {
        ...state,
        gameId: action.payload.gameId,
        playerColor: action.payload.color,
        status: state.status === 'playing' ? 'playing' : 'lobby',
        errorMessage: null,
      };
    case 'playerJoined':
      return { ...state, status: 'lobby', lobbyFull: true };
    case 'lobbyFull':
      return { ...state, lobbyFull: true };
    case 'iAmReady':
      return { ...state, iAmReady: true };
    case 'iAmUnready':
      return { ...state, iAmReady: false };
    case 'opponentReady':
      return { ...state, opponentReady: true };
    case 'opponentUnready':
      return { ...state, opponentReady: false };
    case 'gameStarted': {
      const { gameLength, currentPlayer } = action.payload;
      return {
        ...state,
        whiteTime: gameLength,
        blackTime: gameLength,
        gameLength,
        whoseTurn: currentPlayer,
        status: 'playing',
        countdown: null,
      };
    }
    case 'boardUpdate': {
      const board = action.payload;
      const whiteAlive = findKingThreshold(board, 'white');
      const blackAlive = findKingThreshold(board, 'black');
      let winner: ChessHubState['winner'] = null;
      let status: GameStatus = state.status === 'ended' ? 'ended' : 'playing';
      if (!whiteAlive && blackAlive) {
        winner = 'black';
        status = 'ended';
      } else if (!blackAlive && whiteAlive) {
        winner = 'white';
        status = 'ended';
      }
      return {
        ...state,
        board,
        possibleMoves: [],
        whoseTurn: state.whoseTurn === 'white' ? 'black' : 'white',
        winner,
        status,
      };
    }
    case 'movesReceived':
      return { ...state, possibleMoves: action.payload };
    case 'clearPossibleMoves':
      return { ...state, possibleMoves: [] };
    case 'timerUpdate': {
      const { player, timeLeft } = action.payload;
      return {
        ...state,
        whiteTime: player === 'white' ? timeLeft : state.whiteTime,
        blackTime: player === 'black' ? timeLeft : state.blackTime,
        whoseTurn: player,
      };
    }
    case 'gameOver':
      return {
        ...state,
        winner: action.payload.winner,
        winReason: action.payload.reason,
        status: 'ended',
        countdown: null,
      };
    case 'gameState': {
      const p = action.payload;
      return {
        ...state,
        gameId: p.gameId,
        playerColor: p.color,
        gameLength: p.gameLength,
        whiteTime: p.whiteTime,
        blackTime: p.blackTime,
        whoseTurn: p.currentPlayer,
        board: p.board as BoardState,
        status: p.isFinished ? 'ended' : p.isActive ? 'playing' : 'lobby',
        lobbyFull: true,
        opponentDisconnected: false,
        errorMessage: null,
      };
    }
    case 'countdown':
      return { ...state, countdown: action.payload };
    case 'playerDisconnected':
      return { ...state, opponentDisconnected: true };
    case 'playerReconnected':
      return { ...state, opponentDisconnected: false };
    case 'message':
      return {
        ...state,
        messages: [
          ...state.messages,
          { id: crypto.randomUUID(), text: action.payload, at: Date.now() },
        ],
      };
    case 'error':
      return { ...state, errorMessage: action.payload };
    case 'clearError':
      return { ...state, errorMessage: null };
    case 'setLastMove':
      return { ...state, lastMove: action.payload };
    case 'reset':
      return { ...INITIAL_STATE, isConnected: state.isConnected };
    default:
      return state;
  }
}

export interface UseChessHub {
  state: ChessHubState;
  createGame: (color: Color, gameLength: number) => Promise<void>;
  joinGame: (code: string) => Promise<void>;
  setReady: () => Promise<void>;
  unsetReady: () => Promise<void>;
  makeMove: (from: PositionDto, to: PositionDto) => Promise<void>;
  getMoves: (from: PositionDto | null) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  resetError: () => void;
}

export function useChessHub(): UseChessHub {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    const connection = createConnection();
    connectionRef.current = connection;

    const log = (event: string, payload: unknown) => {
      if (import.meta.env.DEV) console.debug('[ChessHub]', event, payload);
    };

    connection.on('GameCreated', (data: GameCreatedPayload) => {
      log('GameCreated', data);
      window.sessionStorage.setItem('szachuz.joinCode', data.joinCode);
      dispatch({ type: 'gameCreated', payload: data });
    });
    connection.on('Joined', (data: JoinedPayload) => {
      log('Joined', data);
      const savedCode = window.sessionStorage.getItem('szachuz.joinCode');
      if (!savedCode) {
        const fromUrl = new URLSearchParams(window.location.search).get('code');
        if (fromUrl) window.sessionStorage.setItem('szachuz.joinCode', fromUrl);
      }
      dispatch({ type: 'joined', payload: data });
    });
    connection.on('PlayerJoined', (id: string) => {
      log('PlayerJoined', id);
      dispatch({ type: 'playerJoined' });
    });
    connection.on('LobbyFull', () => {
      log('LobbyFull', null);
      dispatch({ type: 'lobbyFull' });
    });
    connection.on('PlayerReady', (_id: string) => {
      log('PlayerReady', _id);
      dispatch({ type: 'opponentReady' });
    });
    connection.on('PlayerUnready', (_id: string) => {
      log('PlayerUnready', _id);
      dispatch({ type: 'opponentUnready' });
    });
    connection.on('MoveMade', (board: BoardState) => {
      log('MoveMade', board);
      dispatch({ type: 'boardUpdate', payload: board });
    });
    connection.on('ReciveMoves', (moves: PositionDto[]) => {
      log('ReciveMoves', moves);
      dispatch({ type: 'movesReceived', payload: moves });
    });
    connection.on('GameStarted', (data: GameStartedPayload) => {
      log('GameStarted', data);
      dispatch({ type: 'gameStarted', payload: data });
    });
    connection.on('UpdateTimer', (data: UpdateTimerPayload) => {
      log('UpdateTimer', data);
      dispatch({ type: 'timerUpdate', payload: data });
    });
    connection.on('GameOver', (data: GameOverPayload) => {
      log('GameOver', data);
      dispatch({ type: 'gameOver', payload: data });
    });
    connection.on('GameState', (data: GameStatePayload) => {
      log('GameState', data);
      dispatch({ type: 'gameState', payload: data });
    });
    connection.on('Countdown', (n: number) => {
      log('Countdown', n);
      dispatch({ type: 'countdown', payload: n });
    });
    connection.on('PlayerDisconnected', () => {
      log('PlayerDisconnected', null);
      dispatch({ type: 'playerDisconnected' });
    });
    connection.on('PlayerReconnected', () => {
      log('PlayerReconnected', null);
      dispatch({ type: 'playerReconnected' });
    });
    connection.on('ReciveMessage', (msg: string) => {
      log('ReciveMessage', msg);
      dispatch({ type: 'message', payload: msg });
    });
    connection.on('Error', (msg: string) => {
      log('Error', msg);
      dispatch({ type: 'error', payload: msg });
    });

    connection.onreconnecting(() => dispatch({ type: 'disconnected' }));
    connection.onreconnected(() => dispatch({ type: 'connected' }));
    connection.onclose(() => dispatch({ type: 'disconnected' }));

    dispatch({ type: 'connecting' });
    connection
      .start()
      .then(async () => {
        dispatch({ type: 'connected' });
        const savedCode = window.sessionStorage.getItem('szachuz.joinCode');
        if (savedCode) {
          try {
            await connection.invoke('JoinGame', savedCode);
          } catch (err) {
            if (import.meta.env.DEV) console.warn('[ChessHub] auto-rejoin failed:', err);
            window.sessionStorage.removeItem('szachuz.joinCode');
          }
        }
      })
      .catch((err: unknown) => {
        if (import.meta.env.DEV) {
          console.warn('[ChessHub] connection failed:', err);
        }
        dispatch({ type: 'disconnected' });
      });

    return () => {
      void connection.stop();
      connectionRef.current = null;
    };
  }, []);

  const ensureConnected = useCallback((): HubConnection => {
    const connection = connectionRef.current;
    if (!connection || connection.state !== HubConnectionState.Connected) {
      throw new Error('not_connected');
    }
    return connection;
  }, []);

  const createGame = useCallback<UseChessHub['createGame']>(
    async (color, gameLength) => {
      try {
        const connection = ensureConnected();
        const serverColor = color.charAt(0).toUpperCase() + color.slice(1);
        await connection.invoke('CreateGame', serverColor, gameLength);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'createFailed';
        dispatch({ type: 'error', payload: msg });
      }
    },
    [ensureConnected],
  );

  const joinGame = useCallback<UseChessHub['joinGame']>(
    async (code) => {
      try {
        const connection = ensureConnected();
        window.sessionStorage.setItem('szachuz.joinCode', code);
        await connection.invoke('JoinGame', code);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'joinFailed';
        dispatch({ type: 'error', payload: msg });
      }
    },
    [ensureConnected],
  );

  const setReady = useCallback<UseChessHub['setReady']>(async () => {
    const connection = connectionRef.current;
    const gameId = state.gameId;
    if (!connection || !gameId) return;
    dispatch({ type: 'iAmReady' });
    try {
      await connection.invoke('PlayerReady', gameId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'generic';
      dispatch({ type: 'error', payload: msg });
    }
  }, [state.gameId]);

  const unsetReady = useCallback<UseChessHub['unsetReady']>(async () => {
    const connection = connectionRef.current;
    const gameId = state.gameId;
    if (!connection || !gameId) return;
    dispatch({ type: 'iAmUnready' });
    try {
      await connection.invoke('PlayerUnready', gameId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'generic';
      dispatch({ type: 'error', payload: msg });
    }
  }, [state.gameId]);

  const makeMove = useCallback<UseChessHub['makeMove']>(
    async (from, to) => {
      const connection = connectionRef.current;
      const gameId = state.gameId;
      if (import.meta.env.DEV) {
        console.debug('[ChessHub] makeMove called', { gameId, from, to, hasConn: !!connection });
      }
      if (!connection || !gameId) return;
      dispatch({ type: 'setLastMove', payload: { from, to } });
      try {
        await connection.invoke('MakeMove', gameId, from, to);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'generic';
        dispatch({ type: 'error', payload: msg });
      }
    },
    [state.gameId],
  );

  const getMoves = useCallback<UseChessHub['getMoves']>(
    async (from) => {
      if (from === null) {
        dispatch({ type: 'clearPossibleMoves' });
        return;
      }
      const connection = connectionRef.current;
      const gameId = state.gameId;
      if (!connection || !gameId) return;
      try {
        await connection.invoke('GetAllMoves', gameId, from);
      } catch {
        dispatch({ type: 'clearPossibleMoves' });
      }
    },
    [state.gameId],
  );

  const sendMessage = useCallback<UseChessHub['sendMessage']>(
    async (text) => {
      const connection = connectionRef.current;
      const gameId = state.gameId;
      if (!connection || !gameId || text.trim().length === 0) return;
      await connection.invoke('SendMessage', gameId, text);
    },
    [state.gameId],
  );

  const resetError = useCallback(() => dispatch({ type: 'clearError' }), []);

  return useMemo(
    () => ({
      state,
      createGame,
      joinGame,
      setReady,
      unsetReady,
      makeMove,
      getMoves,
      sendMessage,
      resetError,
    }),
    [
      state,
      createGame,
      joinGame,
      setReady,
      unsetReady,
      makeMove,
      getMoves,
      sendMessage,
      resetError,
    ],
  );
}
