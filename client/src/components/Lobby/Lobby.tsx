import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { TurtleSVG } from '../shared/TurtleSVG';
import styles from './Lobby.module.css';

type Mode = 'choose' | 'create' | 'join';

const SPECIES_LIST = ['Green', 'Loggerhead', 'Leatherback', 'Hawksbill', 'Kemps Ridley'] as const;

export function Lobby() {
  const { state, createRoom, joinRoom, toggleReady, startGame } = useGame();
  const [mode, setMode] = useState<Mode>('choose');
  const [name, setName] = useState(state.playerName || '');
  const [roomInput, setRoomInput] = useState('');

  const inRoom = !!state.roomCode;
  const allReady = state.players.length >= 1 && state.players.every((p) => p.ready);

  const handleCreate = () => {
    if (!name.trim()) return;
    createRoom(name.trim());
  };

  const handleJoin = () => {
    if (!name.trim() || !roomInput.trim()) return;
    joinRoom(roomInput.trim(), name.trim());
  };

  return (
    <div className={styles.lobby}>
      {/* Background swimming turtles */}
      <div className={styles.bgTurtles}>
        {SPECIES_LIST.map((sp, i) => (
          <div
            key={sp}
            className={styles.bgTurtle}
            style={{
              animationDelay: `${i * 3.2}s`,
              top: `${12 + i * 17}%`,
            }}
          >
            <TurtleSVG species={sp} size={60 + i * 8} />
          </div>
        ))}
      </div>

      {/* Wave decoration at the bottom */}
      <div className={styles.waves}>
        <svg
          className={styles.waveSvg}
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            className={styles.wave1}
            d="M0,100 C360,180 720,20 1080,100 C1260,140 1380,80 1440,100 L1440,200 L0,200Z"
            fill="var(--ocean-mid)"
            opacity="0.4"
          />
          <path
            className={styles.wave2}
            d="M0,120 C320,60 640,180 960,100 C1120,60 1320,150 1440,120 L1440,200 L0,200Z"
            fill="var(--ocean-light)"
            opacity="0.3"
          />
          <path
            className={styles.wave3}
            d="M0,140 C240,180 480,100 720,150 C960,200 1200,110 1440,160 L1440,200 L0,200Z"
            fill="var(--ocean-surface)"
            opacity="0.2"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>
            <span className={styles.titleWave}>Sea Turtle Triage</span>
          </h1>
          <p className={styles.subtitle}>A multiplayer marine rescue challenge</p>
        </div>

        {!inRoom ? (
          /* === NOT IN A ROOM === */
          <div className={styles.card}>
            {mode === 'choose' && (
              <div className={styles.modeSelect}>
                <button className={styles.btnPrimary} onClick={() => setMode('create')}>
                  Create Room
                </button>
                <button className={styles.btnSecondary} onClick={() => setMode('join')}>
                  Join Room
                </button>
              </div>
            )}

            {mode === 'create' && (
              <div className={styles.form}>
                <button className={styles.backBtn} onClick={() => setMode('choose')}>
                  &larr; Back
                </button>
                <h2 className={styles.cardTitle}>Create a Room</h2>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Your name"
                  maxLength={20}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
                <button
                  className={styles.btnPrimary}
                  disabled={!name.trim()}
                  onClick={handleCreate}
                >
                  Create
                </button>
              </div>
            )}

            {mode === 'join' && (
              <div className={styles.form}>
                <button className={styles.backBtn} onClick={() => setMode('choose')}>
                  &larr; Back
                </button>
                <h2 className={styles.cardTitle}>Join a Room</h2>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Your name"
                  maxLength={20}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Room code"
                  maxLength={6}
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                />
                <button
                  className={styles.btnPrimary}
                  disabled={!name.trim() || !roomInput.trim()}
                  onClick={handleJoin}
                >
                  Join
                </button>
              </div>
            )}
          </div>
        ) : (
          /* === IN A ROOM === */
          <div className={styles.card}>
            <div className={styles.roomHeader}>
              <span className={styles.roomLabel}>Room Code</span>
              <span className={styles.roomCode}>{state.roomCode}</span>
            </div>

            <div className={styles.playerList}>
              <h3 className={styles.playerListTitle}>
                Players ({state.players.length})
              </h3>
              {state.players.map((p) => (
                <div key={p.id} className={styles.playerRow}>
                  <span className={styles.playerName}>
                    {p.name}
                    {p.id === state.players[0]?.id && (
                      <span className={styles.hostBadge}>HOST</span>
                    )}
                  </span>
                  <span
                    className={
                      p.ready ? styles.readyCheck : styles.readyCircle
                    }
                  >
                    {p.ready ? '\u2713' : '\u25CB'}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.roomActions}>
              <button className={styles.btnReady} onClick={toggleReady}>
                Toggle Ready
              </button>
              {state.isHost && (
                <button
                  className={styles.btnStart}
                  disabled={!allReady}
                  onClick={startGame}
                >
                  Start Game
                </button>
              )}
            </div>
          </div>
        )}

        {!state.connected && (
          <div className={styles.disconnected}>
            Connecting to server...
          </div>
        )}
      </div>
    </div>
  );
}
