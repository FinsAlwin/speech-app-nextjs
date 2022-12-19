import React, { useState } from "react";
import styles from "../../styles/BottomTray.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ControlIcon(props) {
  const handleClick = () => {
    props.handleClick();
  };
  return (
    <div className={`${styles.controlIconContainer} `} onClick={handleClick}>
      <FontAwesomeIcon icon={props.icon} size={props.lg} color={props.color} />
    </div>
  );
}
