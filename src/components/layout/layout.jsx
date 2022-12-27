import NavBar from "./navBar";
import Footer from "./footer";
import Caller from "./caller";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { onMessageListener } from "../../utils/firebase";

let socket;

export default function Layout({ children }) {
  const [callActive, setCallActive] = useState(false);
  const [callType, setCallType] = useState("");
  const [callerName, setCallerName] = useState("");
  const [callerImage, setCallerImage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [uid, setUid] = useState();

  const handleCallActive = (e) => {
    setCallActive(e);
  };
  return (
    <>
      <NavBar />
      <main>{children}</main>
      {/* {callActive && (
        <Caller
          roomName={roomName}
          uid={uid}
          callType={callType}
          callerName={callerName}
          callerImage={callerImage}
          show={callActive}
          callActive={handleCallActive}
        />
      )} */}

      <Footer />
    </>
  );
}
