<template>
<transition enter-active-class="animated rollIn" leave-active-class="animated rollOut">
  <div 
    id="w-text"
    :contenteditable="editable ? 'plaintext-only' : false"
    @dblclick="(e) => dblclickText(e)"
    :class="[{'edit-text': editable}, params.uuid]"
    ref="widget"
    :style="{
      position: 'absolute',
      left: (params.left - parent.left) + 'px',
      top: (params.top - parent.top) + 'px',
      width: Math.max(params.fontSize, params.width) + 'px',
      minWidth: params.fontSize + 'px',
      minHeight: params.fontSize * params.lineHeight + 'px',
      lineHeight: params.fontSize * params.lineHeight + 'px',
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
    }">
    <template v-for="w in textDis">
      <transition :key="w.text" enter-active-class="animated bounceInRight fadeInRight" leave-active-class="animated rollOut">
        <div class="font" v-html="w.text" v-show="w.display" style="width:fit-content;width:-webkit-fit-content;width:-moz-fit-content;" ></div>{{params}}
      </transition>

      
    </template>

    <!--  <template v-for="w in textDis">
      <w-test :text="w.text" v-if="w.display"></w-test>
    </template>
    -->
  </div>
</transition>
</template>

<script>
// 文本组件
const NAME = "w-text";

import { mapGetters, mapActions } from "vuex";
import '../../../../assets/css/controll-animate.css';
import 'animate.css'

export default {
  name: NAME,
  setting: {
    name: "文本",
    type: NAME,
    uuid: -1,
    editable: true,
    width: 300,
    left: 0,
    top: 0,
    lineHeight: 1.5,
    letterSpacing: 0,
    fontSize: 24,
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    textColor: "rgba(0, 0, 0, 1)",
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
      dir: "horizontal"
    }
  },
  props: ["params", "parent"],
  data() {
    return {
      editable: false,
      textDis:[]
    };
  },
  updated() {
    this.updateRecord();
  },
  mounted() {
    this.updateRecord();
  },
  computed: {
    ...mapGetters(["dActiveElement"])
  },
  watch:{
    "params.text":function(val){
      this.textDis = this.params.text.split('').map(v=>{
        return {display:false,text:v}
      })
      console.debug(this.textDis)
      let ins = this;
      setTimeout(()=>{
        ins.textAnimate(ins)
      },2000)
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
    },
    textAnimate(ins){
      let idx = 0
      let timer = setInterval(()=>{
        if(ins.textDis.length <= idx){
          clearInterval(timer)
          return;
        }
        ins.textDis[idx].display = true
        idx++
      },100)
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
  .font {
    width:fit-content;
    width:-webkit-fit-content;
    width:-moz-fit-content;
    float:left;
  }
}
</style>
