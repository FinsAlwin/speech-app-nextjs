import styles from "../../styles/2dCall.module.css";
import Tools from "./tools";
import { useRef, useEffect, useState } from "react";
import { connect } from "twilio-video";
import { useRouter } from "next/router";
import BottomTray from "../iconTray/bottomTray";

export default function TwoDCallTherapist(second) {
  const {
    Face,
    Vector: { lerp },
    Utils: { clamp },
  } = Kalidokit;

  let facemesh, drawLandmarks;
  const [active, setActive] = useState(false);
  const [hasFace, setHasFace] = useState(false);
  const [isRemoteActive, setIsRemoteActive] = useState(false);
  const remoteVideoContainerRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const canvasRef = useRef(null);
  const router = useRouter();
  const { roomName } = router.query;
  const { username } = router.query;

  useEffect(() => {
    if (active) {
      connectVideocall(localStorage.getItem("tiToken"));
    } else {
      getToken();
    }
  }, [active]);

  async function connectVideocall(data) {
    connect(`${data}`, {
      audio: true,
      name: roomName,
      video: true,
    }).then((room) => {
      room.on("participantConnected", (participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed) {
            const track = publication.track;
            remoteVideoContainerRef.current.appendChild(track.attach());
            getRemoteStream();
          }
        });

        participant.on("trackSubscribed", (track) => {
          remoteVideoContainerRef.current.appendChild(track.attach());
          getRemoteStream();
        });
      });

      room.participants.forEach((participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.track) {
            remoteVideoContainerRef.current.appendChild(
              publication.track.attach()
            );
            getRemoteStream();
          }
        });

        participant.on("trackSubscribed", (track) => {
          remoteVideoContainerRef.current.appendChild(track.attach());
          getRemoteStream();
        });
      });
    });
  }

  async function getRemoteStream() {
    remoteStreamRef.current.srcObject =
      document.getElementsByTagName("video")[1]?.srcObject;
    await remoteStreamRef.current.play();
    setIsRemoteActive(true);
  }

  async function getToken() {
    const payload = {
      identity: username,
    };
    const res = await fetch(`/api/${username}/getToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const dataRes = await res.json();

    if (res.status == 200) {
      await localStorage.setItem("tiToken", dataRes.data);
      setActive(true);
    }
  }

  useEffect(() => {
    if (isRemoteActive) {
      facemesh = new FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        },
      });

      // set facemesh config
      facemesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // pass facemesh callback function
      facemesh.onResults(onResults);

      async function onFrame() {
        if (
          !remoteStreamRef?.current.paused &&
          !remoteStreamRef?.current?.ended
        ) {
          await facemesh.send({
            image: remoteStreamRef.current,
          });
          await new Promise(requestAnimationFrame);
          onFrame();
        } else setTimeout(onFrame, 500);
      }

      onFrame();
    }
  }, [isRemoteActive]);

  const onResults = (results) => {
    if (results.multiFaceLandmarks.length) {
      setHasFace(true);
    } else {
      setHasFace(false);
    }
  };

  return (
    <div className={`container-fluid ${styles.twodContainerTherapist}`}>
      <div className="row">
        <div className="col-lg-8">
          <div
            ref={remoteVideoContainerRef}
            id="localSream"
            className={`${styles.remoteVideoContainer} shadow rounded`}
          >
            <BottomTray />
            <video
              id="user-2"
              ref={remoteStreamRef}
              autoPlay
              muted={true}
              playsInline
              style={{ visibility: "hidden", position: "absolute" }}
            ></video>
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`${styles.toolsContainer} shadow rounded`}>
            <Tools isFace={hasFace} />
          </div>
        </div>
      </div>
    </div>
  );
}
