<template>
  <el-dialog title="图片浏览" :visible.sync="config.visiable" :fullscreen="config.fullscreen" :width="config.width"
    append-to-body>
    <div>
        <el-radio v-model="sourceType" label="upload">上传图片</el-radio>
        <el-radio v-model="sourceType" label="url">图片网址</el-radio>
    </div>
    <div v-show="sourceType=='url'">
      <br/>
      <h2>请输入图片网址</h2> <br/>
       <el-input placeholder="请输入内容" v-model="imgUrl">
        <template slot="prepend">Http://</template>
      </el-input>
       <br/>
    </div>
    <div v-show="sourceType=='upload'">
     <el-upload
      class="avatar-uploader"
      :action="imgUploadUrl"
      :show-file-list="false"
      :on-success="handleUploadSuccess">
      <img v-if="imgUrl" :src="imgUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="config.visiable = false">取 消</el-button>
    <el-button type="primary" @click="submitChange">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script>
// 图片组件样式
const NAME = "view-image-dialog";
import { mapGetters, mapActions } from "vuex";
import serverInfo from '../../../config/serverInfo.js';

export default {
  name: NAME,
  data() {
    return {
      config: {
        visiable: this.display,
        fullscreen: false,
        width: "30%"
      },
      imgUploadUrl:serverInfo.getUploadUrl(),
      sourceType:'upload',
      imgUrl:''
      //http://bearcarimg.codebear.cn/d876071258082127cebb0de42f5270b9rxJbFGS4jObsgrikYBq9c!gradual.show
    };
  },
  props: {
    display: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'dActiveElement',
      'dMoving'
    ])
  },
  watch: {
    display(val, oldVal) {
      this.config.visiable = val;
    },
    "config.visiable": function(val, oldVal) {
      if (val != this.display) {
        this.$emit("close");
        this.$emit("update:display", false); //触发更新
      } else {
      }
    }
  },
  methods:{
    ...mapActions([
      'updateWidgetData',
      'updateAlign',
      'updateLayerIndex',
      'updateViewImageDialog'
    ]),
    reset () {
      this.imgUrl = ''
    },
    submitChange(){
      let imgUrl = this.imgUrl;
      if(!imgUrl){
        this.$message.error('请上传图片或输入图片网址');
        return;
      }
      this.config.visiable = false;
      console.debug('更改后的图片地址: ',imgUrl);
      this.updateWidgetData({
        uuid: this.dActiveElement.uuid,
        key: 'imgUrl',
        value: imgUrl,
        pushHistory: true
      })
      this.reset()
    },handleUploadSuccess(res, file){
      this.imgUrl = serverInfo.getViewUrl(res.url);
    }
  }
};
</script>
<style scoped>

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
</style>
