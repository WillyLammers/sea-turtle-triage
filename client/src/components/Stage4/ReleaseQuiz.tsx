import React, { useState } from 'react';
import { TurtleSVG } from '../shared/TurtleSVG';
import type { ReleaseScenario } from '../../data/releaseQuiz';
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

interface ReleaseQuizProps {
  scenario: ReleaseScenario;
  onAnswer: (location: string, selectedChecklist: string[]) => void;
  result: ReleaseResult | null;
}

export function ReleaseQuiz({ scenario, onAnswer, result }: ReleaseQuizProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedChecklist, setSelectedChecklist] = useState<Set<string>>(new Set());
  const submitted = result !== null;

  const toggleChecklistItem = (id: string) => {
    if (submitted) return;
    setSelectedChecklist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (selectedLocation && selectedChecklist.size > 0 && !submitted) {
      onAnswer(selectedLocation, Array.from(selectedChecklist));
    }
  };

  const getLocationClass = (loc: string) => {
    if (!submitted) {
      return selectedLocation === loc ? styles.optionSelected : '';
    }
    if (loc === scenario.correctLocation) return styles.optionCorrect;
    if (loc === selectedLocation && !result?.correctLocation) return styles.optionWrong;
    return styles.optionDimmed;
  };

  const getChecklistClass = (itemId: string, itemCorrect: boolean) => {
    if (!submitted) {
      return selectedChecklist.has(itemId) ? styles.optionSelected : '';
    }
    // After submit
    const wasSelected = selectedChecklist.has(itemId);
    if (wasSelected && itemCorrect) return styles.optionCorrect;
    if (wasSelected && !itemCorrect) return styles.optionWrong;
    if (!wasSelected && !itemCorrect) return styles.optionDimmed;
    // Not selected but was correct — dim it
    return styles.optionDimmed;
  };

  const getChecklistPrefix = (itemId: string, itemCorrect: boolean) => {
    const wasSelected = selectedChecklist.has(itemId);
    if (!submitted) {
      return wasSelected ? '\u2713 ' : '';
    }
    // After submit: correct items get check, wrong get x
    if (wasSelected && itemCorrect) return '\u2713 ';
    if (wasSelected && !itemCorrect) return '\u2717 ';
    if (!wasSelected && itemCorrect) return '\u2713 ';
    return '\u2717 ';
  };

  return (
    <div className={styles.quizCard}>
      {/* Turtle Info */}
      <div className={styles.turtleInfo}>
        <div className={styles.turtleSvgWrapper}>
          <TurtleSVG species={scenario.species as 'Green' | 'Loggerhead' | 'Leatherback' | 'Hawksbill' | 'Kemps Ridley'} size={100} />
        </div>
        <div className={styles.turtleDetails}>
          <div className={styles.speciesName}>{scenario.species} Sea Turtle</div>
          <div className={styles.rehabSummary}>{scenario.rehabSummary}</div>
        </div>
      </div>

      {/* Selection Grids */}
      <div className={styles.selectionGrid}>
        {/* Release Location */}
        <div className={styles.selectionSection}>
          <div className={styles.selectionTitle}>Release Location</div>
          <div className={styles.optionGrid}>
            {scenario.locationOptions.map((loc) => (
              <button
                key={loc}
                className={`${styles.optionBtn} ${getLocationClass(loc)}`}
                onClick={() => !submitted && setSelectedLocation(loc)}
                disabled={submitted}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Pre-Release Checklist */}
        <div className={styles.selectionSection}>
          <div className={styles.selectionTitle}>Pre-Release Checklist</div>
          <div className={styles.optionGrid}>
            {scenario.checklistItems.map((item) => (
              <button
                key={item.id}
                className={`${styles.optionBtn} ${getChecklistClass(item.id, item.correct)}`}
                onClick={() => toggleChecklistItem(item.id)}
                disabled={submitted}
              >
                <span className={styles.checklistIcon}>
                  {getChecklistPrefix(item.id, item.correct)}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      {!submitted && (
        <div className={styles.confirmBtnWrapper}>
          <button
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={!selectedLocation || selectedChecklist.size === 0}
          >
            Confirm Release
          </button>
        </div>
      )}

      {/* Result / Educational Blurb */}
      {submitted && result && (
        <div className={styles.resultArea}>
          <div className={styles.resultSummary}>
            <span
              className={`${styles.resultBadge} ${
                result.correctLocation ? styles.resultBadgeCorrect : styles.resultBadgeWrong
              }`}
            >
              {result.correctLocation ? '\u2713' : '\u2717'} Location
            </span>
            <span
              className={`${styles.resultBadge} ${
                result.perfectChecklist ? styles.resultBadgeCorrect : styles.resultBadgeWrong
              }`}
            >
              {result.perfectChecklist ? '\u2713' : '\u2717'} Checklist ({result.checklistCorrect}/{result.checklistTotal})
            </span>
          </div>

          <div className={styles.resultPoints}>+{result.points} points</div>

          <div className={styles.infoBox}>
            <div className={styles.infoBoxLabel}>Did You Know?</div>
            <div className={styles.infoBoxText}>{result.educationalBlurb}</div>
          </div>
        </div>
      )}
    </div>
  );
}
