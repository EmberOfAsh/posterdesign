<template>
<transition enter-active-class="animated rollIn" leave-active-class="animated rollOut">
  <div 
    id="w-test"
    ref="widget"
    v-html="text">
  </div>
</transition>
</template>

<script>
// 文本组件
const NAME = "w-test";

import { mapGetters, mapActions } from "vuex";

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
  props: ["text", "parent"],
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
  },
  methods: {
    ...mapActions(["updateWidgetData", "updateEditeTextDialog"]),
    updateRecord() {
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
      },1000)
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
    padding:50px;
    background-color:blue;
  }
}
</style>
