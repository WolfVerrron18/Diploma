<template>
  <div class="reflections-container">
    <!-- Кнопка создания в хедере -->
    <Teleport v-if="isMounted" to=".page-header">
      <el-button type="warning" size="large" round icon="Edit" @click="openReflectionInCreateMode">
        Записать мысль
      </el-button>
    </Teleport>

    <!-- Модалка теперь принимает режим и данные -->
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
        <h2 class="page-title">Поток мыслей</h2>
        <p class="page-subtitle">Ваши идеи, рефлексия и важные заметки</p>
      </div>
    </div>

    <!-- Загрузка -->
    <div v-if="loading" class="loading-grid">
      <el-skeleton v-for="n in 6" :key="n" :rows="4" animated class="skeleton-card" />
    </div>

    <!-- Сетка из API -->
    <div v-else class="reflections-grid">
      <div
        v-for="note in notes"
        :key="note._id"
        class="reflection-card"
        @click="openEditModal(note)"
      >
        <div class="card-inner">
          <div class="card-top">
            <span class="type-icon">{{ getNoteIcon(note.type) }}</span>
          </div>

          <div class="card-main">
            <h3 class="note-title">{{ note.title || 'Без названия' }}</h3>
            <p class="note-content">{{ note.content }}</p>
          </div>

          <div class="card-bottom">
            <div class="note-info">
              <span class="note-date">{{ formatDate(note.updatedAt) }}</span>
              <el-tag size="small" effect="light" type="warning" class="type-tag">
                {{ getTypeName(note.type) }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-empty
      v-if="!loading && notes.length === 0"
      description="Тишина... Время что-нибудь записать."
    >
      <el-button type="warning" plain @click="openReflectionInCreateMode">
        Создать первую заметку
      </el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { StarFilled, Edit } from '@element-plus/icons-vue'
import ReflectionCard from '@/components/reflections/card/ReflectionCard.vue'
// Импортируем наш сервис
import ReflectionService from '@/components/reflections/service/ReflectionService.js'

const notes = ref([])
const loading = ref(true)
const isMounted = ref(false)

const reflection = reactive({
  visibility: false,
  cardMode: 'create',
  activeRow: {}
})

/**
 * Получение данных с бэкенда через сервис
 */
const fetchNotes = async () => {
  loading.value = true
  try {
    const response = await ReflectionService.reflections.list()
    // Предполагаем, что http.js возвращает данные в свойстве data
    notes.value = response.data || []
  } catch (e) {
    console.error('Ошибка при получении заметок:', e)
  } finally {
    loading.value = false
  }
}

// Открытие модалки для создания
const openReflectionInCreateMode = () => {
  reflection.activeRow = {
    title: '',
    content: '',
    type: 'idea',
    importance: 1
  }
  reflection.cardMode = 'create'
  reflection.visibility = true
}

// Открытие модалки для редактирования
const openEditModal = (note) => {
  reflection.activeRow = { ...note } // Копируем объект, чтобы не мутировать список напрямую
  reflection.cardMode = 'edit'
  reflection.visibility = true
}

// Хелперы (остаются без изменений)
const getNoteIcon = (type) => {
  const icons = { idea: '💡', memo: '📝', mind: '🧠' }
  return icons[type] || '✨'
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
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.reflections-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;

  .page-title {
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
    color: var(--el-text-color-primary);
  }

  .page-subtitle {
    margin: 8px 0 0 0;
    color: var(--el-text-color-secondary);
    font-size: 1rem;
  }
}

.reflections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.reflection-card {
  height: 220px;
  background: var(--el-bg-color-overlay);
  border-radius: 20px;
  border: 1px solid var(--el-border-color-lighter);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-color: var(--el-color-warning-light-5);
  }

  // Декоративный элемент "загнутый уголок" или акцент
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    background: linear-gradient(225deg, var(--el-color-warning-light-8) 50%, transparent 50%);
    opacity: 0.5;
  }

  .card-inner {
    padding: 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    .type-icon {
      font-size: 1.4rem;
    }
  }

  .card-main {
    flex-grow: 1;

    .note-title {
      margin: 0 0 10px 0;
      font-size: 1.15rem;
      font-weight: 700;
      font-style: italic; // Тот самый стиль "размышления"
      font-family: 'Georgia', serif;
      color: var(--el-text-color-primary);
    }

    .note-content {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--el-text-color-regular);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .card-bottom {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px dashed var(--el-border-color-lighter);

    .note-info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .note-date {
        font-size: 0.8rem;
        color: var(--el-text-color-placeholder);
      }

      .type-tag {
        border-radius: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }
    }
  }
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;

  .skeleton-card {
    padding: 20px;
    background: var(--el-bg-color-overlay);
    border-radius: 20px;
    height: 220px;
  }
}
</style>
