import styles from "../../styles/caller.module.css";
import Image from "next/image";
import { BiPhoneCall } from "react-icons/bi";
import { FcEndCall } from "react-icons/fc";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useRouter } from "next/router";

let socket;

export default function Caller(props) {
  const [show, setShow] = useState();
  const router = useRouter();
  const { username } = router.query;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAnswerCall = async () => {
    const payload = JSON.stringify({
      to: props.senderFcm,
      priority: "high",
      notification: {
        title: "Call Response",
        body: "Video Call Response",
      },
      data: {
        isAccepted: true,
        roomName: props.roomName,
        url: `video/${props.roomName}`,
      },
    });

    const sendNotification = await fetch(
      `https://fcm.googleapis.com/fcm/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY}`,
        },
        body: payload,
      }
    );

    if (sendNotification) {
      router.push(`/${username}/video/${props.roomName}`);
    }
  };

  const handleAnswerCall2D = async () => {
    const payload = JSON.stringify({
      to: props.senderFcm,
      priority: "high",
      notification: {
        title: "Call Response",
        body: "2d Call Response",
      },
      data: {
        isAccepted: true,
        roomName: props.roomName,
        url: `2dCall/${props.roomName}`,
      },
    });

    const sendNotification = await fetch(
      `https://fcm.googleapis.com/fcm/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY}`,
        },
        body: payload,
      }
    );

    if (sendNotification) {
      router.push(`/${username}/2dCall/${props.roomName}`);
    }
  };

  const handleRejectCall = async () => {
    const payload = JSON.stringify({
      to: props.senderFcm,
      priority: "high",
      notification: {
        title: "Call Response",
        body: "Call rejected",
      },
      data: {
        isAccepted: true,
        roomName: props.roomName,
        uid: props.uid,
      },
    });

    const sendNotification = await fetch(
      `https://fcm.googleapis.com/fcm/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY}`,
        },
        body: payload,
      }
    );

    if (sendNotification) {
      props.callActive(false);
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      animation={true}
      contentClassName={styles.modalContent}
    >
      <div className={`${styles.callContainer} card shadow`}>
        {props.callerImage && (
          <div className={`${styles.imageContainer} shadow-lg`}>
            <Image
              className={`${styles.imageCustom}`}
              alt="Picture of the user"
              width={80}
              height={80}
              src={`${props.callerImage}`}
              unoptimized
              priority={true}
            />
          </div>
        )}
        <h4>{props.callerName}</h4>

        {props.callType.includes("video") && (
          <>
            <span className="badge bg-dark">Video Call</span>
            <div className={styles.btnContainer}>
              <button
                className={`${styles.btnAnswer} shadow`}
                onClick={handleAnswerCall}
              >
                <BiPhoneCall size={20} />
              </button>
              &nbsp;
              <button
                className={`${styles.btnDecline} shadow`}
                onClick={handleRejectCall}
              >
                <FcEndCall size={20} color="#fff" />
              </button>
            </div>
          </>
        )}

        {props.callType.includes("2d") && (
          <>
            <span className="badge bg-dark">2-D Call</span>
            <div className={styles.btnContainer}>
              <button
                className={`${styles.btnAnswer} shadow`}
                onClick={handleAnswerCall2D}
              >
                <BiPhoneCall size={20} />
              </button>
              &nbsp;
              <button
                className={`${styles.btnDecline} shadow`}
                onClick={handleRejectCall}
              >
                <FcEndCall size={20} color="#fff" />
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
