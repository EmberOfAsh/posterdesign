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
        @select-img="selectTemplate" />
    </div>
  </div>
</template>

<script>
// 图片列表
const NAME = "poster-template";
import wSvg from 'COMMON/pageDesign/widgets/wImage/wSvg';
import wImage from "COMMON/pageDesign/widgets/wImage/wImage";
import serverInfo from "../../../config/serverInfo.js";

import { mapGetters, mapActions } from "vuex";
import PostInfoService from '../../../service/PosterInfoService.js';

export default {
  name: NAME,
  data() {
    return {
      albums: [],
      cur_album: { name: "所有" },
      pager: { total: 0, current: 1, size: 24 },
      activeTab: -1,
      myImgList: [],
      recommendImgList: [],
      pos: 0
    };
  },
  mounted() {
    this.loadTemplate();
    //this.loadAlbum();
  },
  computed: {
    ...mapGetters([
      'posterTemplateInfo'
    ]),
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
    ...mapActions(["addWidget", "loadPosterTemplate"]),
    getStyle(index) {
      return {
        display: this.activeTab === index ? "" : "none"
      };
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
    loadTemplate() {
      let data = {}
      PostInfoService.loadPosterInfo(this.$http,this.pager,data,(datas,pager)=>{
        this.recommendImgList = datas
        this.pager.total = pager.total
      })
    },
    uploadImg() {},
    currentChange(val) {
      this.pager.current = val;
      this.loadTemplate();
    },
    sizeChange(val) {
      this.pager.size = val;
      this.loadTemplate();
    },
    albumClick(album) {
      this.cur_album = album;
      this.pager.current = 1;
      this.loadTemplate();
    },
    selectTemplate(item) {
      if(this.posterTemplateInfo.title){
        this.$confirm('已存在正在编辑的海报?如何操作', '提示', {
          confirmButtonText: '覆盖当前',
          cancelButtonText: '新页面打开',
          type: 'warning'
        }).then(() => {
          let url = '/edit/'+item.value.templateId
          window.open(url,'_self')
        }).catch(()=>{
          let url = '/edit/'+item.value.templateId
          window.open(url)
        })
      }else{
        PostInfoService.loadPosterTemplate(this.$http,item.value.templateId,  this.loadPosterTemplate);
       }
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
