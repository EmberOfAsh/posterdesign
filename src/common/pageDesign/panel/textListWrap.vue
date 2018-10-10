<template>
<div id="img-list-wrap">
    <div class="style-tab">
      <span class="tab" :class="{'active-tab' : activeTab === 0}" @click="activeTab = 0">普通字体</span>
      <span class="tab" :class="{'active-tab' : activeTab === 1}" @click="activeTab = 1">艺术字体</span>
    </div>
    <div class="tab-content" v-if="hadShowMyImg" :style="getStyle(0)">
      <div id="text-list-wrap">
        <ul class="basic-text-wrap">
        <li
          class="basic-text-item"
          v-for="(item, index) in basicTextList"
          :key="index"
          :style="{
            fontSize: item.disFontSize / 2 + 'px',
            fontWeight: item.fontWeight
          }"
          @click="selectBasicText(item)">
          {{ item.text }}
        </li>
      </ul>
      </div>
    </div>
    <div class="tab-content" v-if="hadShowRecommendImg" :style="getStyle(1)">
      <img-water-fall 
        class="shape-list" 
        :listData="fontsList"
        sortBy="id"
        k="id"
        @select-img="selectFont" />
    </div>
  </div>
</template>

<script>

// 文本组件列表
const NAME = 'text-list-wrap'

import wText from 'COMMON/pageDesign/widgets/wText/wText'
import WordArt from 'COMMON/pageDesign/widgets/wText/WordArt'
import serverInfo from '../../../config/serverInfo.js'
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: NAME,
  data () {
    return {
      activeTab: 0,
      hadShowMyImg: true,
      hadShowRecommendImg: false,
      fontsList:[],
      basicTextList: []
    }
  },
  mounted(){
    this.loadFontsInfo()
    this.initTextList()
  },
  computed: {
    ...mapGetters([
      'dPage'
    ]),
    /*主标题 字体大小*/
    mainTitleFontSize(){
      let max = Math.min(this.dPage.width,this.dPage.height)
      return Math.ceil(max / 10)
    }
  },
  watch:{
    activeTab(value) {
      if (value === 0) {
        this.hadShowMyImg = true;
      } else if (value === 1) {
        this.hadShowRecommendImg = true;
      }
    }
  },
  methods: {
    ...mapActions([
      'addWidget'
    ]),
    initTextList(){
      this.basicTextList = [{
          text: '大标题',
          fontSize: this.mainTitleFontSize,
          disFontSize: 96,
          fontWeight: 'bold'
        },
        {
          text: '标题',
          fontSize: Math.ceil(this.mainTitleFontSize * 2 / 3),
          disFontSize:60,
          fontWeight: 'bold'
        },
        {
          text: '副标题',
          fontSize: Math.ceil(this.mainTitleFontSize * 1 / 2),
          disFontSize:40,
          fontWeight: 'normal'
        },
        {
          text: '小标题',
          fontSize: Math.ceil(this.mainTitleFontSize / 3),
          disFontSize: 36,
          fontWeight: 'normal'
        },
        {
          text: '正文内容',
          fontSize: Math.ceil(this.mainTitleFontSize / 4),
          disFontSize: 28,
          fontWeight: 'normal'
        }]
    },
    getStyle(index) {
      return {
        display: this.activeTab === index ? "" : "none"
      };
    },
    selectBasicText (item) {
      let setting = JSON.parse(JSON.stringify(wText.setting))
      setting.text = item.text
      setting.fontSize = item.fontSize
      setting.fontWeight = item.fontWeight
      this.addWidget(setting)
    },
    loadFontsInfo(){
      let ins = this;
      let url = serverInfo.getFontUrl()
      fetch(url).then(function(response) {
          return response.text();
      }).then(function(text) {
        let ay = JSON.parse(text)
        ins.disFonts(ay)
      })
    },
    disFonts(ay){
      let ins = this;
      let idx = 0
      ay.forEach(element => {
        let name = element.split('.')[0]
        idx ++
        ins.fontsList.push({
          id: idx,
          fontName:name,
          url: serverInfo.uploadServer+'/fonts-preview/'+name+'.jpg',
          ratio: 100 / 30
        })
      });
    },
    selectFont(val){
      let data = val.value
      let setting = JSON.parse(JSON.stringify(WordArt.setting))
      setting.fontFamily = data.fontName
      setting.text = '艺术字体'
      this.addWidget(setting)
    },
  }
}
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

#text-list-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .basic-text-wrap {
    width: 100%;
    border-bottom: 1px solid #092625;
    padding: 10px 0;

    .basic-text-item {
      width: 100%;
      text-align: center;
      padding: 5px 0;
      color: $white;
      border-top: 1px solid $color-transparent;
      border-bottom: 1px solid $color-transparent;
      cursor: pointer;

      &:hover {
        border-top: 1px solid $color-main;
        border-bottom: 1px solid $color-main;
        background-color: $color-dark-gray;
      }
    }
  }

  .other-text-wrap {
    width: 100%;
    flex: 1;
    overflow: auto;
  }
}

#shape-list-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .shape-list {
    width: 100%;
    height: 100%;
  }
}

#img-list-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .style-tab {
    width: 100%;
    display: flex;
    border-bottom: 1px solid $color-dark-gray;

    .tab {
      flex: 1;
      padding: 10px;
      color: $color-white;
      cursor: pointer;
      border-bottom: 2px solid $color-transparent;
      text-align: center;

      &.active-tab {
        color: $color-main;
        border-bottom: 2px solid $color-main;
      }
    }
  }

  .tab-content {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;

    .img-list {
      width: 100%;
      flex: 1;

      .img-item {
        width: 33.33%;
        height: auto;
        padding: 6px;
        cursor: pointer;

        &:hover {
          outline: 1px solid $color-main;
        }

        .img {
          width: 100%;
        }
      }
    }

    .upload-btn-wrap {
      width: 100%;
      display: flex;
      justify-content: center;

      .upload-btn {
        cursor: pointer;
        width: 80%;
        padding: 10px;
        margin: 15px;
        text-align: center;
        border-radius: 5px;
        color: $color-white;
        background-color: $color-main;

        &:hover {
          background-color: lighten($color-main, 10%);
        }
      }
    }
  }
}
</style>
