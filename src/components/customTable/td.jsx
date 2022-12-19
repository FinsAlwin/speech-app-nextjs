import styles from "../../styles/CustomTable.module.css";

export default function Td(props) {
  return <td className={`${styles.customTd}`}>{props.title}</td>;
}
