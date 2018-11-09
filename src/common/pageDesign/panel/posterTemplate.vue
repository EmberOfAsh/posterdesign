<template>
  <div id="img-list-wrap">
    <el-collapse>
      <el-collapse-item title="模版选择" name="1">
        <el-form ref="form" :model="filter" size="mini" label-position="top" label-width="40px">
          <el-form-item label="分类">
            <el-radio-group v-model="filter.useCategory" size="mini" @change="doSearch">
              <el-radio-button label="0">所有</el-radio-button>
              <el-radio-button label="-1">其他用途</el-radio-button>
              <template v-for="ps in useCategory">
                <el-radio-button :key="ps.categoryId" :label="ps.categoryId">{{ps.name}}</el-radio-button>
              </template>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="详细" v-show="secondCategory.length > 0">
            <el-radio-group v-model="filter.useCategory2" size="mini" @change="doSearch">
              <template v-for="ps in secondCategory">
                <el-radio-button :key="ps.categoryId" :label="ps.categoryId">{{ps.name}}</el-radio-button>
              </template>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="屏幕">
            <el-radio-group v-model="filter.h_v" size="mini" @change="doSearch">
              <el-radio-button label="all">所有</el-radio-button>
              <el-radio-button label="h">横屏</el-radio-button>
              <el-radio-button label="v">竖屏</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="filter.keyword" placeholder="关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">查询</el-button>
            <el-button type="danger" @click="resetSearch">清空</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div class="form-container" style="padding: 0px 10px">
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
import wSvg from "COMMON/pageDesign/widgets/wImage/wSvg";
import wImage from "COMMON/pageDesign/widgets/wImage/wImage";
import serverInfo from "../../../config/serverInfo.js";

import { mapGetters, mapActions } from "vuex";
import PostInfoService from "../../../service/PosterInfoService.js";

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
      pos: 0,
      filter: {
        h_v: "all",
        sizeType: -1,
        title: "all",
        keyword: "",
        category: -1,
        useCategory: 0, //过滤用途分类
        useCategory2: 0
      },
      useCategory: [],
      useCategory2: [],
      totalCategory: []
    };
  },
  mounted() {
    this.loadTemplate();
  },
  created() {
    this.loadPosterCategory();
  },
  computed: {
    ...mapGetters(["posterTemplateInfo", "dWidgets", "workMode"]),
    secondCategory() {
      let category = this.totalCategory.find(
        Element => Element.categoryId == this.filter.useCategory
      );
      if (!category || this.filter.useCategory == 0) return [];
      let ay = this.totalCategory.filter(
        Element => Element.parent == category.categoryId && Element.display
      );
      return ay;
    }
  },
  watch: {
    activeTab(value) {
      if (value === 0) {
        this.hadShowMyImg = true;
      } else if (value === 1) {
        this.hadShowRecommendImg = true;
      }
    },
    "filter.useCategory": function(val) {
      if (this.secondCategory && this.secondCategory.length > 0) {
        this.filter.useCategory2 = this.secondCategory[0].categoryId;
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
    loadPosterCategory() {
      PostInfoService.loadPosterCategory(this.$http, {}, respdata => {
        console.debug(respdata);
        this.totalCategory = respdata.data;
        this.useCategory = respdata.data.filter(
          el => el.type == 2 && el.display
        );
      });
    },
    doSearch() {
      this.pager.current = 1;
      this.loadTemplate();
    },
    resetSearch(){
      this.filter.h_v = 'all'
      this.filter.useCategory = 0
      this.filter.useCategory2 = 0
      this.pager.current = 1;
      this.loadTemplate();
    },
    loadTemplate() {
      let data = {
        sizeType: this.filter.sizeType != -1 ? this.filter.sizeType : null,
        keyword: this.filter.keyword ? this.filter.keyword : null,
        category: this.filter.category != -1 ? this.filter.category : null
      };
      if (this.filter.useCategory != 0) {
        if (this.filter.useCategory != -1 && this.filter.useCategory2 != 0) {
          data.useCategory = this.filter.useCategory2;
        } else {
          data.useCategory = this.filter.useCategory;
        }
      } else {
        delete data.useCategory;
      }

      if (this.filter.h_v != "all") {
        data.posterSize = {};
        data.posterSize.horVer = this.filter.h_v;
        if (this.filter.sizeType != -1) {
          data.posterSize.id = this.filter.sizeType;
        }
      }

      PostInfoService.loadPosterInfo(
        this.$http,
        this.pager,
        data,
        (datas, pager) => {
          this.recommendImgList = datas;
          this.pager.total = pager.total;
        }
      );
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
      let a = JSON.stringify(this.posterTemplateInfo.layouts || []);
      let b = JSON.stringify(this.dWidgets);
      console.debug(a);
      console.debug(b);
      //对比数据， 布局信息已被修改
      if (a != b) {
        this.$confirm("已存在正在编辑的海报?如何操作", "提示", {
          confirmButtonText: "覆盖当前",
          cancelButtonText: "新页面打开",
          type: "info "
        })
          .then(() => {
            //工作模式为 从模板新建
            if (this.workMode.mode === "newFromTemplate") {
              this.$router.push({ path: "/from/" + item.value.templateId });
            } else if (this.workMode.mode === "edit") {
              // 编辑模式， 使用此模板内容覆盖原来的
              if (
                this.posterTemplateInfo.layouts &&
                this.posterTemplateInfo.layouts.length > 0
              ) {
                this.$confirm("是否使用此模板覆盖?", "警告! 危险操作!", {
                  confirmButtonText: "覆盖当前",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(() => {
                  PostInfoService.loadPosterTemplate(
                    this.$http,
                    item.value.templateId,
                    this.loadPosterTemplate
                  );
                });
              } else {
                PostInfoService.loadPosterTemplate(
                  this.$http,
                  item.value.templateId,
                  this.loadPosterTemplate
                );
              }
            } else {
              PostInfoService.loadPosterTemplate(
                this.$http,
                item.value.templateId,
                this.loadPosterTemplate
              );
            }
          })
          .catch(() => {
            let url = "/from/" + item.value.templateId;
            window.open(url);
          });
      } else {
        //工作模式为 从模板新建
        if (this.workMode.mode === "newFromTemplate") {
          this.$router.push({ path: "/from/" + item.value.templateId });
        } else if (this.workMode.mode === "edit") {
          // 编辑模式， 使用此模板内容覆盖原来的
          if (
            this.posterTemplateInfo.layouts &&
            this.posterTemplateInfo.layouts.length > 0
          ) {
            this.$confirm("是否使用此模板覆盖?", "警告! 危险操作!", {
              confirmButtonText: "覆盖当前",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              PostInfoService.loadPosterTemplate(
                this.$http,
                item.value.templateId,
                this.loadPosterTemplate
              );
            });
          } else {
            PostInfoService.loadPosterTemplate(
              this.$http,
              item.value.templateId,
              this.loadPosterTemplate
            );
          }
        } else {
          PostInfoService.loadPosterTemplate(
            this.$http,
            item.value.templateId,
            this.loadPosterTemplate
          );
        }
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

.form-container {
  padding: 10px 10px 10px 0px;
  background-color: white;
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
