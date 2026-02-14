import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import styles from './Leaderboard.module.css';

export function Leaderboard() {
  const { state } = useGame();
  const [collapsed, setCollapsed] = useState(false);
  const showOverlay = state.stageResults !== null;

  return (
    <>
      {/* Full-screen overlay between stages */}
      {showOverlay && (
        <div className={styles.overlay}>
          <div className={styles.overlayCard}>
            <h2 className={styles.overlayTitle}>Stage Results</h2>

            <div className={styles.stageBreakdown}>
              {state.stageResults!.map((r, i) => (
                <div key={i} className={styles.stageRow}>
                  <span className={styles.stageRank}>#{i + 1}</span>
                  <span className={styles.stageName}>{r.name}</span>
                  <AnimatedNumber value={r.stageScore} />
                </div>
              ))}
            </div>

            <h3 className={styles.overallHeading}>Overall Standings</h3>
            <div className={styles.overallList}>
              {state.rankings.map((r, i) => (
                <div
                  key={r.id}
                  className={`${styles.overallRow} ${
                    r.name === state.playerName ? styles.overallHighlight : ''
                  }`}
                >
                  <span className={styles.overallRank}>#{i + 1}</span>
                  <span className={styles.overallName}>{r.name}</span>
                  <AnimatedNumber value={r.total} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar leaderboard */}
      <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <button
          className={styles.tab}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand leaderboard' : 'Collapse leaderboard'}
        >
          <span className={styles.tabIcon}>{collapsed ? '\u25C0' : '\u25B6'}</span>
          {collapsed && <span className={styles.tabLabel}>Scores</span>}
        </button>

        <div className={styles.sidebarContent}>
          <h3 className={styles.sidebarTitle}>Leaderboard</h3>
          <div className={styles.rankings}>
            {state.rankings.map((r, i) => (
              <div
                key={r.id}
                className={`${styles.rankRow} ${
                  r.name === state.playerName ? styles.highlight : ''
                }`}
              >
                <span className={styles.rank}>
                  {i === 0 ? '\uD83E\uDD47' : i === 1 ? '\uD83E\uDD48' : i === 2 ? '\uD83E\uDD49' : `#${i + 1}`}
                </span>
                <span className={styles.name}>{r.name}</span>
                <AnimatedNumber value={r.total} />
              </div>
            ))}
            {state.rankings.length === 0 && (
              <p className={styles.empty}>No scores yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* Animated number sub-component */
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (from === to) return;

    const duration = 600;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value]);

  return <span className={styles.score}>{display}</span>;
}
