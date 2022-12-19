import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script src="https://cdn.jsdelivr.net/npm/kalidokit@1.1/dist/kalidokit.umd.js"></script>
        <script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js"></script>
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"
          crossorigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/holistic.js"
          crossorigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
          crossorigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
          crossorigin="anonymous"
        ></script>
        <script src="https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
