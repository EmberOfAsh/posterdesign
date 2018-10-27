<template>
  <div id="size-control" role="sizeControl"  :class="activeType" v-if="dActiveElement.record && dActiveElement.uuid !== '-1'" 
  :style="{
      'transform':'rotate('+dActiveElement.rotate+'deg)',
      //left: left - 10 + 'px',
      //top: top - 10+ 'px',
      //width:width + 20 + 'px',
      //height:height + 20 + 'px',
      //'z-index':0
    }">
    <!-- 上左 -->
    <div class="square" position="top-left" role="sizeControl" v-if="dActiveElement.record.dir === 'all'"
	  	@mousedown="handlemousedown($event, 'left-top')"
      :style="{
        left: left + 'px',
        top: top + 'px',
        cursor: 'nw-resize',
        width: squareSize,
        height: squareSize,
      }">
    </div>
    <!-- 上中 -->
    <div class="square" position="top-middle" role="sizeControl"  v-if="dActiveElement.record.dir === 'vertical' || dActiveElement.record.dir === 'all'"
	  	@mousedown="handlemousedown($event, 'top')"
      :style="{
        left: left + width / 2 + 'px',
        top: top + 'px',
        cursor: 'n-resize',
        width: squareSize,
        height: squareSize,
      }">
    </div>
    <!-- 上右 -->
    <div class="square" position="top-right" role="sizeControl"  v-if="dActiveElement.record.dir === 'all'"
	  	@mousedown="handlemousedown($event, 'right-top')"
      :style="{
        left: left + width + 'px',
        top: top + 'px',
        cursor: 'ne-resize',
        width: squareSize,
        height: squareSize,
      }">
    </div>
    <!-- 中左 -->
    <div class="square" position="middle-left" role="sizeControl"  v-if="dActiveElement.record.dir === 'horizontal' || dActiveElement.record.dir === 'all'"
	  	@mousedown="handlemousedown($event, 'left')"
      :style="{
        left: left + 'px',
        top: (top + height / 2) + 'px',
        cursor: 'w-resize',
        width: squareSize,
        height: squareSize,
      }">
    </div>
    <!-- 中右 -->
    <div class="square" position="middle-right" role="sizeControl"  v-if="dActiveElement.record.dir === 'horizontal' || dActiveElement.record.dir === 'all'"
	  	@mousedown="handlemousedown($event, 'right')"
      :style="{
        left: left + width + 'px',
        top: (top + height / 2) + 'px',
        cursor: 'e-resize',
        width: squareSize,
        height: squareSize,
      }">
    </div>
    <!-- 下左 -->
    <div class="square" position="bottom-left" role="sizeControl"  v-if="dActiveElement.record.dir === 'all'"
	  	@mousedown="handlemousedown($event, 'left-bottom')"
      :style="{
        left: left + 'px',
        top: top + height + 'px',
        cursor: 'sw-resize',
        width: squareSize,
        height: squareSize,
      }">
    </div>
    <!-- 下中 -->
    <div class="square" position="bottom-middle" role="sizeControl"  v-if="dActiveElement.record.dir === 'vertical' || dActiveElement.record.dir === 'all'"
	  	@mousedown="handlemousedown($event, 'bottom')"
      :style="{
        left: left + width / 2 + 'px',
        top: top + height + 'px',
        cursor: 's-resize',
        width: squareSize,
        height: squareSize,
      }">
    </div>
    <!-- 下右 -->
    <div class="square" position="bottom-right" role="sizeControl"  v-if="dActiveElement.record.dir === 'all'"
	  	@mousedown="handlemousedown($event, 'right-bottom')"
      :style="{
        left: left + width + 'px',
        top: top + height + 'px',
        cursor: 'se-resize',
        width: squareSize,
        height: squareSize,
      }">
    </div>
    <!--旋转控制-->
    <!--
    <div class=" transform" v-if="dActiveElement.record.dir === 'vertical' || dActiveElement.record.dir === 'all'"
	  	@mousedown="transmousedown($event, 'bottom')"
      :style="{
        left: '46%',
        top: '105%',
        cursor: 'move'
      }">
    </div>
    -->
  </div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

// 组件大小控制器
const NAME = 'size-control'

export default {
  name: NAME,
  data () {
    return {
      dirs: []
    }
  },
  computed: {
    ...mapGetters([
      'dActiveElement',
      'dWidgets',
      'dPage'
    ]),
    left () {
      return parseInt(this.dActiveElement.left)
    },
    top () {
      return parseInt(this.dActiveElement.top)
    },
    width () {
      return parseInt(this.dActiveElement.width)
    },
    height () {
      return parseInt(this.dActiveElement.height)
    },
    rotate () {
      let rotate = this.dActiveElement.rotate
      if(!rotate) rotate = 0
      return rotate
    },
    activeType(){
      let ele = this.dActiveElement;
      return ele.type
    },
    /** 调整按钮尺寸 */
    squareSize(){
      let ps = Math.min(this.dPage.width,this.dPage.height)
      let ws = Math.min(this.width,this.height)
      let pss = ps/50
      let wss = ws/10
      console.debug('计算调整尺寸按钮尺寸:  画布尺寸:',ps,'->',pss,' 组件尺寸',ws,'->',wss)
      return pss
    }
  },
  watch: {
    dActiveElement:function(val, old){

      console.debug('activeElement change:',val,old)
      // 取消选中图层前排显示
      //if(val.uuid != -1) val.zIndex = 1 //调高当前组件的zIndex展示值
      //if(old.uuid != -1) old.zIndex = 0   //恢复前一个组件的zIndex值
    }
  },
  methods: {
    ...mapActions([
      'dResize',
      'initDResize',
      'dResize',
      'stopDResize',
      'dRotate'
    ]),
    handlemousedown (e, dirs) {
      e.stopPropagation()
      this.dirs = dirs.split('-')
      this.initDResize({
        startX: e.pageX,
        startY: e.pageY,
        originX: this.dActiveElement.left,
        originY: this.dActiveElement.top,
        width: this.width,
        height: this.height
      })

      document.addEventListener('mousemove', this.handlemousemove, true)
      document.addEventListener('mouseup', this.handlemouseup, true)
    },

    handlemousemove (e) {
      e.stopPropagation()
      e.preventDefault()

      this.dResize({
        x: e.pageX,
        y: e.pageY,
        dirs: this.dirs
      })
    },

    handlemouseup () {
      document.removeEventListener('mousemove', this.handlemousemove, true)
      document.removeEventListener('mouseup', this.handlemouseup, true)
      this.stopDResize()
    } ,
    transmousedown(e, dirs){
      e.stopPropagation()
      this.dirs = dirs.split('-')
      this.initDResize({
        startX: e.pageX,
        startY: e.pageY,
        originX: this.dActiveElement.left,
        originY: this.dActiveElement.top,
        width: this.width,
        height: this.height
      })

      document.addEventListener('mousemove', this.transmousemove, true)
      document.addEventListener('mouseup', this.transmouseup, true)
    },
     transmousemove (e) {
      e.stopPropagation()
      e.preventDefault()
      this.dRotate({
        x: e.pageX,
        y: e.pageY
      })
    },
    transmouseup () {
      document.removeEventListener('mousemove', this.transmousemove, true)
      document.removeEventListener('mouseup', this.transmouseup, true)
      this.stopDResize()
    },
  }
}
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl'
#size-control {
  cursor: move;
  
}
.w-group{
  background-color: #eee;
  background-image: linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd), 
  linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd);
  background-size:60px 60px;
  background-position:0 0, 30px 30px
}
#size-control
  position: absolute
  .square
    position: absolute
    width: 20px
    height: 20px
    z-index: 999
    background-color: $color-white
    outline: 1px solid $color-main
    transform: translateX(-50%) translateY(-50%)
  .square:hover
    background-color: yellow;
  .transform
    position: absolute
    width: 50px;
    height: 50px;
    z-index: 999
    background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 18 18' fill='%23757575'%3E%3Ccircle fill='%23fff' cx='9' cy='9' r='8'/%3E%3Cpath d='M13.864 3.82a.22.22 0 0 0-.24.048L12.5 4.992a5.26 5.26 0 0 0-3.432-1.268 5.25 5.25 0 0 0-3.731 1.545A5.25 5.25 0 0 0 3.792 9a5.25 5.25 0 0 0 1.545 3.731 5.25 5.25 0 0 0 3.731 1.545 5.25 5.25 0 0 0 3.731-1.545.794.794 0 0 0-1.123-1.123 3.663 3.663 0 0 1-2.608 1.08C7.035 12.688 5.38 11.034 5.38 9s1.654-3.688 3.688-3.688c.848 0 1.652.284 2.304.808l-1.057 1.057a.22.22 0 0 0 .156.376h3.309a.22.22 0 0 0 .22-.221V4.024a.221.221 0 0 0-.136-.204z'/%3E%3C/svg%3E")
</style>
