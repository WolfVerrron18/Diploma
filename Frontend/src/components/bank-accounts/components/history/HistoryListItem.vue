<template>
  <div class="history-list-item">
    <div class="history-list-item__item">
      <SystemLabel label="Наименование:" />

      {{ item.name }}
    </div>

    <div class="history-list-item__item">
      <SystemLabel label="Категория:" />

      <el-tag :color="item.categoryId.color">
        <template #default>
          <span :style="{ color: defineColor(item.categoryId.color) }">
            {{ item.categoryId.name }}
          </span>
        </template>
      </el-tag>
    </div>

    <div class="history-list-item__item">
      <SystemLabel label="Тип:" />

      <p :style="{ color: rowStyleCategories[item.categoryId.type] }">
        {{ typeCategories[item.categoryId.type] }}
      </p>
    </div>

    <div class="history-list-item__item">
      <SystemLabel label="Дата:" />

      {{ getFormatTime(item.date) }}
    </div>
  </div>
</template>

<script>
import { defineColor, getFormatTime } from '@/utils/utils.js'
import SystemLabel from '@/components/system/SystemLabel.vue'
import { rowStyleCategories, typeCategories } from '@/components/categories/enums/enumCategories.js'

export default {
  name: 'HistoryListItem',
  computed: {
    typeCategories() {
      return typeCategories
    },
    rowStyleCategories() {
      return rowStyleCategories
    }
  },
  components: { SystemLabel },

  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    return { getFormatTime, defineColor }
  }
}
</script>

<style scoped lang="scss">
.history-list-item {
  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
