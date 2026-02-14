import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { socket } from '../../socket';
import { STRANDING_CARDS, CONDITION_CODE_LABELS } from '../../data/strandings';
import type { ConditionCode } from '../../data/strandings';
import { ProgressBar } from '../shared/ProgressBar';
import { PatientCard } from './PatientCard';
import { ConditionSlots } from './ConditionSlots';
import styles from './Stage2.module.css';

const SECONDS_PER_CARD = 12;
const RESULT_DISPLAY_MS = 1500;
const TRANSITION_MS = 500;

export function SurgeTriage() {
  const { submitAnswer, completeStage } = useGame();

  // Queue of stranding cards (shuffled once on mount)
  const [cards] = useState(() => [...STRANDING_CARDS].sort(() => Math.random() - 0.5));
  const totalCards = cards.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_CARD);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [result, setResult] = useState<{
    correct: boolean;
    points: number;
    correctAnswer: string;
  } | null>(null);
  const [streak, setStreak] = useState(0);
  const [localScore, setLocalScore] = useState(0);
  const [showTimesUp, setShowTimesUp] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [finished, setFinished] = useState(false);

  // Refs to avoid stale closures in timers
  const resultRef = useRef(result);
  resultRef.current = result;
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  // ------------------------------------------------------------------
  // Countdown timer
  // ------------------------------------------------------------------
  useEffect(() => {
    if (result !== null || transitioning || finished) return;

    if (timeLeft <= 0) {
      // Time expired — auto-advance with 0 points
      handleTimeUp();
      return;
    }

    const id = setInterval(() => {
      setTimeLeft((t) => Math.max(t - 1, 0));
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, result, transitioning, finished]);

  // ------------------------------------------------------------------
  // Listen for answer-result from server
  // ------------------------------------------------------------------
  useEffect(() => {
    function onAnswerResult(data: {
      correct: boolean;
      points: number;
      speedBonus: number;
      streakBonus: number;
      correctAnswer: string;
    }) {
      const totalPts = data.points + (data.speedBonus || 0) + (data.streakBonus || 0);

      setResult({
        correct: data.correct,
        points: totalPts,
        correctAnswer: data.correctAnswer,
      });

      if (data.correct) {
        setStreak((s) => s + 1);
        setLocalScore((s) => s + totalPts);
      } else {
        setStreak(0);
      }

      // After displaying result, advance to next card
      setTimeout(() => {
        advanceCard();
      }, RESULT_DISPLAY_MS);
    }

    socket.on('answer-result', onAnswerResult);
    return () => {
      socket.off('answer-result', onAnswerResult);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------
  // Handle player selecting a code
  // ------------------------------------------------------------------
  const handleSelect = useCallback(
    (code: string) => {
      if (result !== null || transitioning || finished) return;

      setSelectedCode(code);

      const card = cards[currentIndexRef.current];
      if (card) {
        submitAnswer(2, card.id, code);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cards, finished, result, transitioning, submitAnswer],
  );

  // ------------------------------------------------------------------
  // Time expired handler
  // ------------------------------------------------------------------
  const handleTimeUp = useCallback(() => {
    if (resultRef.current !== null) return;

    setShowTimesUp(true);
    setStreak(0);

    // Treat as a wrong/missed answer
    const card = cards[currentIndexRef.current];
    const correctLabel =
      card
        ? `${card.correctCode} (${CONDITION_CODE_LABELS[card.correctCode]})`
        : '';

    setResult({
      correct: false,
      points: 0,
      correctAnswer: correctLabel,
    });

    // Still submit so the server records the miss
    if (card) {
      submitAnswer(2, card.id, '__timeout__');
    }

    setTimeout(() => {
      setShowTimesUp(false);
      advanceCard();
    }, RESULT_DISPLAY_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, submitAnswer]);

  // ------------------------------------------------------------------
  // Advance to the next card (or finish)
  // ------------------------------------------------------------------
  const advanceCard = useCallback(() => {
    setTransitioning(true);

    setTimeout(() => {
      const nextIdx = currentIndexRef.current + 1;

      if (nextIdx >= totalCards) {
        setFinished(true);
        setTransitioning(false);
        completeStage(2);
        return;
      }

      setCurrentIndex(nextIdx);
      setTimeLeft(SECONDS_PER_CARD);
      setSelectedCode(null);
      setResult(null);
      setTransitioning(false);
    }, TRANSITION_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCards, completeStage]);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  const currentCard = cards[currentIndex];
  const slotsDisabled = result !== null || transitioning || finished;
  const revealCorrectCode: string | null =
    result !== null ? currentCard.correctCode : null;

  return (
    <div className={styles.scene}>
      {/* Animated rain */}
      <div className={styles.rain} />

      {/* Top bar: progress + score */}
      <div className={styles.topBar}>
        <div className={styles.progressWrap}>
          <ProgressBar
            current={Math.min(currentIndex + (result ? 1 : 0), totalCards)}
            total={totalCards}
            label="Patients"
          />
        </div>
        <span className={styles.scoreDisplay}>{localScore} pts</span>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Stranding Surge</h2>
        <p className={styles.subtitle}>Read each report, then assign a condition code below</p>
      </div>

      {/* Streak counter */}
      <div className={styles.streakWrap}>
        {streak > 0 && (
          <span className={`${styles.streak} ${streak >= 3 ? styles.streakFire : ''}`}>
            Streak: {streak}x {streak >= 3 ? '\uD83D\uDD25' : ''}
          </span>
        )}
      </div>

      {/* Card + buttons grouped together */}
      <div className={styles.gameArea}>
        <div className={styles.cardArea}>
          {!finished && currentCard && (
            <PatientCard
              key={currentCard.id}
              stranding={currentCard}
              onAnswer={handleSelect}
              result={result}
              timeLeft={timeLeft}
            />
          )}

          {finished && (
            <div style={{ textAlign: 'center', color: 'var(--white)' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Triage Complete</h3>
              <p>
                You scored <strong>{localScore}</strong> points across{' '}
                {totalCards} patients.
              </p>
            </div>
          )}

          {/* TIME'S UP flash */}
          {showTimesUp && (
            <div className={styles.timesUp}>
              <span className={styles.timesUpText}>TIME&rsquo;S UP</span>
            </div>
          )}
        </div>

        {/* Condition code buttons */}
        {!finished && (
          <ConditionSlots
            onSelect={handleSelect}
            disabled={slotsDisabled}
            selectedCode={selectedCode}
            correctCode={revealCorrectCode}
          />
        )}
      </div>
    </div>
  );
}
