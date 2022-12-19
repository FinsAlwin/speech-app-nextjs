import React, { useState } from "react";
import styles from "../../styles/SideTray.module.css";
import { BiStar } from "react-icons/bi";
import MenuItem from "./menuItem";
import SubItem from "./subItem";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function SideTray() {
  return (
    <div className={`${styles.leftTrayContainer} shadow-lg`}>
      <div className="d-flex ">
        <ul className="nav nav-pills nav-flush flex-column ">
          <li>
            <MenuItem icon={faStar} size="lg" />
          </li>
          <li>
            <MenuItem icon={faStar} size="lg" />
          </li>
          <li>
            <MenuItem icon={faStar} size="lg" />
          </li>
          <li>
            <MenuItem icon={faStar} size="lg" />
          </li>
          <li>
            <MenuItem icon={faStar} size="lg" />
          </li>
        </ul>
      </div>
    </div>
  );
}
