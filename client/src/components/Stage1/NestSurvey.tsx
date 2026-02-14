import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { socket } from '../../socket';
import { NEST_SCENARIOS } from '../../data/nests';
import type { NestScenario } from '../../data/nests';
import { BeachScene } from './BeachScene';
import { Flashlight } from './Flashlight';
import { NestCard } from './NestCard';
import { NestIllustration } from './NestIllustration';
import styles from './Stage1.module.css';

function randomNestPosition(seed: number): { x: number; y: number } {
  const hash = ((seed * 2654435761) >>> 0) / 4294967296;
  const hash2 = (((seed + 7) * 2654435761) >>> 0) / 4294967296;
  return {
    x: 15 + hash * 70,
    y: 72 + hash2 * 16,
  };
}

const NESTS = NEST_SCENARIOS;

interface AnswerResult {
  correct: boolean;
  points: number;
  correctAnswer: string;
}

type Phase = 'intro' | 'searching' | 'answering' | 'result' | 'complete';

export function NestSurvey() {
  const { submitAnswer, completeStage } = useGame();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('intro');
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [localScore, setLocalScore] = useState(0);
  const [nestFound, setNestFound] = useState(false);

  const revealTimestamp = useRef<number>(0);

  const nest: NestScenario | undefined = NESTS[currentIndex];
  const isNight = nest?.timeOfDay === 'night';
  const totalNests = NESTS.length;

  // ---- Socket listener for answer-result ----
  useEffect(() => {
    const handleResult = (data: { correct: boolean; points: number; speedBonus: number; correctAnswer: string }) => {
      const answerResult: AnswerResult = {
        correct: data.correct,
        points: data.points + (data.speedBonus || 0),
        correctAnswer: data.correctAnswer,
      };
      setResult(answerResult);
      setPhase('result');
      setLocalScore((prev) => prev + answerResult.points);
    };

    socket.on('answer-result', handleResult);
    return () => {
      socket.off('answer-result', handleResult);
    };
  }, []);

  // ---- Start the stage ----
  const handleStart = useCallback(() => {
    if (!nest) return;
    if (isNight) {
      setPhase('searching');
    } else {
      setPhase('answering');
      revealTimestamp.current = Date.now();
    }
  }, [nest, isNight]);

  // ---- Flashlight found the nest ----
  const handleFoundNest = useCallback(() => {
    setNestFound(true);
    // Keep the flashlight overlay visible so the "Nest Found!" message shows,
    // then transition to the answering phase after a brief pause.
    setTimeout(() => {
      setPhase('answering');
      revealTimestamp.current = Date.now();
    }, 1200);
  }, []);

  // ---- Player selects an answer ----
  const handleAnswer = useCallback(
    (answer: string) => {
      if (!nest || phase !== 'answering') return;
      submitAnswer(1, nest.id, answer);
    },
    [nest, phase, submitAnswer],
  );

  // ---- Player clicks "Next" to advance ----
  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalNests) {
      setPhase('complete');
      completeStage(1);
    } else {
      setCurrentIndex(nextIndex);
      setResult(null);
      setNestFound(false);
      const nextNest = NESTS[nextIndex];
      if (nextNest.timeOfDay === 'night') {
        setPhase('searching');
      } else {
        setPhase('answering');
        revealTimestamp.current = Date.now();
      }
    }
  }, [currentIndex, totalNests, completeStage]);

  // ---- Render Intro ----
  if (phase === 'intro') {
    return (
      <div className={styles.stageContainer}>
        <BeachScene timeOfDay="morning">
          <div className={styles.stageIntro}>
            <div className={styles.stageIntroIcon}>🔦🐢</div>
            <div className={styles.stageIntroTitle}>Stage 1: Nest Identification</div>
            <div className={styles.stageIntroSubtitle}>
              Survey the beach and identify sea turtle nests. Examine visual clues to classify each
              nest site correctly. Night surveys require your flashlight!
            </div>
            <button className={styles.stageIntroStart} onClick={handleStart}>
              Begin Survey
            </button>
          </div>
        </BeachScene>
      </div>
    );
  }

  // ---- Render Complete ----
  if (phase === 'complete' || !nest) {
    return (
      <div className={styles.stageContainer}>
        <BeachScene timeOfDay="morning">
          <div className={styles.waitingMessage}>
            <div className={styles.waitingIcon}>🏖️</div>
            <div className={styles.waitingText}>Survey Complete!</div>
            <div className={styles.waitingScore}>Score: {localScore} pts</div>
            <div className={styles.waitingSub}>
              Waiting for other players...
            </div>
          </div>
        </BeachScene>
      </div>
    );
  }

  const nestPos = randomNestPosition(currentIndex + 1);
  const progressPct = ((currentIndex + (phase === 'result' ? 1 : 0)) / totalNests) * 100;

  return (
    <div className={styles.stageContainer}>
      <BeachScene timeOfDay={nest.timeOfDay}>
        {/* Top bar: progress + score */}
        <div className={styles.topBar}>
          <div className={styles.progressLabel}>
            {currentIndex + 1}/{totalNests}
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreIcon}>⭐</span> {localScore} pts
          </div>
        </div>

        {/* Nest illustration on the sand */}
        {(phase === 'answering' || phase === 'result') && (
          <NestIllustration
            correctAnswer={nest.correctAnswer}
            nestIndex={currentIndex}
          />
        )}

        {/* Night searching phase: flashlight overlay */}
        {isNight && phase === 'searching' && (
          <Flashlight
            active={true}
            onFoundNest={handleFoundNest}
            nestPosition={nestPos}
          />
        )}

        {/* Show NestCard when answering or showing result */}
        {(phase === 'answering' || phase === 'result') && (
          <NestCard
            nest={nest}
            onAnswer={handleAnswer}
            result={result}
            nestNumber={currentIndex + 1}
            totalNests={totalNests}
            onNext={phase === 'result' ? handleNext : undefined}
          />
        )}
      </BeachScene>
    </div>
  );
}
