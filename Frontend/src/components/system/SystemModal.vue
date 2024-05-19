<template>
  <el-dialog
    :model-value="modelValue"
    modal-class="modal"
    center
    :width="width"
    :draggable="true"
    :align-center="true"
    :show-close="false"
    :z-index="zIndex"
    :fullscreen="isFullScreen"
    @closed="onHideModal"
    @update:model-value="onUpdateVisible"
  >
    <template #header="{ close, titleId, titleClass }">
      <!-- Шапка -->
      <div class="modal__header">
        <!-- Заголовок -->
        <h3 :id="titleId" :class="titleClass">{{ title }}</h3>

        <!-- Контролы -->
        <div class="modal__controls">
          <!-- Иконка полноэкранного режима -->
          <el-icon v-if="!isFullScreen" color="#000000" class="modal__icon">
            <FullScreen @click="isFullScreen = true" />
          </el-icon>

          <!-- Иконка картинка в картинке -->
          <el-icon v-else color="#000000" class="modal__icon">
            <CopyDocument @click="isFullScreen = false" />
          </el-icon>

          <el-icon color="#000000" class="modal__icon">
            <Close @click="close" />
          </el-icon>
        </div>
      </div>
    </template>

    <div class="modal__content" :style="{ height: getModalHeight }">
      <slot name="content" />
    </div>

    <template #footer>
      <div v-if="showFooter" class="modal__footer">
        <slot name="footer" />
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { computed, onMounted, ref } from 'vue'

import { Close, CopyDocument, FullScreen } from '@element-plus/icons-vue'

export default {
  name: 'SystemModal',

  components: { Close, CopyDocument, FullScreen },

  props: {
    /** @param {boolean} modelValue - Видимость модального окна */
    modelValue: {
      type: Boolean,
      default: false
    },

    /** @param {string} title - Заголовок модального окна */
    title: {
      type: String,
      default: ''
    },

    /** @param {number} width - Ширина модального окна */
    width: {
      type: Number,
      default: 0
    },

    /** @param {number} height - Высота модального окна */
    height: {
      type: Number,
      default: 0
    },

    /** @param {number} zIndex - Порядок наложения */
    zIndex: {
      type: Number,
      default: 999
    },

    /** @param {boolean} showFooter - Отображать ли подвал модального окна */
    showFooter: {
      type: Boolean,
      default: true
    }
  },

  emits: ['onHideModal', 'update:modelValue'],

  setup(props, { emit }) {
    const isFullScreen = ref(false)

    /** @function
     * @name getModalHeight - Получение высоты модального окна в пикселях */
    const getModalHeight = computed(() => {
      return !isFullScreen.value ? `${props.height}px` : '100%'
    })

    /** @function
     * @name onUpdateVisible - Обновление видимости модального окна */
    const onUpdateVisible = () => emit('update:modelValue')

    /** @function
     * @name onHideModal - Закрытие модального окна */
    const onHideModal = () => emit('onHideModal')

    return { isFullScreen, getModalHeight, onHideModal, onUpdateVisible }
  }
}
</script>

<style lang="scss">
@mixin flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal {
  background-color: transparent;

  .el-dialog__body {
    overflow: auto;
  }

  .el-dialog {
    box-shadow: var(--el-box-shadow);
    padding: 0;
    border-radius: 8px;
  }

  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__title {
    text-align: left;
  }

  &__header {
    @include flex;
    width: 100%;
    padding: 24px;
    border-bottom: 1px solid var(--el-border-color);
  }

  &__content {
  }

  &__footer {
    border-top: 1px solid var(--el-border-color);
    padding: 24px;
  }

  &__title {
    color: var(--el-text-color-primary);
    font-size: 16px;
  }

  &__controls {
    @include flex;
    gap: 10px;
  }

  &__icon {
    cursor: pointer;
  }
}

:deep(.el-overlay) {
  background: white;
}
</style>
