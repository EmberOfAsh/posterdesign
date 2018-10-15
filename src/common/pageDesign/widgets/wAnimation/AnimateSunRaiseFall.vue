<template>
  <div 
    id="w-snow"
    ref="widget"
    :style="{
      position: 'absolute',
      left: (params.left - parent.left) + 'px',
      top: (params.top - parent.top) + 'px',
      width: params.width + 'px',
      height: params.height + 'px',
      borderTopLeftRadius: params.radiusTopLeft + 'px',
      borderTopRightRadius: params.radiusTopRight + 'px',
      borderBottomLeftRadius: params.radiusBottomLeft + 'px',
      borderBottomRightRadius: params.radiusBottomRight + 'px',
      opacity: params.opacity,
      'transform':'rotate('+params.rotate+'deg)',
      'z-index': params.zIndex
    }">
    <canvas ></canvas>
  </div>
</template>

<script>
// 形状-圆形组件
const NAME = "w-snow";

import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  setting: {
    name: "雪花特效",
    type: NAME,
    uuid: -1,
    width: 500,
    height: 500,
    left: 100,
    top: 100,
    opacity: 1,
    parent: "-1",
    color: "",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    size: 5,
    rotate: 0, //旋转角度
    setting: [],
    record: {
      width: 0,
      height: 0,
      minWidth: 1,
      minHeight: 1,
      dir: "all"
    }
  },
  props: ["params", "parent"],
  data() {
    return {};
  },
  updated() {},
  mounted() {
    this.onDraw();
  },
  computed: {
    ...mapGetters(["dActiveElement"])
  },
  methods: {
    ...mapActions([]),
    onDraw() {
      let ins = this
      function go() {
        "use strict";
        // JS1K's HTML shim gives us a canvas (a) and its 2D context (c) for free. We'll set them up here.

        let canvas = ins.$refs.widget.querySelector("canvas");
        let ctx = canvas.getContext("2d");

        canvas.style =
          "width: 100%; height: 100%; object-fit:contain; background:#000;";

        // Now we need a frame counter.

        // t=0

        let frame = 0;

        // B() is the requestAnimationFrame callback.

        // B=_=>{

        function onFrame() {
          // Set width and height on our canvases, we'll be using a smaller canvas for the godrays. This
          // also clears and resets their states. While we're at it, we'll store their dimensions in one
          // letter vars for later.

          // w=a[P]=512
          // h=a[Q]=256
          // W=E[P]=128
          // H=E[Q]=64

          canvas.width = 512;
          canvas.height = 256;
          godraysCanvas.width = 128;
          godraysCanvas.height = 64;

          // Set the sun's vertical position.

          // T=C(t++/w)*24

          let sunY = Math.cos(frame++ / 512) * 24; // This is actually the offset from the middle of the canvas.

          // Get the 2D context for our godrays canvas, and create abbreviations for all the context properties.

          // A(F=E.getContext`2d`)

          let godraysCtx = godraysCanvas.getContext("2d");

          // Now we set the godrays' context fillstyle (window.fy is 'fillStyle') to a newly created gradient
          // (cr is 'createRadialGradient') which we also run through our abbreviator.

          // A(F[fy]=g=F[cR](H,32+T,0,H,32+T,44)) // Could have shaved one more char here...

          let emissionGradient = godraysCtx.createRadialGradient(
            godraysCanvas.width / 2,
            godraysCanvas.height / 2 + sunY, // The sun's center.
            0, // Start radius.
            godraysCanvas.width / 2,
            godraysCanvas.height / 2 + sunY, // Sun's center again.
            44 // End radius.
          );
          godraysCtx.fillStyle = emissionGradient;

          // Now we addColorStops. This needs to be a dark gradient because our godrays effect will basically
          // overlay it on top of itself many many times, so anything lighter will result in lots of white.
          //
          // If you're not space-bound you can add another stop or two, maybe fade out to black, but this
          // actually looks good enough.

          // g[ao](.1,'#0C0804')
          // g[ao](.2,'#060201')

          emissionGradient.addColorStop(0.1, "#0C0804"); // Color for pixels in radius 0 to 4.4 (44 * .1).
          emissionGradient.addColorStop(0.2, "#060201"); // Color for everything past radius 8.8.

          // Now paint the gradient all over our godrays canvas.

          // F[fc](0,0,W,H)

          godraysCtx.fillRect(0, 0, godraysCanvas.width, godraysCanvas.height);

          // And set the fillstyle to black, we'll use it to paint our occlusion (mountains).

          // F[fy]='#000'

          godraysCtx.fillStyle = "#000";

          // For our 1K demo, we paint our sky a solid #644 reddish-brown. But here - let's do it right.

          // c[fy]=g='#644'
          // c[fc](0,0,w,h)

          let skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          skyGradient.addColorStop(0, "#2a3e55"); // Blueish at the top.
          skyGradient.addColorStop(0.7, "#8d4835"); // Reddish at the bottom.
          ctx.fillStyle = skyGradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Our mountains will be made by summing up sine waves of varying frequencies and amplitudes.

          // m=(f,j)=>[1721,947,547,233,73,31,7].reduce((a,v)=>a*j-C(f*v),0)

          function mountainHeight(position, roughness) {
            // Our frequencies (prime numbers to avoid extra repetitions).
            let frequencies = [1721, 947, 547, 233, 73, 31, 7];
            // Add them up.
            return frequencies.reduce(
              (height, freq) => height * roughness - Math.cos(freq * position),
              0
            );
          }
          for (let i = 0; i < 4; i++) {
            ctx.fillStyle = `hsl(7, 23%, ${23 - i * 6}%)`;
            for (let x = canvas.width; x--; ) {
              let mountainPosition = (frame + frame * i * i) / 1000 + x / 2000;
              let mountainRoughness = i / 19 - 0.5;
              let y =
                128 +
                i * 25 +
                mountainHeight(mountainPosition, mountainRoughness) * 45;
              ctx.fillRect(x, y, 1, 999); // 999 can be any large number...
              godraysCtx.fillRect(x / 4, y / 4 + 1, 1, 999);
            }
          }

          ctx.globalCompositeOperation = godraysCtx.globalCompositeOperation = "lighter";
          for (
            let scaleFactor = 1.07;
            scaleFactor < 5;
            scaleFactor *= scaleFactor
          ) {
            godraysCtx.drawImage(
              godraysCanvas,
              (godraysCanvas.width - godraysCanvas.width * scaleFactor) / 2,
              (godraysCanvas.height - godraysCanvas.height * scaleFactor) / 2 -
                sunY * scaleFactor +
                sunY,
              godraysCanvas.width * scaleFactor,
              godraysCanvas.height * scaleFactor
            );
          }

          ctx.drawImage(godraysCanvas, 0, 0, canvas.width, canvas.height);

          requestAnimationFrame(onFrame);
        }

        let godraysCanvas = canvas.cloneNode();
        onFrame();

        let encodedMelody =
          "!!----,*,(444420/20/-0/---,,--//((4444202/;;;;986986420/00--//,,";

        // M=[Y=[V=J=I=i=0]]
        let voiceBuffer = []; // M = [...]
        let ksDelayBuffer = []; // Y = [...]
        let sampleOffset = 0; // V = 0 (used later)
        let J = 0; // What the hell is J????
      }
      go();
    }
  }
};
</script>

<style scoped>
canvas {
  width:100%;height:100%;
}
</style>
