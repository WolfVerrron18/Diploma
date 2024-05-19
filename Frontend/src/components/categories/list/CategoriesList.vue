<template>
  <div class="categories-list">
    <el-table
      table-layout="fixed"
      :data="tableData"
      :border="true"
      :row-style="getTableRowStyle"
      @row-click="onRowClicked"
    >
      <el-table-column type="index" label="Номер" width="80px" :resizable="false" />
      <el-table-column prop="name" label="Наименование" />
      <el-table-column prop="description" label="Описание" />
      <el-table-column prop="type" label="Тип" :resizable="false">
        <template #default="{ row }">{{ typeCategories[row.type] }}</template>
      </el-table-column>
    </el-table>

    <Teleport v-if="isMounted" to=".page-header">
      <!-- Кнопка действия -->
      <el-button type="primary" @click="openCardInCreateMode">Создать категорию</el-button>
    </Teleport>

    <CategoryCard
      v-model="category.visibility"
      :id="category.activeRow._id"
      :mode="category.cardMode"
      @on-object-created="onObjectedCreated"
      @on-object-updated="onObjectedUpdated"
      @on-hide-modal="onHideCard"
    />
  </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue'

import CategoryService from '@/components/categories/service/CategoryService.js'

import { typeCategories, rowStyleCategories } from '@/components/categories/enums/enumCategories.js'
import CategoryCard from '@/components/categories/card/category/CategoryCard.vue'

export default {
  name: 'CategoriesList',

  components: { CategoryCard },

  setup(props, { emit }) {
    const isMounted = ref(false)

    const loading = ref(false)

    const category = reactive({
      visibility: false,
      cardMode: 'edit',
      activeRow: {}
    })

    const tableData = ref([])

    const getTableRowStyle = ({ row }) => {
      return {
        backgroundColor: rowStyleCategories[row.type]
      }
    }

    const openCardInCreateMode = () => {
      category.cardMode = 'create'
      category.visibility = true
    }

    const onRowClicked = (row) => {
      category.activeRow = row

      category.visibility = true
    }

    const onObjectedCreated = (object) => {
      tableData.value.push(object)

      category.cardMode = 'edit'
      category.visibility = false
    }

    const onObjectedUpdated = (object) => {
      const foundIndex = tableData.value.findIndex((row) => {
        return row._id === object._id
      })

      tableData.value.splice(foundIndex, 1, { ...object })
    }

    const getCategories = async () => {
      loading.value = true

      try {
        const { data } = await CategoryService.categories.list()

        tableData.value = data
      } finally {
        loading.value = false
      }
    }

    const onHideCard = () => {
      category.visibility = false
      category.cardMode = 'edit'
    }

    getCategories()

    onMounted(() => {
      isMounted.value = true
    })

    return {
      category,
      tableData,
      isMounted,
      typeCategories,
      onHideCard,
      onRowClicked,
      getTableRowStyle,
      onObjectedCreated,
      onObjectedUpdated,
      openCardInCreateMode
    }
  }
}
</script>

<style lang="scss">
.el-table .el-table__row {
  &:hover {
    cursor: pointer;
  }
}
</style>
