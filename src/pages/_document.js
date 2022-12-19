import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* <Script src="https://cdn.jsdelivr.net/npm/kalidokit@1.1/dist/kalidokit.umd.js"></Script>
        <Script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></Script>
        <Script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"></Script>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js"></Script>

        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"></Script>

        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/holistic.js"></Script>

        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"></Script>

        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"></Script>

        <Script src="https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js"></Script> */}

        <script
          src="https://cdn.jsdelivr.net/npm/kalidokit@1.1/dist/kalidokit.umd.js"
          async
        ></script>
        <script
          src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"
          async
        ></script>
        <script
          src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"
          async
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js"
          async
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"
          crossorigin="anonymous"
          async
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/holistic.js"
          crossorigin="anonymous"
          async
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
          crossorigin="anonymous"
          async
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
          crossorigin="anonymous"
          async
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js"
          async
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
