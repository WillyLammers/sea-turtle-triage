import React from 'react';
import type { ConditionCode } from '../../data/strandings';
import styles from './Stage2.module.css';

interface ConditionSlotsProps {
  onSelect: (code: string) => void;
  disabled: boolean;
  selectedCode: string | null;
  correctCode: string | null;
}

interface SlotDef {
  code: ConditionCode;
  label: string;
  description: string;
  colorClass: string;
  icon: React.ReactNode;
}

/** Simple inline SVG icons for each condition code. */
function SkullIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
      <path d="M12 2a8 8 0 0 0-8 8c0 3.5 2 6 4 7.5V20h8v-2.5c2-1.5 4-4 4-7.5a8 8 0 0 0-8-8z" />
      <line x1="10" y1="20" x2="10" y2="23" />
      <line x1="14" y1="20" x2="14" y2="23" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function HeartHalfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      <clipPath id="half"><rect x="0" y="0" width="12" height="24" /></clipPath>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" clipPath="url(#half)" />
    </svg>
  );
}

function HeartCrackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      <path d="M12 6l-2 4h4l-2 4" strokeWidth="1.5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

const SLOTS: SlotDef[] = [
  { code: 'CC0', label: 'Dead',     description: 'No pulse or reflexes',      colorClass: 'slotCC0', icon: <SkullIcon /> },
  { code: 'CC1', label: 'Good',     description: 'Alert and strong',          colorClass: 'slotCC1', icon: <HeartIcon /> },
  { code: 'CC2', label: 'Fair',     description: 'Alive but struggling',      colorClass: 'slotCC2', icon: <HeartHalfIcon /> },
  { code: 'CC3', label: 'Poor',     description: 'Barely alive, very weak',   colorClass: 'slotCC3', icon: <HeartCrackIcon /> },
  { code: 'CC4', label: 'Critical', description: 'Near death, needs emergency care', colorClass: 'slotCC4', icon: <AlertIcon /> },
];

export function ConditionSlots({
  onSelect,
  disabled,
  selectedCode,
  correctCode,
}: ConditionSlotsProps) {
  return (
    <div className={styles.slotsOuter}>
      <div className={styles.slotsLabel}>How is this turtle doing?</div>
      <div className={styles.slotsContainer}>
      {SLOTS.map((slot) => {
        const isSelected = selectedCode === slot.code;
        const isCorrectSlot = correctCode === slot.code;
        const wasWrongChoice = correctCode !== null && selectedCode === slot.code && !isCorrectSlot;

        const btnClasses = [
          styles.slotBtn,
          (styles as Record<string, string>)[slot.colorClass],
          isSelected && !correctCode ? styles.slotSelected : undefined,
          correctCode && isCorrectSlot ? styles.slotCorrectReveal : undefined,
          correctCode && wasWrongChoice ? styles.slotWrongReveal : undefined,
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={slot.code}
            className={btnClasses}
            disabled={disabled}
            onClick={() => onSelect(slot.code)}
          >
            <span className={styles.slotIcon}>{slot.icon}</span>
            <span className={styles.slotMainLabel}>{slot.label}</span>
            <span className={styles.slotHint}>{slot.description}</span>
            <span className={styles.slotCode}>{slot.code}</span>

            {/* Check / X badges on reveal */}
            {correctCode && isCorrectSlot && (
              <span className={styles.checkmark} aria-label="correct">
                &#10003;
              </span>
            )}
            {correctCode && wasWrongChoice && (
              <span className={styles.xmark} aria-label="wrong">
                &#10007;
              </span>
            )}
          </button>
        );
      })}
      </div>
    </div>
  );
}
