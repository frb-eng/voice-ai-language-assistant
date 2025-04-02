import styles from "./LoadingSkeleton.module.css"; // Import CSS module

export const LoadingSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={styles.skeletonItem}></div>
      ))}
    </div>
  );
};
