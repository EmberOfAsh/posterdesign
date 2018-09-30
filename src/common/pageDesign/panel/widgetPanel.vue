<template>
  <div id="widget-panel">
    <div class="widget-classify">
      <ul class="classify-wrap">
        <li
          class="classify-item"
          :class="{ 'active-classify-item' : activeWidgetClassify === index}"
          v-for="(item, index) in widgetClassifyList" 
          :key="index"
          @click="clickClassify(item.id)">
          <i :class="item.icon" class="iconfont"></i>
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
    <div class="widget-wrap">
      <text-list-wrap v-if="widgetClassifyList.find(id=>id.id==0).show" :style="getStyle(0)" />
      <shape-list-wrap v-if="widgetClassifyList.find(id=>id.id==1).show" :style="getStyle(1)" />
      <img-list-wrap v-if="widgetClassifyList.find(id=>id.id==2).show" :style="getStyle(2)" />
      <img-material v-if="widgetClassifyList.find(id=>id.id==3).show" :style="getStyle(3)"/>
      <effect-material v-if="widgetClassifyList.find(id=>id.id==4).show" :style="getStyle(4)"/>
      <poster-template v-if="widgetClassifyList.find(id=>id.id==5).show" :style="getStyle(5)"/> 
      <qr-code-create v-if="widgetClassifyList.find(id=>id.id==6).show" :style="getStyle(6)"/> 
    </div>
  </div>
</template>

<script>
// 组件面板
const NAME = 'widget-panel'

export default {
  name: NAME,
  data () {
    return {
      widgetClassifyList: [
        {
          name: '文本',
          icon: 'icon-text',
          show: false,
          id:0
        },
        {
          name: '形状',
          icon: 'icon-shape',
          show: false,
          id:1
        },
        {
          name: '图片',
          icon: 'icon-pic',
          show: false,
          id:2
        },
        {
          name: '素材',
          icon: 'icon-material',
          show: false,
          id:3
        },
        {
          name: '特效',
          icon: 'icon-material',
          show: false,
          id:4
        },
        {
          name: '模版',
          icon: 'icon-material',
          show: false,
          id:5
        },
        {
          name: '二维码',
          icon: 'icon-material',
          show: false,
          id:6
        }
      ],
      activeWidgetClassify: -1
    }
  },
  watch: {
    activeWidgetClassify (index) {
      if (index >= 0 && index < this.widgetClassifyList.length) {
        this.widgetClassifyList[index].show = true
      }
    }
  },
  mounted () {
    this.activeWidgetClassify = 0
  },
  methods: {
    clickClassify (index) {
      this.activeWidgetClassify = index
    },
    getStyle (index) {
      return {
        display: (this.activeWidgetClassify === index ? '' : 'none')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl'
#widget-panel
  position: relative
  width: 360px
  height: 100%
  display: flex
  flex-direction: row
  font-weight: bold
  color: $color-white
  .widget-classify
    width: 60px
    height: 100%
    text-align: center
    background-color: $color-dark-gray
    .classify-wrap
      width: 100%
      .classify-item
        width: 100%
        height: 60px
        font-size: 12px
        cursor: pointer
        display: flex
        justify-content: center
        align-items: center
        flex-direction: column
        p
          margin-top: 5px
        &:hover
          color: $color-main
      .active-classify-item
        background-color: $color-light-gray
        color: $color-main
  .widget-wrap
    flex: 1
    height: 100%
    background-color: $color-light-gray

</style>
