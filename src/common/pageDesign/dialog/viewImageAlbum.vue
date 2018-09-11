<template>
<el-dialog :title="title" :visible.sync="config.visiable" :fullscreen="config.fullscreen" :width="config.width">
  <div slot="title">
    <span class="el-dialog__title"> {{title}}</span>
    <el-button-group style="margin-left:30px;">
      <el-button size="small" icon="el-icon-rank" @click="setFullscreen" title="最大"></el-button>
    </el-button-group>
    <el-input placeholder="请输入内容" v-model="config.keyword" class="input-with-select" style="margin-left:10%;width:500px">
      <el-select v-model="config.type" slot="prepend" placeholder="资源类型" style="width:80px;">
        <el-option label="所有" value=""></el-option>
        <el-option label="图片" value="image"></el-option>
        <el-option label="视频" value="video"></el-option>
        <el-option label="音频" value="audio"></el-option>
        <el-option label="文字" value="text"></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
  </div>
  <div slot="footer" class="foot-button-container">
    <el-button type="primary" @click="submit">确定</el-button>
    <el-button @click="close">关闭</el-button>
  </div>
  <el-container>
    <el-aside width="200px">
      <el-tree ref="tree" :data="tpt_data" :props="props" :highlight-current="true" node-key="id" default-expand-all
        :expand-on-click-node="false" @node-click="tptTreeClick" class="menu-tree">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="left-label-group">
            <i class="icon" v-if="data.data.icon" :class="data.data.icon"></i> {{ node.label }}</span>
        </span>
      </el-tree>
    </el-aside>
    <el-main>
      <div role="mainDis" style="overflow: auto;">
        <el-row style="display:flex;">
          <el-col :span="10">
            <!--查询-->
            <el-breadcrumb separator="/" style="margin-top: 10px;">
              <el-breadcrumb-item>所有类别</el-breadcrumb-item>
              <template v-for="item in breadcrumbData">
                <el-breadcrumb-item :key="item.name">
                  <a @click="breadPathClick(item)">{{item.name}}</a>
                </el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </el-col>
          <el-col :span="14" style="text-align: right;">
            <!--分页-->
            <el-pagination style="margin:auto;" class="pagebar" :current-page="tpager.current" :page-sizes="[10, 20, 30]"
              :page-size="tpager.size" layout="total, sizes, prev, pager, next, jumper" :total="tpager.total"
              @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
          </el-col>
        </el-row>
        <template v-for="tp in tps">
          <el-popover placement="right-start" width="280" trigger="click" :key="tp.name" >
            <div>
              <p>
                <span class="right-start-icon">
                  <i class="el-icon-document"></i> 文件类型:</span> {{tp.contentType}}</p>
              <p>
                <span class="right-start-icon">
                  <i class="el-icon-goods"></i> 文件大小:</span> {{tp.size | byteToSize}}</p>
              <p>
                <span class="right-start-icon">
                  <i class="el-icon-printer"></i> 文件长度:</span> {{tp.timeLength | secToMin}}</p>
              <p>
                <span class="right-start-icon">
                  <i class="el-icon-edit-outline"></i> 文件描述: </span>
              </p>
              <p>
                <span class="right-start-icon"> {{tp.description}}</span>
              </p>
            </div>
            <el-card class="passage-conver image-card" :body-style="{ padding: '0px' }" slot="reference" style="position:relative;">
              <div class="background-img" @mouseenter="card_hover(tp)" @mouseleave="card_leave(tp)" @click="chose(tp)">
                <span v-show="tp.chose" class="active-icon" style="display: block;width: 20px;height: 20px;border-radius: 50%;background-color: #fff;position: absolute;right: 10px;top:3px;background:url(../../assets/img/active-icon.png)"></span>
                <template v-if="tp.type == 'image' || tp.type == 'text'">
                  <!--图片-->
                  <img :src="getResUrl(tp.coverUrl) " class="image">
                </template>
                <template v-if="tp.type == 'audio'">
                  <!--音频-->
                  <span class="audio-icon"></span>
                </template>
                <template v-if="tp.type == 'video'">
                  <!--视频-->
                  <img :src="getResUrl(tp.coverUrl) " class="image">
                  <span class="video-icon"></span>
                </template>
                <div class="control ">
                  <span class="title">{{tp.name}}</span>
                  <div v-show="tp.showtoolbar" class="bottom clearfix">
                    <p class="descript">{{tp.description}}</p>
                    <el-button-group>
                        <el-button type="primary" size="small"  @click="chose(tp)">选择</el-button>
                    </el-button-group>
                  </div>
                </div>
              </div>
            </el-card>
          </el-popover>
        </template>

      </div>
    </el-main>
  </el-container>
</el-dialog>
</template>
<script>
// 图片组件样式
const NAME = "view-image-album";
import { mapGetters, mapActions } from "vuex";
import serverInfo from "../../../config/serverInfo.js";
import commonUtil from "../../../util/common.js";
export default {
  name: NAME,
  data() {
    return {
      dialogVisible: true,
      choseResource: [],
      currentCategory: {
        name: "所有类别"
      },
      tpt_data: [],
      tps: [],
      tpt_data_normal: [],
      props: {
        children: "children",
        label(data, node) {
          let label = data.data.name;
          if (data.data.count) {
            label += "(" + data.data.count + ")";
          }
          return label;
        }
      },
      tpager: {
        total: 0,
        current: 1,
        size: 10
      },
      config: {
        visiable: this.display,
        fullscreen: false,
        width: "70%",
        //提交后清除数据
        clearOnSubmit: true,
        type: this.type,
        keyword: this.keyword
      }
    };
  },
  props: {
    display: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: "素材浏览"
    },
    //关键词
    keyword: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "image"
    }
  },
  computed: {
    ...mapGetters(["dActiveElement", "dMoving"]),
    breadcrumbData() {
      let bp = commonUtil.breadPath(
        this.currentCategory,
        this.tpt_data,
        item => item.children,
        item => item.parent,
        item => item.albumId,
        item => item.data
      );
      return bp;
    }
  },
  watch: {
    type(val, oldVal) {
      this.config.type = val;
    },
    keyword(val, oldVal) {
      this.config.keyword = val;
    },
    display(val, oldVal) {
      this.config.visiable = val;
    },
    "config.visiable": function(val, oldVal) {
      if (val != this.display) {
        this.$emit("close");
        this.$emit("update:display", false); //触发更新
      }
    }
  },
  mounted() {
    this.loadTreeData();
    this.loadTpTypeData(null, this);
  },
  methods: {
    ...mapActions([
      "updateWidgetData",
      "updateAlign",
      "updateLayerIndex",
      "updateViewImageAlbum"
    ]),

    search() {
      this.loadTpTypeData();
    },
    breadPathClick(item) {
      let cc = this.currentCategory;
      if (cc.albumId == item.albumId) return;
      this.currentCategory = item;
      this.loadTpTypeData(item);
    },
    getResUrl(url) {
      return serverInfo.getViewUrl(url);
    },
    setFullscreen() {
      this.config.fullscreen = !this.config.fullscreen;
      this.config.width = this.config.fullscreen ? "100%" : "70%";
    },
    tptTreeClick: function(_data, node) {
      var ins = this;
      var data = _data.data; // 类别节点数据
      this.loadTpTypeData(data, ins);
    },
    // 加载分类数据
    loadTpTypeData: function(data) {
      let ins = this;
      if (data) {
        this.currentCategory = data;
      } else {
        data = {};
      }
      let url =
        "/resource/Material/" + this.tpager.current + "-" + this.tpager.size;
      data.keyword = this.config.keyword ? this.config.keyword : null;
      data.type = this.config.type ? this.config.type : null;
      data.verify = true;
      this.$http.post(url, data).then(response => {
        let result = response.data;
        ins.tps = ins.initData(result.data);
        ins.tpager.total = result.pager.total;
      });
    }, // 重新加载分类数据
    reloadTpTypeData: function() {
      var node = this.$refs.tree.getCurrentNode();
      this.loadTpTypeData(node ? node.data : null, this);
    }, // 加载类别树的数据
    loadTreeData: function() {
      var ins = this;
      let data = {
        keyword: this.config.keyword ? this.config.keyword : null,
        type: this.config.type ? this.config.type : null,
        verify: true
      };
      let url = "/MaterialAlbum/Album?keyword=&type="+this.config.type;
      this.$http.get(url).then(response => {
        ins.tpt_data = response.data.data;
        ins.tpt_data_normal = ins.toNormalData(response.data.data);
      });
    },
    handleSizeChange(val) {
      this.tpager.size = val;
      this.loadTpTypeData();
    },
    handleCurrentChange(val) {
      this.tpager.current = val;
      this.loadTpTypeData();
    },
    //转化为普通数据
    toNormalData(data) {
      function next(obj, chi) {
        if (chi) {
          let ay = [];
          chi.forEach(v => {
            let o = v.data;
            ay.push(o);
            next(o);
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
    },
    initData(data) {
      let me = this;
      data.forEach(element => {
        element.showtoolbar = false;
        element.cfv = false;
        element.chose =
          me.choseResource.filter(e2 => e2.materialId == element.materialId)
            .length > 0;
      });
      return data;
    },
    card_hover(it) {
      it.showtoolbar = true;
    },
    card_leave(it) {
      it.showtoolbar = false;
    },
    chose(tp) {
      tp.chose = !tp.chose;
      if (tp.chose) {
        this.choseResource.push(tp);
      } else {
        this.choseResource = this.choseResource.filter(item => item.chose);
      }
    },
    close() {
      this.$emit("close", this.choseResource);
      this.visiable = false;
      this.config.visiable = false;
    },
    submit() {
      console.debug("提交选择素材", this.choseResource);
      this.$emit("submit", this.choseResource);
      this.config.visiable = false;
      if (this.config.clearOnSubmit) {
        this.choseResource = [];
        this.tps.forEach(item => (item.chose = false));
      }
    },
    chose(tp){
      let imgUrl = serverInfo.getViewUrl(tp.url)
      this.updateWidgetData({
        uuid: this.dActiveElement.uuid,
        key: 'imgUrl',
        value: imgUrl,
        pushHistory: true
      })
      this.config.visiable = false
    }
  }
};
</script>
<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.image {
  width: 100%;
  display: block;
}

.box-card {
  width: 200px;
  float: left;
  margin-left: 20px;
  margin-top: 20px;
  transition: transform 0.2s, box-shadow 0.3s;
}

.box-card:hover {
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.el-main,
.el-header {
  padding: 0;
}

.el-main {
  padding: 0 20px;
}

.el-main > div[role="mainDis"] {
  padding-bottom: 20px;
}

.el-main > div[role="mainDis"] + .el-row {
  background-color: #fff;
  box-shadow: rgb(221, 221, 221) 0px 0px 25px 3px inset;
  padding: 15px;
  margin-bottom: 20px;
}

/**页面预览**/

.page-thumb {
  transform: scale(0.36);
}

.editTp {
  width: 90%;
}

.previewPic {
  width: 150px;
  height: 200px;
}

.time {
  font-size: 13px;
  color: #999;
}

.title {
  font-size: 14px;
  font-weight: bolder;
}

.image {
  display: block;
  margin: 0 auto;
  height: 170px;
  width: auto;
  max-width: 100%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.passage-conver {
  width: 200px;
  float: left;
  margin-left: 20px;
  margin-top: 20px;
  height: 255px;
  transition: transform 0.2s, box-shadow 0.3s;
}

.el-card__body {
  position: relative;
}

.passage-conver:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.passage-conver .background-img {
  height: 255px;
  background-size: 100% 100%;
  position: absolute;
  width: 205px;
  background-color: #ebeef5;
}

.video-icon {
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 60px auto;
  background-color: rgba(0, 0, 0, 0.4);
  position: relative;
  top: -165px;
}

.video-icon:after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: 10px;
  left: 20px;
  border: 15px solid transparent;
  border-left-color: rgba(255, 255, 255, 1);
}

.audio-icon {
  display: block;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 60px auto;
  background-image: url(/assets/img/timg-6cf3ea99fe69fbacb4b1ba2a331ef1e6.png);
  background-size: contain;
}

.passage-conver .background-img .image {
  /*width: 100%;
    height: 100%;*/
  max-width: 75%;
  max-height: 100%;
  height: auto;
  width: auto;
}

.passage-conver .control {
  padding: 15px 0px;
  text-align: center;
  position: absolute;
  bottom: 0px;
  /*background: hsla(0, 0%, 100%, 0.90);*/
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  /*border-top: solid 1px rgba(255, 255, 255);*/
  width: 200px;
}

.image-card .control {
  padding: 10px 0px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
}

.image-card .title {
  word-wrap: break-word;
  word-break: normal;
}

.image-card .descript {
  padding: 0 5px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #fff;
  word-wrap: break-word;
  word-break: normal;
  line-height: 20px;
}

.el-upload-list__item-name [class^="el-icon"] {
  height: auto;
}

.resourceView .el-dialog__body {
  padding: 0px;
  background-color: #fafafa;
  text-align: center;
}

.resourceView .imageView {
  max-width: 100%;
  height: auto;
}

.resourceView .audioView {
  width: 100%;
  margin: 10px 0;
}

.resourceView .videoView {
  max-width: 100%;
  height: auto;
}

.templateView .el-dialog__body {
  padding: 30px 20px;
  background-color: #fafafa;
}

.submitReport .el-dialog__body {
  padding: 10px 20px 30px 20px;
}

.verify-status {
  position: absolute;
  right: 5;
  top: 5;
  z-index: 10;
}

.not-verify,
.not-pass,
.pass {
  width: 30px;
  height: 30px;
  display: inline-block;
  border-radius: 50%;
}

.not-verify {
  background: url(/assets/icons/not-verify.png) no-repeat;
  background-size: cover;
}

.not-pass {
  background: url(/assets/icons/not-pass.png) no-repeat;
  background-size: cover;
}

.pass {
  background: url(/assets/icons/pass.png) no-repeat;
  background-size: cover;
}

.control-button {
  margin-top: 10px;
}

.store-status {
  width: 180px;
  font-size: 13px;
  position: absolute;
  top: 10px;
  right: 20px;
}

.store-status .label-txt {
  margin-left: 10px;
  margin-bottom: 5px;
}

.next-dirs {
  padding: 10px;
  overflow: hidden;
}

.next-dirs .dirs {
  width: 100px;
  height: 100px;
  background-image: url(/assets/icons/folder.png);
  float: left;
  line-height: 130px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  margin-left: 10px;
  margin-top: 0;
  padding: 5px;
}

.next-dirs .dirs:hover {
  transition: transform 0.2s;
  transform: translateY(-3px);
}

.next-dirs .dirs .title {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100px;
}

.next-dirs .dirs:hover .title {
  color: #c9ebff;
  transition: transform 0.3s;
  transform: rotate(360deg);
}
</style>
