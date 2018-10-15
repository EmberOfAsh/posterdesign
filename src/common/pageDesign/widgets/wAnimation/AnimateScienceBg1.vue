<template>
  <div 
    id="container"
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
      'z-index': params.zIndex,
      color: params.color
    }">
    <div id="output"></div>
  </div>
</template>

<script>
// 形状-圆形组件
import Victor from './js/vector.js'
import domUtil from '../../../../util/domUtil.js'
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["params", "parent"],
  data() {
    return {
      victory:null,
      controlHandle:null,
      txtColor:'#005584',
      bgColor:'#002c4a'
    };
  },
  updated() {},
  mounted() {
    this.doDraw();
  },
  computed: {
    ...mapGetters(["dActiveElement"])
  },
  watch:{
    "params.width":function(val){
      console.debug('触发 大小调整')
      this.controlHandle.resize(this.params.width,this.params.height)
    },
    "params.height":function(val){
      console.debug('触发 大小调整')
      this.controlHandle.resize(this.params.width,this.params.height)
    },
    "params.color":function(val){
      this.txtColor = domUtil.rgb2hex(val)
      this.resetColor()
    },
    "params.backgroundColor":function(val){
      this.bgColor = domUtil.rgb2hex(val)
      this.resetColor()
    }
  },
  methods: {
    ...mapActions([]),
    doDraw() {
      let container = this.$refs.widget
      let output = this.$refs.widget.querySelector("#output")
      this.victor = new Victor.Victor(container, output);
      this.resetColor()
    },
    resetColor(){
      this.controlHandle =  this.victor([this.bgColor, this.txtColor])
      this.controlHandle.set()
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
