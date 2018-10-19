<template>
<transition enter-active-class="animated rollIn" leave-active-class="animated rollOut">
  <video 
    ref="widget"
    id="w-video"
    :contenteditable="editable ? 'plaintext-only' : false"
    :class="[{'edit-text': editable}, params.uuid]"
    :src="params.imgUrl"
    :autoplay="params.video.autoplay?'autoplay':null"
    :controls="params.video.controls?'controls':null"
    :muted="params.video.muted?'muted':null"
    :loop="params.video.loop?'loop':null" 
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
      '-webkit-mask-image': 'linear-gradient('+maskStartColor+','+maskEndColor+')',
      'filter':'blur('+params.shadow.filter+'px)'
    }">
  </video>
</transition>
</template>

<script>
// 文本组件
const NAME = "w-video";

import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  setting: {
    name: "视频",
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
      minWidth: 10,
      minHeight: 10,
      dir: 'all'
    },
    shadow: {
      startColor:'rgba(255, 255, 255, 1)',
      endColor: 'rgba(255, 255, 255, 1)',
      filter:0
    },
    video: {
      autoplay:true,
      controls:true,
      muted:true,
      loop:true,
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
    ...mapGetters(["dActiveElement"]),
    maskStartColor(){
      if(this.params.shadow && this.params.shadow.startColor)
        return this.params.shadow.startColor
      return 'rgba(255, 255, 255, 1)'
    },
    maskEndColor(){
      if(this.params.shadow && this.params.shadow.endColor)
        return this.params.shadow.endColor
      return 'rgba(255, 255, 255, 1)'
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
