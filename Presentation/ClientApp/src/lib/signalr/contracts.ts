// SignalR contract for `Presentation/Hubs/ChessHub.cs` — keep in sync with the hub.

export type Color = 'white' | 'black';

export interface PositionDto {
  row: number;
  col: number;
}

export type PieceCode =
  | 'wK'
  | 'wQ'
  | 'wR'
  | 'wB'
  | 'wN'
  | 'wP'
  | 'bK'
  | 'bQ'
  | 'bR'
  | 'bB'
  | 'bN'
  | 'bP'
  | '';

export type BoardState = PieceCode[][];

export interface GameCreatedPayload {
  gameId: string;
  joinCode: string;
  yourColor: Color;
}

export interface JoinedPayload {
  gameId: string;
  color: Color;
}

export interface UpdateTimerPayload {
  player: Color;
  timeLeft: number;
}

export type HubServerToClient = {
  GameCreated: (data: GameCreatedPayload) => void;
  Joined: (data: JoinedPayload) => void;
  PlayerJoined: (connectionId: string) => void;
  MoveMade: (board: BoardState) => void;
  ReciveMoves: (moves: PositionDto[]) => void;
  ReciveMessage: (message: string) => void;
  UpdateTimer: (data: UpdateTimerPayload) => void;
  Error: (message: string) => void;
};

export type HubClientToServer = {
  CreateGame: (color: 'White' | 'Black', gameLength: number) => Promise<void>;
  JoinGame: (joinGameId: string) => Promise<void>;
  MakeMove: (gameId: string, from: PositionDto, to: PositionDto) => Promise<void>;
  GetAllMoves: (gameId: string, from: PositionDto) => Promise<void>;
  SendMessage: (gameId: string, message: string) => Promise<void>;
};
