<template>
  <div id="w-image-style">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="位置" name="1">
        <div class="line-layout">
          <number-input label="X" v-model="innerElement.left" @finish="(value) => finish('left', value)" />
          <number-input label="Y" v-model="innerElement.top" @finish="(value) => finish('top', value)" />
          <number-input label="宽" v-model="innerElement.width" @finish="(value) => finish('width', value)" />
          <number-input label="高" v-model="innerElement.height" @finish="(value) => finish('height', value)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="圆角设置" name="5">
        <number-slider 
          class="style-item" 
          label="左上圆角" 
          v-model="innerElement.radiusTopLeft" 
          :maxValue="Math.min(innerElement.record.width, innerElement.record.height)" 
          @finish="(value) => finish('radiusTopLeft', value)" />
        <number-slider 
          class="style-item" 
          label="右上圆角" 
          v-model="innerElement.radiusTopRight" 
          :maxValue="Math.min(innerElement.record.width, innerElement.record.height)" 
          @finish="(value) => finish('radiusTopRight', value)" />
        <number-slider 
          class="style-item" 
          label="左下圆角" 
          v-model="innerElement.radiusBottomLeft" 
          :maxValue="Math.min(innerElement.record.width, innerElement.record.height)" 
          @finish="(value) => finish('radiusBottomLeft', value)" />
        <number-slider 
          class="style-item" 
          label="右上圆角" 
          v-model="innerElement.radiusBottomRight" 
          :maxValue="Math.min(innerElement.record.width, innerElement.record.height)" 
          @finish="(value) => finish('radiusBottomRight', value)" />
      </el-collapse-item>
      <el-collapse-item title="模糊效果" name="6">
         <div class="line-layout style-item">
          <color-select label="遮罩开始颜色" v-model="innerElement.shadow.startColor" @finish="(value) => finish('shadow.startColor', value)" />
          <color-select label="遮罩结束颜色" v-model="innerElement.shadow.endColor" @finish="(value) => finish('shadow.endColor', value)" />
        </div>
        <number-slider 
            class="style-item" 
            label="高斯模糊" 
            v-model="innerElement.shadow.filter" 
            :maxValue="50" 
            @finish="(value) => finish('shadow.filter', value)" />
      </el-collapse-item>
      <el-collapse-item title="形状路径" name="7">
<el-button size="small" type="danger" @click="()=>this.finish('shadow.clipPath', null)">清除形状</el-button>

<section tabindex="-1" class="shapes vertical" @click="choseClipPath">
<ul>
  <figure class="gallery-cell" data-name="三角形" data-type="polygon" data-coords="50,0 0,100 100,100">
    <div style="-webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 100%);  clip-path: polygon(50% 0%, 0% 100%, 100% 100%)" class="shape 三角形"></div>
    <figcaption>三角形</figcaption>
  </figure>
  <figure class="gallery-cell" data-name="梯形" data-type="polygon" data-coords="20,0 80,0 100,100 0,100">
    <div style="-webkit-clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);  clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" class="shape 梯形"></div>
    <figcaption>梯形</figcaption></figure>
  <figure class="gallery-cell" data-name="平行四边形" data-type="polygon" data-coords="25,0 100,0 75,100 0,100">
    <div style="-webkit-clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);  clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)" class="shape 平行四边形"></div>
    <figcaption>平行四边形</figcaption></figure>
  <figure class="gallery-cell" data-name="菱形" data-type="polygon" data-coords="50,0 100,50 50,100 0,50">
    <div style="-webkit-clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" class="shape 菱形"></div>
    <figcaption>菱形</figcaption></figure>
  <figure class="gallery-cell" data-name="五边形" data-type="polygon" data-coords="50,0 100,38 82,100 18,100 0,38">
    <div style="-webkit-clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" class="shape 五边形"></div>
    <figcaption>五边形</figcaption></figure>
  <figure class="gallery-cell" data-name="六边形" data-type="polygon" data-coords="50,0 100,25 100,75 50,100 0,75 0,25">
    <div style="-webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" class="shape 六边形"></div>
    <figcaption>六边形</figcaption></figure>
  <figure class="gallery-cell on" data-name="七边形" data-type="polygon" data-coords="50,0 90,20 100,60 75,100 25,100 0,60 10,20">
    <div style="-webkit-clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%);  clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)" class="shape 七边形"></div>
    <figcaption>七边形</figcaption></figure>
  <figure class="gallery-cell" data-name="八边形" data-type="polygon" data-coords="30,0 70,0 100,30 100,70 70,100 30,100 0,70 0,30">
    <div style="-webkit-clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);  clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" class="shape 八边形"></div>
    <figcaption>八边形</figcaption></figure>
  <figure class="gallery-cell" data-name="九边形" data-type="polygon" data-coords="50,0 83,12 100,43 94,78 68,100 32,100 6,78 0,43 17,12">
    <div style="-webkit-clip-path: polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%);  clip-path: polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)" class="shape 九边形"></div>
    <figcaption>九边形</figcaption></figure>
  <figure class="gallery-cell" data-name="十边形" data-type="polygon" data-coords="50,0 80,10 100,35 100,70 80,90 50,100 20,90 0,70 0,35 20,10">
    <div style="-webkit-clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%);  clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)" class="shape 十边形"></div>
    <figcaption>十边形</figcaption></figure>
  <figure class="gallery-cell" data-name="锥形" data-type="polygon" data-coords="20,0 80,0 100,20 100,80 80,100 20,100 0,80 0,20">
    <div style="-webkit-clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);  clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)" class="shape 锥形"></div>
    <figcaption>锥形</figcaption></figure>
  <figure class="gallery-cell" data-name="槽口形" data-type="polygon" data-coords="0,15 15,15 15,0 85,0 85,15 100,15 100,85 85,85 85,100 15,100 15,85 0,85">
    <div style="-webkit-clip-path: polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%);  clip-path: polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)" class="shape 槽口形"></div>
    <figcaption>槽口形</figcaption></figure>
  <figure class="gallery-cell" data-name="左箭头形" data-type="polygon" data-coords="40,0 40,20 100,20 100,80 40,80 40,100 0,50">
    <div style="-webkit-clip-path: polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%);  clip-path: polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)" class="shape 左箭头形"></div>
    <figcaption>左箭头形</figcaption></figure>
  <figure class="gallery-cell" data-name="右箭头形" data-type="polygon" data-coords="0,20 60,20 60,0 100,50 60,100 60,80 0,80">
    <div style="-webkit-clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%);  clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)" class="shape 右箭头形"></div>
    <figcaption>右箭头形</figcaption></figure>
  <figure class="gallery-cell" data-name="左指示形" data-type="polygon" data-coords="25,0 100,1 100,100 25,100 0,50">
    <div style="-webkit-clip-path: polygon(25% 0%, 100% 1%, 100% 100%, 25% 100%, 0% 50%);  clip-path: polygon(25% 0%, 100% 1%, 100% 100%, 25% 100%, 0% 50%)" class="shape 左指示形"></div>
    <figcaption>左指示形</figcaption></figure>
  <figure class="gallery-cell" data-name="右指示形" data-type="polygon" data-coords="0,0 75,0 100,50 75,100 0,100">
    <div style="-webkit-clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);  clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)" class="shape 右指示形"></div>
    <figcaption>右指示形</figcaption></figure>
  <figure class="gallery-cell" data-name="左臂章形" data-type="polygon" data-coords="100,0 75,50 100,100 25,100 0,50 25,0">
    <div style="-webkit-clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%);  clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%)" class="shape 左臂章形"></div>
    <figcaption>左臂章形</figcaption></figure>
  <figure class="gallery-cell" data-name="右臂章形" data-type="polygon" data-coords="75,0 100,50 75,100 0,100 25,50 0,0">
    <div style="-webkit-clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)" class="shape 右臂章形"></div>
    <figcaption>右臂章形</figcaption></figure>
  <figure class="gallery-cell" data-name="星形" data-type="polygon" data-coords="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35">
    <div style="-webkit-clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" class="shape 星形"></div>
    <figcaption>星形</figcaption></figure>
  <figure class="gallery-cell" data-name="十字形" data-type="polygon" data-coords="10,25 35,25 35,0 65,0 65,25 90,25 90,50 65,50 65,100 35,100 35,50 10,50">
    <div style="-webkit-clip-path: polygon(10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%);  clip-path: polygon(10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%)" class="shape 十字形"></div>
    <figcaption>十字形</figcaption></figure>
  <figure class="gallery-cell" data-name="消息窗口形" data-type="polygon" data-coords="0,0 100,0 100,75 75,75 75,100 50,75 0,75">
    <div style="-webkit-clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);  clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)" class="shape 消息窗口形"></div>
    <figcaption>消息窗口形</figcaption></figure>
  <figure class="gallery-cell" data-name="关闭按钮形" data-type="polygon" data-coords="20,0 0,20 30,50 0,80 20,100 50,70 80,100 100,80 70,50 100,20 80,0 50,30">
    <div style="-webkit-clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);  clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)" class="shape 关闭按钮形"></div>
    <figcaption>关闭按钮形</figcaption></figure>
  <figure class="gallery-cell" data-name="空心框架形" data-type="polygon" data-coords="0,0 0,100 25,100 25,25 75,25 75,75 25,75 25,100 100,100 100,0">
    <div style="-webkit-clip-path: polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%);  clip-path: polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)" class="shape 空心框架形"></div>
    <figcaption>空心框架形</figcaption></figure>
  <figure class="gallery-cell" data-name="实心框架形" data-type="inset" data-coords="5 20 15 10">
    <div style="-webkit-clip-path: inset(5% 20% 15% 10%);  clip-path: inset(5% 20% 15% 10%)" class="shape 实心框架形"></div>
    <figcaption>实心框架形</figcaption></figure>
  <figure class="gallery-cell" data-name="自定义" data-type="custom" data-coords="10,75 10,25 35,0 100,10 90,30 50,30 40,40 40,60 50,70 90,70 100,90 35,100">
    <div style="-webkit-clip-path: polygon(10% 75%, 10% 25%, 35% 0%, 100% 10%, 90% 30%, 50% 30%, 40% 40%, 40% 60%, 50% 70%, 90% 70%, 100% 90%, 35% 100%);  clip-path: polygon(10% 75%, 10% 25%, 35% 0%, 100% 10%, 90% 30%, 50% 30%, 40% 40%, 40% 60%, 50% 70%, 90% 70%, 100% 90%, 35% 100%)" class="shape 自定义"></div>
    <figcaption>自定义</figcaption></figure>
  <figure class="gallery-cell" data-name="Circle" data-type="circle">
    <div style="-webkit-clip-path: circle(50% at 50% 50%);  clip-path: circle(50% at 50% 50%)" class="shape 圆形"></div>
    <figcaption>圆形</figcaption></figure>
  <figure class="gallery-cell" data-name="Ellipse" data-type="ellipse">
    <div style="-webkit-clip-path: ellipse(25% 40% at 50% 50%);  clip-path: ellipse(25% 40% at 50% 50%)" class="shape 椭圆形"></div>
    <figcaption>椭圆形</figcaption></figure>
</ul>
				
			</section>
      </el-collapse-item>
      <el-collapse-item title="样式设置" name="2">
        <number-slider 
          class="style-item" 
          label="旋转角度" 
          v-model="innerElement.rotate" 
          :maxValue="360" 
          @finish="(value) => finish('rotate', value)" />
        <icon-item-select class="style-item" label="图层层级" :data="layerIconList" @finish="layerAction"/>
        <icon-item-select label="组件对齐" :data="alignIconList" @finish="alignAction"/>
      </el-collapse-item>
      <el-collapse-item title="更改图片" name="3">
        <el-button @click="updateViewImageDialog({display:true})">上传</el-button>
        <el-button @click="updateViewImageAlbum({display:true})">素材库选择</el-button>
      </el-collapse-item>
      <el-collapse-item title="其他设置" name="4">
        <text-input label="图层名称" v-model="innerElement.name" @finish="(value) => finish('name', value)" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
// 图片组件样式
const NAME = "w-image-style";
import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  data() {
    return {
      showImgDialog: false,
      activeNames: ["1", "2", "3", "4"],
      innerElement: {},
      tag: false,
      ingoreKeys: [
        "left",
        "top",
        "name",
        "width",
        "height",
        "radiusTopLeft",
        "radiusTopRight",
        "radiusBottomLeft",
        "radiusBottomRight"
      ],
      layerIconList: [
        {
          key: "zIndex",
          icon: "icon-layer-up",
          tip: "上一层",
          value: 1
        },
        {
          key: "zIndex",
          icon: "icon-layer-down",
          tip: "下一层",
          value: -1
        }
      ],
      alignIconList: [
        {
          key: "align",
          icon: "icon-align-left",
          tip: "左对齐",
          value: "left"
        },
        {
          key: "align",
          icon: "icon-align-center-horiz",
          tip: "水平居中对齐",
          value: "ch"
        },
        {
          key: "align",
          icon: "icon-align-right",
          tip: "右对齐",
          value: "right"
        },
        {
          key: "align",
          icon: "icon-align-top",
          tip: "上对齐",
          value: "top"
        },
        {
          key: "align",
          icon: "icon-align-center-verti",
          tip: "垂直居中对齐",
          value: "cv"
        },
        {
          key: "align",
          icon: "icon-align-bottom",
          tip: "下对齐",
          value: "bottom"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["dActiveElement", "dMoving"])
  },
  watch: {
    dActiveElement: {
      handler(newValue, oldValue) {
        this.change();
      },
      deep: true
    },
    innerElement: {
      handler(newValue, oldValue) {
        this.changeValue();
      },
      deep: true
    }
  },
  created() {
    this.change();
  },
  methods: {
    ...mapActions([
      "updateWidgetData",
      "updateAlign",
      "updateLayerIndex",
      "updateViewImageDialog",
      "updateViewImageAlbum"
    ]),
    change() {
      this.tag = true;
      this.innerElement = JSON.parse(JSON.stringify(this.dActiveElement));
    },
    changeValue() {
      if (this.tag) {
        this.tag = false;
        return;
      }
      if (this.dMoving) {
        return;
      }
      for (let key in this.innerElement) {
        if (this.ingoreKeys.indexOf(key) !== -1) {
          this.dActiveElement[key] = this.innerElement[key];
        } else if (
          key !== "setting" &&
          key !== "record" &&
          this.innerElement[key] !== this.dActiveElement[key]
        ) {
          this.updateWidgetData({
            uuid: this.dActiveElement.uuid,
            key: key,
            value: this.innerElement[key]
          });
        }
      }
    },
    finish(key, value) {
      this.updateWidgetData({
        uuid: this.dActiveElement.uuid,
        key: key,
        value: value,
        pushHistory: true
      });
    },
    layerAction(item) {
      this.updateLayerIndex({
        uuid: this.dActiveElement.uuid,
        value: item.value
      });
    },
    alignAction(item) {
      this.updateAlign({
        align: item.value,
        uuid: this.dActiveElement.uuid
      });
    },
    choseClipPath(){
      let node = event.target.parentElement
      if(node.tagName != 'FIGURE') return
      let style = node.children[0].style
      let clipPath = style.clipPath
      console.debug('选择 clip-path',clipPath)
      this.finish('shadow.clipPath', clipPath)
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

#w-image-style {
  width: 100%;
  height: 100%;
}

.line-layout {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.style-item {
  margin-bottom: 10px;
}

.setting-list {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}

.shapes.vertical {
  display: block;
}

.shapes {
  position: relative;
  max-width: 100%;
  background: #d3d0c9;
  white-space: nowrap;
  overflow-x: hidden;
}

figure {
  float: left;
  text-align: center;
  padding: 0.625rem 0.25rem;
  margin: 0.25rem;
  background: #fff;
  width: 4.125rem;
  box-shadow: 0 1px 2px rgba(16, 10, 9, 0.15);
  border-radius: 2px;
  -webkit-transition: background 0.25s, -webkit-transform 0.5s;
  transition: background 0.25s, transform 0.5s;
  -ms-user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-callout: none;
}

figure .shape {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  background: currentColor;
}

figure figcaption {
  display: block;
  font-size: 0.75rem;
  color: #100a09;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 0.5rem;
  padding: 0 0.25rem;
  line-height: 1.5;
}

figure:nth-of-type(1) {
  color: tomato;
}

.handle:nth-of-type(2), .point:nth-of-type(2), figure:nth-of-type(2) {
  color: #3cb371;
}

.handle:nth-of-type(3), .point:nth-of-type(3), figure:nth-of-type(3) {
  color: orange;
}

.handle:nth-of-type(4), .point:nth-of-type(4), figure:nth-of-type(4) {
  color: #1e90ff;
}

.handle:nth-of-type(5), .point:nth-of-type(5), figure:nth-of-type(5) {
  color: orchid;
}

.handle:nth-of-type(6), .point:nth-of-type(6), figure:nth-of-type(6) {
  color: #d3d3d3;
}

.handle:nth-of-type(7), .point:nth-of-type(7), figure:nth-of-type(7) {
  color: #00ced1;
}

.handle:nth-of-type(8), .point:nth-of-type(8), figure:nth-of-type(8) {
  color: #db7093;
}

.handle:nth-of-type(9), .point:nth-of-type(9), figure:nth-of-type(9) {
  color: khaki;
}

.handle:nth-of-type(10), .point:nth-of-type(10), figure:nth-of-type(10) {
  color: #32cd32;
}

.handle:nth-of-type(11), .point:nth-of-type(11), figure:nth-of-type(11) {
  color: coral;
}

.handle:nth-of-type(12), .point:nth-of-type(12), figure:nth-of-type(12) {
  color: #6a5acd;
}

.handle:nth-of-type(13), .point:nth-of-type(13), figure:nth-of-type(13) {
  color: #cd5c5c;
}

.handle:nth-of-type(14), .point:nth-of-type(14), figure:nth-of-type(14) {
  color: gray;
}

.handle:nth-of-type(15), .point:nth-of-type(15), figure:nth-of-type(15) {
  color: plum;
}

.handle:nth-of-type(16), .point:nth-of-type(16), figure:nth-of-type(16) {
  color: #6b8e23;
}

.handle:nth-of-type(17), .point:nth-of-type(17), figure:nth-of-type(17) {
  color: #90ee90;
}

.handle:nth-of-type(18), .point:nth-of-type(18), figure:nth-of-type(18) {
  color: #ffa07a;
}

.handle:nth-of-type(19), .point:nth-of-type(19), figure:nth-of-type(19) {
  color: gold;
}

.handle:nth-of-type(20), .point:nth-of-type(20), figure:nth-of-type(20) {
  color: peru;
}

.handle:nth-of-type(21), .point:nth-of-type(21), figure:nth-of-type(21) {
  color: #4169e1;
}

.handle:nth-of-type(22), .point:nth-of-type(22), figure:nth-of-type(22) {
  color: #f4a460;
}

.handle:nth-of-type(23), .point:nth-of-type(23), figure:nth-of-type(23) {
  color: #20b2aa;
}

.handle:nth-of-type(24), .point:nth-of-type(24), figure:nth-of-type(24) {
  color: #8a2be2;
}

.handle:nth-of-type(25), .point:nth-of-type(25), figure:nth-of-type(25) {
  color: tomato;
}

.handle:nth-of-type(26), .point:nth-of-type(26), figure:nth-of-type(26) {
  color: #daa520;
}

.handle:nth-of-type(27), .point:nth-of-type(27), figure:nth-of-type(27) {
  color: #32cd32;
}
</style>
