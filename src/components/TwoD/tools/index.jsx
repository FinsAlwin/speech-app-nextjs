import styles from "../../../styles/2dCall.module.css";
import { HiThumbUp, HiEye } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
let socket;

export default function Tools(props) {
  const router = useRouter();
  const { uid } = router.query;
  const [time, setTime] = useState(0);
  let interval = null;

  useEffect(() => {
    if (props.isFace) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();
  };

  const handleCongratulations = () => {
    const payload = JSON.stringify({
      userId: uid,
      callType: "2d",
      reinforcement: true,
    });

    socket.emit("congratsSend", payload);
  };

  return (
    <div className={`${styles.toolsContainer}`}>
      <div className="row">
        <div className="col-6">
          <div
            className={`${styles.toolCard} shadow rounded d-flex flex-column`}
            onClick={handleCongratulations}
          >
            <HiThumbUp size={40} />
            <p>Congratulations</p>
          </div>
        </div>

        <div className="col-6">
          <div
            className={`${styles.toolCard} shadow rounded d-flex flex-column`}
          >
            <HiEye size={40} />

            <p>
              {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
              {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
              {("0" + ((time / 10) % 100)).slice(-2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
