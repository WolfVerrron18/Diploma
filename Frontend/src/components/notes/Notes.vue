<template>
  <div class="notes-container">
    <!-- Сетка карточек -->
    <el-row :gutter="20">
      <el-col v-for="row in tableData" :key="row._id" :xs="24" :sm="12" :md="8" :lg="6">
        <el-card class="note-card" shadow="hover" @click="onRowClicked(row)">
          <!-- Верхняя часть: Приоритет и Дата -->
          <div class="note-card__header">
            <el-tag
              :color="rowStylePriorities[row.priority]"
              size="small"
              effect="dark"
              class="priority-tag"
            >
              {{ priorityLabels[row.priority] }}
            </el-tag>
            <span class="note-date">{{ row.dateCreation?.split('T')[0] }}</span>
          </div>

          <!-- Контент -->
          <div class="note-card__body">
            <h3 class="note-title">{{ row.name }}</h3>
            <p class="note-description">{{ row.description }}</p>
          </div>

          <!-- Футер: Состояние -->
          <div class="note-card__footer">
            <el-tag :color="rowStyleStates[row.type]" round class="state-tag">
              {{ noteLabels[row.type] }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Кнопка создания (через Teleport) -->
    <Teleport v-if="isMounted" to=".page-header">
      <el-button type="primary" round @click="openCardInCreateMode"> Создать задачу </el-button>
    </Teleport>

    <!-- Модалка редактирования/создания -->
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

const isMounted = ref(false)
const loading = ref(false)
const tableData = ref([])

const category = reactive({
  visibility: false,
  cardMode: 'edit',
  activeRow: {}
})

const openCardInCreateMode = () => {
  category.activeRow = {} // Очищаем текущую строку
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
  category.visibility = false
}

const onObjectedRemoved = (id) => {
  const foundIndex = tableData.value.findIndex((row) => row._id === id)
  if (foundIndex !== -1) tableData.value.splice(foundIndex, 1)
  category.visibility = false
}

const onObjectedUpdated = (object) => {
  const foundIndex = tableData.value.findIndex((row) => row._id === object._id)
  if (foundIndex !== -1) tableData.value.splice(foundIndex, 1, { ...object })
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

onMounted(() => {
  isMounted.value = true
  getCategories()
})
</script>

<style lang="scss" scoped>
.notes-container {
  padding: 20px;

  .note-card {
    margin-bottom: 20px;
    cursor: pointer;
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid var(--el-border-color-lighter);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .note-date {
        font-size: 0.75rem;
        color: var(--el-text-color-secondary);
      }
    }

    &__body {
      .note-title {
        margin: 0 0 8px 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .note-description {
        font-size: 0.9rem;
        color: var(--el-text-color-regular);
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        min-height: 3.6em;
      }
    }

    &__footer {
      margin-top: 15px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

// Фикс для читаемости текста в тегах, если используются кастомные цвета
:deep(.el-tag__content) {
  color: #000;
  font-weight: 500;
}

.priority-tag {
  border: none;
}

.state-tag {
  border: none;
  opacity: 0.9;
}
</style>
