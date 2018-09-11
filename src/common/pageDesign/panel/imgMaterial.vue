<template>
  <div id="img-list-wrap">
    <div style="background-color:#fff;display:flex;">
      <el-dropdown trigger="click" @command="albumClick">
        <el-button type="primary" size="small">
          {{cur_album.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <template v-for="album in albums">
            <el-dropdown-item v-if="album.count > 0" :key="album.albumId+'id'" :command="album">{{album.name}} ({{album.count}})</el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
      <el-pagination :total="pager.total" :current-page="pager.current" :page-sizes="[9, 18, 27]" :page-size="pager.size"
        layout="total,  prev, next" @current-change="currentChange" @size-change="sizeChange"></el-pagination>
    </div>

    <div class="tab-content">
      <img-water-fall class="img-list" :listData="recommendImgList" sortBy="id" k="id" @delete-img="deleteImg"
        @select-img="selectImg" />
    </div>
  </div>
</template>

<script>
// 图片列表
const NAME = "img-material";

import wImage from "COMMON/pageDesign/widgets/wImage/wImage";
import serverInfo from "../../../config/serverInfo.js";

import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  data() {
    return {
      albums: [],
      cur_album:{name:'所有'},
      pager: { total: 0, current: 1, size: 24 },
      activeTab: -1,
      myImgList: [],
      recommendImgList: [],
      pos: 0
    };
  },
  mounted() {
    this.loadImgMaterial();
    this.loadAlbum();
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
    ...mapActions(["addWidget"]),
    getStyle(index) {
      return {
        display: this.activeTab === index ? "" : "none"
      };
    },
    selectImg(item) {
      let setting = JSON.parse(JSON.stringify(wImage.setting));
      setting.width = 100;
      setting.height = parseInt(100 / item.value.ratio);
      setting.imgUrl = item.value.url;
      this.addWidget(setting);
    },
    deleteImg(item) {
      //
    },
    loadAlbum() {
      // MaterialAlbum/Album?keyword=
      let url = "/MaterialAlbum/Album?keyword=&type=image";
      this.$http.get(url).then(response => {
        console.log(response);
        this.albums = response.data.list;
      });
    },
    loadImgMaterial() {
      let url =
        "/resource/Material/" + this.pager.current + "-" + this.pager.size;
      let data = { type: "image" ,albumId:this.cur_album.albumId };
      this.$http.post(url, data).then(response => {
        let data = response.data.data;
        this.pager.total = response.data.pager.total;
        this.convertData(data);
      });
    },
    convertData(datas) {
      datas.forEach(element => {
        element.ratio = 50 / 50;
        element.url = serverInfo.getViewUrl(element.url);
      });
      this.recommendImgList = datas;
    },
    uploadImg() {},
    currentChange(val) {
      this.pager.current = val;
      this.loadImgMaterial();
    },
    sizeChange(val) {
      this.pager.size = val;
      this.loadImgMaterial();
    },
    albumClick(album) {
      this.cur_album = album;
      this.pager.current = 1
      this.loadImgMaterial()
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

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
