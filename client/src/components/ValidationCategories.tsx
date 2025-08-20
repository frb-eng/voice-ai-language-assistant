import React from 'react';
import { ValidationIcon, ValidationCategory } from './ValidationIcon';
import styles from './ValidationIcon.module.css';

interface CategoryValidation {
  category: ValidationCategory;
  score: number | null;
  feedback: string;
}

interface ValidationCategoriesProps {
  categories: CategoryValidation[];
}

export const ValidationCategories: React.FC<ValidationCategoriesProps> = ({ 
  categories
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  // Filter out categories without scores
  const validCategories = categories.filter(validation => validation.score);

  if (validCategories.length === 0) {
    return null;
  }

  return (
    <div className={styles.validationContainer}>
      {validCategories.map((validation) => (
        <ValidationIcon
          key={validation.category}
          category={validation.category}
          score={validation.score}
          feedback={validation.feedback}
        />
      ))}
    </div>
  );
};
