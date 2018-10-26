<template>
  <div id="page-design" 
    ref="page-design">
    <div
      :class="workMode.mode != 'display'?'out-page':''"
      :style="getOutPageStyle()">
      <div 
        class="design-canvas"
        :data-type="dPage.type"
        :data-uuid="dPage.uuid"
        :id="pageDesignCanvasId"
        :style="getDesignCanvasStyle()">
        <grid-size />

        <component
          :is="layer.type"
          :class="getA(layer)"
          :data-title="layer.type"
          v-for="layer in getlayers()"
          :key="layer.uuid"
          :params="layer"
          :parent="dPage"
          :data-type="layer.type"
          :data-uuid="layer.uuid"
          v-if="layer.display"
          >
          <component
            v-if="layer.isContainer && layer.display"
            :is="widget.type"
            class="layer"
            :class="{
              'layer-active': getIsActive(widget.uuid),
              'layer-no-hover': dActiveElement.uuid !== widget.parent && dActiveElement.parent !== widget.parent,
              'layer-hover': widget.uuid === dHoverUuid
            }"
            :data-title="widget.type"
            v-for="widget in getChilds(layer.uuid)"
            :key="widget.uuid"
            :params="widget"
            :parent="layer"
            :data-type="widget.type"
            :data-uuid="widget.uuid"
             />
        </component>

        <ref-line v-if="dSelectWidgets.length === 0" />
        <size-control v-if="dSelectWidgets.length === 0" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

// 页面设计组件
const NAME = "page-design";

import { move } from "MIXINS/move";
import '../../assets/css/controll-animate.css';
import 'animate.css'
import domUtil from '../../util/domUtil';
export default {
  name: NAME,
  props: ["pageDesignCanvasId"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "dPage",
      "dZoom",
      "dScreen",
      "dWidgets",
      "dActiveElement",
      "dHoverUuid",
      "dSelectWidgets",
      "dAltDown",
      "animatePlayControl",
      "workMode"
    ])
  },
  mixins: [move],
  mounted() {
    let ins = this
    this.getScreen();
    if(this.workMode.mode != 'display'){
      document
        .getElementById("page-design")
        .addEventListener("mousedown", this.handleSelection, true);
    }
  },
  beforeDestroy() {},
  methods: {
    ...mapActions(["updateScreen", "selectWidget", "deleteWidget"]),
    // 获取层相关class
    getA(layer){
      return [
        this.getIsActive(layer.uuid)?'layer-active':'',
        layer.uuid === this.dHoverUuid || this.dActiveElement.parent === layer.uuid?'layer-hover':'',
        this.getAnimate(layer),this.workMode.mode != 'display'?'layer':'']
    },
    getAnimate(layer){
      if(layer.animates && this.animatePlayControl.play){
        return layer.animates.join(' ')
      }
      return ''
    },
    // 获取out-page style定义
    getOutPageStyle(){
      let style = {}
      if(this.workMode.mode != 'display'){
        style = {
          width: this.dPage.width * this.dZoom / 100 + 120 + 'px',
          height: this.dPage.height * this.dZoom / 100 + 120 + 'px',
          opacity: 1 - (this.dZoom < 100 ? this.dPage.tag : 0)
        }
      }else{
        style = {
          width: 'auto',
          height: 'auto',
        }
      }
      return style
    },
    getDesignCanvasStyle(){
      let style = {
          width: this.dPage.width + 'px',
          height: this.dPage.height + 'px',
          backgroundColor: this.dPage.backgroundColor,
          backgroundImage: 'url(\'' + (this.dPage.backgroundImage ? this.dPage.backgroundImage : '') + '\')',
          overflow:'hidden'
      }
      if(this.workMode.mode != 'display'){
        style.transform = 'scale(' + this.dZoom / 100 + ')'
        style.transformOrigin = (this.dZoom >= 100 ? 'center' : 'left') + ' top'
        style.opacity = this.dPage.opacity + (this.dZoom < 100 ? this.dPage.tag : 0)
      }
      else{
        // 展示模式
        style.transform = 'scale(' + this.dZoom / 100 + ')'
        style.transformOrigin = 'left top' // (this.dZoom >= 100 ? 'left' : 'left') + ' top'
        style.position = 'fixed'
        style.top = '0px'
        // 横屏设备,竖屏节目
        if(!this.screen_h_v() && this.page_h_v(this.dPage)){
          style.left = '50%'
          style['marginLeft'] = (this.dZoom / 100 * this.dPage.width / 2 * -1) + 'px'
        }else
        // 竖屏设备,横屏节目
        if(this.screen_h_v() && !this.page_h_v(this.dPage)){

        }
      }
      return style
    },
    // true: 竖屏, false: 横屏
    screen_h_v(){
      return window.screen.height > window.screen.width
    },
    page_h_v(dPage){
      return dPage.height > dPage.width
    },
    getScreen() {
      let screen = this.$refs["page-design"];
      this.updateScreen({
        width: screen.offsetWidth,
        height: screen.offsetHeight
      });
    },
    handleSelection(e) {
      console.debug('handleSelection')
      if (e.which === 3) {
        return;
      }
      let target = e.target
      let type = target.getAttribute("data-type");
      let role = target.getAttribute('role');
      // 如果是控制组件 跳过
      if(role == 'sizeControl'){
        console.debug('控制组件点击 跳过')
        return;
      }
      if(!type){
        console.debug('本节点未找到，回溯父节点')
        let trueTarget = domUtil.getWidgetRoot(e.target)
        target = trueTarget || e.target;
      }else{
        console.debug('本节点找到')
      }
      type = target.getAttribute("data-type");

      if (type) {
        let uuid = target.getAttribute("data-uuid");
        if (uuid !== "-1" && !this.dAltDown) {
          let widget = this.dWidgets.find(item => item.uuid === uuid);
          if (
            widget.parent !== "-1" &&
            widget.parent !== this.dActiveElement.uuid &&
            widget.parent !== this.dActiveElement.parent
          ) {
            uuid = widget.parent;
          }
        }

        // 设置选中元素
        this.selectWidget({
          uuid: uuid
        });

        if (uuid !== "-1") {
          this.initmovement(e); // 参见 mixins
        }
      } else {
        // 取消选中元素
        this.selectWidget({
          uuid: "-1"
        });
      }
    },
    getlayers() {
      return this.dWidgets.filter(item => item.parent === this.dPage.uuid);
    },
    getChilds(uuid) {
      return this.dWidgets.filter(item => item.parent === uuid);
    },
    getIsActive(uuid) {
      if (this.dSelectWidgets.length > 0) {
        let widget = this.dSelectWidgets.find(item => item.uuid === uuid);
        if (widget) {
          return true;
        }
        return false;
      } else {
        return uuid === this.dActiveElement.uuid;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

#page-design {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;

  .out-page {
    position: relative;
    margin: 0 auto;
    padding: 60px;

    .design-canvas {
      position: relative;
      margin: 0 auto;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      box-shadow: 1px 1px 10px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
  }
}
</style>


