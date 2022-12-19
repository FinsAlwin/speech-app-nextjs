import styles from "../../styles/CustomTable.module.css";
export default function CustomTable({ children }) {
  return <table className={`${styles.customTable}`}>{children}</table>;
}
