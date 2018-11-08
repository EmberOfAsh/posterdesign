<template>
  <div 
    ref="widget"
    id="ambiance-animate"
    comp-name="w-snow"
    comp-data="{}"
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
    <canvas></canvas>
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
    this.b();
  },
  computed: {
    ...mapGetters(["dActiveElement"])
  },
  methods: {
    ...mapActions([]),
    b() {
      let ins = this;
       new function() {
        //canvas init
        var canvas = ins.$refs.widget.querySelector("canvas");
        var ctx = canvas.getContext("2d");

        //canvas dimensions
        var W = window.innerWidth;
        var H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        //snowflake particles
        var mp = 3000; //max particles
        var particles = [];
        for (var i = 0; i < mp; i++) {
          particles.push({
            x: Math.random() * W, //x-coordinate
            y: Math.random() * H, //y-coordinate
            r: Math.random() * 3 + 1, //radius
            d: Math.random() * mp //density
          });
        }

        //Lets draw the flakes
        function draw() {
          ctx.clearRect(0, 0, W, H);
          //ctx.fillStyle = "#000"
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          /* ctx.fillStyle = "#FF0000";*/
          ctx.beginPath();
          for (var i = 0; i < mp; i++) {
            var p = particles[i];
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
          }
          ctx.fill();
          update();
        }

        //Function to move the snowflakes
        //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
        var angle = 0;
        function update() {
          angle += 0.01;
          for (var i = 0; i < mp; i++) {
            var p = particles[i];
            //Updating X and Y coordinates
            //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
            //Every particle has its own density which can be used to make the downward movement different for each flake
            //Lets make it more random by adding in the radius
            p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
            p.x += Math.sin(angle) * 2;

            //Sending flakes back from the top when it exits
            //Lets make it a bit more organic and let flakes enter from the left and right also.
            if (p.x > W || p.x < 0 || p.y > H) {
              if (i % 3 > 0) {
                //66.67% of the flakes
                particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d };
              } else {
                //If the flake is exitting from the right
                if (Math.sin(angle) > 0) {
                  //Enter fromth
                  particles[i] = {
                    x: -5,
                    y: Math.random() * H,
                    r: p.r,
                    d: p.d
                  };
                } else {
                  //Enter from the right
                  particles[i] = {
                    x: W + 5,
                    y: Math.random() * H,
                    r: p.r,
                    d: p.d
                  };
                }
              }
            }
          }
        }

        //animation loop
        setInterval(draw, 15);
      }();
    },
    a() {}
  }
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
