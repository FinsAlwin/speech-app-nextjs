import { useState } from "react";
import styles from "../../styles/BottomTray.module.css";
import ControlIcon from "../../components/iconTray/controlIcon";

import {
  faMicrophone,
  faVideo,
  faCommentAlt,
  faStar,
  faSmile,
  faL,
} from "@fortawesome/free-solid-svg-icons";

export default function BottomTray(props) {
  const [isMic, setMic] = useState(true);
  const [video, setVideo] = useState(true);

  const handleMic = (e) => {
    if (isMic) {
      setMic(false);
      props.handleLocalAudio();
    } else {
      setMic(true);
      props.handleLocalAudio();
    }
  };

  const handleVideo = (e) => {
    if (video) {
      setVideo(false);
      props.handleLocalVideo();
    } else {
      setVideo(true);
      props.handleLocalVideo();
    }
  };
  return (
    <div className={`${styles.bottomTrayContainer} shadow-lg`}>
      <ControlIcon
        icon={faMicrophone}
        size={"lg"}
        handleClick={handleMic}
        color={isMic && "#75CD36"}
      />
      &nbsp; &nbsp;
      <ControlIcon
        icon={faVideo}
        size={"2xl"}
        handleClick={handleVideo}
        color={video && "#75CD36"}
      />
      &nbsp;&nbsp;
      <ControlIcon icon={faCommentAlt} size={"2xl"} />
      &nbsp;&nbsp;
      <ControlIcon icon={faStar} size={"2xl"} />
      &nbsp;&nbsp;
      <ControlIcon icon={faSmile} size={"2xl"} />
      &nbsp;&nbsp;
    </div>
  );
}
