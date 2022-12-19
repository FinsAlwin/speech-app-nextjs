import styles from "../../styles/SideTray.module.css";
export default function SubItem(props) {
  return <div className={`${styles.subItemContainer}`}>{props.title}</div>;
}
