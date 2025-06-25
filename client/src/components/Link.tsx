import { Link as RouterLink } from "react-router-dom";
import styles from "./Link.module.css";

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export const Link = ({ to, children, className = "", variant = "primary" }: LinkProps) => {
  const linkClass = `${styles.link} ${styles[variant]} ${className}`;
  
  return (
    <RouterLink to={to} className={linkClass}>
      {children}
    </RouterLink>
  );
};

export default Link;
