import React, { useState } from 'react';
import { TurtleSVG } from '../shared/TurtleSVG';
import type { ReleaseScenario } from '../../data/releaseQuiz';
import styles from './Stage4.module.css';

interface ReleaseResult {
  correctLocation: boolean;
  correctSeason: boolean;
  points: number;
  educationalBlurb: string;
}

interface ReleaseQuizProps {
  scenario: ReleaseScenario;
  onAnswer: (location: string, season: string) => void;
  result: ReleaseResult | null;
}

const SEASON_ICONS: Record<string, string> = {
  Spring: '\u{1F338}',  // cherry blossom
  Summer: '\u{2600}\uFE0F',  // sun
  Fall: '\u{1F342}',    // fallen leaf
  Winter: '\u{2744}\uFE0F',  // snowflake
};

export function ReleaseQuiz({ scenario, onAnswer, result }: ReleaseQuizProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const submitted = result !== null;

  const handleConfirm = () => {
    if (selectedLocation && selectedSeason && !submitted) {
      onAnswer(selectedLocation, selectedSeason);
    }
  };

  const getLocationClass = (loc: string) => {
    if (!submitted) {
      return selectedLocation === loc ? styles.optionSelected : '';
    }
    // After result
    if (loc === scenario.correctLocation) return styles.optionCorrect;
    if (loc === selectedLocation && !result?.correctLocation) return styles.optionWrong;
    return styles.optionDimmed;
  };

  const getSeasonClass = (season: string) => {
    if (!submitted) {
      return selectedSeason === season ? styles.optionSelected : '';
    }
    if (season === scenario.correctSeason) return styles.optionCorrect;
    if (season === selectedSeason && !result?.correctSeason) return styles.optionWrong;
    return styles.optionDimmed;
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

        {/* Release Season */}
        <div className={styles.selectionSection}>
          <div className={styles.selectionTitle}>Release Season</div>
          <div className={styles.optionGrid}>
            {scenario.seasonOptions.map((season) => (
              <button
                key={season}
                className={`${styles.optionBtn} ${styles.seasonBtn} ${getSeasonClass(season)}`}
                onClick={() => !submitted && setSelectedSeason(season)}
                disabled={submitted}
              >
                <span className={styles.seasonIcon}>{SEASON_ICONS[season]}</span>
                {season}
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
            disabled={!selectedLocation || !selectedSeason}
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
                result.correctSeason ? styles.resultBadgeCorrect : styles.resultBadgeWrong
              }`}
            >
              {result.correctSeason ? '\u2713' : '\u2717'} Season
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
