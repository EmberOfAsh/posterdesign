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
    <canvas></canvas>
  </div>
</template>

<script>
// 形状-圆形组件
const NAME = "w-fire-work1";

import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  setting: {
    name: "烟花效果",
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
    this.a();
  },
  computed: {
    ...mapGetters(["dActiveElement"])
  },
  methods: {
    ...mapActions([]),
    a() {
      let ins = this;
      var ctx = this.$refs.widget.querySelector("canvas").getContext("2d");
      ctx.canvas.width = this.params.width;
      ctx.canvas.height = this.params.height;

      var sparks = [];
      var fireworks = [];
      var i = 20;
      while (i--) {
        fireworks.push(
          new Firework(
            Math.random() * this.params.width,
            this.params.height * Math.random()
          )
        );
      }

      render();

      function render() {
        setTimeout(render, 1000 / 60);
        ctx.fillStyle = ins.params.backgroundColor; //'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (var firework of fireworks) {
          if (firework.dead) continue;
          firework.move();
          firework.draw();
        }
        for (var spark of sparks) {
          if (spark.dead) continue;
          spark.move();
          spark.draw();
        }

        if (Math.random() < 0.05) {
          fireworks.push(new Firework());
        }
      }

      function Spark(x, y, color) {
        this.x = x;
        this.y = y;
        this.dir = Math.random() * (Math.PI * 2);
        this.dead = false;
        this.color = color;
        this.speed = Math.random() * 3 + 3;
        this.walker = new Walker({
          radius: 20,
          speed: 0.25
        });
        this.gravity = 0.25;
        this.dur = this.speed / 0.1;
        this.move = function() {
          this.dur--;
          if (this.dur < 0) this.dead = true;

          if (this.speed < 0) return;
          if (this.speed > 0) this.speed -= 0.1;
          var walk = this.walker.step();
          this.x += Math.cos(this.dir + walk) * this.speed;
          this.y += Math.sin(this.dir + walk) * this.speed;
          this.y += this.gravity;
          this.gravity += 0.05;
        };
        this.draw = function() {
          drawCircle(this.x, this.y, 3, this.color);
        };
      }

      function Firework(x, y) {
        this.xmove = new Walker({
          radius: 10,
          speed: 0.5
        });
        this.x = x || Math.random() * ctx.canvas.width;
        this.y = y || ctx.canvas.height;
        this.height = Math.random() * ctx.canvas.height / 2;
        this.dead = false;
        this.color = randomColor();

        this.move = function() {
          this.x += this.xmove.step();
          if (this.y > this.height) this.y -= 1;
          else this.burst();
        };
        this.draw = function() {
          drawCircle(this.x, this.y, 1, this.color);
        };
        this.burst = function() {
          this.dead = true;
          var i = 100;
          while (i--) sparks.push(new Spark(this.x, this.y, this.color));
        };
      }

      function drawCircle(x, y, radius, color) {
        color = color || "#FFF";
        ctx.fillStyle = color;
        ctx.fillRect(x - radius / 2, y - radius / 2, radius, radius);
      }

      function randomColor() {
        return ["#6ae5ab", "#88e3b2", "#36b89b", "#7bd7ec", "#66cbe1"][
          Math.floor(Math.random() * 5)
        ];
      }

      function Walker(options) {
        this.step = function() {
          this.direction = Math.sign(this.target) * this.speed;
          this.value += this.direction;
          this.target
            ? (this.target -= this.direction)
            : this.value
              ? this.wander
                ? (this.target = this.newTarget())
                : (this.target = -this.value)
              : (this.target = this.newTarget());
          return this.direction;
        };

        this.newTarget = function() {
          return Math.round(Math.random() * (this.radius * 2) - this.radius);
        };

        this.start = 0;
        this.value = 0;
        this.radius = options.radius;
        this.target = this.newTarget();
        this.direction = Math.sign(this.target);
        this.wander = options.wander;
        this.speed = options.speed || 1;
      }
    }
  }
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
