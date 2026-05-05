<template>
  <div class="p-8 bg-[#0a0a0a] min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-end mb-12">
      <div>
        <h1 class="text-4xl font-bold text-amber-50 tracking-tighter">REPOSITORY</h1>
        <p class="text-gray-500 text-xs uppercase tracking-[0.4em] mt-1">
          Crystallized Knowledge Base
        </p>
      </div>
      <el-button
        @click="handleCreate"
        class="!bg-amber-500 !text-black !border-none !font-bold !rounded-none hover:!bg-amber-400 !px-8"
      >
        + NEW ARTEFACT
      </el-button>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <el-card
        v-for="(item, index) in artifacts"
        :key="index"
        class="artifact-card-preview group"
        shadow="hover"
        @click="handleEdit(item, index)"
      >
        <div class="flex flex-col h-full justify-between space-y-4">
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-[9px] text-amber-500/50 font-mono"
                >ID: {{ index.toString().padStart(3, '0') }}</span
              >
              <el-rate :model-value="item.importance" :max="3" disabled void-color="#262626" />
            </div>
            <h3
              class="text-xl font-serif italic text-amber-100 group-hover:text-amber-400 transition-colors"
            >
              {{ item.title || 'Untitled' }}
            </h3>
            <p class="text-gray-500 text-sm line-clamp-3 font-light leading-relaxed">
              {{ item.content }}
            </p>
          </div>

          <div class="flex flex-wrap gap-1 pt-4 border-t border-white/5">
            <span v-for="tag in item.tags" :key="tag" class="text-[10px] text-gray-600">
              #{{ tag }}
            </span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Твоя карточка (ArtifactCard.vue) -->
    <ArtifactCard
      v-model="modalVisible"
      :default-data="selectedArtifact"
      @on-hide-modal="closeModal"
      @on-save="saveArtifact"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ArtifactCard from '@/components/artifacts/card/ArtifactCard.vue'

// Список артефактов (в реальности может приходить из API)
const artifacts = ref([
  {
    title: 'Логика Workflow',
    content:
      'Центральный узел управления состояниями редактора. Рефакторинг позволил снизить задержку рендеринга на 40%.',
    importance: 3,
    tags: ['Frontend', 'Vue3'],
    createdAt: new Date()
  },
  {
    title: 'Принцип автоматизации',
    content:
      'Ферма пороха в Minecraft показала, что избыточность ресурсов ведет к творческой свободе.',
    importance: 2,
    tags: ['Minecraft', 'Logic'],
    createdAt: new Date()
  }
])

const modalVisible = ref(false)
const selectedArtifact = ref(null)
const editIndex = ref(-1)

const handleCreate = () => {
  selectedArtifact.value = {
    title: '',
    content: '',
    importance: 1,
    tags: [],
    createdAt: new Date()
  }
  editIndex.value = -1
  modalVisible.value = true
}

const handleEdit = (item, index) => {
  selectedArtifact.value = { ...item }
  editIndex.value = index
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
  selectedArtifact.value = null
}

const saveArtifact = (newData) => {
  if (editIndex.value > -1) {
    // Обновляем существующий
    artifacts.value[editIndex.value] = { ...newData }
  } else {
    // Добавляем новый
    artifacts.value.unshift({ ...newData })
  }
  closeModal()
}
</script>
