import React, { useEffect, useState, useRef } from 'react';
import styles from './Timer.module.css';

interface TimerProps {
  seconds: number;
  onComplete: () => void;
  paused?: boolean;
}

export function Timer({ seconds, onComplete, paused = false }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (paused || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          setTimeout(() => onCompleteRef.current(), 0);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, remaining <= 0]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = seconds > 0 ? remaining / seconds : 0;
  const offset = circumference * (1 - progress);
  const isUrgent = remaining <= 5 && remaining > 0;

  return (
    <div className={`${styles.timer} ${isUrgent ? styles.urgent : ''}`}>
      <svg className={styles.svg} viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--ocean-dark)"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={isUrgent ? 'var(--alert-red)' : 'var(--ocean-surface)'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          className={styles.progress}
        />
      </svg>
      <div className={`${styles.display} ${isUrgent ? styles.urgentText : ''}`}>
        {remaining}
      </div>
    </div>
  );
}
