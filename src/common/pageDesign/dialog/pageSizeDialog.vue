<template>
  <el-dialog title="更改尺寸" :visible.sync="config.visiable" :fullscreen="config.fullscreen" :width="config.width"
    append-to-body>
     <el-table
    :data="sizeDatas"
    border
    style="width: 100%"
    :row-class-name="tableRowClassName"
    >
    <el-table-column
      prop="type"
      label="类型"
      >
    </el-table-column>
    <el-table-column
      label="分辨率"
      >
      <template slot-scope="scope">
        {{scope.row.width}} × {{scope.row.height}}
      </template>
    </el-table-column>
    <el-table-column
      prop="label"
      label="描述"
      >
    </el-table-column>
    <el-table-column
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button :disabled="isDisabled(scope.row)" @click="changeSize(scope.row)" type="text" size="small">更改尺寸</el-button>
        <el-button :disabled="isDisabled(scope.row)" @click="convertSize(scope.row)" type="text" size="small">转换尺寸</el-button>
      </template>
    </el-table-column>
    <div slot="append">
      更改尺寸: 直接修改页面尺寸 <br/>
      转换尺寸: 修改页面尺寸基础上,根据和原有分辨率的缩放转换布局信息<br/>
    </div>
  </el-table>
  </el-dialog>
</template>
<script>
// 图片组件样式
const NAME = "page-size-dialog";
import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  data() {
    return {
      config: {
        visiable: this.display,
        fullscreen: false,
        width: "50%"
      },
      sizeDatas: [
        { type: "横屏", width: 1920, height: 1080, label: "1080P横屏" },
        { type: "竖屏", width: 1080, height: 1920, label: "1080P竖屏" },
        { type: "横屏", width: 2560, height: 1440, label: "2K横屏" },
        { type: "竖屏", width: 1440, height: 2560, label: "2K竖屏" },
        { type: "横屏", width: 4096, height: 2160, label: "4K横屏" },
        { type: "竖屏", width: 2160, height: 4096, label: "4K竖屏" }
      ],
      inputText: ""
    };
  },
  props: {
    display: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(["dActiveElement", "dMoving","dPage"])
  },
  watch: {
    display(val, oldVal) {
      this.config.visiable = val;
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
      "updateViewImageDialog",
      "updatePageSize",
      'convertPageSize'
    ]),
    reset() {
      this.inputText = "";
    },
    changeSize(record) {
      this.updatePageSize(record);
    },
    convertSize(record) {
      this.convertPageSize(record);
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
        key: "text",
        value: inputText,
        pushHistory: true
      });
      this.reset();
    },
    tableRowClassName({row, rowIndex}) {
        if (row.width === this.dPage.width && row.height === this.dPage.height) {
          return 'selected-row';
        }
        return '';
    },
    isDisabled(row){
      if (row.width === this.dPage.width && row.height === this.dPage.height) {
          return true
      }
      return false
    }
  }
};
</script>
<style scoped>
.selected-row {
    background: yellow;
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
</style>
