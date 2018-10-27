<template>
<transition enter-active-class="animated rollIn" leave-active-class="animated rollOut">
  <div 
    id="w-text"
    v-html="params.text"
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
  </div>
</transition>
</template>

<script>
// 文本组件
const NAME = "w-text";

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
    ...mapGetters(["dActiveElement"])
  },
  methods: {
    ...mapActions(["updateWidgetData", "updateEditeTextDialog"]),
    updateRecord() {
      if (this.dActiveElement.uuid === this.params.uuid) {
        let widget = this.dActiveElement
        let record = widget.record;
        record.width = this.$refs.widget.offsetWidth;
        record.height = this.$refs.widget.offsetHeight;
        record.minWidth = this.params.fontSize;
        record.minHeight = this.params.fontSize * this.params.lineHeight;
        widget.width = record.width
        widget.height = record.height
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
