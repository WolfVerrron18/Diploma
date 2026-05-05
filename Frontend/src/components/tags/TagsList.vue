<template>
  <div class="tags-handbook" v-loading.fullscreen.lock="initialLoading">
    <!-- ЛЕВАЯ ПАНЕЛЬ (Фиксированная) -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <el-input
          v-model="categorySearch"
          placeholder="Поиск категорий..."
          prefix-icon="Search"
          clearable
        />
      </div>

      <div v-if="initialLoading" class="skeleton-wrap">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else class="category-list">
        <div
          v-for="cat in filteredCategories"
          :key="cat._id"
          @click="enterEditMode(cat._id)"
          :class="['category-item', { active: selectedCategory?._id === cat._id && !isCreateMode }]"
          :style="{ '--cat-color': cat.color }"
        >
          <div class="category-accent"></div>
          <div class="category-info">
            <span class="category-name">{{ cat.name }}</span>
          </div>
          <el-tag size="small" type="info">
            {{ cat.tagsCount ?? cat.tags?.length ?? 0 }}
          </el-tag>
        </div>
      </div>

      <div class="sidebar-footer">
        <el-button
          type="primary"
          class="w-100"
          @click="enterCreateMode"
          :disabled="isCreateMode"
          icon="Plus"
        >
          Новая категория
        </el-button>
      </div>
    </aside>

    <!-- ОСНОВНАЯ ПАНЕЛЬ (Единый скролл) -->
    <main class="main-content" v-loading="mainPanelLoading">
      <div
        v-if="selectedCategory"
        class="editor-container"
        :style="{ '--active-color': selectedCategory.color }"
      >
        <div class="mode-badge">
          <el-tag :type="'primary'" effect="light" round>
            {{ isCreateMode ? 'РЕЖИМ СОЗДАНИЯ' : 'РЕЖИМ РЕДАКТИРОВАНИЯ' }}
          </el-tag>
        </div>

        <section class="category-form">
          <div class="form-row">
            <div class="input-group main-name">
              <label class="field-label">НАЗВАНИЕ</label>
              <input
                v-model="selectedCategory.name"
                class="massive-input"
                placeholder="Введите название..."
              />
            </div>
            <div class="input-group color-picker-group">
              <label class="field-label">ЦВЕТ</label>
              <el-color-picker v-model="selectedCategory.color" size="large" />
            </div>
          </div>

          <div class="input-group">
            <label class="field-label">ОПИСАНИЕ</label>
            <el-input
              v-model="selectedCategory.description"
              type="textarea"
              :rows="4"
              placeholder="Краткое описание раздела..."
            />
          </div>
        </section>

        <!-- Теги: Естественная ширина -->
        <section v-if="!isCreateMode" class="tags-section">
          <div class="section-header">
            <span class="field-label">ТЕГИ КАТЕГОРИИ</span>
          </div>

          <div class="tags-flex">
            <div v-for="tag in selectedCategory.tags" :key="tag._id" class="themed-tag">
              <input
                v-model="tag.label"
                @change="handleUpdateTag(tag)"
                class="tag-edit-input"
                :style="{ width: tag.label.length + 1 + 'ch' }"
              />
              <el-icon class="tag-del-icon" @click="handleRemoveTag(tag._id)">
                <Close />
              </el-icon>
            </div>

            <div class="tag-adder">
              <el-input
                v-model="newTagName"
                placeholder="+ Тег"
                @keyup.enter="handleConfirmAddTag"
                @blur="handleConfirmAddTag"
                class="compact-adder"
              />
            </div>
          </div>
        </section>

        <footer class="form-footer">
          <div class="footer-left">
            <el-button v-if="!isCreateMode" type="danger" link @click="handleDeleteCategory">
              Удалить категорию
            </el-button>
            <el-button v-else @click="cancelCreate" link>Отмена</el-button>
          </div>

          <el-button
            type="primary"
            size="large"
            @click="isCreateMode ? handleConfirmCreate() : handleSaveCategory()"
            :loading="categoryActionLoading"
          >
            {{ isCreateMode ? 'Создать категорию' : 'Сохранить изменения' }}
          </el-button>
        </footer>
      </div>

      <div v-else class="empty-state">
        <el-icon :size="64" color="var(--el-text-color-placeholder)"><Collection /></el-icon>
        <p>Выберите раздел для управления тегами</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Collection, Close, Plus, Search } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import TagService from '@/components/tags/service/TagService.js'

const categories = ref([])
const selectedCategory = ref(null)
const categorySearch = ref('')
const isCreateMode = ref(false)
const newTagName = ref('')

const initialLoading = ref(true)
const mainPanelLoading = ref(false)
const categoryActionLoading = ref(false)
const tagActionLoading = ref(false)

const fetchCategories = async (autoSelectFirst = false) => {
  try {
    initialLoading.value = true
    const { data } = await TagService.categories.list()
    categories.value = data
    if (autoSelectFirst && data.length > 0 && !selectedCategory.value) {
      enterEditMode(data[0]._id)
    }
  } catch (err) {
    ElMessage.error('Ошибка загрузки')
  } finally {
    initialLoading.value = false
  }
}

onMounted(() => fetchCategories(true))

const filteredCategories = computed(() => {
  return categories.value.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.value.toLowerCase())
  )
})

const enterCreateMode = () => {
  isCreateMode.value = true
  selectedCategory.value = { name: '', color: '#409EFF', description: '', tags: [] }
}

const enterEditMode = async (categoryId) => {
  isCreateMode.value = false
  try {
    mainPanelLoading.value = true
    const { data } = await TagService.categories.get(categoryId)
    selectedCategory.value = data
  } catch (err) {
    ElMessage.error('Не удалось загрузить данные')
  } finally {
    mainPanelLoading.value = false
  }
}

const cancelCreate = () => {
  isCreateMode.value = false
  selectedCategory.value = null
}

const handleConfirmCreate = async () => {
  if (!selectedCategory.value.name.trim()) return ElMessage.warning('Введите название')
  try {
    categoryActionLoading.value = true
    const { data } = await TagService.categories.create(selectedCategory.value)
    await fetchCategories()
    await enterEditMode(data._id)
    ElMessage.success('Создано')
  } catch (err) {
    ElMessage.error('Ошибка создания')
  } finally {
    categoryActionLoading.value = false
  }
}

const handleSaveCategory = async () => {
  try {
    categoryActionLoading.value = true
    await TagService.categories.update(selectedCategory.value._id, selectedCategory.value)
    await fetchCategories()
    ElMessage.success('Сохранено')
  } catch (err) {
    ElMessage.error('Ошибка сохранения')
  } finally {
    categoryActionLoading.value = false
  }
}

const handleConfirmAddTag = async () => {
  const label = newTagName.value.trim()
  if (!label) return
  const isDuplicate = selectedCategory.value.tags.some(
    (t) => t.label.toLowerCase() === label.toLowerCase()
  )
  if (isDuplicate) {
    newTagName.value = ''
    return ElMessage.warning('Такой тег уже есть')
  }
  try {
    tagActionLoading.value = true
    const { data } = await TagService.tags.create({ categoryId: selectedCategory.value._id, label })
    selectedCategory.value.tags.push(data)
    newTagName.value = ''
  } catch (err) {
    ElMessage.error('Ошибка добавления')
  } finally {
    tagActionLoading.value = false
  }
}

const handleUpdateTag = async (tag) => {
  if (!tag.label.trim()) return
  try {
    await TagService.tags.update(tag._id, { label: tag.label })
  } catch (err) {
    ElMessage.error('Ошибка обновления')
  }
}

const handleRemoveTag = async (tagId) => {
  try {
    await TagService.tags.remove(tagId)
    selectedCategory.value.tags = selectedCategory.value.tags.filter((t) => t._id !== tagId)
  } catch (err) {
    ElMessage.error('Ошибка удаления')
  }
}

const handleDeleteCategory = async () => {
  try {
    await ElMessageBox.confirm('Удалить этот раздел и все его теги?', 'Внимание', {
      type: 'warning',
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена'
    })
    categoryActionLoading.value = true
    await TagService.categories.remove(selectedCategory.value._id)
    selectedCategory.value = null
    await fetchCategories(true)
  } catch (err) {
  } finally {
    categoryActionLoading.value = false
  }
}
</script>

<style scoped>
.tags-handbook {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
  overflow: hidden; /* Важно: скролл только внутри панелей */
}

/* SIDEBAR */
.sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-bg-color-page);
  flex-shrink: 0;
}

.sidebar-header {
  padding: 20px;
}

.category-list {
  overflow-y: auto;
  padding: 0 12px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 6px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.category-item:hover {
  background-color: var(--el-fill-color-light);
}
.category-item.active {
  background-color: var(--el-color-primary-light-9);
}

.category-accent {
  position: absolute;
  left: 0;
  width: 4px;
  height: 20px;
  background-color: var(--cat-color);
  border-radius: 0 4px 4px 0;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* MAIN CONTENT (Единственное место со скроллом справа) */
.main-content {
  flex: 1;
  padding: 40px 60px;
  overflow-y: auto; /* Весь контент справа скроллится здесь */
  height: 100vh;
}

.editor-container {
  width: 100%;
  padding-bottom: 100px; /* Чтобы футер не прилипал к краю при скролле */
}

.mode-badge {
  margin-bottom: 40px;
}

.form-row {
  display: flex;
  gap: 40px;
  align-items: flex-end;
  margin-bottom: 30px;
}

.main-name {
  flex: 1;
}

.massive-input {
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--el-border-color-lighter);
  font-size: 36px;
  font-weight: 800;
  color: var(--el-text-color-primary);
  padding: 8px 0;
  width: 100%;
  outline: none;
  transition: border-color 0.3s;
}
.massive-input:focus {
  border-color: var(--active-color);
}

.field-label {
  display: block;
  font-size: 11px;
  letter-spacing: 1.5px;
  color: var(--el-text-color-secondary);
  margin-bottom: 12px;
  text-transform: uppercase;
}

/* TAGS FLEX (Новое поведение) */
.tags-section {
  margin-top: 50px;
}

.section-header {
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 24px;
  padding-bottom: 8px;
}

.tags-flex {
  display: flex;
  flex-wrap: wrap; /* Теги перетекают на новую строку */
  gap: 10px;
  align-items: center;
}

.themed-tag {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 100px; /* Более мягкая форма */
  background-color: var(--active-color);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.tag-edit-input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  min-width: 3ch; /* Чтобы не схлопывался совсем */
  max-width: 300px;
}

.tag-del-icon {
  margin-left: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 14px;
}
.tag-del-icon:hover {
  color: #fff;
  transform: scale(1.2);
}

.tag-adder {
  min-width: 120px;
}

.compact-adder :deep(.el-input__wrapper) {
  border-radius: 100px;
}

/* FOOTER */
.form-footer {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--el-text-color-placeholder);
}

.w-100 {
  width: 100%;
}
</style>
