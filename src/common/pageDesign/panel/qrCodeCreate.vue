<template>
<div class="form-container">
  <el-form ref="form" class="black" :model="qrData" label-width="80px" size="mini">
    <el-form-item label="数据" >
      <el-input type="textarea" v-model="qrData.text"></el-input>
    </el-form-item>
    <el-form-item label="logo">
      <div v-if="qrData.logoSrc">
        <img :src="qrData.logoSrc" class="img-small" /><br/>
      </div>
      <el-button @click="viewImageDialog.display=true;viewImageDialog.from='logo'">上传</el-button>
      <el-button @click="viewImageAlbum.display=true;viewImageAlbum.from='logo'">素材库</el-button>
      <el-button @click="qrData.logoSrc=''" circle type="danger"  icon="el-icon-delete"></el-button>
    </el-form-item>
    <el-form-item label="logo边距">
      <el-input-number v-model="qrData.logoMargin" placeholder="logo外边距"></el-input-number>
    </el-form-item>
    <el-form-item label="背景">
      <div v-if="qrData.bgSrc">
        <img :src="qrData.bgSrc" class="img-small" /><br/>
      </div>
      <el-button @click="viewImageDialog.display=true;viewImageDialog.from='bg'">上传</el-button>
      <el-button @click="viewImageAlbum.display=true;viewImageAlbum.from='bg'">素材库</el-button>
      <el-button @click="qrData.bgSrc=''" circle type="danger"  icon="el-icon-delete"></el-button>
    </el-form-item>
    <el-form-item label="尺寸">
      <el-input-number v-model.number="qrData.size" placeholder="二维码尺寸"></el-input-number>
    </el-form-item>
    <el-form-item label="颜色">
      <el-color-picker v-model="qrData.colorDark"></el-color-picker>
    </el-form-item>
    <el-form-item label="纠错等级">
      <el-select v-model="qrData.correctLevel" placeholder="请选择">
        <el-option
          label="L: 低"
          :value="1">
        </el-option>
        <el-option
          label="M: 标准"
          :value="0">
        </el-option>
        <el-option
          label="Q: 高"
          :value="3">
        </el-option>
        <el-option
          label="H: 超高"
          :value="2">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item >
      <el-button type="primary" @click="createQRCode">创建二维码</el-button>
    </el-form-item>
  </el-form>
<view-image-dialog :display.sync="viewImageDialog.display" :from="viewImageDialog.from" mode="callback" @callback="viewImageCallback"></view-image-dialog>
<view-image-album :display.sync="viewImageAlbum.display" :from="viewImageAlbum.from" mode="callback" @callback="viewImageAlbumCallback"></view-image-album>
</div>
</template>

<script>
// 图片列表
const NAME = "qr-code-create";

import qrCode from "COMMON/pageDesign/widgets/QRcode/qrCode";
import serverInfo from "../../../config/serverInfo.js";

import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  data() {
    return {
      qrData: {
        text: "",
        size: 300,
        logoSrc: "",
        logoMargin: 10,
        bgSrc: "",
        colorDark: "#000",
        correctLevel: 0
      },
      viewImageDialog:{display:false},
      viewImageAlbum:{display:false},
      albums: [],
      cur_album: { name: "所有" },
      pager: { total: 0, current: 1, size: 24 },
      activeTab: -1,
      myImgList: [],
      recommendImgList: [],
      pos: 0
    };
  },
  mounted() {},
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
      let setting = JSON.parse(JSON.stringify(wSnow.setting));
      setting.imgUrl = item.value.rawUrl;
      this.addWidget(setting);
    },
    createQRCode() {
      console.log("创建二维码");
      if(!this.qrData.text){
        this.$message.warning({message:'二维码内容不能为空!'})
        return;
      }
      if(this.qrData.size <= 0){
        this.$message.warning({message:'二维码尺寸不能为空'})
        return;
      }
      let setting = JSON.parse(JSON.stringify(qrCode.setting));
      let qrData = JSON.parse(JSON.stringify(this.qrData));
      setting.height = setting.width = qrData.size
      setting.qrData = qrData
      this.addWidget(setting);
    },
    viewImageCallback(data){
      console.debug(data)
      if(data.from=='logo'){
        this.qrData.logoSrc = data.url
      }else if(data.from == 'bg'){
        this.qrData.bgSrc = data.url
      }
    },
    viewImageAlbumCallback(data){
      console.debug(data)
      if(data.from=='logo'){
        this.qrData.logoSrc = data.url
      }else if(data.from == 'bg'){
        this.qrData.bgSrc = data.url
      }
    }
  }
};
</script>
<style >
.black .el-form-item__label {
  color: white;
}
</style>

<style scoped>
.form-container {
  margin: 10px 10px 10px 0px;
}
.img-small{
  width:100px;height:100px;
}
</style>
