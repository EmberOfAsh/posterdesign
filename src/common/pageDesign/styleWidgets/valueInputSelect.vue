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
      <el-option v-for="item in data" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
// 选择组件
const NAME = "value-input-select";
import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  props: {
    label: {
      default: ""
    },
    data: {
      required: true,
      type: Array
    },
    value: {
      default: ''
    }
  },
  data() {
    return {
      innerValue: '',
      first: true
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
    selectItem (item) {
      if (this.innerValue !== item) {
        this.innerValue = item
        this.$emit('finish', item)
      }
    }
  }
};
</script>

<style lang="stylus">
.el-slider {
  width: 200px !important;

  .show-input {
    margin-right: 90px !important;
  }

  .el-slider__input {
    width: 80px !important;

    .el-input-number__decrease, .el-input-number__increase {
      width: 16px !important;
    }

    .el-input--mini {
      .el-input__inner {
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
    }
  }
}
</style>


<style lang="stylus" scoped>
#value-input-select
  display: flex
  align-items: center
  .label
    margin-right: 10px
.el-slider {
  width: 200px !important;

  .show-input {
    margin-right: 90px !important;
  }

  .el-slider__input {
    width: 80px !important;

    .el-input-number__decrease, .el-input-number__increase {
      width: 16px !important;
    }

    .el-input--mini {
      .el-input__inner {
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
    }
  }
}
</style>
