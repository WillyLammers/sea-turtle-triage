import React, { useState, useCallback, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { RELEASE_SCENARIOS } from '../../data/releaseQuiz';
import type { ReleaseScenario } from '../../data/releaseQuiz';
import { Timer } from '../shared/Timer';
import { ProgressBar } from '../shared/ProgressBar';
import { ReleaseQuiz } from './ReleaseQuiz';
import styles from './Stage4.module.css';

interface ReleaseResult {
  correctLocation: boolean;
  checklistCorrect: number;
  checklistWrong: number;
  checklistTotal: number;
  perfectChecklist: boolean;
  points: number;
  educationalBlurb: string;
}

export function Release() {
  const { submitAnswer, completeStage } = useGame();
  const [phase, setPhase] = useState<'intro' | 'playing'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<ReleaseResult | null>(null);
  const [completed, setCompleted] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);

  const scenarios: ReleaseScenario[] = RELEASE_SCENARIOS;
  const scenario = scenarios[currentIndex];
  const total = scenarios.length;
  const scenarioStartTime = useRef(Date.now());

  const handleAnswer = useCallback(
    (location: string, selectedChecklist: string[]) => {
      const correctLoc = location === scenario.correctLocation;

      // Checklist scoring
      const correctItemIds = new Set(
        scenario.checklistItems.filter((item) => item.correct).map((item) => item.id),
      );
      const selectedSet = new Set(selectedChecklist);

      let checklistCorrect = 0;
      let checklistWrong = 0;

      for (const id of selectedSet) {
        if (correctItemIds.has(id)) {
          checklistCorrect++;
        } else {
          checklistWrong++;
        }
      }

      const perfectChecklist = checklistCorrect === correctItemIds.size && checklistWrong === 0;

      // Points: location = 100, each correct checklist = 25, each wrong = -15, perfect bonus = 50
      let points = 0;
      if (correctLoc) points += 100;
      points += checklistCorrect * 25;
      points += checklistWrong * -15;
      if (perfectChecklist) points += 50;

      setResult({
        correctLocation: correctLoc,
        checklistCorrect,
        checklistWrong,
        checklistTotal: correctItemIds.size,
        perfectChecklist,
        points,
        educationalBlurb: scenario.educationalBlurb,
      });
      setScore((prev) => prev + points);
      setTimerPaused(true);

      // Submit combined answer to server: "location|id1,id2,id3"
      const answer = `${location}|${selectedChecklist.join(',')}`;
      submitAnswer(3, scenario.id, answer, scenarioStartTime.current);

      // Advance after delay
      setTimeout(() => {
        if (currentIndex < total - 1) {
          setCurrentIndex((prev) => prev + 1);
          setResult(null);
          setTimerPaused(false);
          scenarioStartTime.current = Date.now();
        } else {
          setCompleted(true);
          completeStage(3);
        }
      }, 3500);
    },
    [scenario, currentIndex, total, submitAnswer, completeStage],
  );

  const handleTimeUp = useCallback(() => {
    if (!completed) {
      setCompleted(true);
      completeStage(3);
    }
  }, [completed, completeStage]);

  // Intro screen
  if (phase === 'intro') {
    return (
      <div className={styles.releaseScene}>
        <div className={styles.sunsetSky} />
        <div className={styles.sunDisc} />
        <div className={styles.horizonGlow} />
        <div className={styles.sunsetOcean} />
        <div className={styles.waterReflection} />
        <div className={styles.sunsetSand} />

        <div className={styles.releaseIntroOverlay}>
          <div className={styles.releaseIntroIcon}>{'\u{1F3D6}\uFE0F\u{1F422}'}</div>
          <div className={styles.releaseIntroTitle}>Stage 3: Release Day</div>
          <p className={styles.releaseIntroDesc}>
            Your rehabilitated turtles are ready to return to the ocean. Choose the best release
            location and verify the pre-release checklist for each species based on their biology
            and habitat needs.
          </p>
          <div className={styles.releaseIntroStats}>
            <span className={styles.releaseIntroChip}>{total} turtles to release</span>
            <span className={styles.releaseIntroChip}>120s time limit</span>
          </div>
          <button className={styles.releaseIntroBtn} onClick={() => setPhase('playing')}>
            Begin Release
          </button>
        </div>
      </div>
    );
  }

  // Completed state
  if (completed) {
    return (
      <div className={styles.releaseScene}>
        {/* Background */}
        <div className={styles.sunsetSky} />
        <div className={styles.sunDisc} />
        <div className={styles.horizonGlow} />
        <div className={styles.sunsetOcean} />
        <div className={styles.waterReflection} />
        <div className={styles.sunsetSand} />

        <div className={styles.waitingMessage}>
          <div className={styles.turtleReleasedIcon}>
            {'\u{1F422}'}
          </div>
          <div className={styles.waitingText}>All turtles released!</div>
          <div className={styles.waitingScore}>Score: {score}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.releaseScene}>
      {/* Sunset Beach Background */}
      <div className={styles.sunsetSky} />
      <div className={styles.sunDisc} />
      <div className={styles.horizonGlow} />

      {/* Waves */}
      <div className={styles.sunsetWaves}>
        <div className={`${styles.sunsetWave} ${styles.sunsetWave1}`}>
          <svg viewBox="0 0 1200 30" preserveAspectRatio="none">
            <path
              d="M0 15 Q150 0 300 15 Q450 30 600 15 Q750 0 900 15 Q1050 30 1200 15 L1200 30 L0 30Z"
              fill="#1a3a5c"
              opacity="0.6"
            />
          </svg>
          <svg viewBox="0 0 1200 30" preserveAspectRatio="none" style={{ left: '50%' }}>
            <path
              d="M0 15 Q150 0 300 15 Q450 30 600 15 Q750 0 900 15 Q1050 30 1200 15 L1200 30 L0 30Z"
              fill="#1a3a5c"
              opacity="0.6"
            />
          </svg>
        </div>
        <div className={`${styles.sunsetWave} ${styles.sunsetWave2}`}>
          <svg viewBox="0 0 1200 30" preserveAspectRatio="none">
            <path
              d="M0 18 Q150 5 300 18 Q450 30 600 18 Q750 5 900 18 Q1050 30 1200 18 L1200 30 L0 30Z"
              fill="#0f2847"
              opacity="0.5"
            />
          </svg>
          <svg viewBox="0 0 1200 30" preserveAspectRatio="none" style={{ left: '50%' }}>
            <path
              d="M0 18 Q150 5 300 18 Q450 30 600 18 Q750 5 900 18 Q1050 30 1200 18 L1200 30 L0 30Z"
              fill="#0f2847"
              opacity="0.5"
            />
          </svg>
        </div>
      </div>

      <div className={styles.sunsetOcean} />
      <div className={styles.waterReflection} />
      <div className={styles.sunsetSand} />

      {/* Content */}
      <div className={styles.releaseContent}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.timerWrapper}>
            <Timer seconds={120} onComplete={handleTimeUp} paused={timerPaused} />
          </div>
          <div className={styles.progressWrapper}>
            <ProgressBar
              current={currentIndex + (result ? 1 : 0)}
              total={total}
              label="Releases"
            />
          </div>
          <div className={styles.scoreDisplay}>{score} pts</div>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>RELEASE DAY</div>
          <div className={styles.headerSubtitle}>
            Choose the right location and verify the pre-release checklist
          </div>
        </div>

        {/* Quiz Card */}
        <div className={styles.quizContainer}>
          <ReleaseQuiz
            key={scenario.id}
            scenario={scenario}
            onAnswer={handleAnswer}
            result={result}
          />
        </div>
      </div>
    </div>
  );
}
