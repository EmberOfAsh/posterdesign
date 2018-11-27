<template>
<transition enter-active-class="animated zoomInDown"
      leave-active-class="animated rollOut">
  <img 
    id="w-image"
    ref="widget"
    @dblclick="(e) => dblclickText(e)"
    :src="params.imgUrl" 
    :style="{
      position: 'absolute',
      left: (params.left - parent.left) + 'px',
      top: (params.top - parent.top) + 'px',
      width: params.width + 'px',
      height: params.height + 'px',
      opacity: params.opacity,
      borderTopLeftRadius: params.radiusTopLeft + 'px',
      borderTopRightRadius: params.radiusTopRight + 'px',
      borderBottomLeftRadius: params.radiusBottomLeft + 'px',
      borderBottomRightRadius: params.radiusBottomRight + 'px',
      'transform':'rotate('+params.rotate+'deg)',
      'z-index':params.zIndex,
      '-webkit-mask-image': maskImage,
      'filter':'blur('+params.shadow.filter+'px)',
      'clip-path':clipPath,
    }"/>
</transition>
</template>

<script>
// 图片组件
const NAME = 'w-image'

import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: NAME,
  setting: {
    name: '图片',
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
    parent: '-1',
    imgUrl: '',
    zIndex: 0,
    rotate: 0,//旋转角度
    setting: [
      {
        label: '图片',
        parentKey: 'imgUrl',
        value: true
      }
    ],
    record: {
      width: 0,
      height: 0,
      minWidth: 10,
      minHeight: 10,
      dir: 'all'
    },
    shadow: {
      startColor:null,
      endColor:null,
      filter:0,
      clipPath:null,//过滤路径
    },
    display:true,
  },
  props: ['params', 'parent'],
  data () {
    return {
    }
  },
  updated () {
    this.updateRecord()
  },
  mounted () {
    this.updateRecord()
  },
  computed: {
    ...mapGetters([
      'dActiveElement'
    ]),
    maskImage(){
      if(this.maskStartColor && this.maskEndColor){
        return 'linear-gradient('+this.maskStartColor+','+this.maskEndColor+')'
      }
      return null
    },
    maskStartColor(){
      if(this.params.shadow && this.params.shadow.startColor)
        return this.params.shadow.startColor
      return null
    },
    maskEndColor(){
      if(this.params.shadow && this.params.shadow.endColor)
        return this.params.shadow.endColor
      return null
    },
    clipPath(){
      if(this.params.shadow && this.params.shadow.clipPath)
        return this.params.shadow.clipPath
      return null
    }
  },
  methods: {
    ...mapActions([
      'updateViewImageDialog'
    ]),
    updateRecord () {
      if (this.dActiveElement.uuid === this.params.uuid) {
        let record = this.dActiveElement.record
        record.width = this.$refs.widget.offsetWidth
        record.height = this.$refs.widget.offsetHeight
      }
    },
    dblclickText() {
      console.debug('双击图片 更改');
      this.updateViewImageDialog({display:true})
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl'
#w-image
  outline: none
  cursor: pointer
</style>
