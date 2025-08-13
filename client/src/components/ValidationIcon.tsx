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
  switch (score) {
    case 1: return styles.score1;
    case 2: return styles.score2;
    case 3: return styles.score3;
    case 4: return styles.score4;
    case 5: return styles.score5;
    default: return styles.scoreUnavailable;
  }
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
    ? `${displayName} (${score}/5)\n${feedback}`
    : `${displayName} (${score}/5)`;
  
  return (
    <div 
      className={`${styles.validationIcon} ${scoreClass} ${className}`}
      title={tooltipText}
    >
      {icon}
    </div>
  );
};
