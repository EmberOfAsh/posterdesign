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

import { mapGetters, mapActions } from "vuex";

export default {
  props: ["params", "parent"],
  data() {
    return {};
  },
  updated() {},
  mounted() {
    this.doDraw();
  },
  computed: {
    ...mapGetters(["dActiveElement"])
  },
  methods: {
    ...mapActions([]),
    doDraw() {
      let canvas = this.$refs.widget.querySelector("canvas")
      let pi,ctx,cx,cy,playerZ,playerX,playerY,pitch,playerVX,playerVY,playerVZ,yaw,pitchV,yawV,scale,seedTimer
      ,seedInterval,seedLife,gravity,seeds
      ,sparkPics,sparks,sparkV,frames,pow1,pow2,pow3,pow4,type,pic1,pic2,pic3,point,point2,point1

      let s = "https://cantelope.org/NYE/";
      function initVars() {
        pi = Math.PI;
        ctx = canvas.getContext("2d");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        cx = canvas.width / 2;
        cy = canvas.height / 2;
        playerZ = -25;
        playerX = playerY = playerVX = playerVY = playerVZ = pitch = yaw = pitchV = yawV = 0;
        scale = 600;
        seedTimer = 0;
        (seedInterval = 5), (seedLife = 100);
        gravity = 0.02;
        seeds = new Array();
        sparkPics = new Array();
        for (let i = 1; i <= 10; ++i) {
          let sparkPic = new Image();
          sparkPic.src = s + "spark" + i + ".png";
          sparkPics.push(sparkPic);
        }
        sparks = new Array();
        pow1 = new Audio(s + "pow1.ogg");
        pow2 = new Audio(s + "pow2.ogg");
        pow3 = new Audio(s + "pow3.ogg");
        pow4 = new Audio(s + "pow4.ogg");
        frames = 0;
      }

      function rasterizePoint(x, y, z) {
        var p, d;
        x -= playerX;
        y -= playerY;
        z -= playerZ;
        p = Math.atan2(x, z);
        d = Math.sqrt(x * x + z * z);
        x = Math.sin(p - yaw) * d;
        z = Math.cos(p - yaw) * d;
        p = Math.atan2(y, z);
        d = Math.sqrt(y * y + z * z);
        y = Math.sin(p - pitch) * d;
        z = Math.cos(p - pitch) * d;
        var rx1 = -1000,
          ry1 = 1,
          rx2 = 1000,
          ry2 = 1,
          rx3 = 0,
          ry3 = 0,
          rx4 = x,
          ry4 = z,
          uc = (ry4 - ry3) * (rx2 - rx1) - (rx4 - rx3) * (ry2 - ry1);
        if (!uc)
          return {
            x: 0,
            y: 0,
            d: -1
          };
        var ua = ((rx4 - rx3) * (ry1 - ry3) - (ry4 - ry3) * (rx1 - rx3)) / uc;
        var ub = ((rx2 - rx1) * (ry1 - ry3) - (ry2 - ry1) * (rx1 - rx3)) / uc;
        if (!z) z = 0.000000001;
        if (ua > 0 && ua < 1 && ub > 0 && ub < 1) {
          return {
            x: cx + (rx1 + ua * (rx2 - rx1)) * scale,
            y: cy + (y / z) * scale,
            d: Math.sqrt(x * x + y * y + z * z)
          };
        } else {
          return {
            x: cx + (rx1 + ua * (rx2 - rx1)) * scale,
            y: cy + (y / z) * scale,
            d: -1
          };
        }
      }

      function spawnSeed() {
        let seed = new Object();
        seed.x = -50 + Math.random() * 100;
        seed.y = 25;
        seed.z = -50 + Math.random() * 100;
        seed.vx = 0.1 - Math.random() * 0.2;
        seed.vy = -1.5; //*(1+Math.random()/2);
        seed.vz = 0.1 - Math.random() * 0.2;
        seed.born = frames;
        seeds.push(seed);
      }

      function splode(x, y, z) {
        let t = 5 + parseInt(Math.random() * 150);
        sparkV = 1 + Math.random() * 2.5;
        type = parseInt(Math.random() * 3);
        switch (type) {
          case 0:
            pic1 = parseInt(Math.random() * 10);
            break;
          case 1:
            pic1 = parseInt(Math.random() * 10);
            do {
              pic2 = parseInt(Math.random() * 10);
            } while (pic2 == pic1);
            break;
          case 2:
            pic1 = parseInt(Math.random() * 10);
            do {
              pic2 = parseInt(Math.random() * 10);
            } while (pic2 == pic1);
            do {
              pic3 = parseInt(Math.random() * 10);
            } while (pic3 == pic1 || pic3 == pic2);
            break;
        }
        for (let m = 1; m < t; ++m) {
          let spark = new Object();
          spark.x = x;
          spark.y = y;
          spark.z = z;
          let p1 = pi * 2 * Math.random();
          let p2 = pi * Math.random();
          let v = sparkV * (1 + Math.random() / 6);
          spark.vx = Math.sin(p1) * Math.sin(p2) * v;
          spark.vz = Math.cos(p1) * Math.sin(p2) * v;
          spark.vy = Math.cos(p2) * v;
          switch (type) {
            case 0:
              spark.img = sparkPics[pic1];
              break;
            case 1:
              spark.img = sparkPics[parseInt(Math.random() * 2) ? pic1 : pic2];
              break;
            case 2:
              switch (parseInt(Math.random() * 3)) {
                case 0:
                  spark.img = sparkPics[pic1];
                  break;
                case 1:
                  spark.img = sparkPics[pic2];
                  break;
                case 2:
                  spark.img = sparkPics[pic3];
                  break;
              }
              break;
          }
          spark.radius = 25 + Math.random() * 50;
          spark.alpha = 1;
          spark.trail = new Array();
          sparks.push(spark);
        }
        let pow
        switch (parseInt(Math.random() * 4)) {
          case 0:
            pow = new Audio(s + "pow1.ogg");
            break;
          case 1:
            pow = new Audio(s + "pow2.ogg");
            break;
          case 2:
            pow = new Audio(s + "pow3.ogg");
            break;
          case 3:
            pow = new Audio(s + "pow4.ogg");
            break;
        }
        let d = Math.sqrt(
          (x - playerX) * (x - playerX) +
            (y - playerY) * (y - playerY) +
            (z - playerZ) * (z - playerZ)
        );
        pow.volume = 1.5 / (1 + d / 10);
        pow.play();
      }

      function doLogic() {
        if (seedTimer < frames) {
          seedTimer = frames + seedInterval * Math.random() * 10;
          spawnSeed();
        }
        for (let i = 0; i < seeds.length; ++i) {
          seeds[i].vy += gravity;
          seeds[i].x += seeds[i].vx;
          seeds[i].y += seeds[i].vy;
          seeds[i].z += seeds[i].vz;
          if (frames - seeds[i].born > seedLife) {
            splode(seeds[i].x, seeds[i].y, seeds[i].z);
            seeds.splice(i, 1);
          }
        }
        for (let i = 0; i < sparks.length; ++i) {
          if (sparks[i].alpha > 0 && sparks[i].radius > 5) {
            sparks[i].alpha -= 0.01;
            sparks[i].radius /= 1.02;
            sparks[i].vy += gravity;
            point = new Object();
            point.x = sparks[i].x;
            point.y = sparks[i].y;
            point.z = sparks[i].z;
            if (sparks[i].trail.length) {
              let x = sparks[i].trail[sparks[i].trail.length - 1].x;
              let y = sparks[i].trail[sparks[i].trail.length - 1].y;
              let z = sparks[i].trail[sparks[i].trail.length - 1].z;
              let d =
                (point.x - x) * (point.x - x) +
                (point.y - y) * (point.y - y) +
                (point.z - z) * (point.z - z);
              if (d > 9) {
                sparks[i].trail.push(point);
              }
            } else {
              sparks[i].trail.push(point);
            }
            if (sparks[i].trail.length > 5) sparks[i].trail.splice(0, 1);
            sparks[i].x += sparks[i].vx;
            sparks[i].y += sparks[i].vy;
            sparks[i].z += sparks[i].vz;
            sparks[i].vx /= 1.075;
            sparks[i].vy /= 1.075;
            sparks[i].vz /= 1.075;
          } else {
            sparks.splice(i, 1);
          }
        }
        let p = Math.atan2(playerX, playerZ);
        let d = Math.sqrt(playerX * playerX + playerZ * playerZ);
        d += Math.sin(frames / 80) / 1.25;
        let t = Math.sin(frames / 200) / 40;
        playerX = Math.sin(p + t) * d;
        playerZ = Math.cos(p + t) * d;
        yaw = pi + p + t;
      }

      function rgb(col) {
        var r = parseInt((0.5 + Math.sin(col) * 0.5) * 16);
        var g = parseInt((0.5 + Math.cos(col) * 0.5) * 16);
        var b = parseInt((0.5 - Math.sin(col) * 0.5) * 16);
        return "#" + r.toString(16) + g.toString(16) + b.toString(16);
      }

      function draw() {
        let size,d,a
        ctx.clearRect(0, 0, cx * 2, cy * 2);

        ctx.fillStyle = "#ff8";
        for (let i = -100; i < 100; i += 3) {
          for (let j = -100; j < 100; j += 4) {
            let x = i;
            let z = j;
            let y = 25;
            let point = rasterizePoint(x, y, z);
            if (point.d != -1) {
              size = 250 / (1 + point.d);
              d = Math.sqrt(x * x + z * z);
              a = 0.75 - Math.pow(d / 100, 6) * 0.75;
              if (a > 0) {
                ctx.globalAlpha = a;
                ctx.fillRect(
                  point.x - size / 2,
                  point.y - size / 2,
                  size,
                  size
                );
              }
            }
          }
        }
        ctx.globalAlpha = 1;
        for (let i = 0; i < seeds.length; ++i) {
          let point = rasterizePoint(seeds[i].x, seeds[i].y, seeds[i].z);
          if (point.d != -1) {
            size = 200 / (1 + point.d);
            ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
          }
        }
        let point1 = new Object();
        for (let i = 0; i < sparks.length; ++i) {
          point = rasterizePoint(sparks[i].x, sparks[i].y, sparks[i].z);
          if (point.d != -1) {
            size = (sparks[i].radius * 200) / (1 + point.d);
            if (sparks[i].alpha < 0) sparks[i].alpha = 0;
            if (sparks[i].trail.length) {
              point1.x = point.x;
              point1.y = point.y;
              switch (sparks[i].img) {
                case sparkPics[0]:
                  ctx.strokeStyle = "#f84";
                  break;
                case sparkPics[1]:
                  ctx.strokeStyle = "#84f";
                  break;
                case sparkPics[2]:
                  ctx.strokeStyle = "#8ff";
                  break;
                case sparkPics[3]:
                  ctx.strokeStyle = "#fff";
                  break;
                case sparkPics[4]:
                  ctx.strokeStyle = "#4f8";
                  break;
                case sparkPics[5]:
                  ctx.strokeStyle = "#f44";
                  break;
                case sparkPics[6]:
                  ctx.strokeStyle = "#f84";
                  break;
                case sparkPics[7]:
                  ctx.strokeStyle = "#84f";
                  break;
                case sparkPics[8]:
                  ctx.strokeStyle = "#fff";
                  break;
                case sparkPics[9]:
                  ctx.strokeStyle = "#44f";
                  break;
              }
              for (let j = sparks[i].trail.length - 1; j >= 0; --j) {
                point2 = rasterizePoint(
                  sparks[i].trail[j].x,
                  sparks[i].trail[j].y,
                  sparks[i].trail[j].z
                );
                if (point2.d != -1) {
                  ctx.globalAlpha =
                    ((j / sparks[i].trail.length) * sparks[i].alpha) / 2;
                  ctx.beginPath();
                  ctx.moveTo(point1.x, point1.y);
                  ctx.lineWidth =
                    1 +
                    (sparks[i].radius * 10) /
                      (sparks[i].trail.length - j) /
                      (1 + point2.d);
                  ctx.lineTo(point2.x, point2.y);
                  ctx.stroke();
                  point1.x = point2.x;
                  point1.y = point2.y;
                }
              }
            }
            ctx.globalAlpha = sparks[i].alpha;
            ctx.drawImage(
              sparks[i].img,
              point.x - size / 2,
              point.y - size / 2,
              size,
              size
            );
          }
        }
      }

      function frame() {
        if (frames > 100000) {
          seedTimer = 0;
          frames = 0;
        }
        frames++;
        draw();
        doLogic();
        requestAnimationFrame(frame);
      }

      window.addEventListener("resize", () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        cx = canvas.width / 2;
        cy = canvas.height / 2;
      });

      initVars();
      frame();
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
