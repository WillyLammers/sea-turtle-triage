import React from 'react';
import type { NestScenario, NestType } from '../../data/nests';
import { NEST_OPTIONS } from '../../data/nests';
import styles from './Stage1.module.css';

interface AnswerResult {
  correct: boolean;
  points: number;
  correctAnswer: string;
}

interface NestCardProps {
  nest: NestScenario;
  onAnswer: (answer: string) => void;
  result: AnswerResult | null;
  nestNumber: number;
  totalNests: number;
  onNext?: () => void;
}

const NEST_ICONS: Record<string, string> = {
  'Live Nest': '\uD83E\uDD5A',
  'False Crawl': '\uD83D\uDC22',
  'Predator-Raided': '\uD83D\uDC3E',
  'Hatched (old)': '\uD83D\uDC23',
  'Washed Over': '\uD83C\uDF0A',
};

export function NestCard({ nest, onAnswer, result, nestNumber, totalNests, onNext }: NestCardProps) {
  const answered = result !== null;
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);

  const handleClick = (option: NestType) => {
    if (answered) return;
    setSelectedAnswer(option);
    onAnswer(option);
  };

  React.useEffect(() => {
    setSelectedAnswer(null);
  }, [nest.id]);

  const getButtonClass = (option: NestType): string => {
    if (!answered) return styles.answerBtn;
    const classes = [styles.answerBtn];
    if (option === result.correctAnswer) {
      classes.push(styles.answerCorrect);
    } else if (option === selectedAnswer && !result.correct) {
      classes.push(styles.answerWrong);
    } else {
      classes.push(styles.answerDimmed);
    }
    return classes.join(' ');
  };

  return (
    <div className={styles.nestCard}>
      {/* Clipboard clip decoration */}
      <div className={styles.clipboardClip}>
        <div className={styles.clipMetal} />
      </div>

      {/* Header bar */}
      <div className={styles.nestCardHeader}>
        <div className={styles.nestCardHeaderLeft}>
          <span className={styles.nestCardTitle}>Field Observation Report</span>
        </div>
        <span className={styles.nestCardBadge}>
          {nest.timeOfDay === 'night' ? '\u263E Night' : '\u2600 Morning'}
        </span>
      </div>

      {/* Nest site info */}
      <div className={styles.nestSiteInfo}>
        <span className={styles.nestNumber}>Nest #{nestNumber}</span>
        <span className={styles.nestOf}>of {totalNests}</span>
      </div>

      {/* Description */}
      <p className={styles.nestDescription}>{nest.description}</p>

      {/* Visual Clues */}
      <div className={styles.cluesSection}>
        <div className={styles.cluesHeading}>Visual Clues</div>
        <ul className={styles.cluesList}>
          {nest.visualClues.map((clue, i) => (
            <li key={i} className={styles.clueItem}>{clue}</li>
          ))}
        </ul>
      </div>

      {/* Classification */}
      <div className={styles.classifyHeading}>Classify this site:</div>
      <div className={styles.answerGrid}>
        {(nest.options || NEST_OPTIONS).map((option) => (
          <button
            key={option}
            className={getButtonClass(option)}
            disabled={answered}
            onClick={() => handleClick(option)}
          >
            <span className={styles.answerIcon}>{NEST_ICONS[option] || ''}</span>
            <span>{option}</span>
          </button>
        ))}
      </div>

      {/* Result feedback */}
      {answered && (
        <div className={`${styles.resultArea} ${result.correct ? styles.resultCorrect : styles.resultWrong}`}>
          <div className={styles.resultHeader}>
            <span className={`${styles.resultBadge} ${result.correct ? styles.resultBadgeCorrect : styles.resultBadgeWrong}`}>
              {result.correct ? '\u2713 Correct!' : '\u2717 Incorrect'}
            </span>
            <span className={`${styles.resultPoints} ${result.correct ? styles.resultPointsCorrect : styles.resultPointsWrong}`}>
              {result.correct ? `+${result.points} pts` : `${result.points} pts`}
            </span>
          </div>
          {!result.correct && (
            <div className={styles.resultCorrectAnswer}>
              The correct classification is <strong>{result.correctAnswer}</strong>
            </div>
          )}
          <div className={styles.resultExplanation}>{nest.explanation}</div>
          {onNext && (
            <button className={styles.nextBtn} onClick={onNext}>
              {nestNumber < totalNests ? 'Next Nest \u2192' : 'Finish Survey'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
