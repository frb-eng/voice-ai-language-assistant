import React from 'react';
import styles from './ValidationIcon.module.css';

// Icon mapping for validation categories matching server enum values
export const VALIDATION_ICONS = {
  'word_order': '🔄',
  'vocabulary': '📚', 
  'articles': 'A',
  'prepositions': '↔️',
  'verb_conjugation': '⚡',
  'context': '💬',
  'language_level': '📊'
} as const;

export type ValidationCategory = keyof typeof VALIDATION_ICONS;

interface ValidationIconProps {
  category: ValidationCategory;
  score?: number | null;
  className?: string;
  feedback?: string;
}

const getScoreClass = (score?: number | null): string => {
  if (score === null || score === undefined) return styles.scoreUnavailable;
  if (score >= 4) return styles.scoreGood;
  if (score >= 3) return styles.scoreAverage;
  return styles.scorePoor;
};

const getCategoryDisplayName = (category: ValidationCategory): string => {
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const ValidationIcon: React.FC<ValidationIconProps> = ({ 
  category, 
  score, 
  className = '',
  feedback = ''
}) => {
  const icon = VALIDATION_ICONS[category] || '❓';
  const scoreClass = getScoreClass(score);
  const displayName = getCategoryDisplayName(category);
  
  const tooltipText = feedback 
    ? `${displayName}: ${score !== null && score !== undefined ? `${score}/5` : 'Not evaluated'}\n${feedback}`
    : `${displayName}: ${score !== null && score !== undefined ? `${score}/5` : 'Not evaluated'}`;
  
  return (
    <div 
      className={`${styles.validationIcon} ${scoreClass} ${className}`}
      title={tooltipText}
    >
      {icon}
      {score !== null && score !== undefined && (
        <div className={styles.scoreDisplay}>
          {score}
        </div>
      )}
    </div>
  );
};
