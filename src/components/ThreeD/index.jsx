import styles from "../../styles/3dCall.module.css";
import React, { useRef, useEffect, useState } from "react";
import * as Kalidokit from "kalidokit";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Holistic } from "@mediapipe/holistic";
import * as Hol from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";

export default function Threed(props) {
  const remoteCameraRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(async function (stream) {
        remoteCameraRef.current.srcObject = stream;
        remoteCameraRef.current.play();
      })
      .then(async function () {
        runNN();
      })
      .catch(function (err) {
        console.log("An error occurred! " + err);
      });
  }, []);

  const runNN = () => {
    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults(onResults);

    async function onFrame() {
      if (
        !remoteCameraRef?.current?.paused &&
        !remoteCameraRef?.current?.ended
      ) {
        await holistic.send({
          image: remoteCameraRef.current,
        });

        await new Promise(requestAnimationFrame);
        onFrame();
      } else setTimeout(onFrame, 500);
    }

    remoteCameraRef?.current.play();
    onFrame();
  };

  function onResults(results) {}

  return (
    <div>
      <div className={styles.preview}>
        <video
          ref={remoteCameraRef}
          className={styles.input_video}
          width="1280px"
          height="720px"
          autoPlay
          muted
          playsInline
        ></video>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
