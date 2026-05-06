<template>
  <div class="reflections-container">
    <!-- Кнопка создания в хедере -->
    <Teleport v-if="isMounted" to=".page-header">
      <el-button type="primary" round :icon="Edit" @click="openReflectionInCreateMode">
        Записать мысль
      </el-button>
    </Teleport>

    <ReflectionCard
      v-model="reflection.visibility"
      :mode="reflection.cardMode"
      :default-data="reflection.activeRow"
      @on-hide-modal="reflection.visibility = false"
      @on-object-created="fetchNotes"
      @on-object-updated="fetchNotes"
    />

    <div class="reflections-header">
      <div class="title-section">
        <p class="page-subtitle">Ваши идеи и заметки</p>
      </div>
    </div>

    <!-- Обертка со скроллом -->
    <div class="scrollable-content">
      <div v-if="loading" class="reflections-grid">
        <el-skeleton v-for="n in 12" :key="n" animated class="skeleton-compact" />
      </div>

      <div v-else class="reflections-grid">
        <div
          v-for="note in notes"
          :key="note._id"
          class="reflection-card"
          @click="openEditModal(note)"
        >
          <div class="type-accent" :class="note.type"></div>

          <div class="card-inner">
            <div class="card-top">
              <h3 class="note-title">{{ note.title || 'Без названия' }}</h3>
              <el-icon class="type-icon" :class="note.type">
                <component :is="getNoteIcon(note.type)" />
              </el-icon>
            </div>

            <p class="note-content">{{ note.content }}</p>

            <div class="card-meta">
              <span class="note-date">{{ formatDate(note.updatedAt) }}</span>
              <span class="type-label" :class="note.type">{{ getTypeName(note.type) }}</span>
            </div>
          </div>
        </div>
      </div>

      <el-empty v-if="!loading && notes.length === 0" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { Edit, Opportunity, Document, ChatLineRound } from '@element-plus/icons-vue'
import ReflectionCard from '@/components/reflections/card/ReflectionCard.vue'
import ReflectionService from '@/components/reflections/service/ReflectionService.js'

const notes = ref([])
const loading = ref(true)
const isMounted = ref(false)

const reflection = reactive({
  visibility: false,
  cardMode: 'create',
  activeRow: {}
})

const fetchNotes = async () => {
  loading.value = true
  try {
    const response = await ReflectionService.reflections.list()
    notes.value = response.data || []
  } catch (e) {
    console.error('Ошибка:', e)
  } finally {
    loading.value = false
  }
}

const openReflectionInCreateMode = () => {
  reflection.activeRow = { title: '', content: '', type: 'idea', importance: 1 }
  reflection.cardMode = 'create'
  reflection.visibility = true
}

const openEditModal = (note) => {
  reflection.activeRow = { ...note }
  reflection.cardMode = 'edit'
  reflection.visibility = true
}

// Иконки теперь системные
const getNoteIcon = (type) => {
  const icons = { idea: Opportunity, memo: Document, mind: ChatLineRound }
  return icons[type] || Document
}

const getTypeName = (type) => {
  const names = { idea: 'Идея', memo: 'Заметка', mind: 'Рефлексия' }
  return names[type] || 'Мысль'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  })
}

onMounted(() => {
  fetchNotes()
  isMounted.value = true
})
</script>

<style scoped lang="scss">
.reflections-container {
  padding: 20px;
  max-width: 1400px;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.reflections-header {
  margin-bottom: 24px;
  flex-shrink: 0; // Чтобы хедер не сжимался

  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }
  .page-subtitle {
    font-size: 1rem;
    color: var(--el-text-color-secondary);
  }
}

/* Область скролла */
.scrollable-content {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 8px; // Отступ для скроллбара
  padding-bottom: 20px;

  /* Стилизация скроллбара под Element Plus */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--el-border-color-darker);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--el-text-color-placeholder);
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.reflections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  align-items: start; // Чтобы карточки разной наполненности не растягивались странно
}

.reflection-card {
  position: relative;
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 140px;

  &:hover {
    border-color: var(--el-color-primary-light-3);
    transform: translateY(-2px);
    box-shadow: var(--el-box-shadow-lighter);
  }

  .type-accent {
    height: 3px;
    width: 100%;
    &.idea {
      background: var(--el-color-warning);
    }
    &.memo {
      background: var(--el-color-info);
    }
    &.mind {
      background: var(--el-color-primary);
    }
  }

  .card-inner {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    .note-title {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    .type-icon {
      font-size: 1rem;
      opacity: 0.6;
      &.idea {
        color: var(--el-color-warning);
      }
      &.memo {
        color: var(--el-color-info);
      }
      &.mind {
        color: var(--el-color-primary);
      }
    }
  }

  .note-content {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--el-text-color-regular);
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-meta {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--el-border-color-extra-light);
    padding-top: 8px;

    .note-date {
      font-size: 0.7rem;
      color: var(--el-text-color-placeholder);
    }
    .type-label {
      font-size: 12px;
      &.idea {
        color: var(--el-color-warning);
      }
      &.memo {
        color: var(--el-color-info);
      }
      &.mind {
        color: var(--el-color-primary);
      }
    }
  }
}

.skeleton-compact {
  height: 160px;
  border-radius: 12px;
}
</style>
