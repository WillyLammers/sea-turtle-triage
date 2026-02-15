import React, { useState, useCallback, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { socket } from '../../socket';
import { Timer } from '../shared/Timer';
import styles from './Emergency.module.css';

interface EmergencyResult {
  correct: boolean;
  points: number;
}

export function Emergency() {
  const { state, submitEmergencyResponse } = useGame();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<EmergencyResult | null>(null);

  const emergency = state.emergency;

  // Listen for emergency-result from server
  useEffect(() => {
    const handleResult = (data: { correct: boolean; points: number }) => {
      setResult(data);
    };

    socket.on('emergency-result', handleResult);
    return () => {
      socket.off('emergency-result', handleResult);
    };
  }, []);

  // Reset state when a new emergency comes in
  useEffect(() => {
    if (emergency) {
      setSelectedIdx(null);
      setSubmitted(false);
      setResult(null);
    }
  }, [emergency?.emergencyId]);

  if (!emergency) return null;

  const { emergencyId, scenario } = emergency;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelectedIdx(idx);
    setSubmitted(true);
    submitEmergencyResponse(emergencyId, scenario.options[idx]);
  };

  const handleTimeout = () => {
    if (submitted) return;
    setSubmitted(true);
    submitEmergencyResponse(emergencyId, '');
  };

  return (
    <div className={styles.overlay}>
      {/* Pulsing red border */}
      <div className={styles.borderPulse} />

      <div className={styles.container}>
        {/* Timer */}
        <div className={styles.timerWrap}>
          <Timer seconds={15} onComplete={handleTimeout} paused={submitted} />
        </div>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.alertIcon}>&#9888;</span>
          <h1 className={styles.alertTitle}>EMERGENCY ALERT</h1>
          <span className={styles.alertIcon}>&#9888;</span>
        </div>

        {/* Radio crackle visual */}
        <div className={styles.radioWaves}>
          <div className={styles.waveLine} />
          <div className={styles.waveLine} />
          <div className={styles.waveLine} />
          <div className={styles.waveLine} />
          <div className={styles.waveLine} />
        </div>

        {/* Scenario */}
        <p className={styles.scenario}>{scenario.description}</p>

        {/* Options */}
        <div className={styles.options}>
          {scenario.options.map((opt, i) => (
            <button
              key={i}
              className={`${styles.optionBtn} ${
                selectedIdx === i ? styles.selected : ''
              } ${submitted && selectedIdx !== i ? styles.dimmed : ''}`}
              onClick={() => handleSelect(i)}
              disabled={submitted}
            >
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className={styles.optionText}>{opt}</span>
            </button>
          ))}
        </div>

        {/* Result feedback */}
        {submitted && (
          <div className={result ? (result.correct ? styles.feedbackCorrect : styles.feedbackWrong) : styles.feedback}>
            {result ? (
              <>
                <div className={styles.feedbackResult}>
                  {result.correct ? '\u2713 Correct!' : '\u2717 Incorrect'}
                </div>
                <div className={styles.feedbackPoints}>
                  {result.correct ? `+${result.points} pts` : `${result.points} pts`}
                </div>
              </>
            ) : selectedIdx !== null ? (
              'Response submitted! Waiting for results...'
            ) : (
              'Time ran out! No response submitted.'
            )}
          </div>
        )}
      </div>
    </div>
  );
}
