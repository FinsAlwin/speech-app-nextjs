import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { onMessageListener } from "../utils/firebase";
import Caller from "./layout/caller";
import styles from "../styles/caller.module.css";
import { BiPhoneCall } from "react-icons/bi";
import { FcEndCall } from "react-icons/fc";

function PushNotificationLayout({ children, handlereinforcement }) {
  const [callActive, setCallActive] = useState(false);
  const [callType, setCallType] = useState("");
  const [callerName, setCallerName] = useState("");
  const [callerImage, setCallerImage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [uid, setUid] = useState();
  const [senderFcm, setSenderFcm] = useState();
  const [callAccepted, setCallAccepted] = useState();
  const router = useRouter();
  const { username } = router.query;

  const handleAnswerCall = (e) => {};

  const handleRejectCall = (e) => {};

  const handleAnswerCall2D = (e) => {};

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        if (payload.data) {
          if (payload.notification.title.includes("Call Placed")) {
            setCallActive(true);
            setCallType(payload.data.callType);
            setCallerName(payload.data.callerName);
            setCallerImage(payload.data.callerImage);
            setRoomName(payload.data.roomName);
            setUid(payload.data.userId);
            setSenderFcm(payload.data.senderFcmToken);

            const detailes = {
              callerName: payload.data.callerName,
              callType: payload.data.callType,
              backgroundImagesUrl: payload.data.backgroundImagesUrl,
              modelUrl: payload.data.modelUrl,
            };

            localStorage.setItem("callDetailes", JSON.stringify(detailes));
          } else if (payload.notification.title.includes("Call Response")) {
            if (payload.data.isAccepted) {
              setCallActive(false);
              setCallType(payload.data.callType);
              setCallerName(payload.data.callerName);
              setCallerImage(payload.data.callerImage);
              setRoomName(payload.data.roomName);
              setUid(payload.data.userId);
              setSenderFcm(payload.data.senderFcmToken);
              const detailes = {
                callerName: payload.data.callerName,
                callType: payload.data.callType,
                backgroundImagesUrl: payload.data.backgroundImagesUrl,
                modelUrl: payload.data.modelUrl,
              };

              localStorage.setItem("callDetailes", JSON.stringify(detailes));
              router.push(`/${username}/${payload.data.url}`);
            }
          } else if (payload.notification.title.includes("reinforcement")) {
            handlereinforcement(payload.data.reinforcement);
          }
        }
      })
      .catch();
  }, []);

  const handleCallActive = () => {};

  return (
    <>
      <ToastContainer />
      {callActive && (
        <Caller
          roomName={roomName}
          uid={uid}
          callType={callType}
          callerName={callerName}
          callerImage={callerImage}
          show={callActive}
          callActive={handleCallActive}
          senderFcm={senderFcm}
        />
      )}

      {children}
    </>
  );
}

export default PushNotificationLayout;
