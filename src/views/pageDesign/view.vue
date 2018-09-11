<template>
    <div class="page-design-index-wrap">
      <page-design class="page-design-wrap" pageDesignCanvasId="page-design-canvas"></page-design>
    </div>
</template>

<script>
const axios = require('axios');
import 'COMMON/pageDesign/index'
import wGroup from 'COMMON/pageDesign/widgets/wGroup/wGroup'
import { shortcuts } from 'MIXINS/shortcuts'
import html2canvas from 'html2canvas'

import {
  mapGetters,
  mapActions
} from 'vuex'

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
      'viewImageAlbum'
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
      'clearWidget'
    ]),
    loadTemplate(){
      let tid = this.$route.params.tid;
      console.log('加载模版id:',tid);
      let ay = [{"id":0,"name":"背景场景图片","type":"w-image","width":1080,"height":1920,"left":0,"top":0,"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","imgUrl":"http://img1.maka.im/user/4536575/images/b17c7c7f4f5ff19af19275244c157f6d.png","setting":[{"label":"背景图片","parentKey":"imgUrl","value":true}],"record":{"width":1080,"height":1920,"minWidth":10,"minHeight":10,"dir":"all"},"uuid":"6301b4d61d42"},{"id":1,"name":"主题信息图片","type":"w-image","width":762,"height":485,"left":159,"top":306,"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","imgUrl":"http://img1.maka.im/user/4536575/images/cde6cf475b36a60426fc7a838c11649c.png","setting":[{"label":"背景图片","parentKey":"imgUrl","value":true}],"record":{"width":762,"height":485,"minWidth":10,"minHeight":10,"dir":"all"},"uuid":"11c3431fa274"},{"name":"广告词","type":"w-text","uuid":"e63943516777","editable":true,"width":504,"left":288,"top":1331,"lineHeight":1.5,"letterSpacing":0,"fontSize":60,"fontWeight":"bold","fontStyle":"normal","textDecoration":"none","textColor":"rgba(255, 255, 255, 1)","textAlign":"center","text":"苟利国家生死以","opacity":1,"backgroundColor":"","parent":"-1","setting":[{"label":"文本内容","parentKey":"text","value":true},{"label":"文本颜色","parentKey":"textColor","value":false}],"record":{"width":504,"height":90,"minWidth":60,"minHeight":90,"dir":"horizontal"}}]
      this.updatePageSize({width:1920, height:1080});
      ay = [{"name":"图片","type":"w-image","uuid":"9f88ea61c969","width":1920,"height":1080,"left":0,"top":0,"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","imgUrl":"/static/img/20180831-144716-f64d.2c39147.png","setting":[{"label":"图片","parentKey":"imgUrl","value":true}],"record":{"width":1920,"height":1080,"minWidth":10,"minHeight":10,"dir":"all"}},{"name":"图片","type":"w-image","uuid":"42c32f8c3abf","width":914,"height":696,"left":503,"top":66,"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","imgUrl":"/static/img/20180831-144716-542b.d9b2bfd.png","setting":[{"label":"图片","parentKey":"imgUrl","value":true}],"record":{"width":914,"height":696,"minWidth":10,"minHeight":10,"dir":"all"}},{"name":"图片","type":"w-image","uuid":"d3f769f8b480","width":608,"height":490,"left":656,"top":234,"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","imgUrl":"/static/img/20180831-144716-af9b.e3a7557.png","setting":[{"label":"图片","parentKey":"imgUrl","value":true}],"record":{"width":608,"height":490,"minWidth":10,"minHeight":10,"dir":"all"}},{"name":"图片","type":"w-image","uuid":"e5b28a8f6333","width":96,"height":452,"left":224,"top":42,"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","imgUrl":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABlCAYAAAAs7+ErAAADRElEQVRoQ+2bR4tVQRBGT5tzBMUEJsSAWVcuXOlOUf+nAdzpyoUrswsVMYEJFHOOLUfq6vUFZ0afvk01NAyP291fnaqu2XxdGOWotU4CpgMzYk4GxsXyr8AH4HXMN6WUj6PZuoz0Ua3VAxcD84Gp8X3ts67Z7x3wBHhQSlFU39FXQK11ArAKWAAY/WfgU2t+6dh1PDCxNV0vhUfAzVKK67tGTwG11nnAamBWbCJep0LmxpSGhzoUY9TPYnqwKXK65iVwo5TytFNBl4Ba6yJgPSDm98AbYAqwJqapmBabd9bA20B/HXC63rpxvWddKaU8bIv4RUCtdQ6wPXA3RbUS2AUsAyw202DE/t3UgvsopkmDf98FTgO3WkVrWs6VUp43In4IiCrfFtEZiUi3ALsDo7/1K75eZKVkKk4BF6OA/c19zje3pC1gHbAkPvAjD98bm4hyxBvToUKxorcGToQIBTjvl1Ku+v33TWutMwGjd9ELYDlwqFUHYz280dKIcP0R4A4wO86VwqtGgNF7172zLvJwc/7qDyLvTIf7GeA94HDsZ2+xR1wtkfudUUBGvwnYExU82pyP1M8M1HScBC4HBQv5jAK885vjnlv5+6IHeP0GObyON4DjrR5xSQHme0XgNz8H4u6OqpePQaHFaFDHos5Mw20FbIh2691UiARsm97zQQ57g31AArcBe84jBXjdbK+2ybUhYND4m0BMgwKuAab+WacAb4MEfvsf7C+wiF0B9oAUkASSQBJIAkkgCSSBJJAEkkASSAJJIAkkgSSQBJJAEkgCSSAJJIEkkASSQBJIAkkgCSSBJJAEkkBPAkPxEQ3dSTV0L5m5aLvp9oedd9B2rr5uOl1u+gk1mmlo2xhWTm2c/95PGJbO/+Go1GWrrVNz409HZR9Pqba+gwP2lB4NG1+3p7RFoe2q3RrWTo2Nf+uq1cp5IRy13a7aEGAteKgf6Cn20MZXrGd8rEVp0TW+4kvhKdUOrmX4QpevOEToctwR7unGWa3BXWf10kiJm/7OWW0g5rmXs9pAzvZ0Vv8wAg/TW94SYW8wcgvGiP+fu74lonlfsDDeDPzp+4LH8b5AU3zXGNGyPbQXFl3+7H/0xuQbCjWTFojpcAYAAAAASUVORK5CYII=","setting":[{"label":"图片","parentKey":"imgUrl","value":true}],"record":{"width":96,"height":452,"minWidth":10,"minHeight":10,"dir":"all"}},{"name":"文本","type":"w-text","uuid":"a4a48d764345","editable":true,"width":44,"left":253,"top":80,"lineHeight":1.5,"letterSpacing":0,"fontSize":"36","fontWeight":"bold","fontStyle":"normal","textDecoration":"none","textColor":"rgba(250, 212, 0, 1)","textAlign":"left","text":"每逢佳节倍思亲","opacity":1,"backgroundColor":"","parent":"-1","setting":[{"label":"文本内容","parentKey":"text","value":true},{"label":"文本颜色","parentKey":"textColor","value":false}],"record":{"width":44,"height":378,"minWidth":"36","minHeight":54,"dir":"horizontal"}},{"name":"图片","type":"w-image","uuid":"b9408c475ec8","width":332,"height":222,"left":148,"top":798,"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","imgUrl":"http://192.168.1.8:3000/images/dcd/7a4/dcd7a44c96a672932a966f0460048395.jpg","setting":[{"label":"图片","parentKey":"imgUrl","value":true}],"record":{"width":332,"height":222,"minWidth":10,"minHeight":10,"dir":"all"}},{"name":"图片","type":"w-image","uuid":"321dca84e187","width":332,"height":222,"left":596,"top":796,"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","imgUrl":"http://192.168.1.8:3000/images/dcd/7a4/dcd7a44c96a672932a966f0460048395.jpg","setting":[{"label":"图片","parentKey":"imgUrl","value":true}],"record":{"width":332,"height":222,"minWidth":10,"minHeight":10,"dir":"all"}},{"name":"图片","type":"w-image","uuid":"fc3b3042452c","width":332,"height":222,"left":1470,"top":796,"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","imgUrl":"http://192.168.1.8:3000/images/dcd/7a4/dcd7a44c96a672932a966f0460048395.jpg","setting":[{"label":"图片","parentKey":"imgUrl","value":true}],"record":{"width":332,"height":222,"minWidth":10,"minHeight":10,"dir":"all"}},{"name":"图片","type":"w-image","uuid":"593c1e7a50b3","width":332,"height":222,"left":1040,"top":796,"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","imgUrl":"http://192.168.1.8:3000/images/dcd/7a4/dcd7a44c96a672932a966f0460048395.jpg","setting":[{"label":"图片","parentKey":"imgUrl","value":true}],"record":{"width":332,"height":222,"minWidth":10,"minHeight":10,"dir":"all"}},{"name":"图片","type":"w-image","uuid":"d215747c2fdd","width":94,"height":452,"left":96,"top":42,"radiusTopLeft":0,"radiusTopRight":0,"radiusBottomLeft":0,"radiusBottomRight":0,"opacity":1,"parent":"-1","imgUrl":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABlCAYAAAAs7+ErAAADRElEQVRoQ+2bR4tVQRBGT5tzBMUEJsSAWVcuXOlOUf+nAdzpyoUrswsVMYEJFHOOLUfq6vUFZ0afvk01NAyP291fnaqu2XxdGOWotU4CpgMzYk4GxsXyr8AH4HXMN6WUj6PZuoz0Ua3VAxcD84Gp8X3ts67Z7x3wBHhQSlFU39FXQK11ArAKWAAY/WfgU2t+6dh1PDCxNV0vhUfAzVKK67tGTwG11nnAamBWbCJep0LmxpSGhzoUY9TPYnqwKXK65iVwo5TytFNBl4Ba6yJgPSDm98AbYAqwJqapmBabd9bA20B/HXC63rpxvWddKaU8bIv4RUCtdQ6wPXA3RbUS2AUsAyw202DE/t3UgvsopkmDf98FTgO3WkVrWs6VUp43In4IiCrfFtEZiUi3ALsDo7/1K75eZKVkKk4BF6OA/c19zje3pC1gHbAkPvAjD98bm4hyxBvToUKxorcGToQIBTjvl1Ku+v33TWutMwGjd9ELYDlwqFUHYz280dKIcP0R4A4wO86VwqtGgNF7172zLvJwc/7qDyLvTIf7GeA94HDsZ2+xR1wtkfudUUBGvwnYExU82pyP1M8M1HScBC4HBQv5jAK885vjnlv5+6IHeP0GObyON4DjrR5xSQHme0XgNz8H4u6OqpePQaHFaFDHos5Mw20FbIh2691UiARsm97zQQ57g31AArcBe84jBXjdbK+2ybUhYND4m0BMgwKuAab+WacAb4MEfvsf7C+wiF0B9oAUkASSQBJIAkkgCSSBJJAEkkASSAJJIAkkgSSQBJJAEkgCSSAJJIEkkASSQBJIAkkgCSSBJJAEkkBPAkPxEQ3dSTV0L5m5aLvp9oedd9B2rr5uOl1u+gk1mmlo2xhWTm2c/95PGJbO/+Go1GWrrVNz409HZR9Pqba+gwP2lB4NG1+3p7RFoe2q3RrWTo2Nf+uq1cp5IRy13a7aEGAteKgf6Cn20MZXrGd8rEVp0TW+4kvhKdUOrmX4QpevOEToctwR7unGWa3BXWf10kiJm/7OWW0g5rmXs9pAzvZ0Vv8wAg/TW94SYW8wcgvGiP+fu74lonlfsDDeDPzp+4LH8b5AU3zXGNGyPbQXFl3+7H/0xuQbCjWTFojpcAYAAAAASUVORK5CYII=","setting":[{"label":"图片","parentKey":"imgUrl","value":true}],"record":{"width":94,"height":452,"minWidth":10,"minHeight":10,"dir":"all"}},{"name":"文本","type":"w-text","uuid":"65f4f706bbcb","editable":true,"width":44,"left":125,"top":76,"lineHeight":1.5,"letterSpacing":0,"fontSize":"36","fontWeight":"bold","fontStyle":"normal","textDecoration":"none","textColor":"rgba(250, 212, 0, 1)","textAlign":"left","text":"独在异乡为异客","opacity":1,"backgroundColor":"","parent":"-1","setting":[{"label":"文本内容","parentKey":"text","value":true},{"label":"文本颜色","parentKey":"textColor","value":false}],"record":{"width":44,"height":378,"minWidth":"36","minHeight":54,"dir":"horizontal"}}]
      ay.forEach(element => {
        this.addWidget(element);
      });

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
      let target = e.target
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
