import styles from "../../styles/CustomTable.module.css";

export default function Th(props) {
  return <th className={`${styles.customTh}`}>{props.title}</th>;
}
