import React from 'react';
import { TurtleSVG } from '../shared/TurtleSVG';
import type { StrandingCard } from '../../data/strandings';
import styles from './Stage2.module.css';

interface PatientCardProps {
  stranding: StrandingCard;
  onAnswer: (code: string) => void;
  result: { correct: boolean; points: number; correctAnswer: string } | null;
  timeLeft: number;
}

/** How many seconds each card gets — used to compute the timer-bar width. */
const CARD_SECONDS = 20;

export function PatientCard({ stranding, result, timeLeft }: PatientCardProps) {
  const pct = CARD_SECONDS > 0 ? Math.max((timeLeft / CARD_SECONDS) * 100, 0) : 0;
  const isUrgent = timeLeft <= 3 && timeLeft > 0;

  // Determine left-stripe class: red for CC3/CC4, orange otherwise
  const isHighUrgency =
    stranding.correctCode === 'CC3' || stranding.correctCode === 'CC4';

  const cardClasses = [
    styles.patientCard,
    isHighUrgency ? styles.stripeRed : styles.stripeOrange,
    result?.correct === true ? styles.cardCorrect : undefined,
    result?.correct === false ? styles.cardWrong : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} key={stranding.id}>
      {/* Timer row: bar + seconds counter */}
      <div className={styles.timerRow}>
        <div className={styles.timerTrack}>
          <div
            className={`${styles.timerBar} ${isUrgent ? styles.timerBarUrgent : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          className={`${styles.timerSeconds} ${isUrgent ? styles.timerSecondsUrgent : ''}`}
        >
          {timeLeft}s
        </span>
      </div>

      {/* Header */}
      <div className={styles.cardHeader}>
        <span className={styles.speciesName}>{stranding.species} Sea Turtle</span>
        <div className={styles.turtleIcon}>
          <TurtleSVG species={stranding.species} size={60} />
        </div>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        {/* Stats row */}
        <div className={styles.stats}>
          <span className={styles.stat}>
            <span className={styles.statLabel}>SCL:</span>
            {stranding.size} cm
          </span>
          <span className={styles.stat}>
            <span className={styles.statLabel}>Location:</span>
            {stranding.locationFound}
          </span>
        </div>

        {/* Injuries */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Injuries</div>
          {stranding.injuries}
        </div>

        {/* Condition — this is the key section for picking a rating */}
        <div className={`${styles.section} ${styles.sectionHighlight}`}>
          <div className={styles.sectionTitle}>Responsiveness &amp; Behavior</div>
          {stranding.condition}
        </div>
      </div>

      {/* Result overlay */}
      {result && (
        <div
          className={`${styles.resultOverlay} ${
            result.correct ? styles.resultCorrect : styles.resultWrong
          }`}
        >
          <div className={styles.resultLabel}>
            {result.correct ? 'Correct!' : 'Incorrect'}
            {result.points > 0 ? ` +${result.points} pts` : ''}
          </div>
          {!result.correct && (
            <div className={styles.correctAnswerHint}>
              Correct answer: {result.correctAnswer}
            </div>
          )}
          <div>{stranding.explanation}</div>
        </div>
      )}
    </div>
  );
}
