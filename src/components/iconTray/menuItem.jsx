import React, { useState } from "react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/SideTray.module.css";
import { BiStar } from "react-icons/bi";
import SubItem from "./subItem";

export default function MenuItem() {
  const [isShown, setIsShown] = useState(false);

  return (
    <div
      className={`px-0 rounded-0 ${styles.item}`}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {isShown && (
        <div className={styles.menuItem}>
          <ul>
            <li>
              <h6> Menu Item</h6>
            </li>
          </ul>
        </div>
      )}
      <BiStar size={30} />
    </div>
  );
}
