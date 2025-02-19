import { FC, PropsWithChildren } from 'react';
import styles from './PageLayout.module.css';

const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default PageLayout;
