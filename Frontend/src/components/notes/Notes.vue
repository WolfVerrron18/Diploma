<template>
  <div class="categories-list">
    <!-- Таблица -->
    <el-table table-layout="fixed" :data="tableData" :border="true" @row-click="onRowClicked">
      <!-- Дата создания -->
      <el-table-column prop="dateCreation" label="Дата создания" width="250px">
        <template #default="scope"
          ><SystemDatePicker v-model="scope.row.dateCreation" :disabled="true"
        /></template>
      </el-table-column>
      <!-- Название -->
      <el-table-column prop="name" label="Название" />
      <!-- Описание -->
      <el-table-column prop="description" label="Описание" />
      <!-- Состояние -->
      <el-table-column prop="type" label="Состояние" :resizable="false">
        <template #default="{ row }">
          <el-tag :color="rowStyleStates[row.type]" type="info">
            {{ noteLabels[row.type] }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- Приоритет -->
      <el-table-column prop="priority" label="Приоритет" :resizable="false">
        <template #default="{ row }">
          <el-tag :color="rowStylePriorities[row.priority]" type="info">
            {{ priorityLabels[row.priority] }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- Создание категории -->
    <Teleport v-if="isMounted" to=".page-header">
      <el-button type="primary" @click="openCardInCreateMode">Создать</el-button>
    </Teleport>

    <NoteCard
      v-model="category.visibility"
      :id="category.activeRow._id"
      :mode="category.cardMode"
      @on-object-created="onObjectedCreated"
      @on-object-updated="onObjectedUpdated"
      @on-object-removed="onObjectedRemoved"
      @on-hide-modal="category.visibility = false"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'

import CategoryService from '@/components/categories/service/CategoryService.js'

import {
  noteLabels,
  priorityLabels,
  rowStylePriorities,
  rowStyleStates
} from '@/components/notes/data/NotesData.js'

import NoteCard from '@/components/notes/card/NoteCard.vue'
import SystemDatePicker from '@/components/system/SystemDatePicker.vue'

const isMounted = ref(false)

const loading = ref(false)

const category = reactive({
  visibility: false,
  cardMode: 'edit',
  activeRow: {}
})

const tableData = ref([])

const openCardInCreateMode = () => {
  category.cardMode = 'create'
  category.visibility = true
}

const onRowClicked = (row) => {
  category.activeRow = row

  category.cardMode = 'edit'

  category.visibility = true
}

const onObjectedCreated = (object) => {
  tableData.value.push(object)

  category.cardMode = 'edit'
  category.visibility = false
}

const onObjectedRemoved = (id) => {
  const foundIndex = tableData.value.findIndex((row) => {
    return row._id === id
  })

  tableData.value.splice(foundIndex, 1)
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

getCategories()

onMounted(() => {
  isMounted.value = true
})
</script>

<style lang="scss">
.el-table .el-table__row {
  &:hover {
    cursor: pointer;
  }
}

.el-tag__content {
  color: black;
}
</style>
