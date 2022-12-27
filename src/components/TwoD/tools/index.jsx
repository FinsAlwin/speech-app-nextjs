import styles from "../../../styles/2dCall.module.css";
import { HiThumbUp, HiEye } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Tools(props) {
  const [userData, setUserData] = useState();
  const router = useRouter();
  const { uid } = router.query;
  const [time, setTime] = useState(0);
  let interval = null;

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userData")));
  }, []);

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

  const handleCongratulations = async () => {
    const payload = JSON.stringify({
      to: localStorage.getItem("peerFcmToken"),
      priority: "high",
      notification: {
        title: "reinforcement",
        body: "reinforcement request",
      },
      data: {
        callType: "2d",
        reinforcement: true,
        senderFcmToken: userData.fcmToken,
      },
    });

    await fetch(`https://fcm.googleapis.com/fcm/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY}`,
      },
      body: payload,
    });
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
