<template>
<table class="table">
  <thead>
    <tr>
      <td>特效名</td>
      <td>操作</td>
    </tr>
  </thead>
  <tbody>
    <template v-for="ea in effectAnimations">
      <tr :key="ea.name">
        <td>{{ea.label}}</td>
        <td><el-button  type="text" @click="selectEffectAnimation(ea)">选择</el-button></td>
      </tr>
    </template>
  </tbody>
</table>
</template>

<script>
// 图片列表
const NAME = "effect-material";

import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  data() {
    return {
      effectAnimations:[{
        label:"雪花特效1",
        name:'animate-snow'
      },{
        label:"烟花效果1",
        name:'animate-fire-work1'
      },{
        label:"烟花效果2",
        name:'animate-fire-work2'
      },{
        label:"3D烟花效果",
        name:'animate-fire-work3-d'
      },{
        label:"星空1",
        name:'animate-star-heaven1'
      },{
        label:"星空2",
        name:'animate-star-heaven2'
      },{
        label:"流星雨1",
        name:'animate-meteor-shower1'
      },/*{
        label:"气泡背景1",
        name:'animate-bubble-bg1'
      },*/{
        label:"气泡背景2",
        name:'animate-bubble-bg2'
      },{
        label:"日升日落",
        name:'animate-sun-raise-fall'
      },{
        label:"科技几何背景",
        name:'animate-science-bg1'
      },]
    };
  },
  mounted() {
  },
  watch: {
  },
  methods: {
    ...mapActions(["addWidget"]),
    selectEffectAnimation(ea){
      let setting = {
        name: ea.label,
        type: ea.name,
        uuid: -1,
        width: 500,
        height: 500,
        left: 100,
        top: 100,
        opacity: 1,
        parent: "-1",
        color: "",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        size: 5,
        rotate: 0, //旋转角度
        setting: [],
        zIndex: 999,
        record: {
          width: 0,
          height: 0,
          minWidth: 1,
          minHeight: 1,
          dir: "all"
        }
      };
      this.addWidget(setting);
    }
  }
};
</script>

<style lang="stylus" scoped>
.table{
  width:100%;
  font-weight:normal;
  margin:10px;
}
.table thead{
  font-weight :bold;
}
</style>
