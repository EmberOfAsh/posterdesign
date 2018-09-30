<template>
    <div :id="id" class="anim-text hide" contenteditable="false" spellcheck="false">{{text}}</div>
</template>
<script>
import { guid, effect } from "./effect";
export default {
  name: "text-effect",
  label: "文字特效",
  requirement: 'Vue',
  props: ["id", "text", "type"],
  watch: {
    text(newVal, oldVal) {
      setTimeout(() => {
        effect(`#${this.id}`, this.type);
      }, 200);
    }
  },
  mounted() {
    effect(`#${this.id}`, this.type);
  }
};
</script>
<style scoped>
.hide {
  display: none;
}
@import url("./style.css");
</style>
