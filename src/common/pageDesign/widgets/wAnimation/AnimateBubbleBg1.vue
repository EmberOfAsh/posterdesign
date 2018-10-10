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
    <canvas id="c1"></canvas>
    <canvas id="c2"></canvas>
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
      var c1 = this.$refs.widget.querySelector("#c1"),
        ctx1 = c1.getContext("2d"),
        c2 = this.$refs.widget.querySelector("#c2"),
        ctx2 = c2.getContext("2d"),
        twopi = Math.PI * 2,
        parts = [],
        sizeBase,
        cw,ch,
        opt,
        hue,
        count;

      function rand(min, max) {
        return Math.random() * (max - min) + min;
      }

      function hsla(h, s, l, a) {
        return "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
      }

      function create() {
        sizeBase = cw + ch;
        (count = Math.floor(sizeBase * 0.3)),
          (hue = rand(0, 360)),
          (opt = {
            radiusMin: 1,
            radiusMax: sizeBase * 0.04,
            blurMin: 10,
            blurMax: sizeBase * 0.04,
            hueMin: hue,
            hueMax: hue + 100,
            saturationMin: 10,
            saturationMax: 70,
            lightnessMin: 20,
            lightnessMax: 50,
            alphaMin: 0.1,
            alphaMax: 0.5
          });
        ctx1.clearRect(0, 0, cw, ch);
        ctx1.globalCompositeOperation = "lighter";
        while (count--) {
          var radius = rand(opt.radiusMin, opt.radiusMax),
            blur = rand(opt.blurMin, opt.blurMax),
            x = rand(0, cw),
            y = rand(0, ch),
            hue = rand(opt.hueMin, opt.hueMax),
            saturation = rand(opt.saturationMin, opt.saturationMax),
            lightness = rand(opt.lightnessMin, opt.lightnessMax),
            alpha = rand(opt.alphaMin, opt.alphaMax);

          ctx1.shadowColor = hsla(hue, saturation, lightness, alpha);
          ctx1.shadowBlur = blur;
          ctx1.beginPath();
          ctx1.arc(x, y, radius, 0, twopi);
          ctx1.closePath();
          ctx1.fill();
        }

        parts.length = 0;
        for (var i = 0; i < Math.floor((cw + ch) * 0.03); i++) {
          parts.push({
            radius: rand(1, sizeBase * 0.03),
            x: rand(0, cw),
            y: rand(0, ch),
            angle: rand(0, twopi),
            vel: rand(0.1, 0.5),
            tick: rand(0, 10000)
          });
        }
      }

      function init() {
        resize();
        create();
        loop();
      }

      function loop() {
        requestAnimationFrame(loop);

        ctx2.clearRect(0, 0, cw, ch);
        ctx2.globalCompositeOperation = "source-over";
        ctx2.shadowBlur = 0;
        ctx2.drawImage(c1, 0, 0);
        ctx2.globalCompositeOperation = "lighter";

        var i = parts.length;
        ctx2.shadowBlur = 15;
        ctx2.shadowColor = "#fff";
        while (i--) {
          var part = parts[i];

          part.x += Math.cos(part.angle) * part.vel;
          part.y += Math.sin(part.angle) * part.vel;
          part.angle += rand(-0.05, 0.05);

          ctx2.beginPath();
          ctx2.arc(part.x, part.y, part.radius, 0, twopi);
          ctx2.fillStyle = hsla(
            0,
            0,
            100,
            0.075 + Math.cos(part.tick * 0.02) * 0.05
          );
          ctx2.fill();

          if (part.x - part.radius > cw) {
            part.x = -part.radius;
          }
          if (part.x + part.radius < 0) {
            part.x = cw + part.radius;
          }
          if (part.y - part.radius > ch) {
            part.y = -part.radius;
          }
          if (part.y + part.radius < 0) {
            part.y = ch + part.radius;
          }

          part.tick++;
        }
      }

      function resize() {
        (cw = c1.width = c2.width = ins.params.width),
          (ch = c1.height = c2.height = ins.params.height);
        create();
      }

      function click() {
        create();
      }

      this.$refs.widget.addEventListener("resize", resize);
      this.$refs.widget.addEventListener("click", click);

      init();
    }
  }
};
</script>

<style scoped>
canvas {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
#c1 {
  opacity: 0;
}

#c2 {
  background: #000;
}
</style>
