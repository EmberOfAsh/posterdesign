<template>
<transition enter-active-class="animated rollIn" leave-active-class="animated rollOut">
  <vue-bstcode  
    ref="widget"
    :text="params.qrData.text" 
    :size="params.qrData.size"
    :logoSrc="params.qrData.logoSrc"
    :logoMargin="params.qrData.logoMargin"
    :colorDark="params.qrData.colorDark"
    :bgSrc="params.qrData.bgSrc"
    :style="{
      position: 'absolute',
      left: (params.left - parent.left) + 'px',
      top: (params.top - parent.top) + 'px',
      height: params.height  + 'px',
      width: params.width + 'px',
      opacity: params.opacity,
      backgroundColor: params.backgroundColor,
      'transform': 'rotate('+params.rotate+'deg)',
      'z-index': params.zIndex,
      'font-family': params.fontFamily
    }"></vue-bstcode>
</transition>
</template>

<script>
// 图片组件
const NAME = "qr-code";
import VueBstcode from "vue-bstcode";
import { mapGetters, mapActions } from "vuex";
// doc: https://www.npmjs.com/package/vue-bstcode
export default {
  name: NAME,
  setting: {
    name: "二维码",
    type: NAME,
    uuid: -1,
    width: 300,
    height: 300,
    left: 0,
    top: 0,
    radiusTopLeft: 0,
    radiusTopRight: 0,
    radiusBottomLeft: 0,
    radiusBottomRight: 0,
    opacity: 1,
    parent: "-1",
    imgUrl: "",
    zIndex: 0,
    rotate: 0, //旋转角度
    setting: [
      {
        label: "二维码",
        parentKey: "imgUrl",
        value: true
      }
    ],
    record: {
      width: 0,
      height: 0,
      minWidth: 10,
      minHeight: 10,
      dir: "all"
    }
  },
  props: ["params", "parent"],
  data() {
    return {};
  },
  updated() {
    this.updateRecord();
    if (this.params.textColor) this.changeColor(this.params.textColor);
  },
  mounted() {
    this.updateRecord();
  },
  computed: {
    ...mapGetters(["dActiveElement"])
  },
  watch:{
    "params.width":function(val){
      console.log('宽度变化： ',val)
      //this.params.width = val
      this.params.qrData.size = Math.min(val,this.params.width)
    },
    "params.height":function(val){
      console.log('高度变化： ',val)
      //this.params.height = val
      this.params.qrData.size = Math.min(val,this.params.height)
    }
  },
  methods: {
    ...mapActions(["updateViewImageDialog"]),
    updateRecord() {
      if (this.dActiveElement.uuid === this.params.uuid) {
        let record = this.dActiveElement.record;
        record.width = this.params.width
        record.height = this.params.height
      }
    }
  },
  components: { VueBstcode }
};
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

#w-image {
  outline: none;
  cursor: pointer;
}
</style>
