import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { socket } from '../socket';

interface PlayerInfo {
  id: string;
  name: string;
  ready: boolean;
  scores: { stage1: number; stage2: number; stage3: number; stage4: number; emergency: number };
}

interface Ranking {
  id: string;
  name: string;
  total: number;
  scores: Record<string, number>;
}

interface GameState {
  connected: boolean;
  playerName: string;
  roomCode: string | null;
  players: PlayerInfo[];
  currentStage: number; // 0=lobby, 1-4=stages, 5=results
  rankings: Ranking[];
  stageResults: Array<{ name: string; stageScore: number }> | null;
  finalResults: { rankings: Ranking[]; topScorer: Ranking | null } | null;
  emergency: { emergencyId: string; scenario: { description: string; options: string[] } } | null;
  isHost: boolean;
}

type Action =
  | { type: 'SET_CONNECTED'; connected: boolean }
  | { type: 'SET_PLAYER_NAME'; name: string }
  | { type: 'SET_ROOM'; code: string; isHost: boolean }
  | { type: 'SET_PLAYERS'; players: PlayerInfo[] }
  | { type: 'SET_STAGE'; stage: number }
  | { type: 'SET_RANKINGS'; rankings: Ranking[] }
  | { type: 'SET_STAGE_RESULTS'; results: Array<{ name: string; stageScore: number }> }
  | { type: 'CLEAR_STAGE_RESULTS' }
  | { type: 'SET_FINAL_RESULTS'; results: GameState['finalResults'] }
  | { type: 'SET_EMERGENCY'; emergency: GameState['emergency'] }
  | { type: 'CLEAR_EMERGENCY' }
  | { type: 'RESET' };

const initialState: GameState = {
  connected: false,
  playerName: '',
  roomCode: null,
  players: [],
  currentStage: 0,
  rankings: [],
  stageResults: null,
  finalResults: null,
  emergency: null,
  isHost: false,
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_CONNECTED':
      return { ...state, connected: action.connected };
    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.name };
    case 'SET_ROOM':
      return { ...state, roomCode: action.code, isHost: action.isHost };
    case 'SET_PLAYERS':
      return { ...state, players: action.players };
    case 'SET_STAGE':
      return { ...state, currentStage: action.stage, stageResults: null };
    case 'SET_RANKINGS':
      return { ...state, rankings: action.rankings };
    case 'SET_STAGE_RESULTS':
      return { ...state, stageResults: action.results };
    case 'CLEAR_STAGE_RESULTS':
      return { ...state, stageResults: null };
    case 'SET_FINAL_RESULTS':
      return { ...state, currentStage: 5, finalResults: action.results };
    case 'SET_EMERGENCY':
      return { ...state, emergency: action.emergency };
    case 'CLEAR_EMERGENCY':
      return { ...state, emergency: null };
    case 'RESET':
      return { ...initialState, connected: state.connected, playerName: state.playerName };
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  createRoom: (name: string) => void;
  joinRoom: (code: string, name: string) => void;
  toggleReady: () => void;
  startGame: () => void;
  submitAnswer: (stageId: number, questionId: string, answer: string) => void;
  submitEmergencyResponse: (emergencyId: string, answer: string) => void;
  completeStage: (stageId: number) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => dispatch({ type: 'SET_CONNECTED', connected: true }));
    socket.on('disconnect', () => dispatch({ type: 'SET_CONNECTED', connected: false }));

    socket.on('room-created', ({ roomCode }) => {
      dispatch({ type: 'SET_ROOM', code: roomCode, isHost: true });
    });

    socket.on('join-error', ({ message }) => {
      alert(message);
    });

    socket.on('player-joined', ({ players }) => {
      dispatch({ type: 'SET_PLAYERS', players });
    });

    socket.on('game-start', ({ stage }) => {
      dispatch({ type: 'SET_STAGE', stage });
    });

    socket.on('leaderboard-update', ({ rankings }) => {
      dispatch({ type: 'SET_RANKINGS', rankings });
    });

    socket.on('emergency-alert', (data) => {
      dispatch({ type: 'SET_EMERGENCY', emergency: data });
    });

    socket.on('emergency-end', () => {
      dispatch({ type: 'CLEAR_EMERGENCY' });
    });

    socket.on('stage-transition', ({ nextStage, stageResults, rankings }) => {
      dispatch({ type: 'SET_RANKINGS', rankings });
      dispatch({ type: 'SET_STAGE_RESULTS', results: stageResults });
      // After showing results briefly, move to next stage
      setTimeout(() => {
        dispatch({ type: 'SET_STAGE', stage: nextStage });
      }, 5000);
    });

    socket.on('game-over', ({ finalResults }) => {
      dispatch({ type: 'SET_FINAL_RESULTS', results: finalResults });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('room-created');
      socket.off('join-error');
      socket.off('player-joined');
      socket.off('game-start');
      socket.off('leaderboard-update');
      socket.off('emergency-alert');
      socket.off('emergency-end');
      socket.off('stage-transition');
      socket.off('game-over');
      socket.disconnect();
    };
  }, []);

  const createRoom = useCallback((name: string) => {
    dispatch({ type: 'SET_PLAYER_NAME', name });
    socket.emit('create-room', { playerName: name });
  }, []);

  const joinRoom = useCallback((code: string, name: string) => {
    dispatch({ type: 'SET_PLAYER_NAME', name });
    socket.emit('join-room', { roomCode: code.toUpperCase(), playerName: name });
    dispatch({ type: 'SET_ROOM', code: code.toUpperCase(), isHost: false });
  }, []);

  const toggleReady = useCallback(() => {
    socket.emit('player-ready', {});
  }, []);

  const startGame = useCallback(() => {
    socket.emit('start-game', {});
  }, []);

  const submitAnswer = useCallback((stageId: number, questionId: string, answer: string) => {
    socket.emit('stage-answer', { stageId, questionId, answer, timestamp: Date.now() });
  }, []);

  const submitEmergencyResponse = useCallback((emergencyId: string, answer: string) => {
    socket.emit('emergency-response', { emergencyId, answer, timestamp: Date.now() });
  }, []);

  const completeStage = useCallback((stageId: number) => {
    socket.emit('stage-complete', { stageId });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        createRoom,
        joinRoom,
        toggleReady,
        startGame,
        submitAnswer,
        submitEmergencyResponse,
        completeStage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
