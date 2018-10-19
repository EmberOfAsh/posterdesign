<template>
<div id="img-list-wrap">
  <el-collapse >
    <el-collapse-item title="素材查询" name="1" >
      <div class="form-container">
        <el-form ref="form" label-width="60px" size="mini">
          <el-form-item label="名称">
            <el-input v-model="keywords"></el-input>
          </el-form-item>
          <el-form-item label="目录">
            <el-cascader placeholder="请选择" v-model="cur_albums" :props="tpt_props" :options="albumDatas" filterable></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="albumClick">搜索</el-button>
            <el-button type="danger" @click="albumReset">清空</el-button>
          </el-form-item>
        </el-form>
        <!--
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
          layout="total,prev, next" @current-change="currentChange" @size-change="sizeChange"></el-pagination>-->
      </div>
    </el-collapse-item>
  </el-collapse>
  <div class="form-container" style="padding: 0px 10px">
    <el-pagination :total="pager.total" :current-page="pager.current" :page-sizes="[9, 18, 27]" :page-size="pager.size"
          layout="total,prev, next" @current-change="currentChange" @size-change="sizeChange"></el-pagination>
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
import wSvg from "COMMON/pageDesign/widgets/wImage/wSvg";
import wImage from "COMMON/pageDesign/widgets/wImage/wImage";
import wVideo from "COMMON/pageDesign/widgets/wVideo/wVideo";
import serverInfo from "../../../config/serverInfo.js";

import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  data() {
    return {
      albumDatas: [],
      albums: [],
      keywords: "",
      cur_albums: [],
      cur_album: { name: "所有" },
      pager: { total: 0, current: 1, size: 24 },
      activeTab: -1,
      myImgList: [],
      recommendImgList: [],
      pos: 0,
      tpt_props: {
        label: "name",
        value: "albumId",
        children: "children"
      }
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
      if (item.value.contentType == "image/svg+xml") {
        let setting = JSON.parse(JSON.stringify(wSvg.setting));
        setting.width = 400;
        setting.height = parseInt(setting.width / item.value.ratio);
        setting.imgUrl = item.value.rawUrl;
        this.addWidget(setting);
        return;
      } else if (item.value.type == "video") {
        let setting = JSON.parse(JSON.stringify(wVideo.setting));
        setting.width = 400;
        setting.height = parseInt(setting.width / item.value.ratio);
        setting.imgUrl = item.value.rawUrl;
        this.addWidget(setting);
      } else if (item.value.type == "image") {
        let setting = JSON.parse(JSON.stringify(wImage.setting));
        setting.width = 400;
        setting.height = parseInt(setting.width / item.value.ratio);
        setting.imgUrl = item.value.rawUrl;
        this.addWidget(setting);
      } else {
        this.$message({
          message: "此素材不在支持的范围内,请重新选择!",
          type: "warning"
        });
      }
    },
    deleteImg(item) {
      //
    },
    loadAlbum() {
      // MaterialAlbum/Album?keyword=
      let url = "/MaterialAlbum/Album?keyword=" + this.keywords; //&type=image
      this.$http.get(url).then(response => {
        console.log(response);
        this.albumDatas = this.toNormalData(response.data.data);
        this.albums = response.data.list;
      });
    },
    loadImgMaterial() {
      let url =
        "/resource/Material/" + this.pager.current + "-" + this.pager.size;
      let data = { keyword: this.keywords }; // type: "image",
      if (this.cur_albums.length > 0) {
        data.albumId = this.cur_albums[this.cur_albums.length - 1];
      }
      this.$http.post(url, data).then(response => {
        let data = response.data.data;
        this.pager.total = response.data.pager.total;
        this.convertData(data);
      });
    },
    convertData(datas) {
      datas.forEach(element => {
        element.ratio = element.width / element.height;
        let rawUrl = serverInfo.getViewUrl(element.url);
        element.url = serverInfo.getViewUrl(element.coverUrl);
        element.rawUrl = rawUrl;
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
      this.pager.current = 1;
      this.loadImgMaterial();
    },
    albumReset(){
      this.cur_albums = []
      this.pager.current = 1;
      this.keywords = ''
    },
    // 转化为普通数据
    toNormalData(data) {
      function next(obj, chi) {
        if (chi) {
          let ay = [];
          chi.forEach(v => {
            let o = v.data;
            ay.push(o);
            next(o, v.children);
          });
          obj.children = ay;
        } else {
          return;
        }
      }

      let ret = [];
      data.map(v => {
        let obj = v.data;
        ret.push(obj);
        next(obj, v.children);
      });
      return ret;
    }
  }
};
</script>
<style scoped>
.el-collapse-item__content{
  padding-bottom:0px;
}
.black .el-form-item__label {
  color: black;
}
.form-container {
  padding: 10px 10px 10px 0px;
  background-color: white;
}
.img-small {
  width: 100px;
  height: 100px;
}
</style>
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
