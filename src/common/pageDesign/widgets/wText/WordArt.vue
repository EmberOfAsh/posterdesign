<template>
<transition enter-active-class="animated rollIn" leave-active-class="animated rollOut">
  <img 
    id="word-art"
    v-html="params.text"
    :contenteditable="editable ? 'plaintext-only' : false"
    @dblclick="(e) => dblclickText(e)"
    :class="[{'edit-text': editable}, params.uuid]"
    ref="widget"
    :src="wordArtSrc"
    :style="{
      position: 'absolute',
      left: (params.left - parent.left) + 'px',
      top: (params.top - parent.top) + 'px',
      width: fontWidth+ 'px',
      letterSpacing: params.fontSize * params.letterSpacing / 100 + 'px',
      fontSize: params.fontSize + 'px',
      color: params.textColor,
      textAlign: params.textAlign,
      fontWeight: params.fontWeight,
      fontStyle: params.fontStyle,
      textDecoration: params.textDecoration,
      opacity: params.opacity,
      backgroundColor: params.backgroundColor,
      'transform': 'rotate('+params.rotate+'deg)',
      'z-index': params.zIndex,
      'font-family': params.fontFamily
    }"/>
</transition>
</template>

<script>
// 艺术字组件
const NAME = "word-art";

import { mapGetters, mapActions } from "vuex";
import serverInfo from '../../../../config/serverInfo.js'
import domUtil from '../../../../util/domUtil.js'
export default {
  name: NAME,
  setting: {
    name: "艺术字",
    type: NAME,
    uuid: -1,
    editable: true,
    width: 1000,
    left: 0,
    top: 0,
    lineHeight: 1.5,
    letterSpacing: 0,
    fontSize: 200,
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    textColor: "#000",
    textAlign: "left",
    text: "文本",
    opacity: 1,
    backgroundColor: "",
    parent: "-1",
    zIndex: 0,
    rotate: 0, //旋转角度
    fontFamily: "",
    setting: [
      {
        label: "文本内容",
        parentKey: "text",
        value: true
      },
      {
        label: "文本颜色",
        parentKey: "textColor",
        value: false
      }
    ],
    record: {
      width: 0,
      height: 0,
      minWidth: 0,
      minHeight: 0,
      dir: "none"
    },
    display:true,
  },
  props: ["params", "parent"],
  data() {
    return {
      editable: false
    };
  },
  updated() {
    this.updateRecord();
  },
  mounted() {
    this.updateRecord();
  },
  computed: {
    ...mapGetters(["dActiveElement"]),
    wordArtSrc(){
      let ay = [];
      ay.push('text='+encodeURI(this.params.text))
      ay.push('font='+encodeURI(this.params.fontFamily))
      ay.push('size='+encodeURI(this.params.fontSize)+'px')
      ay.push('color='+encodeURI(domUtil.rgb2hex(this.params.textColor).replace('#','')))
      //ay.push('fontWeight='+this.params.fontWeight)
      //ay.push('fontStyle='+this.params.fontStyle)
      //ay.push('textDecoration='+this.params.textDecoration)
      ay.push('space='+(this.params.fontSize * this.params.letterSpacing / 100))
      let url = serverInfo.uploadServer+'/imageText?'+ay.join('&')
      return url
    },
    //字体显示的宽度
    fontWidth(){
      // 字体大小 * 字数 + 字体大小 * 字距离 * (字数 - 1)
      let w = this.params.text
      if(!w)return 10
      let wc = w.length
      let v = this.params.fontSize * wc +  this.params.fontSize * this.params.letterSpacing / 100 * (wc - 1)
      console.debug('计算艺术字体宽度: ',v)
      return v
    }
  },
  watch:{
    "params.width":function(val){
      // 根据拉伸宽度，计算字体大小
      /*
      if(val && this.params.text.length > 0){
        let w = val / this.params.text.length
        console.debug('重新计算字体大小：',w)
        this.params.fontSize = w
      }
      */
    }
  },
  methods: {
    ...mapActions(["updateWidgetData", "updateEditeTextDialog"]),
    updateRecord() {
      if (this.dActiveElement.uuid === this.params.uuid) {
        let record = this.dActiveElement.record;
        record.width = this.$refs.widget.offsetWidth;
        record.height = this.$refs.widget.offsetHeight;
        record.minWidth = this.params.fontSize;
        record.minHeight = this.params.fontSize * this.params.lineHeight;
      }
    },
    updateText(e) {},
    dblclickText(e) {
      console.log("更改文本文字");
      this.updateEditeTextDialog({ display: true });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

#w-text {
  outline: none;
  cursor: pointer;
  word-break: break-word;

  &.edit-text {
    cursor: text;
    outline: 1px solid $color-black !important;
  }
}
</style>
