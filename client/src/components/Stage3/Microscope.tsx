import React from 'react';
import styles from './Stage3.module.css';

interface MicroscopeItem {
  id: string;
  label: string;
  isTarget: boolean;
  x: number; // 0-100 (percentage within the viewport)
  y: number;
}

interface MicroscopeProps {
  items: MicroscopeItem[];
  onTap: (itemId: string) => void;
  disabled: boolean;
  tappedItems: Set<string>;
}

export function Microscope({ items, onTap, disabled, tappedItems }: MicroscopeProps) {
  const handleTap = (itemId: string) => {
    if (disabled || tappedItems.has(itemId)) return;
    onTap(itemId);
  };

  return (
    <div className={styles.microscopeWrapper}>
      {/* Dark eyepiece ring */}
      <div className={styles.microscopeRing} />

      {/* Circular viewport with tissue sample background */}
      <div className={styles.microscopeViewport}>
        {items.map((item) => {
          const isTapped = tappedItems.has(item.id);
          const wasCorrect = isTapped && item.isTarget;
          const wasWrong = isTapped && !item.isTarget;

          const itemClasses = [
            styles.microscopeItem,
            item.isTarget ? styles.itemTarget : styles.itemNonTarget,
            isTapped ? styles.itemTapped : '',
            wasCorrect ? styles.itemTappedCorrect : '',
            wasWrong ? styles.itemTappedWrong : '',
            disabled ? styles.itemDisabled : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div
              key={item.id}
              className={itemClasses}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              onClick={() => handleTap(item.id)}
              title={isTapped ? item.label : ''}
              role="button"
              tabIndex={disabled || isTapped ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTap(item.id);
                }
              }}
              aria-label={isTapped ? `${item.label} (identified)` : 'Unidentified sample'}
            />
          );
        })}

        {/* Vignette overlay */}
        <div className={styles.microscopeVignette} />

        {/* Glass glare reflection */}
        <div className={styles.microscopeGlare} />
      </div>
    </div>
  );
}
