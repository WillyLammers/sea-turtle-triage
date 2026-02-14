import React, { useEffect, useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { TurtleSVG } from '../shared/TurtleSVG';
import styles from './Results.module.css';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Animated counter that counts from 0 to `target` over `duration` ms. */
function useCountUp(target: number, duration = 1500): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/** Generate bioluminescent particles. */
function makeParticles(count: number) {
  const particles = [];
  const glowClasses = [
    styles.particleGlow1,
    styles.particleGlow2,
    styles.particleGlow3,
    styles.particleGlow4,
  ];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${6 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 8}s`,
      glowClass: glowClasses[i % glowClasses.length],
    });
  }
  return particles;
}

/** Generate confetti pieces. */
function makeConfetti(count: number) {
  const colors = ['#ffd700', '#ff6b6b', '#4fb3d9', '#06d6a0', '#ffa07a', '#a8e6f0', '#ffd93d'];
  const pieces = [];
  for (let i = 0; i < count; i++) {
    pieces.push({
      id: i,
      left: `${Math.random() * 100}%`,
      background: colors[i % colors.length],
      animationDuration: `${3 + Math.random() * 4}s`,
      animationDelay: `${Math.random() * 5}s`,
      width: `${5 + Math.random() * 6}px`,
      height: `${8 + Math.random() * 10}px`,
    });
  }
  return pieces;
}

const STAGE_LABELS = ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Emergency'];
const STAGE_KEYS = ['stage1', 'stage2', 'stage3', 'stage4', 'emergency'];
const BAR_CLASSES = [
  styles.miniBarStage1,
  styles.miniBarStage2,
  styles.miniBarStage3,
  styles.miniBarStage4,
  styles.miniBarEmergency,
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function Results() {
  const { state, dispatch } = useGame();
  const finalResults = state.finalResults;
  const rankings = finalResults?.rankings ?? state.rankings;
  const topScorer = finalResults?.topScorer ?? (rankings.length > 0 ? rankings[0] : null);

  // Memoize visual elements so they stay stable across re-renders
  const particles = useMemo(() => makeParticles(40), []);
  const confetti = useMemo(() => makeConfetti(50), []);

  // Animated winner score
  const winnerScoreAnimated = useCountUp(topScorer?.total ?? 0, 2000);

  // Calculate max stage score across all players for bar chart scaling
  const maxStageScore = useMemo(() => {
    let max = 1;
    for (const r of rankings) {
      for (const key of STAGE_KEYS) {
        const val = (r.scores as Record<string, number>)[key] ?? 0;
        if (val > max) max = val;
      }
    }
    return max;
  }, [rankings]);

  // Fun stats
  const funStats = useMemo(() => {
    if (rankings.length === 0) return [];

    const stats: Array<{ icon: string; label: string; value: string }> = [];

    // Most Emergency Points
    let bestEmergency = rankings[0];
    for (const r of rankings) {
      if ((r.scores.emergency ?? 0) > (bestEmergency.scores.emergency ?? 0)) {
        bestEmergency = r;
      }
    }
    if ((bestEmergency.scores.emergency ?? 0) > 0) {
      stats.push({
        icon: '\u{1F6A8}',
        label: 'Emergency Expert',
        value: bestEmergency.name,
      });
    }

    // Best Stage 1 (Nest ID)
    let bestS1 = rankings[0];
    for (const r of rankings) {
      if ((r.scores.stage1 ?? 0) > (bestS1.scores.stage1 ?? 0)) bestS1 = r;
    }
    if ((bestS1.scores.stage1 ?? 0) > 0) {
      stats.push({
        icon: '\u{1F95A}',
        label: 'Nest Spotter',
        value: bestS1.name,
      });
    }

    // Best Stage 3 (Release)
    let bestS3 = rankings[0];
    for (const r of rankings) {
      if ((r.scores.stage3 ?? 0) > (bestS3.scores.stage3 ?? 0)) bestS3 = r;
    }
    if ((bestS3.scores.stage3 ?? 0) > 0) {
      stats.push({
        icon: '\u{1F422}',
        label: 'Release Master',
        value: bestS3.name,
      });
    }

    // Most consistent (smallest range between stage scores)
    if (rankings.length > 1) {
      let mostConsistent = rankings[0];
      let smallestRange = Infinity;
      for (const r of rankings) {
        const stageScores = STAGE_KEYS.map((k) => (r.scores as Record<string, number>)[k] ?? 0);
        const range = Math.max(...stageScores) - Math.min(...stageScores);
        if (range < smallestRange) {
          smallestRange = range;
          mostConsistent = r;
        }
      }
      stats.push({
        icon: '\u{2696}\uFE0F',
        label: 'Most Consistent',
        value: mostConsistent.name,
      });
    }

    // Highest single-stage score
    let highStageName = '';
    let highStagePlayer = '';
    let highStageVal = 0;
    for (const r of rankings) {
      for (let i = 0; i < STAGE_KEYS.length; i++) {
        const val = (r.scores as Record<string, number>)[STAGE_KEYS[i]] ?? 0;
        if (val > highStageVal) {
          highStageVal = val;
          highStagePlayer = r.name;
          highStageName = STAGE_LABELS[i];
        }
      }
    }
    if (highStageVal > 0) {
      stats.push({
        icon: '\u{1F31F}',
        label: `Best in ${highStageName}`,
        value: `${highStagePlayer} (${highStageVal})`,
      });
    }

    return stats;
  }, [rankings]);

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <div className={styles.resultsScene}>
      {/* Bioluminescent particles */}
      <div className={styles.particles}>
        {particles.map((p) => (
          <div
            key={p.id}
            className={`${styles.particle} ${p.glowClass}`}
            style={{
              left: p.left,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Confetti */}
      <div className={styles.confetti}>
        {confetti.map((c) => (
          <div
            key={c.id}
            className={styles.confettiPiece}
            style={{
              left: c.left,
              background: c.background,
              animationDuration: c.animationDuration,
              animationDelay: c.animationDelay,
              width: c.width,
              height: c.height,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.missionHeader}>
          <div className={styles.missionTitle}>MISSION COMPLETE</div>
          <div className={styles.missionSubtitle}>
            Every turtle counts. Here is how your team performed.
          </div>
        </div>

        {/* Winner Announcement */}
        {topScorer && (
          <div className={styles.winnerCard}>
            <span className={styles.crownIcon}>{'\u{1F451}'}</span>
            <div className={styles.winnerTurtle}>
              <TurtleSVG species="Green" size={80} />
            </div>
            <div className={styles.winnerLabel}>Top Rescuer</div>
            <div className={styles.winnerName}>{topScorer.name}</div>
            <div className={styles.winnerScore}>
              <span className={styles.scoreCounter}>{winnerScoreAnimated}</span> points
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className={styles.leaderboard}>
          <div className={styles.leaderboardTitle}>Final Standings</div>
          <table className={styles.leaderboardTable}>
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.tableHeaderRank}>#</th>
                <th className={styles.tableHeaderName}>Player</th>
                <th className={styles.tableHeaderScore}>Total</th>
                {STAGE_LABELS.map((label) => (
                  <th key={label} className={`${styles.tableHeaderStage} ${styles.stageScoreCell}`}>
                    {label}
                  </th>
                ))}
                <th className={styles.barChartCell}>Breakdown</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((player, idx) => (
                <PlayerRow
                  key={player.id}
                  player={player}
                  rank={idx + 1}
                  maxStageScore={maxStageScore}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Fun Stats */}
        {funStats.length > 0 && (
          <div className={styles.funStats}>
            <div className={styles.funStatsTitle}>Fun Stats</div>
            <div className={styles.funStatsGrid}>
              {funStats.map((stat, idx) => (
                <div key={idx} className={styles.funStatCard}>
                  <div className={styles.funStatIcon}>{stat.icon}</div>
                  <div className={styles.funStatLabel}>{stat.label}</div>
                  <div className={styles.funStatValue}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Play Again */}
        <div className={styles.playAgainWrapper}>
          <button className={styles.playAgainBtn} onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Player Row Sub-component                                          */
/* ------------------------------------------------------------------ */

interface PlayerRowProps {
  player: { id: string; name: string; total: number; scores: Record<string, number> };
  rank: number;
  maxStageScore: number;
}

function PlayerRow({ player, rank, maxStageScore }: PlayerRowProps) {
  const animatedTotal = useCountUp(player.total, 1800 + rank * 200);

  const medalClass =
    rank === 1
      ? styles.medalGold
      : rank === 2
        ? styles.medalSilver
        : rank === 3
          ? styles.medalBronze
          : null;

  return (
    <tr className={`${styles.playerRow} ${rank <= 3 ? styles.playerRowTop3 : ''}`}>
      <td>
        <div className={styles.rankCell}>
          {medalClass ? (
            <span className={`${styles.medal} ${medalClass}`}>{rank}</span>
          ) : (
            <span className={styles.rankNumber}>{rank}</span>
          )}
        </div>
      </td>
      <td className={styles.nameCell}>{player.name}</td>
      <td className={styles.totalScore}>
        <span className={styles.scoreCounter}>{animatedTotal}</span>
      </td>
      {STAGE_KEYS.map((key) => (
        <td key={key} className={`${styles.stageScore} ${styles.stageScoreCell}`}>
          {player.scores[key] ?? 0}
        </td>
      ))}
      <td className={styles.barChartCell}>
        <div className={styles.miniBarChart}>
          {STAGE_KEYS.map((key, i) => {
            const val = player.scores[key] ?? 0;
            const height = maxStageScore > 0 ? Math.max((val / maxStageScore) * 24, 2) : 2;
            return (
              <div
                key={key}
                className={`${styles.miniBar} ${BAR_CLASSES[i]}`}
                style={{ height: `${height}px` }}
                title={`${STAGE_LABELS[i]}: ${val}`}
              />
            );
          })}
        </div>
      </td>
    </tr>
  );
}
