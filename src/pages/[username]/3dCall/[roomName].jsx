import React, { useRef, useEffect, useState } from "react";
import styles from "../../../styles/3dCall.module.css";
import { useRouter } from "next/router";
import SideTray from "../../../components/iconTray/sideTray";
import Head from "next/head";
import BottomTray from "../../../components/iconTray/bottomTray";
import { connect } from "twilio-video";
import { signIn, useSession } from "next-auth/react";
import Login from "../../../components/login/login";
import Threed from "../../../components/ThreeD";
import Script from "next/script";

export default function VideoSession() {
  const [userData, setUserData] = useState();
  const [active, setActive] = useState(false);
  const { data: session, status } = useSession();
  const remoteStreamRef = useRef(null);
  const remoteStreamVideoRef = useRef(null);
  const router = useRouter();
  const { roomName } = router.query;
  const { username } = router.query;

  // useEffect(() => {
  //   setUserData(JSON.parse(localStorage.getItem("userData")));
  // }, []);

  // useEffect(() => {
  //   if (active) {
  //     connectVideocall(localStorage.getItem("tiToken"));
  //   } else {
  //     getToken();
  //   }
  // }, [getToken()]);

  // async function connectVideocall(data) {
  //   connect(`${data}`, {
  //     audio: true,
  //     name: roomName,
  //     video: true,
  //   }).then((room) => {
  //     room.on("participantConnected", (participant) => {
  //       console.log(participant);
  //       participant.tracks.forEach((publication) => {
  //         if (publication.isSubscribed) {
  //           const track = publication.track;
  //           remoteStreamRef.current.appendChild(track.attach());
  //         }
  //       });

  //       participant.on("trackSubscribed", (track) => {
  //         remoteStreamRef.current.appendChild(track.attach());
  //       });
  //     });

  //     room.participants.forEach((participant) => {
  //       participant.tracks.forEach((publication) => {
  //         if (publication.track) {
  //           remoteStreamRef.current.appendChild(publication.track.attach());
  //         }
  //       });

  //       participant.on("trackSubscribed", (track) => {
  //         remoteStreamRef.current.appendChild(track.attach());
  //       });
  //     });
  //   });
  // }

  // async function getToken() {
  //   const payload = {
  //     identity: username,
  //   };
  //   const res = await fetch(`/api/${username}/getToken`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(payload),
  //   });

  //   const dataRes = await res.json();

  //   if (res.status == 200) {
  //     await localStorage.setItem("tiToken", dataRes.data);
  //     setActive(true);
  //   }
  // }

  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>Speech App | 3d Call</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        <Threed />

        {/* {userData.userType == 1 && (
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-8">
                    <div
                      ref={remoteStreamRef}
                      id="localSream"
                      className={`${styles.remoteVideoContainer} `}
                    >
                      <BottomTray />
                    </div>
                  </div>

                  <div className="col-lg-6"></div>
                </div>
              </div>
            )}
            {userData.userType == 2 && <Threed />} */}
      </>
    );
  }

  return (
    <div>
      <Login click={() => signIn("google")} />
    </div>
  );
}
