<template>
  <el-tabs
    v-model="activeTab"
    :tab-position="tabPosition"
    class="system-tabs"
    @update:model-value="onTabSelected"
  >
    <el-tab-pane v-for="item in tabs" :key="item.id" :label="item.title" :name="item.id" />
  </el-tabs>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SystemTabs',

  props: {
    /** @param {array} tabs - Вкладки */
    tabs: {
      type: Array,
      default: () => []
    },

    /** @param {string} tabPosition - Расположение вкладок */
    tabPosition: {
      type: String,
      default: 'right',
      validator(position) {
        return ['top', 'right', 'bottom', 'left'].includes(position)
      }
    }
  },

  emits: ['onTabSelected'],

  setup(props, { emit }) {
    const activeTab = ref(props.tabs[0].id)

    /** @function
     * @name onTabSelected - Вкладка была выбрана */
    const onTabSelected = () => emit('onTabSelected')

    return { activeTab, onTabSelected }
  }
}
</script>

<style scoped lang="scss">
.system-tabs {
  & > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
