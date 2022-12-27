import styles from "../../styles/2dCall.module.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { connect } from "twilio-video";
import BottomTray from "../iconTray/bottomTray";
import { Fireworks } from "@fireworks-js/react";

export default function TwoDCallPatient(props) {
  const [active, setActive] = useState(false);

  const [isRemoteActive, setIsRemoteActive] = useState(false);
  const [firework, setFirework] = useState(false);
  const [call, setCall] = useState();
  const router = useRouter();
  const { roomName } = router.query;
  const { username } = router.query;

  const userData = localStorage.getItem("userData");

  const {
    Application,
    live2d: { Live2DModel },
  } = PIXI;

  const {
    Face,
    Vector: { lerp },
    Utils: { clamp },
  } = Kalidokit;

  useEffect(() => {
    if (active) {
      setCall(JSON.parse(localStorage.getItem("callDetailes")));
      connectVideocall(localStorage.getItem("tiToken"));
    } else {
      getToken();
    }
  }, [active]);

  useEffect(() => {
    setFirework(props.reinforcement);
    console.log(props.reinforcement);
  }, [props.reinforcement]);

  useEffect(() => {
    if (isRemoteActive) {
      runModal();
    }
  }, [isRemoteActive]);

  let currentModel, facemesh;

  const remoteStreamRef = useRef(null);
  const remoteStreamContainerRef = useRef(null);
  const canvasRef = useRef(null);

  async function getRemoteStream() {
    remoteStreamRef.current.srcObject =
      document.getElementsByTagName("video")[0].srcObject;
    await remoteStreamRef.current.play();
    setIsRemoteActive(true);
  }

  const modelUrl = `${call?.modelUrl}`;
  const onResults = (results) => {
    animateLive2DModel(results.multiFaceLandmarks[0]);
  };

  const animateLive2DModel = (points) => {
    if (!currentModel || !points) return;

    let riggedFace;

    if (points) {
      // use kalidokit face solver
      riggedFace = Face.solve(points, {
        runtime: "mediapipe",
        video: document.querySelector(".input_video"),
      });
      rigFace(riggedFace, 0.5);
    }
  };

  // update live2d model internal state
  const rigFace = (result, lerpAmount = 0.7) => {
    const coreModel = currentModel.internalModel.coreModel;

    currentModel.internalModel.motionManager.update = (...args) => {
      // disable default blink animation
      currentModel.internalModel.eyeBlink = undefined;

      coreModel.setParameterValueById(
        "ParamEyeBallX",
        lerp(
          result.pupil.x,
          coreModel.getParameterValueById("ParamEyeBallX"),
          lerpAmount
        )
      );
      coreModel.setParameterValueById(
        "ParamEyeBallY",
        lerp(
          result.pupil.y,
          coreModel.getParameterValueById("ParamEyeBallY"),
          lerpAmount
        )
      );

      // X and Y axis rotations are swapped for Live2D parameters
      // because it is a 2D system and KalidoKit is a 3D system
      coreModel.setParameterValueById(
        "ParamAngleX",
        lerp(
          result.head.degrees.y,
          coreModel.getParameterValueById("ParamAngleX"),
          lerpAmount
        )
      );
      coreModel.setParameterValueById(
        "ParamAngleY",
        lerp(
          result.head.degrees.x,
          coreModel.getParameterValueById("ParamAngleY"),
          lerpAmount
        )
      );
      coreModel.setParameterValueById(
        "ParamAngleZ",
        lerp(
          result.head.degrees.z,
          coreModel.getParameterValueById("ParamAngleZ"),
          lerpAmount
        )
      );

      // update body params for models without head/body param sync
      const dampener = 0.3;
      coreModel.setParameterValueById(
        "ParamBodyAngleX",
        lerp(
          result.head.degrees.y * dampener,
          coreModel.getParameterValueById("ParamBodyAngleX"),
          lerpAmount
        )
      );
      coreModel.setParameterValueById(
        "ParamBodyAngleY",
        lerp(
          result.head.degrees.x * dampener,
          coreModel.getParameterValueById("ParamBodyAngleY"),
          lerpAmount
        )
      );
      coreModel.setParameterValueById(
        "ParamBodyAngleZ",
        lerp(
          result.head.degrees.z * dampener,
          coreModel.getParameterValueById("ParamBodyAngleZ"),
          lerpAmount
        )
      );

      // Simple example without winking.
      // Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
      let stabilizedEyes = window.Kalidokit.Face.stabilizeBlink(
        {
          l: lerp(
            result.eye.l,
            coreModel.getParameterValueById("ParamEyeLOpen"),
            0.7
          ),
          r: lerp(
            result.eye.r,
            coreModel.getParameterValueById("ParamEyeROpen"),
            0.7
          ),
        },
        result.head.y
      );
      // eye blink
      coreModel.setParameterValueById("ParamEyeLOpen", stabilizedEyes.l);
      coreModel.setParameterValueById("ParamEyeROpen", stabilizedEyes.r);

      // mouth
      coreModel.setParameterValueById(
        "ParamMouthOpenY",
        lerp(
          result.mouth.y,
          coreModel.getParameterValueById("ParamMouthOpenY"),
          0.3
        )
      );
      // Adding 0.3 to ParamMouthForm to make default more of a "smile"
      coreModel.setParameterValueById(
        "ParamMouthForm",
        0.5 +
          lerp(
            result.mouth.x,
            coreModel.getParameterValueById("ParamMouthForm"),
            0.5
          )
      );
    };
  };

  async function runModal() {
    if (isRemoteActive) {
      // create pixi application
      const app = new PIXI.Application({
        view: canvasRef.current,
        autoStart: true,
        backgroundAlpha: 1,
        backgroundColor: 0xffffff,
        resizeTo: window,
      });

      var background = window.PIXI.Sprite.fromImage(
        `${call?.backgroundImagesUrl}`
      );

      background.width = window.innerWidth;
      background.height = window.innerHeight;
      app.stage.addChild(background);

      // load live2d model
      currentModel = await Live2DModel.from(modelUrl, {
        autoInteract: true,
      });

      currentModel.scale.set(0.4);
      currentModel.interactive = true;
      currentModel.anchor.set(0.55, 0.55);
      currentModel.position.set(
        window.innerWidth * 0.5,
        window.innerHeight * 1.5
      );

      // Add mousewheel events to scale model
      // document.querySelector("#live2d").addEventListener("wheel", (e) => {
      //   e.preventDefault();
      //   currentModel.scale.set(
      //     clamp(currentModel.scale.x + e.deltaY * -0.001, -0.5, 10)
      //   );
      // });

      // add live2d model to stage
      app.stage.addChild(currentModel);

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
  }

  async function connectVideocall(data) {
    connect(`${data}`, {
      audio: true,
      name: roomName,
      video: true,
    }).then((room) => {
      room.on("participantConnected", (participant) => {
        console.log(participant);
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed) {
            const track = publication.track;
            remoteStreamContainerRef.current.appendChild(track.attach());
            getRemoteStream();
          }
        });

        participant.on("trackSubscribed", (track) => {
          remoteStreamContainerRef.current.appendChild(track.attach());
          getRemoteStream();
        });
      });

      room.participants.forEach((participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.track) {
            remoteStreamContainerRef.current.appendChild(
              publication.track.attach()
            );
            getRemoteStream();
          }
        });

        participant.on("trackSubscribed", (track) => {
          remoteStreamContainerRef.current.appendChild(track.attach());
          getRemoteStream();
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

  useEffect(() => {
    if (firework) {
      setTimeout(() => {
        setFirework(false);
      }, 10000);
    }
  }, [firework]);

  return (
    <>
      <div
        ref={remoteStreamContainerRef}
        style={{ visibility: "hidden", position: "absolute" }}
      ></div>
      <video
        id="user-2"
        ref={remoteStreamRef}
        autoPlay
        muted={true}
        playsInline
        style={{ visibility: "hidden", position: "absolute" }}
      ></video>
      <div className={styles.canvasContainer}>
        {firework && (
          <div className={styles.fireworkContainer}>
            <Fireworks
              options={{
                rocketsPoint: {
                  min: 0,
                  max: 100,
                },
              }}
              style={{
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                position: "fixed",
              }}
            />
          </div>
        )}

        <canvas
          ref={canvasRef}
          id="live2d"
          className={styles.remoteVideoContainerCanvas}
        ></canvas>

        <BottomTray />
      </div>
    </>
  );
}
