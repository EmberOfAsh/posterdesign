<template>
  <div id="value-input-select">
    <span class="label">{{ label }}</span>
    <el-select
      size="mini"
      v-model="innerValue"
      filterable
      allow-create
      default-first-option
      clearable
      placeholder="请选择"
      @change="selectItem">
      <el-option v-for="item in fontDatas" :key="item.value" :label="item.label" :value="item.value">
          <span :style="{'font-family':item.value}">{{item.label}}</span>
      </el-option>
    </el-select>
  </div>
</template>
<script>
// 选择组件
const NAME = "font-family-select";
import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  props: {
    label: {
      default: ""
    },
    value: {
      default: ""
    }
  },
  data() {
    return {
      innerValue: "",
      first: true,
      fontDatas: [
        {
          label: "微软雅黑",
          value: "Microsoft YaHei"
        },
        {
          label: "微软正黑体",
          value: "Microsoft JhengHei"
        },
        {
          label: "新细明体",
          value: "PMingLiU"
        },
        {
          label: "细明体",
          value: "MingLiU"
        },
        {
          label: "标楷体",
          value: "DFKai-SB"
        },
        {
          label: "黑体",
          value: "SimHei"
        },
        {
          label: "宋体",
          value: "SimSun"
        },
        {
          label: "新宋体",
          value: "NSimSun"
        },
        {
          label: "仿宋",
          value: "FangSong"
        },
        {
          label: "楷体",
          value: "KaiTi"
        },
        {
          label: "仿宋_GB2312",
          value: "FangSong_GB2312"
        },
        {
          label: "楷体_GB2312",
          value: "KaiTi_GB2312"
        },
        {
          label: "隶书",
          value: "LiSu"
        },
        {
          label: "幼圆",
          value: "YouYuan"
        },
        {
          label: "华文细黑",
          value: "STXihei"
        },
        {
          label: "华文楷体",
          value: "STKaiti"
        },
        {
          label: "华文中宋",
          value: "STZhongsong"
        },
        {
          label: "华文仿宋",
          value: "STFangsong"
        },
        {
          label: "方正舒体",
          value: "FZShuTi"
        },
        {
          label: "方正姚体",
          value: "FZYaoti"
        },
        {
          label: "华文彩云",
          value: "STCaiyun"
        },
        {
          label: "华文琥珀",
          value: "STHupo"
        },
        {
          label: "华文隶书",
          value: "STLiti"
        },
        {
          label: "华文行楷",
          value: "STXingkai"
        },
        {
          label: "华文新魏",
          value: "STXinwei"
        },
        {
          label: "华文细黑",
          value: "STHeiti Light [STXihei]"
        },
        {
          label: "华文黑体",
          value: "STHeiti"
        },
        {
          label: "华文宋体",
          value: "STSong"
        },
        {
          label: "serif (衬线体)",
          value: "serif"
        },
        {
          label: "sans-serif(无衬线体)",
          value: "sans-serif"
        },
        {
          label: "monospace(等宽体)",
          value: "monospace"
        },
        {
          label: "cursive(草书体)",
          value: "cursive"
        },
        {
          label: "fantasy(幻想体)",
          value: "fantasy"
        },
        {
          label: "Verdana",
          value: "Verdana"
        },
        {
          label: "Times New Roman",
          value: "Times New Roman"
        },
        {
          label: "Arial Black",
          value: "Arial Black"
        },
        {
          label: "Arial Narrow",
          value: "Arial Narrow"
        },
        {
          label: "Georgia",
          value: "Georgia"
        },
        {
          label: "Trebuchet MS",
          value: "Trebuchet MS"
        },
        {
          label: "Courier New",
          value: "Courier New"
        },
        {
          label: "Impact",
          value: "Impact"
        },
        {
          label: "Comic Sans MS",
          value: "Comic Sans MS"
        }
        ,
        {
          label: "Tahoma",
          value: "Tahoma"
        },
        {
          label: "Courier",
          value: "Courier"
        },
        {
          label: "Lucida Sans Unicode",
          value: "Lucida Sans Unicode"
        },
        {
          label: "Lucida Console",
          value: "Lucida Console"
        },
        {
          label: "Garamond",
          value: "Garamond"
        },
        {
          label: "MS Sans Serif",
          value: "MS Sans Serif"
        },
        {
          label: "MS Serif",
          value: "MS Serif"
        },
        {
          label: "Symbol",
          value: "Symbol"
        },
        {
          label: "Bookman Old Style",
          value: "Bookman Old Style"
        }
      ]
    };
  },
  created() {
    this.first = true;
    this.innerValue = this.value;
  },
  watch: {
    innerValue(value) {
      if (this.first) {
        this.first = false;
        return;
      }
      this.$emit("input", value);
    }
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    ...mapActions([]),
    selectItem(item) {
      if (this.innerValue !== item) {
        this.innerValue = item;
        this.$emit("finish", item);
      }
    }
  }
};
</script>