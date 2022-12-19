import NavBar from "./navBar";
import Footer from "./footer";
import Caller from "./caller";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Layout({ children }) {
  const [callActive, setCallActive] = useState(false);
  const [callType, setCallType] = useState("");
  const [callerName, setCallerName] = useState("");
  const [callerImage, setCallerImage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [uid, setUid] = useState();

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("newIncomingMessage", (msg) => {
      const dataRes = JSON.parse(msg);

      const userData = localStorage.getItem("userData");

      if (userData)
        if (dataRes.userId === JSON.parse(userData).id) {
          setCallActive(true);
          setCallType(dataRes.callType);
          setCallerName(dataRes.callerName);
          setCallerImage(dataRes.callerImage);
          setRoomName(dataRes.roomName);
          setUid(dataRes.userId);
          const detailes = {
            callerName: dataRes.callerName,
            callType: dataRes.callType,
            backgroundImagesUrl: dataRes.backgroundImagesUrl,
            modelUrl: dataRes.modelUrl,
          };
          localStorage.setItem("callDetailes", JSON.stringify(detailes));
        }
    });
  };

  const handleCallActive = (e) => {
    setCallActive(e);
  };
  return (
    <>
      <NavBar />
      <main>{children}</main>
      {callActive && (
        <Caller
          roomName={roomName}
          uid={uid}
          callType={callType}
          callerName={callerName}
          callerImage={callerImage}
          show={callActive}
          callActive={handleCallActive}
        />
      )}

      <Footer />
    </>
  );
}
