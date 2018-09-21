<template>
  <el-dialog :visible.sync="config.visiable" :fullscreen="config.fullscreen" :width="config.width"
    append-to-body>
      <h2>请输入文字</h2><br/>
      <text-input-area type="textarea" placeholder="请输入内容" v-model="inputText">
      </text-input-area>
    
    <span slot="footer" class="dialog-footer">
    <el-button @click="config.visiable = false">取 消</el-button>
    <el-button type="primary" @click="submitChange">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script>
// 图片组件样式
const NAME = "edit-text-dialog";
import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  data() {
    return {
      config: {
        visiable: this.display,
        fullscreen: false,
        width: "30%"
      },
      inputText:''
    };
  },
  props: {
    display: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(["dActiveElement", "dMoving"])
  },
  mounted(){
  },
  watch: {
    display(val, oldVal) {
      this.config.visiable = val;
      if(val){
        this.inputText = this.dActiveElement.text
      }
    },
    "config.visiable": function(val, oldVal) {
      if (val != this.display) {
        this.$emit("update:display", false); //触发更新
      }
    }
  },
  methods: {
    ...mapActions([
      "updateWidgetData",
      "updateAlign",
      "updateLayerIndex",
      "updateViewImageDialog"
    ]),
    reset() {
      this.inputText = "";
    },
    submitChange() {
      let inputText = this.inputText;
      if (!inputText) {
        this.$message.error("请输入文字内容");
        return;
      }
      this.config.visiable = false;
      console.debug("更改后的文字: ", inputText);
      this.updateWidgetData({
        uuid: this.dActiveElement.uuid,
        key: 'text',
        value: inputText,
        pushHistory: true
      })
      this.reset();
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
</style>
