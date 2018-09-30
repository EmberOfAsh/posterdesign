<template>
  <div id="page-design-index" ref="pageDesignIndex">
    <div class="top-nav" :style="style">
      <div class="top-nav-wrap">
        <div class="top-back">
          <i class="el-icon-mobile-phone"></i>
        </div>
        <div class="top-title">
          pageDesign
        </div>
        <div class="top-icon-wrap">
          <el-button-group>
            <el-button @click="savePoster">保存</el-button>
            <el-button @click="savePosterAs">另存为</el-button>
          </el-button-group>
          <el-button-group>
            <el-button icon="el-icon-edit" @click="updatePageSizeDialog({display:true})">更改尺寸</el-button>
            <!--
            <el-button @click="changeHV('h')">横屏</el-button>
            <el-button @click="changeHV('v')">竖屏</el-button>
            -->
          </el-button-group>
          <div class="top-icon" @click="newPoster">
            <i class="iconfont icon-empty"></i>
            清空
          </div>
          <div class="top-icon" @click="save">
            <i class="iconfont icon-publish"></i>
            发布
          </div>

          <div class="top-icon" @click="save">
            <i class="iconfont icon-save"></i>
            保存
          </div>
        </div>
      </div>
    </div>
    <div class="page-design-index-wrap">
      <widget-panel></widget-panel>
      <page-design class="page-design-wrap" pageDesignCanvasId="page-design-canvas"></page-design>
      <style-panel></style-panel>
    </div>
    <div class="operation">
      <ul class="operation-wrap">
        <li 
          class="operation-item" 
          :class="{'disable' : !undoable}"
          @click="undoable ? handle('undo') : ''">
          <i class="iconfont icon-undo"></i>
          <p>撤销</p>
        </li>
        <li 
          class="operation-item" 
          :class="{'disable' : !redoable}"
          @click="redoable ? handle('redo') : ''">
          <i class="iconfont icon-redo"></i>
          <p>重做</p>
        </li>
      </ul>
      <ul class="operation-wrap">
        <li 
          class="operation-item" 
          :class="{'disable' : dActiveElement.uuid === '-1'}"
          @click="dActiveElement.uuid !== '-1' ? handle('copy') : ''">
          <i class="iconfont icon-copy"></i>
          <p>复制</p>
        </li>
        <li 
          class="operation-item" 
          :class="{'disable' : dCopyElement.length === 0}"
          @click="dCopyElement.length !== 0 ? handle('paste') : ''">
          <i class="iconfont icon-paste"></i>
          <p>粘贴</p>
        </li>
        <li 
          class="operation-item" 
          :class="{'disable' : dActiveElement.uuid === '-1'}"
          @click="dActiveElement.uuid !== '-1' ? handle('delete') : ''">
          <i class="iconfont icon-delete"></i>
          <p>删除</p>
        </li>
      </ul>
      <ul class="operation-wrap">
        <li 
          class="operation-item" 
          @click.stop="showGridSizeList = !showGridSizeList"
          :class="{'operation-item-active' : showGridSizeList}">
          <i class="iconfont icon-ref-grid"></i>
          <p>网格</p>
          <ul class="grid-selecter" v-show="showGridSizeList">
            <li
              v-for="(item, index) in gridSizeList"
              :key="index"
              class="grid-item"
              :class="{'grid-item-active' : gridSizeIndex === index}"
              @click="gridSizeIndex = index">
              <span>{{ item.value }}</span>
              <i class="iconfont icon-selected" v-if="gridSizeIndex === index"></i>
            </li>
          </ul>
        </li>
        <li 
          class="operation-item" 
          @click.stop="showRefLine(!dShowRefLine)"
          :class="{'operation-item-active' : dShowRefLine}">
          <i class="iconfont icon-ref-line"></i>
          <p>吸附</p>
        </li>
      </ul>
    </div>
    <zoom-control/>
    <div class="menu-bg" id="menu-bg" v-show="showMenuBg">
      <ul 
        class="menu-list"
        ref="menuList"
        :style="{
          left: menuList.left + 'px',
          top: menuList.top + 'px'
        }">
        <li
          class="menu-item"
          :class="{'disable-menu': dCopyElement.length === 0 && item.type === 'paste'}"
          v-for="(item, index) in menuList.list"
          :key="index"
          @click="selectMenu(item.type)">
          {{ item.text }}
        </li>
      </ul>
    </div>
    <div class="fill-info-wrap" v-if="fillInfoing">
      <div class="fill-info-content" v-loading="publishing">
        <el-steps :active="active[fillStep]" finish-status="success" align-center>
          <el-step :title="message['1']"></el-step>
          <!-- <el-step :title="message['2']"></el-step>
          <el-step :title="message['3']"></el-step> -->
        </el-steps>
        <div class="fill-info-step" v-if="fillStep === 1" v-loading="true">
        </div>
        <!-- <div class="fill-info-step" v-show="fillStep === 2 || fillStep === 3">
          <div id="cover-wrap">
            <img id="cover" />
          </div>
          <text-input label="名称" v-model="title" />
          <div class="publish-btn" @click="publish">
            <span v-show="!publishing">确认发布</span>
            <i class="el-icon-loading" v-show="publishing"></i>
          </div>
          <div class="close-publish" @click="closePublish">
            关闭
          </div>
        </div> -->
        <div class="fill-info-step" v-show="fillStep === 2 || fillStep === 3">
          <div id="cover-wrap">
            <img id="cover" />
          </div>
          <div class="publish-btn" @click="saveImg">
            <span v-show="!publishing">保存图片</span>
            <i class="el-icon-loading" v-show="publishing"></i>
          </div>
          <div class="close-publish" @click="closePublish">
            关闭
          </div>
        </div>
      </div>
    </div>
    <!--全局使用dialog-->
    <view-image-dialog :display.sync="viewImageDialog.display"></view-image-dialog>
    <edit-text-dialog :display.sync="editTextDialog.display"></edit-text-dialog>
    <view-image-album :display.sync="viewImageAlbum.display"></view-image-album>
    <page-size-dialog :display.sync="pageSizeDialog.display"></page-size-dialog>
  </div>
</template>

<script>
const axios = require('axios');
import PosterInfoService from '../../service/PosterInfoService'
import 'COMMON/pageDesign/index'
import wGroup from 'COMMON/pageDesign/widgets/wGroup/wGroup'
import { shortcuts } from 'MIXINS/shortcuts'
import html2canvas from 'html2canvas'
import {
  mapGetters,
  mapActions
} from 'vuex';
import domUtil from '../../util/domUtil';
export default {
  name: 'page-design-index',
  data () {
    return {
      style: {
        left: '0px'
      },
      gridSizeList: [
        {
          width: 0,
          height: 0,
          value: '无'
        },
        {
          width: 10,
          height: 10,
          value: '10x10'
        },
        {
          width: 20,
          height: 20,
          value: '20x20'
        },
        {
          width: 50,
          height: 50,
          value: '50x50'
        },
        {
          width: 75,
          height: 75,
          value: '75x75'
        },
        {
          width: 100,
          height: 100,
          value: '100x100'
        }
      ],
      gridSizeIndex: 0,
      showGridSizeList: false,
      showMenuBg: false,
      menuList: {
        left: 0,
        top: 0,
        list: []
      },
      widgetMenu: [
        {
          type: 'copy',
          text: '复制'
        },
        {
          type: 'paste',
          text: '粘贴'
        },
        {
          type: 'index-up',
          text: '上移一层'
        },
        {
          type: 'index-down',
          text: '下移一层'
        },
        {
          type: 'del',
          text: '删除'
        }
      ],
      pageMenu: [
        {
          type: 'paste',
          text: '粘贴'
        }
      ],
      fillInfoing: false,
      message: {
        '1': '生成封面图',
        '2': '填写模板信息',
        '3': '发布模板'
      },
      active: {
        '1': 0,
        '2': 1,
        '3': 2
      },
      fillStep: 1,
      formParams: {},
      title: '',
      publishing: false
    }
  },
  mixins: [shortcuts],
  computed: {
    ...mapGetters([
      'dHistoryParams',
      'dActiveElement',
      'dShowRefLine',
      'dCopyElement',
      'dPage',
      'dAltDown',
      'dWidgets',
      'dZoom' ,
      'viewImageDialog',
      'editTextDialog',
      'viewImageAlbum',
      'posterTemplateInfo',
      'pageSizeDialog'
    ]),
    undoable() {
      return !(this.dHistoryParams.index === -1 || (this.dHistoryParams === 0 && this.dHistoryParams.length === 10))
    },
    redoable() {
      return !(this.dHistoryParams.index === this.dHistoryParams.length - 1)
    }
  },
  mounted () {
    // 初始化激活的控件为page
    this.selectWidget({
      uuid: '-1'
    })
    this.initGroupJson(JSON.stringify(wGroup.setting))
    window.addEventListener('scroll', this.fixTopBarScroll)
    window.addEventListener('click', this.clickListener)
    document.addEventListener('keydown', this.handleKeydowm, false)
    document.addEventListener('keyup', this.handleKeyup, false)
    document.oncontextmenu = this.mouseRightClick

    this.loadTemplate();
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.fixTopBarScroll)
    window.removeEventListener('click', this.clickListener)
    document.removeEventListener('keydown', this.handleKeydowm, false)
    document.removeEventListener('keyup', this.handleKeyup, false)
    document.oncontextmenu = null
  },
  watch: {
    gridSizeIndex (index) {
      this.updateGridSize({
        width: this.gridSizeList[index].width,
        height: this.gridSizeList[index].height
      })
    }
  },
  methods: {
    ...mapActions([
      'addWidget',
      'updateGridSize',
      'handleHistory',
      'selectWidget',
      'deleteWidget',
      'copyWidget',
      'showRefLine',
      'pasteWidget',
      'updateWidgetData',
      'getWidgetJsonData',
      'initGroupJson',
      'updateLayerIndex',
      'ungroup',
      'updateZoom',
      'updateScreen',
      'updatePageSize',
      'clearWidget',
      'loadPosterTemplate',
      'updatePosterTemplateInfo',
      'updatePageSizeDialog'
    ]),
    loadTemplate(){
      let tid = this.$route.params.tid;
      if(tid){
        console.log('加载模版id:',tid);
        PosterInfoService.loadPosterTemplate(this.$http,tid,this.loadPosterTemplate)
      }else{
        let pt ={"from":"818ps.com","height":3366,"layouts":[{"name":"图片","width":1893,"height":3366,"top":1,"left":0,"zindex":1,"id":8,"type":"w-image","imgUrl":"https://img.tuguaishou.com/ips_asset/15/20/33/42/21/a1/a1158a9d2790980bb3fdae7b99153f3f.png!l800_i_w?auth_key=1537027200-0-0-b95721180c3caf97be280b69d6ad0fd4","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"all","height":1334},"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","setting":[{"parentKey":"imgUrl","label":"图片","value":true}]},{"name":"图片","width":230,"height":230,"top":1362,"left":587,"zindex":2,"id":7,"type":"w-image","imgUrl":"https://img.tuguaishou.com/ips_asset/15/20/33/42/21/bb/bb99a2ca38af29202139851db28df517.png!l800_i_w?auth_key=1537027200-0-0-151a03e3a6324802d880d2882b4dc227","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"all","height":1334},"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","setting":[{"parentKey":"imgUrl","label":"图片","value":true}]},{"name":"图片","width":231,"height":230,"top":1362,"left":879,"zindex":3,"id":6,"type":"w-image","imgUrl":"https://img.tuguaishou.com/ips_asset/15/20/33/42/21/12/12a1dfe005ae5e1e95ad76b0f3c8283c.png!l800_i_w?auth_key=1537027200-0-0-51bea9114d0a0a5fce580d5a4d4b0a87","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"all","height":1334},"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","setting":[{"parentKey":"imgUrl","label":"图片","value":true}]},{"name":"图片","width":483,"height":176,"top":1390,"left":616,"zindex":4,"id":5,"type":"w-image","imgUrl":"https://img.tuguaishou.com/ips_asset/15/20/33/42/21/1c/1c5a28ffb91af47ef1914862106631f7.png!l800_i_w?auth_key=1537027200-0-0-fd5644c52b4d73e099f279d51cdb75ce","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"all","height":1334},"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","setting":[{"parentKey":"imgUrl","label":"图片","value":true}]},{"name":"图片","width":61,"height":358,"top":1688,"left":1046,"zindex":5,"id":4,"type":"w-image","imgUrl":"https://img.tuguaishou.com/ips_asset/15/20/33/42/21/5a/5a802b50e6d5b8bec33f0b1af6409f2f.png!l800_i_w?auth_key=1537027200-0-0-58f7b1f760756f61b5c2d450cc5f7c2f","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"all","height":1334},"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","setting":[{"parentKey":"imgUrl","label":"图片","value":true}]},{"name":"图片","width":80,"height":69,"top":1497,"left":1281,"zindex":6,"id":3,"type":"w-image","imgUrl":"https://img.tuguaishou.com/ips_asset/15/20/33/42/21/72/72a81083e6e5e2a031378b3bc3544ae9.png!l800_i_w?auth_key=1537027200-0-0-fb32837fc7f3f61ba394b2bef5fdcee8","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"all","height":1334},"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","setting":[{"parentKey":"imgUrl","label":"图片","value":true}]},{"name":"图片","width":46,"height":41,"top":1555,"left":1281,"zindex":7,"id":2,"type":"w-image","imgUrl":"https://img.tuguaishou.com/ips_asset/15/20/33/42/21/ae/aeba1c32fea5b55b9b0d25b6a401fb24.png!l800_i_w?auth_key=1537027200-0-0-a665ef69d42e7fad92c4035775926343","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"all","height":1334},"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","setting":[{"parentKey":"imgUrl","label":"图片","value":true}]},{"name":"图片","width":91,"height":76,"top":1881,"left":928,"zindex":8,"id":1,"type":"w-image","imgUrl":"https://img.tuguaishou.com/ips_asset/15/20/33/42/21/a7/a7ffe052a7bb514ad5d0bdaee2a98e80.png!l800_i_w?auth_key=1537027200-0-0-cbbd0b294c06577bff84ea6e41d39329","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"all","height":1334},"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","setting":[{"parentKey":"imgUrl","label":"图片","value":true}]},{"name":"图片","width":47,"height":40,"top":1854,"left":972,"zindex":9,"id":0,"type":"w-image","imgUrl":"https://img.tuguaishou.com/ips_asset/15/20/33/42/21/44/4446a87dff6e3270cb7ea38f1c228144.png!l800_i_w?auth_key=1537027200-0-0-a2d53f9a97528cfa53337632a03fd5ae","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"all","height":1334},"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","setting":[{"parentKey":"imgUrl","label":"图片","value":true}]},{"name":"广告标语","width":1216,"height":0,"top":59,"left":310,"zindex":10,"parent":"-1","id":10,"type":"w-text","text":"/七/夕/传/统/佳/节/","fontSize":44,"fontWeight":"normal","fontFamily":"syht","lineHeight":1.3,"textColor":"#000000ff","backgroundColor":"","fontStyle":"","letterSpacing":38.738738738739,"textAlign":"center","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"horizontal","height":1334},"setting":[{"parentKey":"text","label":"文本内容","value":true},{"parentKey":"textColor","label":"文本颜色","value":false}]},{"name":"节日时间","width":470,"height":0,"top":1615,"left":566,"zindex":11,"parent":"-1","id":11,"type":"w-text","text":"七月初七七夕节","fontSize":52,"fontWeight":"bold","fontFamily":"syht","lineHeight":1.25,"textColor":"#ffffffff","backgroundColor":"","fontStyle":"","letterSpacing":0,"textAlign":"center","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"horizontal","height":1334},"setting":[{"parentKey":"text","label":"文本内容","value":true},{"parentKey":"textColor","label":"文本颜色","value":false}]},{"name":"副标题","width":89,"height":0,"top":1476,"left":1183,"zindex":12,"parent":"-1","id":12,"type":"w-text","text":"有你在","fontSize":57,"fontWeight":"bold","fontFamily":"syht","lineHeight":1.23,"textColor":"#ffffffff","backgroundColor":"","fontStyle":"","letterSpacing":0,"textAlign":"center","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"horizontal","height":1334},"setting":[{"parentKey":"text","label":"文本内容","value":true},{"parentKey":"textColor","label":"文本颜色","value":false}]},{"name":"副标题","width":89,"height":0,"top":1531,"left":1109,"zindex":13,"parent":"-1","id":13,"type":"w-text","text":"每天都是情人节","fontSize":57,"fontWeight":"bold","fontFamily":"syht","lineHeight":1.23,"textColor":"#ffffffff","backgroundColor":"","fontStyle":"","letterSpacing":0,"textAlign":"center","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"horizontal","height":1334},"setting":[{"parentKey":"text","label":"文本内容","value":true},{"parentKey":"textColor","label":"文本颜色","value":false}]},{"name":"副标题","width":454,"height":0,"top":1682,"left":558,"zindex":14,"parent":"-1","id":14,"type":"w-text","text":"DOUBLE SEVENTH","fontSize":49,"fontWeight":"normal","fontFamily":"syht","lineHeight":1.27,"textColor":"#ffffffff","backgroundColor":"","fontStyle":"","letterSpacing":0,"textAlign":"center","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"horizontal","height":1334},"setting":[{"parentKey":"text","label":"文本内容","value":true},{"parentKey":"textColor","label":"文本颜色","value":false}]},{"name":"副标题","width":391,"height":0,"top":1758,"left":590,"zindex":15,"parent":"-1","id":15,"type":"w-text","text":"遇见你·遇见最美的你","fontSize":37,"fontWeight":"normal","fontFamily":"syht","lineHeight":1.35,"textColor":"#ffffffff","backgroundColor":"","fontStyle":"","letterSpacing":0,"textAlign":"center","record":{"minHeight":10,"width":750,"minWidth":10,"dir":"horizontal","height":1334},"setting":[{"parentKey":"text","label":"文本内容","value":true},{"parentKey":"textColor","label":"文本颜色","value":false}]}],"pid":104688,"title":"中秋国庆节日插画海报","width":1893}
        pt = {
    "from": "818ps.com",
    "height": 1080,
    "layouts": [
        {
            "name": "雪花特效",
            "type": "w-snow",
            "uuid": "ec119833738f",
            "width": 1920,
            "height": 1080,
            "left": 0,
            "top": 0,
            "opacity": 1,
            "parent": "-1",
            "color": "",
            "backgroundColor": "rgba(0, 0, 0, 0.1)",
            "size": 5,
            "rotate": 0,
            "setting": [],
            "record": {
                "width": 0,
                "height": 0,
                "minWidth": 1,
                "minHeight": 1,
                "dir": "all"
            },
            "imgUrl": "http://192.168.1.8:3000/images/c3b/934/c3b934388a49c8f5df4271da62d91486.png",
            "zIndex": 0
        }
    ],
    "pid": 104688,
    "title": "中秋国庆节日插画海报",
    "width": 1920,
    "page": "{\"name\":\"背景页面\",\"type\":\"page\",\"uuid\":\"-1\",\"left\":0,\"top\":0,\"width\":1920,\"height\":1080,\"backgroundColor\":\"#fff\",\"backgroundImage\":\"\",\"opacity\":1,\"tag\":0.01,\"setting\":[{\"label\":\"背景颜色\",\"parentKey\":\"backgroundColor\",\"value\":false}],\"record\":{}}"
}

pt = {
    "category": "112",
    "from": "www.egpic.cn",
    "height": 3360,
    "layouts": [
        {
            "id": 32,
            "width": 2463,
            "height": 3360,
            "top": 0,
            "left": 0,
            "name": "底图",
            "zindex": 0,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 1,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_2ca054190cb36936c989407de03edd51.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 31,
            "width": 2463,
            "height": 1062,
            "top": 2298,
            "left": 0,
            "name": "图层 1",
            "zindex": 1,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_3b239842d07aead6f9e90a891bf08b59.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 30,
            "width": 770,
            "height": 314,
            "top": 2768,
            "left": 59,
            "name": "矢量智能对象",
            "zindex": 2,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_70b07bb3c52392b08a94498579ae7de9.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 29,
            "width": 817,
            "height": 385,
            "top": 2925,
            "left": 777,
            "name": "矢量智能对象",
            "zindex": 3,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_c1efb4feca63986b2f1d678caa0e1d66.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 28,
            "width": 618,
            "height": 316,
            "top": 2865,
            "left": 1790,
            "name": "矢量智能对象",
            "zindex": 4,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_6b0a67c9e29e4608db4ca3ebcc79f45c.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 27,
            "width": 513,
            "height": 464,
            "top": 2654,
            "left": 1277,
            "name": "矢量智能对象",
            "zindex": 5,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_fe31e9a40b055ad8299473aec78bb22a.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 26,
            "width": 183,
            "height": 101,
            "top": 2553,
            "left": 1231,
            "name": "矢量智能对象",
            "zindex": 6,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_423ce457410c39f17777a822269151ec.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 25,
            "width": 456,
            "height": 456,
            "top": 298,
            "left": 880,
            "name": "世",
            "zindex": 7,
            "parent": "-1",
            "type": "w-text",
            "text": "世",
            "fontSize": 456,
            "fontFamily": "fangzhengshusong",
            "lineHeight": 1,
            "textColor": "rgba(255,255,255,255)",
            "textAlign": "left",
            "rotate": 0,
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "horizontal",
                "height": 1334
            },
            "setting": [
                {
                    "parentKey": "text",
                    "label": "文本内容",
                    "value": true
                },
                {
                    "parentKey": "textColor",
                    "label": "文本颜色",
                    "value": false
                }
            ]
        },
        {
            "id": 24,
            "width": 817,
            "height": 525,
            "top": 475,
            "left": 861,
            "name": "形状 1",
            "zindex": 8,
            "type": "w-svg",
            "opacity": "1.000",
            "isBgImage": 0,
            "textColor": "rgba(255,255,255,1)",
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_a41c2b222a7ce229b79545ba6acdd07c.svg+xml",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 23,
            "width": 238,
            "height": 170,
            "top": 1258,
            "left": 854,
            "name": "形状 2",
            "zindex": 9,
            "type": "w-svg",
            "opacity": "1.000",
            "isBgImage": 0,
            "textColor": "rgba(255,255,255,1)",
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_a327e2b124e3ab4deb1087c561a1016a.svg+xml",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 22,
            "width": 236,
            "height": 176,
            "top": 944,
            "left": 1384,
            "name": "形状 3",
            "zindex": 10,
            "type": "w-svg",
            "opacity": "1.000",
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_41a7110876d0c8f64a6a64115e90fbdd.svg+xml",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 21,
            "width": 54,
            "height": 54,
            "top": 634,
            "left": 1542,
            "name": "椭圆 1",
            "zindex": 11,
            "type": "w-svg",
            "opacity": "1.000",
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_234d14def4ecf7c569f493ca95f7f37d.svg+xml",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 20,
            "width": 57,
            "height": 57,
            "top": 1212,
            "left": 984,
            "name": "椭圆 1 拷贝",
            "zindex": 12,
            "type": "w-svg",
            "opacity": "1.000",
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_931904dd2b054e309556766c2e4cfcc.svg+xml",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 19,
            "width": 54,
            "height": 54,
            "top": 1357,
            "left": 1322,
            "name": "椭圆 1 拷贝 2",
            "zindex": 13,
            "type": "w-svg",
            "opacity": "1.000",
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_7579a16349f6bfcffd7b151daf152cfd.svg+xml",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 18,
            "width": 512,
            "height": 243,
            "top": 1290,
            "left": 188,
            "name": "矢量智能对象",
            "zindex": 14,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_51607fb542e214a191e0b7a568a9aca8.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 16,
            "width": 387,
            "height": 386,
            "top": 2864,
            "left": 156,
            "name": "矢量智能对象",
            "zindex": 15,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_62a1d9d7d3e3b5465f26ab1b34176eb7.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 15,
            "width": 476,
            "height": 150,
            "top": 634,
            "left": 1898,
            "name": "矢量智能对象",
            "zindex": 16,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_3eedac42018a6ecbb81dd57134b7ef6f.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 14,
            "width": 405,
            "height": 397,
            "top": 228,
            "left": 1288,
            "name": "界",
            "zindex": 17,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_5ae1978e511261c2cc6f211748ebb260.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 13,
            "width": 227,
            "height": 678,
            "top": 847,
            "left": 1113,
            "name": "旅游日",
            "zindex": 18,
            "parent": "-1",
            "type": "w-text",
            "text": "旅游日",
            "fontSize": 226,
            "fontFamily": "fangzhengshusong",
            "lineHeight": 1,
            "textColor": "rgba(255,255,255,255)",
            "textAlign": "left",
            "rotate": 0,
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "horizontal",
                "height": 1334
            },
            "setting": [
                {
                    "parentKey": "text",
                    "label": "文本内容",
                    "value": true
                },
                {
                    "parentKey": "textColor",
                    "label": "文本颜色",
                    "value": false
                }
            ]
        },
        {
            "id": 12,
            "width": 53,
            "height": 265,
            "top": 740,
            "left": 1406,
            "name": "限量的时光",
            "zindex": 19,
            "parent": "-1",
            "type": "w-text",
            "text": "限量的时光",
            "fontSize": 53,
            "fontFamily": "fangzhengshusong",
            "lineHeight": 1,
            "textColor": "rgba(255,255,255,255)",
            "textAlign": "left",
            "rotate": 0,
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "horizontal",
                "height": 1334
            },
            "setting": [
                {
                    "parentKey": "text",
                    "label": "文本内容",
                    "value": true
                },
                {
                    "parentKey": "textColor",
                    "label": "文本颜色",
                    "value": false
                }
            ]
        },
        {
            "id": 11,
            "width": 53,
            "height": 318,
            "top": 741,
            "left": 1348,
            "name": "不限量的记忆",
            "zindex": 20,
            "parent": "-1",
            "type": "w-text",
            "text": "不限量的记忆",
            "fontSize": 53,
            "fontFamily": "fangzhengshusong",
            "lineHeight": 1,
            "textColor": "rgba(255,255,255,255)",
            "textAlign": "left",
            "rotate": 0,
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "horizontal",
                "height": 1334
            },
            "setting": [
                {
                    "parentKey": "text",
                    "label": "文本内容",
                    "value": true
                },
                {
                    "parentKey": "textColor",
                    "label": "文本颜色",
                    "value": false
                }
            ]
        },
        {
            "id": 10,
            "width": 240,
            "height": 54,
            "top": 1152,
            "left": 1387,
            "name": "2018.9.27",
            "zindex": 21,
            "parent": "-1",
            "type": "w-text",
            "text": "2018.9.27",
            "fontSize": 54,
            "fontFamily": "fangzhengshusong",
            "lineHeight": 1,
            "textColor": "rgba(255,255,255,255)",
            "textAlign": "left",
            "rotate": 0,
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "horizontal",
                "height": 1334
            },
            "setting": [
                {
                    "parentKey": "text",
                    "label": "文本内容",
                    "value": true
                },
                {
                    "parentKey": "textColor",
                    "label": "文本颜色",
                    "value": false
                }
            ]
        },
        {
            "id": 9,
            "width": 919,
            "height": 136,
            "top": 1643,
            "left": 818,
            "name": "圆角矩形 1",
            "zindex": 22,
            "type": "w-svg",
            "opacity": "1.000",
            "isBgImage": 0,
            "textColor": "rgba(255,79,136,1)",
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_291babb1d2a3ffd1b9865f663239bf92.svg+xml",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 8,
            "width": 1452,
            "height": 70,
            "top": 1841,
            "left": 582,
            "name": "特色花园别墅+海边国际酒店+五星级自助晚餐",
            "zindex": 23,
            "parent": "-1",
            "type": "w-text",
            "text": "特色花园别墅+海边国际酒店+五星级自助晚餐",
            "fontSize": 70,
            "fontFamily": "weiruanyahei",
            "lineHeight": 1,
            "textColor": "rgba(255,255,255,255)",
            "textAlign": "left",
            "rotate": 0,
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "horizontal",
                "height": 1334
            },
            "setting": [
                {
                    "parentKey": "text",
                    "label": "文本内容",
                    "value": true
                },
                {
                    "parentKey": "textColor",
                    "label": "文本颜色",
                    "value": false
                }
            ]
        },
        {
            "id": 7,
            "width": 1327,
            "height": 94,
            "top": 2216,
            "left": 624,
            "name": "世界旅游日 全场出游八折优惠",
            "zindex": 24,
            "parent": "-1",
            "type": "w-text",
            "text": "世界旅游日 全场出游八折优惠",
            "fontSize": 94,
            "fontFamily": "weiruanyahei",
            "lineHeight": 1,
            "textColor": "rgba(255,255,255,255)",
            "letterSpacing": 0.06,
            "textAlign": "left",
            "rotate": 0,
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "horizontal",
                "height": 1334
            },
            "setting": [
                {
                    "parentKey": "text",
                    "label": "文本内容",
                    "value": true
                },
                {
                    "parentKey": "textColor",
                    "label": "文本颜色",
                    "value": false
                }
            ]
        },
        {
            "id": 6,
            "width": 206,
            "height": 71,
            "top": 1213,
            "left": 1390,
            "name": "矢量智能对象",
            "zindex": 25,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_c55c536ccafbb4febfae110c3fa2e3d3.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 5,
            "width": 98,
            "height": 206,
            "top": 989,
            "left": 961,
            "name": "矢量智能对象",
            "zindex": 26,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_ab0293abe4f7fbb5069d6d122b4e80fb.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 4,
            "width": 73,
            "height": 116,
            "top": 811,
            "left": 1507,
            "name": "矢量智能对象",
            "zindex": 27,
            "type": "w-image",
            "opacity": 1,
            "isBgImage": 0,
            "imgUrl": "http://192.168.1.8:3000/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_3dbb1c6804a6e9607f2bc851f3ae83bc.png",
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "all",
                "height": 1334
            },
            "radiusTopLeft": 0,
            "radiusTopRight": 0,
            "radiusBottomLeft": 0,
            "radiusBottomRight": 0,
            "parent": "-1",
            "setting": [
                {
                    "parentKey": "imgUrl",
                    "label": "图片",
                    "value": true
                }
            ]
        },
        {
            "id": 3,
            "width": 988,
            "height": 70,
            "top": 1954,
            "left": 783,
            "name": "SELF-DRVING TRAVELLING",
            "zindex": 28,
            "parent": "-1",
            "type": "w-text",
            "text": "SELF-DRVING TRAVELLING",
            "fontSize": 70,
            "fontFamily": "weiruanyahei",
            "lineHeight": 1,
            "textColor": "rgba(255,255,255,255)",
            "letterSpacing": 0.1,
            "textAlign": "left",
            "rotate": 0,
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "horizontal",
                "height": 1334
            },
            "setting": [
                {
                    "parentKey": "text",
                    "label": "文本内容",
                    "value": true
                },
                {
                    "parentKey": "textColor",
                    "label": "文本颜色",
                    "value": false
                }
            ]
        },
        {
            "id": 2,
            "width": 84,
            "height": 91,
            "top": 2078,
            "left": 1082,
            "name": "￥",
            "zindex": 29,
            "parent": "-1",
            "type": "w-text",
            "text": "￥",
            "fontSize": 91,
            "fontFamily": "weiruanyahei",
            "lineHeight": 1,
            "textColor": "rgba(255,255,255,255)",
            "textAlign": "center",
            "rotate": 0,
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "horizontal",
                "height": 1334
            },
            "setting": [
                {
                    "parentKey": "text",
                    "label": "文本内容",
                    "value": true
                },
                {
                    "parentKey": "textColor",
                    "label": "文本颜色",
                    "value": false
                }
            ]
        },
        {
            "id": 1,
            "width": 312,
            "height": 116,
            "top": 2061,
            "left": 1171,
            "name": "8888",
            "zindex": 30,
            "parent": "-1",
            "type": "w-text",
            "text": "8888",
            "fontSize": 116,
            "fontFamily": "siyuanheiti",
            "lineHeight": 1,
            "textColor": "rgba(255,79,137,255)",
            "textAlign": "center",
            "rotate": 0,
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "horizontal",
                "height": 1334
            },
            "setting": [
                {
                    "parentKey": "text",
                    "label": "文本内容",
                    "value": true
                },
                {
                    "parentKey": "textColor",
                    "label": "文本颜色",
                    "value": false
                }
            ]
        },
        {
            "id": 0,
            "width": 801,
            "height": 91,
            "top": 1665,
            "left": 890,
            "name": "爱上巴厘岛5日5夜",
            "zindex": 31,
            "parent": "-1",
            "type": "w-text",
            "text": "爱上巴厘岛5日5夜",
            "fontSize": 91,
            "fontFamily": "weiruanyahei",
            "lineHeight": 1,
            "textColor": "rgba(255,255,255,255)",
            "letterSpacing": 0.06,
            "textAlign": "left",
            "rotate": 0,
            "record": {
                "minHeight": 10,
                "width": 750,
                "minWidth": 10,
                "dir": "horizontal",
                "height": 1334
            },
            "setting": [
                {
                    "parentKey": "text",
                    "label": "文本内容",
                    "value": true
                },
                {
                    "parentKey": "textColor",
                    "label": "文本颜色",
                    "value": false
                }
            ]
        }
    ],
    "pid": "6f634a7411e7202fc014e099f18a5767",
    "preview": "/poster-res/6f634a7411e7202fc014e099f18a5767/6f634a7411e7202fc014e099f18a5767_42aec52e759221c00bc03f8e50f53c30.png",
    "title": "世界旅游日印刷海报",
    "width": 2463
}

this.loadPosterTemplate(pt)
      }
    },
    newPoster () {
      this.clearWidget()
    },
    /*更改横屏/竖屏*/
    changeHV(type){
      console.log('更改屏幕类型: ',type);
      if(type == 'h'){
          this.updatePageSize({width:1920, height:1080});
      }else{
        //v
        this.updatePageSize({width:1080, height:1920});
      }
    },
    fixTopBarScroll () {
      const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
      this.style.left = `-${scrollLeft}px`
    },
    clickListener (e) {
      this.showGridSizeList = false
    },
    handle (action) {
      switch (action) {
        case 'undo':
        case 'redo':
          this.handleHistory(action)
          break
        case 'delete':
          this.deleteWidget()
          break
        case 'copy':
          this.copyWidget()
          break
        case 'paste':
          this.pasteWidget()
          break
      }
    },
    mouseRightClick (e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.showMenuBg) {
        this.showMenuBg = false
        return
      }
      let target = domUtil.getWidgetRoot(e.target) || e.target
      let type = target.getAttribute('data-type')
      if (type) {
        let uuid = target.getAttribute('data-uuid')// 设置选中元素

        if (uuid !== '-1' && !this.dAltDown) {
          let widget = this.dWidgets.find(item => item.uuid === uuid)
          if (widget.parent !== '-1' && widget.parent !== this.dActiveElement.uuid && widget.parent !== this.dActiveElement.parent) {
            uuid = widget.parent
          }
        }
        this.selectWidget({
          uuid: uuid || '-1'
        })
        this.showMenu(e)
      }
    },
    showMenu (e) {
      let isPage = this.dActiveElement.uuid === '-1'
      this.menuList.list = isPage ? this.pageMenu : this.widgetMenu
      if (this.dActiveElement.isContainer) {
        let ungroup = [{
          type: 'ungroup',
          text: '取消组合'
        }]
        this.menuList.list = ungroup.concat(this.menuList.list)
      }
      this.showMenuBg = true
      document.getElementById('menu-bg').addEventListener('click', this.closeMenu, false)
      let mx = e.pageX
      let my = e.pageY
      let listWidth = 120
      if (mx + listWidth > window.innerWidth) {
        mx -= listWidth
      }
      let listHeight = (14 + 10) * this.menuList.list.length + 10
      if (my + listHeight > window.innerHeight) {
        my -= listHeight
      }
      this.menuList.left = mx
      this.menuList.top = my
    },
    closeMenu () {
      this.showMenuBg = false
      document.getElementById('menu-bg').removeEventListener('click', this.closeMenu, false)
    },
    selectMenu (type) {
      switch (type) {
        case 'copy':
          this.copyWidget()
          break
        case 'paste':
          if (this.dCopyElement.length === 0) {
            return
          }
          this.pasteWidget()
          break
        case 'index-up':
          this.updateLayerIndex({
            uuid: this.dActiveElement.uuid,
            value: 1,
            isGroup: this.dActiveElement.isContainer
          })
          break
        case 'index-down':
          this.updateLayerIndex({
            uuid: this.dActiveElement.uuid,
            value: -1,
            isGroup: this.dActiveElement.isContainer
          })
          break
        case 'del':
          this.deleteWidget()
          break
        case 'ungroup':
        this.ungroup(this.dActiveElement.uuid)
          break
      }
    },
    // save () {
    //   this.fillStep = 1
    //   this.fillInfoing = true
    //   let nowGrideSizeIndex = this.gridSizeIndex
    //   let nowZoom = this.dZoom
    //   // 取消选中元素
    //   this.selectWidget({
    //     uuid: '-1'
    //   })
    //   this.gridSizeIndex = 0
    //   this.updateZoom(100)
    //   this.getQiniuToken().then((data) => {
    //     let opts = {
    //       useCORS: true, // 跨域图片
    //     }
    //     html2canvas(document.getElementById('page-design-canvas'), opts).then((canvas) => {
    //       canvas.toBlob((blob) => {
    //         this.blobToImage(blob, data => {
    //           document.getElementById('cover').src = data
    //         })

    //         this.fillStep = 2
    //         this.gridSizeIndex = nowGrideSizeIndex
    //         this.updateZoom(nowZoom)

    //         this.formParams = new FormData()
    //         this.formParams.append('token', data.token)
    //         this.formParams.append('file', blob, 'canvas.png')
    //       }, 'image/png')
    //     })
    //   }).catch(err => this.saveError(err.msg))
    // },
    publish () {
      if (this.publishing) {
        return
      }
      if (!this.title) {
        this.$message({
          showClose: true,
          message: '请输入名称',
          type: 'error'
        })
        return
      }
      this.publishing = true
      this.uploadToQiniu(this.formParams).then((qiniuData) => {
        this.getWidgetJsonData().then((json) => {
          let templateData = {
            title: this.title,
            template: JSON.stringify(json),
            cover: qiniuData.imgUrl
          }
          this.fillStep = 3
          this.createDesignTemplate(templateData).then(data => {
            this.fillStep = 4
            this.publishing = false
            this.fillInfoing = false
            this.$message({
              showClose: true,
              message: '发布完成',
              type: 'success'
            })
          }).catch(err => {
            this.publishing = false
            if (!err.code === -2) {
              this.saveError(err.msg)
            }
          })
        })
      }).catch(err => this.saveError(err.msg))
    },
    closePublish () {
      this.publishing = false
      this.fillInfoing = false
      this.fillStep = 1
    },
    saveError (message) {
      this.publishing = false
      this.fillInfoing = false
      this.fillStep = 1
      this.$message({
        showClose: true,
        message: message,
        type: 'error'
      })
    },
    fileOrBlobToDataURL (obj, cb) {
      let a = new FileReader()
      a.readAsDataURL(obj)
      a.onload = e => {
        cb(e.target.result)
      }
    },
    blobToImage (blob, cb){
      this.fileOrBlobToDataURL(blob, dataurl => {
        cb(dataurl)
      })
    },
    save () {
      this.fillStep = 1
      this.fillInfoing = true
      let nowGrideSizeIndex = this.gridSizeIndex
      let nowZoom = this.dZoom
      // 取消选中元素
      this.selectWidget({
        uuid: '-1'
      })
      this.gridSizeIndex = 0
      this.updateZoom(100)
      let opts = {
        useCORS: true, // 跨域图片
      }
      let _this = this
      setTimeout(function() {
        html2canvas(document.getElementById('page-design-canvas'), opts).then((canvas) => {
          console.debug(canvas)

          canvas.toBlob((blob) => {
            _this.blobToImage(blob, data => {
              document.getElementById('cover').src = data
            })

            _this.fillStep = 2
            _this.gridSizeIndex = nowGrideSizeIndex
            _this.updateZoom(nowZoom)

          }, 'image/png',0.5)
        })
      }, 500)
      console.log('save',JSON.stringify( this.dWidgets))
    },
    saveImg () {
      if (this.publishing) {
        return
      }
      this.publishing = true
      let image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
          let canvas = document.createElement('canvas')
          canvas.width = image.width
          canvas.height = image.height

          let context = canvas.getContext('2d')
          context.drawImage(image, 0, 0, image.width, image.height)
          let url = canvas.toDataURL('image/png')

          let a = document.createElement('a')
          let event = new MouseEvent('click')

          // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
          a.download = name || 'pageDesign'
          a.href = url

          // 触发a的单击事件
          a.dispatchEvent(event)
      }

      image.src = document.getElementById('cover').src
      this.publishing = false
    },
    /**保存海报 **/
    savePoster() {
      this.updatePosterTemplateInfo()
      console.debug(this.posterTemplateInfo)
      PosterInfoService.updatePosterInfo(this.$http, this.posterTemplateInfo)
    },
    /**海报另存为 **/
    savePosterAs() {
      this.updatePosterTemplateInfo()
      console.debug(this.posterTemplateInfo)
      PosterInfoService.savePosterInfo(this.$http, this.posterTemplateInfo)
    }
  }
}
</script>

<style lang="stylus">
@import '~STYLUS/page-design-element-ui.styl'
</style>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl'
#page-design-index
  width: 100%
  min-width: 1180px
  height: 100%
  min-height: 500px
  position: absolute
  background-color: #efefef
  display: flex
  flex-direction: column
  .menu-bg
    position: absolute
    width: 100%
    height: 100%
    z-index: 9999
    .menu-list
      position: absolute
      width: 120px
      background-color: $color-white
      box-shadow: 1px 0px 10px 3px rgba(0, 0, 0, .1)
      padding: 5px
      .menu-item
        width: 100%
        padding: 5px 15px
        cursor: pointer
        font-size: 14px
        line-height: 1
        &:hover
          background-color: #ececec
        &.disable-menu
          background-color: $color-white
          cursor: not-allowed
          color: #aaaaaa
  .top-nav
    position: relative
    width: 100%
    min-width: 1180px
    height: 45px
    .top-nav-wrap
      position: fixed
      width: 100%
      height: 45px
      min-width: 1180px
      background-color: $color-main
      display: flex
      align-items: center
      .top-back
        width: 60px
        height: 45px
        cursor: pointer
        color: $color-white
        display: flex
        justify-content: center
        align-items: center
        box-shadow: 1px 0px 10px 3px rgba(0, 0, 0, .1) inset
        i
          font-size: 28px
      .top-title
        flex: 1
        text-align: center
        color: $color-white
        font-weight: bold
        cursor: pointer
      .top-icon-wrap
        height: 45px
        display: flex
        .top-icon
          color: $color-white
          margin: 8px
          border-radius: 5px
          padding: 5px 8px
          font-weight: bold
          cursor: pointer
          background-color: rgba(0, 0, 0, .4)
          &:hover
            background-color: rgba(0, 0, 0, .5)
  .page-design-index-wrap
    width: 100%
    height: 100%
    flex: 1
    display: flex
    overflow: hidden
    flex-direction: row
    .page-design-wrap
      flex: 1
.operation
  z-index: 1000
  width: 45px
  position: absolute
  top: 200px
  right: 320px
  .operation-wrap
    box-shadow: 1px 1px 10px 3px rgba(0, 0, 0, .1)
    margin-bottom: 20px
    &:last-child
      margin-bottom: 0px
    .operation-item
      border-bottom: 1px solid $color-dark-gray
      background-color: $color-light-gray
      color: $color-white
      width: 100%
      height: 45px
      font-size: 10px
      cursor: pointer
      display: flex
      justify-content: center
      align-items: center
      flex-direction: column
      p
        margin-top: 5px
      &:hover
        color: $color-main
        background-color: $color-dark-gray
      &:last-child
        border-bottom: 0px
      .grid-selecter
        position: absolute
        width: 120px
        left: -8px
        transform: translateX(-100%)
        background-color: $color-dark-gray
        color: $color-white
        z-index: 1000
        &:after
          content: ''
          position: absolute
          top: 50%
          right: -8px
          transform: translateY(-50%)
          triangle(right, 8px, $color-dark-gray)
        .grid-item
          width: 100%
          height: 34px
          font-size: 14px
          padding: 10px
          display: flex
          align-items: center
          cursor: pointer
          span
            flex: 1
          &:hover
            color: $color-main
            background-color: #50555b
        .grid-item-active
          color: $color-main
          background-color: #50555b
    .operation-item-active
      color: $color-main
      background-color: $color-dark-gray
    .disable
      color: #808080
      &:hover
        color: #808080
        background-color: $color-light-gray
        cursor: not-allowed

.fill-info-wrap
  position: absolute
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.8)
  z-index: 2000
  padding: 50px
  .fill-info-content
    border-radius: 10px
    width: 600px
    min-height: 600px
    max-height: 861px
    margin: 0 auto
    padding: 20px
    background-color: #fff
    display: flex
    flex-direction: column
    .fill-info-step
      width: 100%
      flex: 1
      #cover-wrap
        margin: 20px auto
        width: 400px
        height: 400px
        display: flex
        justify-content: center
        align-items: center
        #cover
          max-width: 400px
          max-height: 400px
          box-shadow: 1px 1px 10px 3px rgba(0, 0, 0, .1)
      .publish-btn
        margin: 20px auto
        padding: 10px
        text-align: center
        border-radius: 5px
        color: $color-white
        background-color: $color-main
        cursor: pointer
        &:hover
          background-color: lighten($color-main, 10%)
      .close-publish
        margin: 20px auto
        margin-bottom: 0px
        padding: 10px
        text-align: center
        border-radius: 5px
        color: $color-main
        background-color: $color-white
        outline: 1px solid $color-main
        cursor: pointer
        &:hover
          color: $color-white
          background-color: lighten($color-main, 10%)

</style>
