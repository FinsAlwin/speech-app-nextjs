import styles from "../../styles/Therapist.module.css";
import Link from "next/link";

export default function AppTile(props) {
  return (
    <>
      &nbsp;
      <Link
        href={props.link}
        className={`${styles.appTileContainer}`}
        style={{ backgroundColor: "#19A6F4" }}
      >
        {props.icon}
      </Link>
    </>
  );
}
