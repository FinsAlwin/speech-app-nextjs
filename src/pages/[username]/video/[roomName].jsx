import React, { useRef, useEffect, useState } from "react";
import styles from "../../../styles/Video.module.css";
import { useRouter } from "next/router";
import SideTray from "../../../components/iconTray/sideTray";
import Head from "next/head";
import BottomTray from "../../../components/iconTray/bottomTray";
import { connect, createLocalVideoTrack } from "twilio-video";
import { signIn, useSession } from "next-auth/react";
import Login from "../../../components/login/login";

export default function VideoSession() {
  const [active, setActive] = useState(false);
  const [room, setRoom] = useState();
  const { data: session, status } = useSession();
  const remoteStreamRef = useRef(null);
  const remoteStreamVideoRef = useRef(null);
  const router = useRouter();
  const { roomName } = router.query;
  const { username } = router.query;

  useEffect(() => {
    if (active && !room) {
      connectVideocall(localStorage.getItem("tiToken"));
    } else {
      getToken();
    }
  }, [getToken()]);

  async function connectVideocall(data) {
    connect(`${data}`, {
      audio: true,
      name: roomName,
      video: true,
    }).then((room) => {
      setRoom(room);
      room.on("participantConnected", (participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed) {
            const track = publication.track;
            remoteStreamRef.current.appendChild(track.attach());
          }
        });

        participant.on("trackSubscribed", (track) => {
          remoteStreamRef.current.appendChild(track.attach());
        });
      });

      room.participants.forEach((participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.track) {
            remoteStreamRef.current.appendChild(publication.track.attach());
          }
        });

        participant.on("trackSubscribed", (track) => {
          remoteStreamRef.current.appendChild(track.attach());
        });
      });
    });
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

  const handleLocalVideo = () => {
    room.localParticipant.videoTracks.forEach((publication) => {
      if (publication.track.isEnabled) {
        publication.track.disable();
      } else {
        publication.track.enable();
      }
    });
  };

  const handleLocalAudio = () => {
    room.localParticipant.audioTracks.forEach((publication) => {
      if (publication.track.isEnabled) {
        publication.track.disable();
      } else {
        publication.track.enable();
      }
    });
  };

  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>Speech App | Video Call</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div
          ref={remoteStreamRef}
          id="localSream"
          className={styles.remoteVideoContainer}
        >
          <SideTray />
          <BottomTray
            handleLocalVideo={handleLocalVideo}
            handleLocalAudio={handleLocalAudio}
          />
        </div>
      </>
    );
  }

  return (
    <di>
      <Login click={() => signIn("google")} />
    </di>
  );
}
