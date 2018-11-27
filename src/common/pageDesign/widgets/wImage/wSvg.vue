<template>
<transition enter-active-class="animated rollIn"
      leave-active-class="animated rollOut">
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  viewBox="0 0 256 256"  preserveAspectRatio="xMidYMid"
    id="w-image"
    ref="widget"
    :src="params.imgUrl" 
    :width="params.width + 'px'"
    :height="params.height + 'px'"
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
      backgroundColor: params.backgroundColor,
    }">
  </svg>
</transition>
</template>

<script>
// 图片组件
const NAME = "w-svg";

import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  setting: {
    name: "SVG矢量图",
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
        label: "图片",
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
    },
    display:true,
  },
  props: ["params", "parent"],
  data() {
    return {};
  },
  updated() {
    this.updateRecord();
    if(this.params.textColor) this.changeColor(this.params.textColor)
  },
  mounted() {
    this.updateRecord();
    this.getSvgInfo();
  },
  computed: {
    ...mapGetters(["dActiveElement"])
  },
  methods: {
    ...mapActions(["updateViewImageDialog"]),
    updateRecord() {
      if (this.dActiveElement.uuid === this.params.uuid) {
        let record = this.dActiveElement.record;
        record.width = this.$refs.widget.offsetWidth;
        record.height = this.$refs.widget.offsetHeight;
      }
    },
    getSvgInfo() {
      let ins = this;
      let url = this.params.imgUrl;
      fetch(url)
        .then(function(response) {
          return response.text();
        })
        .then(function(text) {
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(text, "text/xml");

          // Get the SVG tag, ignore the rest
          var svg = xmlDoc.getElementsByTagName("svg")[0];
          // Add replaced image's ID to the new SVG
          if (typeof imgID !== "undefined") {
            svg.setAttribute("id", imgID);
          }
          // Add replaced image's classes to the new SVG
          if (typeof imgClass !== "undefined") {
            svg.setAttribute("class", imgClass + " replaced-svg");
          }

          // Remove any invalid XML tags as per http://validator.w3.org
          svg.removeAttribute("xmlns:a");

          // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
          if (
            !svg.getAttribute("viewBox") &&
            svg.getAttribute("height") &&
            svg.getAttribute("width")
          ) {
            svg.setAttribute(
              "viewBox",
              "0 0 " +
                svg.getAttribute("height") +
                " " +
                svg.getAttribute("width")
            );
          }
          // Replace image with new SVG
          let widget = ins.$refs.widget
          widget.setAttribute('viewBox', svg.getAttribute("viewBox"))
          if(svg.getAttribute('preserveAspectRatio')) {
            widget.setAttribute('preserveAspectRatio', svg.getAttribute('preserveAspectRatio'))
          }
          widget.innerHTML = svg.innerHTML;
          // ins.$refs.widget.appendChild(svg);
        });
    },
    changeColor(color){
      let widget = this.$refs.widget
      function handleNext(node){
        if(node.getAttribute('fill')){
          node.setAttribute('fill',color)
        }
        let children = node.children;
        if(children){
          for(let idx=0;idx<children.length;idx++)
            handleNext(children[idx])
        }
      }
      handleNext(widget)
    },
    dblclickText() {
      console.debug("双击图片 更改");
      this.updateViewImageDialog({ display: true });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

#w-image {
  outline: none;
  cursor: pointer;
}
</style>
