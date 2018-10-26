<template>
  <div id="style-panel">
    <div class="style-tab">
      <span class="tab" :class="{'active-tab' : activeTab === 0}" @click="activeTab = 0">设置</span>
      <span class="tab" :class="{'active-tab' : activeTab === 1}" @click="activeTab = 1">图层</span>
      <span class="tab" :class="{'active-tab' : activeTab === 2}" @click="activeTab = 2">动画</span>
    </div>
    <div class="style-wrap" v-show="activeTab === 0">
      <component
        v-if="dActiveElement.type"
        :is="dActiveElement.type + '-style'" />
    </div>
    <div class="layer-wrap" v-show="activeTab === 1">
      <transition-group class="widget-list" tag="ul" name="drog">
        <li
          class="widget"
          key="pageInfo"
          :class="{active : dActiveElement.uuid === dPage.uuid && dSelectWidgets.length === 0}"
          @click="selectLayer(dPage)"
          @mouseover="hoverLayer('-1')" 
          @mouseout="hoverLayer('-1')"
          >
          <!--
          <span class="widget-type" @click="widgetDisplayClick(widget,'widget')">
            <span class="widget-dis" :class="displayAll==false?'widget-invisible':' widget-visible'"></span>
          </span>
          -->
          <span class="widget-type"></span>
          <span class="widget-name" @click="widgetDisplayClick(widget,'widget')">{{ dPage.name }}</span>
          <div 
            class="widget-out"
            :data-type="dPage.type"
            :data-uuid="dPage.uuid"
            :style="{
              marginLeft: '-10px'
            }">
          </div>
        </li>
        <li
          class="widget"
          :class="[
            {
              active : getIsActive(widget.uuid)
            },
            widget.parent === '-1' ? 'item-one' : 'item-two'
          ]"
          v-for="(widget, index) in getWidgets"
          :key="widget.uuid"
          @click="selectLayer(widget)"
          @mouseover="hoverLayer(widget.uuid)" 
          @mouseout="hoverLayer('-1')"
          draggable="true"
          @dragstart="dragStart($event, index,widget.uuid)" @dragover="allowDrop" @drop="drop($event, index,widget.uuid)"
          >
          <span class="widget-type" @click="widgetDisplayClick(widget,'widget')">
            <span class="widget-dis" :class="widget.display==false?'widget-invisible':' widget-visible'"></span>
          </span>
          <span class="widget-type"><span class="type-dis" :class="getTypeClass(widget)"></span></span>
          <span class="widget-name">{{ widget.name }}</span>
          <span>
            <el-popover
              placement="left"
              :title="'「'+widget.name+'」详情'"
              width="300"
              trigger="click" >
              <table class="info-table">
                <tbody>
                  <tr>
                    <td>类型: </td>
                    <td>{{widget.type}}</td>
                  </tr>
                  <tr v-if="widget.type == 'w-image'">
                    <td>尺寸: </td>
                    <td>{{widget.width}} × {{widget.height}}</td>
                  </tr>
                  <tr>
                    <td>内容: </td>
                    <td>
                      <template v-if="widget.type == 'w-text' || widget.type == 'word-art'" >
                        {{widget.text}}
                      </template>
                      <template v-if="widget.type == 'w-image' || widget.type == 'w-svg'">
                        <img class="small-img" :src="widget.imgUrl"/>
                      </template>
                      <template v-if="widget.type =='qr-code'">
                        {{widget.qrData.text}}
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
              <a slot="reference" class="el-icon-info" @click="openWidgetDetail(widget)"></a>
            </el-popover>
          </span>
          <!--
          <div 
            class="widget-out"
            :data-type="widget.type"
            :data-uuid="widget.uuid"
            :style="{
              marginLeft: widget.parent === '-1' ? '-25px' : '-40px'
            }">
          </div>
          -->
        </li>
      </transition-group>
    </div>
    <div class="layer-wrap" v-show="activeTab === 2 ">
      <el-collapse v-model="activeNames">
         <el-collapse-item title="播放控制" name="0">
           <el-switch
            v-model="playAnimate"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="stopAnimate(playAnimate)"
            >
          </el-switch>
         </el-collapse-item>
        <el-collapse-item title="动画设置" name="1">
           <div class="line-layout style-item" v-show="dActiveElement.uuid != -1">
        <div style="margin-bottom:10px;">
          <template v-for="an in getAnimatesInfo()">
            <el-tag class="margin-left-10" :key="an" >{{an}}</el-tag>
          </template>
        </div>
        <el-form ref="form" label-width="80px" size="mini">
          <el-form-item label="动画名称">
            <el-select v-model="choseAnimate" clearable placeholder="请选择">
              <el-option
                v-for="item in animates"
                :key="item.name"
                :label="item.label"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="动画速度">
            <el-select v-model="choseAnimateSpeed" clearable placeholder="请选择">
              <el-option
                v-for="item in animateSpeed"
                :key="item.name"
                :label="item.label"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="createAnimate">立即创建</el-button>
            <el-button type="danger" @click="deleteAnimate">删除动画</el-button>
          </el-form-item>
        </el-form>
        </div>
        </el-collapse-item>
      </el-collapse>
      
    </div>
  </div>
</template>

<script>
// 样式设置面板
const NAME = "style-panel";
import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  data() {
    return {
      activeNames: ['0', '1'],
      activeTab: 0,
      choseAnimate: "",
      choseAnimateSpeed: "",
      playAnimate: true,
      animates: [
        {
          name: "move-to-right",
          label: "平移移动",
          tag: "move"
        },
        {
          name: "rotation",
          label: "旋转",
          tag: "rotation"
        },
        {
          name: "flashing",
          label: "闪烁",
          tag: "flashing"
        },
        {
          name: "zoom",
          label: "放大",
          tag: "zoom"
        },
        {
          name: "pendulum",
          label: "钟摆",
          tag: "pendulum"
        }
      ],
      animateSpeed: [
        { name: "slow", label: "慢" },
        { name: "normal", label: "中" },
        { name: "fast", label: "快" }
      ],
      displayAll:true,
    };
  },
  computed: {
    ...mapGetters(["dActiveElement", "dWidgets", "dPage", "dSelectWidgets"]),
    getWidgets() {
      let widgets = [];
      let len = this.dWidgets.length;
      let childs = [];
      for (let i = len - 1; i >= 0; --i) {
        let widget = JSON.parse(JSON.stringify(this.dWidgets[i]));
        if (widget.parent === "-1") {
          widgets.push(widget);
          if (widget.isContainer) {
            widgets = widgets.concat(childs);
            childs = [];
          }
        } else {
          childs.push(widget);
        }
      }
      if (childs.length > 0) {
        widgets = widgets.concat(childs);
      }
      widgets.forEach(el => (el.visible = false));

      return widgets;
    }
  },
  methods: {
    ...mapActions([
      "selectWidget",
      "updateHoverUuid",
      "moveLayer",
      "updateWidgetData",
      "stopAnimate"
    ]),
    selectLayer(widget) {
      this.selectWidget({
        uuid: widget.uuid
      });
    },
    hoverLayer(uuid) {
      this.updateHoverUuid(uuid);
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
    },
    //开始拖动
    dragStart(e, index) {
      e.dataTransfer.setData("Text", index);
    },
    //放置
    drop(e, index, uuid) {
      //取消默认行为
      this.allowDrop(e);
      let dragIndex = e.dataTransfer.getData("Text");
      console.log("move layer from ", dragIndex, " to ", index);
      this.moveLayer({ from: dragIndex, to: index, uuid: uuid });
    },
    //取消默认行为
    allowDrop(e) {
      e.preventDefault();
    },
    getTypeClass(widget) {
      let t = widget.type;
      if (t == "w-text") {
        return "type-txt";
      }
      if (t == "w-image") {
        return "type-img";
      }
      let ay = ["w-rectangle", "w-line", "w-circle"];
      if (ay.find(el => el == t)) {
        return "type-shape";
      }
      return t;
    },
    openWidgetDetail(widget) {
      console.debug("查看图层详情", widget);
    },
    deleteAnimate() {
      if (this.dActiveElement.uuid != -1) {
        this.updateWidgetData({
          uuid: this.dActiveElement.uuid,
          key: "animates",
          value: [],
          pushHistory: true
        });
      }
    },
    createAnimate() {
      if (this.choseAnimate && this.choseAnimateSpeed) {
        let ay = [];
        ay.push(this.choseAnimate);
        ay.push(this.choseAnimate + "-" + this.choseAnimateSpeed);
        this.updateWidgetData({
          uuid: this.dActiveElement.uuid,
          key: "animates",
          value: ay,
          pushHistory: true
        });
      }
    },
    getAnimatesInfo(){
      let ins = this;
      if (this.dActiveElement.uuid == -1) return []
      let animates = this.dActiveElement.animates
      let ret = []
      if(animates){
        animates.forEach(el=>{
          let f = ins.animates.find(e=>e.name == el)
          if(f) ret.push(f.label)
          else{
            if(el.indexOf('fast')){
              ret.push('快')
            }
            else if(el.indexOf('normal')){
              ret.push('中')
            }
            else if(el.indexOf('slow')){
              ret.push('慢')
            }
          }
        })
      }
      return ret
    },
    widgetDisplayClick(widget,type){
      event.stopPropagation()
      if(type == 'widget'){
         this.finish('display',!widget.display,widget)
      }else if(type == 'all'){
        this.displayAll = !this.displayAll
        this.dWidgets.forEach(el => (this.finish('display',this.displayAll,el)))
      }
    },
    finish(key, value, widget) {
      this.updateWidgetData({
        uuid: widget.uuid,
        key: key,
        value: value,
        pushHistory: true
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

#style-panel {
  position: relative;
  width: 300px;
  height: 100%;
  background-color: #ffffff;
  border-left: 1px solid #d7d7d7;
  display: flex;
  flex-direction: column;

  .style-tab {
    width: 100%;
    display: flex;
    flex-direction: row;
    text-align: center;
    box-shadow: 0px 1px 5px 1px rgba(0, 0, 0, 0.1);
    z-index: 10;

    .tab {
      flex: 1;
      padding: 10px;
      background-color: $color-white;
      color: $color-black;
      cursor: pointer;

      &.active-tab {
        background-color: $color-light-gray;
        color: $color-white;
      }
    }
  }

  .style-wrap {
    flex: 1;
    width: 100%;
    overflow: auto;
  }

  .layer-wrap {
    flex: 1;
    width: 100%;
    overflow: auto;

    .widget-list {
      width: 100%;

      .widget {
        position: relative;
        width: 100%;
        display: flex;
        padding: 10px;
        align-items: center;
        border-bottom: 1px solid #d7d7d7;
        cursor: pointer;
        background-color: #efefef;
        color: $color-black;

        &.active {
          background-color: $color-dark-gray;
          color: $color-white;
        }

        .widget-type {
          margin-right: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: $color-white;
          color: $color-black;
        }

        .widget-name {
          flex: 1;
          font-size: 14px;
          single-text-ellipsis();
        }

        .widget-out {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }

      .item-one {
        padding-left: 10px;
        padding-right: 10px;
      }

      .item-two {
        padding-left: 40px;
      }

      .type-dis {
        width: 30px;
        height: 30px;
        background-size: 30px 30px;
      }

      .type-txt {
        background-image: url('../../../assets/icon/text_icon.png');
      }

      .type-img {
        background-image: url('../../../assets/icon/pic_icon.png');
      }

      .type-shape {
        background-image: url('../../../assets/icon/shapes_icon.png');
      }

      .w-group {
        background-image: url('../../../assets/icon/group_icon.png');
      }
      .w-svg {
        background-image: url('../../../assets/icon/svg_icon.svg');
      }

      .widget-dis {
        width: 20px;
        height: 20px;
        background-size: 20px 20px;
      }
      .widget-visible {
        background-image: url('../../../assets/icon/eye-visiable.png');
      }
      .widget-invisible {
        background-image: url('../../../assets/icon/eye-invisible.png');
      }
    }
  }
}

.small-img {
  max-width: 220px;
  max-height: 300px;
  height: auto;
}

.info-table > tbody > tr>td:nth-child(1) {
  font-weight: bolder;
}
.margin-left-10{
  margin-left:10px;
}
</style>
