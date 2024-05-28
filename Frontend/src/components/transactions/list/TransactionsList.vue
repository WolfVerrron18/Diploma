<template>
  <div class="transactions-list">
    <!-- Таблица -->
    <el-table
      v-loading="loading"
      table-layout="fixed"
      :data="tableData"
      :border="true"
      @row-click="onRowClicked"
    >
      <!-- Номер -->
      <el-table-column type="index" label="Номер" width="80px" :resizable="false" />

      <!-- Наименование -->
      <el-table-column prop="name" label="Наименование" />

      <!-- Описание -->
      <el-table-column prop="sum" label="Описание" />

      <!-- Категория -->
      <el-table-column prop="categoryId" label="Категория">
        <template #default="{ row }">
          <el-tag :color="row.categoryId.color">
            <template #default>
              <span :style="{ color: getTableRowStyle(row) }">
                {{ row.categoryId.name }}
              </span>
            </template>
          </el-tag>
        </template>
      </el-table-column>

      <!-- Тип -->
      <el-table-column prop="type" label="Тип" :resizable="false">
        <template #default="{ row }">
          <el-tag :color="rowStyleCategories[row.type]" type="info">
            {{ typeCategories[row.type] }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- Удаление -->
      <el-table-column fixed="right" width="170">
        <template #default="{ $index }">
          <el-button type="primary" size="small" @click.stop="onRowRemoved($index)">
            Удалить транзакцию
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Создание категории -->
    <Teleport v-if="isMounted" to=".page-header">
      <el-button type="primary" :disabled="loading" @click="openCardInCreateMode"
        >Создать транзакцию</el-button
      >
    </Teleport>

    <TransactionCard
      v-model="transaction.visibility"
      :id="transaction.activeRow._id"
      :mode="transaction.cardMode"
      @on-object-created="onObjectedCreated"
      @on-object-updated="onObjectedUpdated"
      @on-hide-modal="transaction.visibility = false"
    />
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'

/** @class TransactionService - Сервис для работы с транзакциями */
import TransactionService from '@/components/transactions/service/TransactionService.js'

/** @module enumCategories - Перечисляемые списки для работы с категориями */
import { typeCategories, rowStyleCategories } from '@/components/categories/enums/enumCategories.js'

/** @module Components - Компоненты */
import TransactionCard from '@/components/transactions/card/TransactionCard.vue'

export default {
  name: 'TransactionsList',

  components: { TransactionCard },

  setup() {
    const isMounted = ref(false)

    const loading = ref(false)

    const tableData = ref([])

    const transaction = reactive({
      visibility: false,
      cardMode: 'edit',
      activeRow: {}
    })

    const onRowClicked = (row) => {
      transaction.activeRow = row

      transaction.cardMode = 'edit'

      transaction.visibility = true
    }

    const onRowRemoved = async (index) => {
      loading.value = true

      const foundRowTransaction = tableData.value[index]

      try {
        await TransactionService.transactions.remove(foundRowTransaction._id)

        tableData.value.splice(index, 1)
      } finally {
        loading.value = false
      }
    }

    const getTableRowStyle = (row) => {
      return parseInt(row.categoryId.color.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff'
    }

    const openCardInCreateMode = () => {
      transaction.cardMode = 'create'
      transaction.visibility = true
    }

    const onObjectedCreated = (object) => {
      tableData.value.push(object)

      transaction.cardMode = 'edit'
      transaction.visibility = false
    }

    const onObjectedUpdated = (object) => {
      const foundIndex = tableData.value.findIndex((row) => {
        return row._id === object._id
      })

      tableData.value.splice(foundIndex, 1, { ...object })
    }

    const getTransactions = async () => {
      loading.value = true

      try {
        const { data } = await TransactionService.transactions.list()

        tableData.value = data
      } finally {
        loading.value = false
      }
    }
    getTransactions()

    onMounted(() => {
      isMounted.value = true
    })

    return {
      transaction,
      tableData,
      isMounted,
      loading,
      typeCategories,
      rowStyleCategories,
      onRowClicked,
      onRowRemoved,
      getTransactions,
      getTableRowStyle,
      openCardInCreateMode,
      onObjectedCreated,
      onObjectedUpdated
    }
  }
}
</script>

<style scoped lang="scss"></style>
