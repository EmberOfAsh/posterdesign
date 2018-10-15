<template>
  <div id="w-circle-style">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="位置" name="1">
        <div class="line-layout">
          <number-input label="X" v-model="innerElement.left" @finish="(value) => finish('left', value)" />
          <number-input label="Y" v-model="innerElement.top" @finish="(value) => finish('top', value)" />
          <number-input label="宽" v-model="innerElement.width" @finish="(value) => finish('width', value)" />
          <number-input label="高" v-model="innerElement.height" @finish="(value) => finish('height', value)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="样式设置" name="2">
        <el-button class="style-item" size="small" @click="()=>this.updateFullPage()">填充背景</el-button>
        <div class="line-layout style-item">
          <color-select label="图案颜色" v-model="innerElement.color" @finish="(value) => finish('color', value)" />
          <color-select label="背景颜色" v-model="innerElement.backgroundColor" @finish="(value) => finish('backgroundColor', value)" />
        </div>
        <div id="value-input-select" class="style-item">
          <span class="label">配色方案</span>
          <el-select
            size="mini"
            v-model="choseTheme"
            default-first-option
            placeholder="请选择"
            @change="selectTheme">
            <el-option v-for="(item,index) in chosedColors" :key="index" :value="index">
              图案:<span :style="{background:item[1],color:item[1]}">颜色</span> &nbsp;&nbsp;&nbsp;背景:<span :style="{background:item[0],color:item[0]}">颜色</span>
            </el-option>
          </el-select>
        </div>
        <number-slider 
          class="style-item" 
          label="旋转角度" 
          v-model="innerElement.rotate" 
          :maxValue="360" 
          @finish="(value) => finish('rotate', value)" />
        <icon-item-select class="style-item" label="图层层级" :data="layerIconList" @finish="layerAction"/>
        <icon-item-select label="组件对齐" :data="alignIconList" @finish="alignAction"/>
      </el-collapse-item>
      <el-collapse-item title="其他设置" name="3">
        <text-input label="名称" v-model="innerElement.name" @finish="(value) => finish('name', value)" />
      </el-collapse-item>
      <el-collapse-item title="客户端配置(设置客户端是否允许修改)" name="4">
        <div class="setting-list">
          <setting-switch
            class="style-item"
            v-for="item in dActiveElement.setting" 
            :key="item.key"
            :label="item.label"
            v-model="item.value" />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
// 形状-圆形组件样式
const NAME = 'w-circle-style'
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: NAME,
  data () {
    return {
      choseTheme:null,
      activeNames: ['1', '2', '3', '4'],
      innerElement: {},
      tag: false,
      ingoreKeys: [
        'left',
        'top',
        'name',
        'width',
        'height',
        'color',
        'backgroundColor'
      ],
      layerIconList: [
        {
          key: 'zIndex',
          icon: 'icon-layer-up',
          tip: '上一层',
          value: 1
        },
        {
          key: 'zIndex',
          icon: 'icon-layer-down',
          tip: '下一层',
          value: -1
        }
      ],
      alignIconList: [
        {
          key: 'align',
          icon: 'icon-align-left',
          tip: '左对齐',
          value: 'left'
        },
        {
          key: 'align',
          icon: 'icon-align-center-horiz',
          tip: '水平居中对齐',
          value: 'ch'
        },
        {
          key: 'align',
          icon: 'icon-align-right',
          tip: '右对齐',
          value: 'right'
        },
        {
          key: 'align',
          icon: 'icon-align-top',
          tip: '上对齐',
          value: 'top'
        },
        {
          key: 'align',
          icon: 'icon-align-center-verti',
          tip: '垂直居中对齐',
          value: 'cv'
        },
        {
          key: 'align',
          icon: 'icon-align-bottom',
          tip: '下对齐',
          value: 'bottom'
        }
      ],
      chosedColors:[["#002c4a", "#005584"],["#35ac03", "#3f4303"],["#ac0908", "#cd5726"],["#18bbff", "#00486b"]]
    }
  },
  computed: {
    ...mapGetters([
      'dActiveElement',
      'dMoving'
    ])
  },
  watch: {
    dActiveElement: {
      handler(newValue, oldValue) {
        this.change()
      },
      deep: true
    },
    innerElement: {
      handler(newValue, oldValue) {
        this.changeValue()
      },
      deep: true
    }
  },
  created () {
    this.change()
  },
  methods: {
    ...mapActions([
      'updateWidgetData',
      'updateAlign',
      'updateLayerIndex',
      'updateFullPage'
    ]),
    change () {
      this.tag = true
      this.innerElement = JSON.parse(JSON.stringify(this.dActiveElement))
    },
    changeValue () {
      if (this.tag) {
        this.tag = false
        return
      }
      if (this.dMoving) {
        return
      }
      for(let key in this.innerElement) {
        if (this.ingoreKeys.indexOf(key) !== -1) {
          this.dActiveElement[key] = this.innerElement[key]
        } else if (key !== 'setting' && key !== 'record' && this.innerElement[key] !== this.dActiveElement[key]) {
          this.updateWidgetData({
            uuid: this.dActiveElement.uuid,
            key: key,
            value: this.innerElement[key]
          })
        }
      }
    },
    finish (key, value) {
      this.updateWidgetData({
        uuid: this.dActiveElement.uuid,
        key: key,
        value: value,
        pushHistory: true
      })
    },
    layerAction (item) {
      this.updateLayerIndex({
        uuid: this.dActiveElement.uuid,
        value: item.value
      })
    },
    alignAction (item) {
      this.updateAlign({
        align: item.value,
        uuid: this.dActiveElement.uuid
      })
    },
    selectTheme(val){
      let t = this.chosedColors[val]
      this.innerElement.color = t[1]
      this.innerElement.backgroundColor = t[0]

    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl'
#w-circle-style
  width: 100%
  height: 100%

.line-layout
  width: 100%
  display: flex
  flex-direction: row
  flex-wrap: wrap
  justify-content: space-between
.style-item
  margin-bottom: 10px
.setting-list
  width: 100%
  display: flex
  flex-direction: row
  justify-content: space-between
  flex-wrap: wrap
</style>
