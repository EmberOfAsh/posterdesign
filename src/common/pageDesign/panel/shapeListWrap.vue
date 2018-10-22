<template>
  <div id="img-list-wrap">
    <div class="style-tab">
      <span class="tab" :class="{'active-tab' : activeTab === 0}" @click="activeTab = 0">形状</span>
      <span class="tab" :class="{'active-tab' : activeTab === 1}" @click="activeTab = 1">简单形状</span>
    </div>
    <div class="tab-content" v-if="hadShowMyImg" :style="getStyle(0)">
      <img-water-fall 
        class="img-list"
        :listData="templateResource" 
        sortBy="id"
        k="id"
        @select-img="selectImg" />
    </div>
    <div class="tab-content" v-if="hadShowRecommendImg" :style="getStyle(1)">
      <img-water-fall 
        class="shape-list" 
        :listData="shapeList"
        sortBy="id"
        k="id"
        @select-img="selectShape" />
    </div>
  </div>
</template>

<script>

// 形状列表
const NAME = 'shape-list-wrap'

import wCircle from 'COMMON/pageDesign/widgets/wCircle/wCircle'
import wLine from 'COMMON/pageDesign/widgets/wLine/wLine'
import wRectangle from 'COMMON/pageDesign/widgets/wRectangle/wRectangle'
import wSvg from 'COMMON/pageDesign/widgets/wImage/wSvg';
import wImage from "COMMON/pageDesign/widgets/wImage/wImage";
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
      shapeList: [],
      list: [
        {
          id: 1,
          url: 'http://bearcarimg.codebear.cn/981ece4443dee0bcb2c8cc2c3a83a1463yQocPJBFuufMQPRTMVffM!gradual.show',
          ratio: 100 / 60,
          setting: ''
        },
        {
          id: 2,
          url: 'http://bearcarimg.codebear.cn/fef0936c6d2f180e6e177a3fc56667bf6P7xvZPoKiDV2hfpMnOMUg!gradual.show',
          ratio: 80 / 100,
          setting: ''
        },
        {
          id: 3,
          url: 'http://bearcarimg.codebear.cn/1d3c5119753230453d923efacecdc38d63LlspnxruQ9fYADV66CnO!gradual.show',
          ratio: 1,
          setting: ''
        },
        {
          id: 4,
          url: 'http://bearcarimg.codebear.cn/9c8f233c366bed5319aaeedb4aa13ef73u33zQlXvFNSjwCwhoJEDY!gradual.show',
          ratio: 1,
          setting: ''
        },
        {
          id: 5,
          url: 'http://bearcarimg.codebear.cn/68d1c9cc707a0420e9249f82fb11091477CzSOwR5gdeN9FLB2iDo2!gradual.show',
          ratio: 1,
          setting: ''
        },
        {
          id: 6,
          url: 'http://bearcarimg.codebear.cn/6963f9e14a24a568874b3789d96b18246jxGBDdR4rBjjzt7uZe1YY!gradual.show',
          ratio: 1,
          setting: ''
        }
      ],
      templateResource: [
        {
          id: 1,
          url: require("../../../assets/svg/sharpe- (1).svg"),
          ratio: 1
        },{
          id: 2,
          url: require("../../../assets/svg/sharpe- (2).svg"),
          ratio: 1
        },{
          id: 3,
          url: require("../../../assets/svg/sharpe- (3).svg"),
          ratio: 1
        },{
          id: 4,
          url: require("../../../assets/svg/sharpe- (4).svg"),
          ratio: 1
        },{
          id: 5,
          url: require("../../../assets/svg/sharpe- (5).svg"),
          ratio: 1
        },{
          id: 6,
          url: require("../../../assets/svg/sharpe- (6).svg"),
          ratio: 1
        },{
          id:7,
          url: require("../../../assets/svg/sharpe- (7).svg"),
          ratio: 1
        },{
          id: 8,
          url: require("../../../assets/svg/sharpe- (8).svg"),
          ratio: 1
        },{
          id: 9,
          url: require("../../../assets/svg/sharpe- (9).svg"),
          ratio: 1
        },{
          id: 10,
          url: require("../../../assets/svg/sharpe- (10).svg"),
          ratio: 1
        },{
          id: 11,
          url: require("../../../assets/svg/sharpe- (11).svg"),
          ratio: 1
        },{
          id: 12,
          url: require("../../../assets/svg/sharpe- (12).svg"),
          ratio: 1
        },{
          id: 13,
          url: require("../../../assets/svg/sharpe- (13).svg"),
          ratio: 1
        },{
          id: 14,
          url: require("../../../assets/svg/sharpe- (14).svg"),
          ratio: 1
        },{
          id: 15,
          url: require("../../../assets/svg/sharpe- (15).svg"),
          ratio: 1
        },{
          id: 16,
          url: require("../../../assets/svg/sharpe- (16).svg"),
          ratio: 1
        },{
          id: 17,
          url: require("../../../assets/svg/sharpe- (17).svg"),
          ratio: 1
        },{
          id: 18,
          url: require("../../../assets/svg/sharpe- (18).svg"),
          ratio: 1
        },{
          id: 19,
          url: require("../../../assets/svg/sharpe- (19).svg"),
          ratio: 1
        },{
          id: 20,
          url: require("../../../assets/svg/sharpe- (20).svg"),
          ratio: 1
        },{
          id: 21,
          url: require("../../../assets/svg/sharpe- (21).svg"),
          ratio: 1
        },{
          id: 22,
          url: require("../../../assets/svg/sharpe- (22).svg"),
          ratio: 1
        }
      ]
    }
  },
  created () {
    let line = JSON.parse(JSON.stringify(wLine.setting))
    this.list[0].setting = line
    let line2 = JSON.parse(JSON.stringify(wLine.setting))
    line2.width = 2
    line2.height = 300
    this.list[1].setting = line2
    let circle = JSON.parse(JSON.stringify(wCircle.setting))
    this.list[2].setting = circle
    let circle2 = JSON.parse(JSON.stringify(wCircle.setting))
    circle2.backgroundColor = 'rgba(0, 0, 0, 1)'
    this.list[3].setting = circle2
    let rectangle = JSON.parse(JSON.stringify(wRectangle.setting))
    this.list[4].setting = rectangle
    let rectangle2 = JSON.parse(JSON.stringify(wRectangle.setting))
    rectangle2.backgroundColor = 'rgba(0, 0, 0, 1)'
    this.list[5].setting = rectangle2
    this.shapeList = this.list

  },
  mounted () {
  },
  watch: {
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
    getStyle(index) {
      return {
        display: this.activeTab === index ? "" : "none"
      };
    },
    selectShape (item) {
      this.addWidget(JSON.parse(JSON.stringify(item.value.setting)))
    },
    selectImg(item) {
      let setting = JSON.parse(JSON.stringify(wSvg.setting));
      setting.width = 400;
      setting.height = parseInt(setting.width / item.value.ratio);
      setting.imgUrl = item.value.url;
      this.addWidget(setting);
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl'
#shape-list-wrap
  width: 100%
  height: 100%
  display: flex
  flex-direction: column
  .shape-list
    width: 100%
    height: 100%

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
