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
  title?: string;
}

export const ValidationCategories: React.FC<ValidationCategoriesProps> = ({ 
  categories, 
  title = "Language Assessment" 
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className={styles.validationContainer}>
      <div className={styles.validationTitle}>{title}</div>
      {categories.map((validation) => (
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
