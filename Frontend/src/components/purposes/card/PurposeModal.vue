<template>
  <SystemModal
    :model-value="modelValue"
    :width="400"
    :height="300"
    title="Цель какая-то"
    :show-footer="isMode.create"
    @on-hide-modal="onHideModal"
  >
    <template #content>
      <div class="purpose__wrapper">
        <!-- Название -->
        <SystemInput class="purpose__item" label="Название" />

        <!-- Сумма -->
        <SystemInputNumber class="purpose__item" label="Сумма" />

        <!--        &lt;!&ndash; Предполагаемая дата достижения цели &ndash;&gt;-->
        <!--        <el-date-picker class="purpose__item" v-model="value1" type="datetime" />-->

        <!-- Описание -->
        <SystemInput
          class="purpose__item"
          style="width: 240px"
          label="Описание"
          type-field="textarea"
          placeholder="Введите описание"
        />

        <!-- Текущий прогресс -->
        <SystemInputNumber class="purpose__item" label="Текущий прогресс" />

        <!-- Приоритет -->
        <SystemSelect
          class="purpose__item"
          v-model="selectedPriority"
          :options="priorities"
          label="Приоритет"
          placeholder="Выберите приоритет"
        />
      </div>
    </template>

    <template #footer>
      <el-button @click="onHideModal"> Отмена </el-button>
      <el-button type="primary"> Сохранить </el-button>
    </template>
  </SystemModal>
</template>

<script>
import { computed, ref } from 'vue'
import { priorities } from '@/components/purposes/data/PurposeData.js'
import dayjs from 'dayjs'
import { PurposeModel } from '@/components/purposes/card/PurposeModel.js'
import SystemModal from '@/components/system/SystemModal.vue'
import { Minus, Plus } from '@element-plus/icons-vue'
import SystemInput from '@/components/system/SystemInput.vue'
import SystemInputNumber from '@/components/system/SystemInputNumber.vue'
import SystemLabel from '@/components/system/SystemLabel.vue'
import SystemSelect from '@/components/system/SystemSelect.vue'

export default {
  name: 'PurposeModal',

  components: {
    SystemSelect,
    SystemLabel,
    SystemInputNumber,
    SystemInput,
    Plus,
    Minus,
    SystemModal
  },

  props: {
    /** @param {boolean} modelValue - Видимость модального окна */
    modelValue: {
      type: Boolean,
      default: false
    },

    /** @param {string} mode - Режим работы с карточкой */
    mode: {
      type: String,
      default: 'edit',
      validator(mode) {
        return ['create', 'edit', 'analogy'].includes(mode)
      }
    }
  },

  emits: ['onHideModal', 'update:modelValue'],

  setup(props, { emit }) {
    const purpose = ref({})

    const selectedPriority = ref('')

    /** @computed
     * @name isMode - Определение режима с модальным окном */
    const isMode = computed(() => ({
      create: props.mode === 'create',
      edit: props.mode === 'edit',
      analogy: props.mode === 'analogy'
    }))

    const initPurpose = () => {
      if (!isMode.value.edit) {
        purpose.value = new PurposeModel()
      } else {
        getPurpose()
      }
    }

    const getPurpose = () => {}

    /** @function
     * @name onUpdateVisible - Обновление видимости модального окна */
    const onUpdateVisible = () => emit('update:modelValue')

    /** @function
     * @name onHideModal - Закрытие модального окна */
    const onHideModal = () => emit('onHideModal')

    return { selectedPriority, isMode, priorities, onHideModal, onUpdateVisible }
  }
}
</script>

<style scoped lang="scss">
.purpose {
  &__wrapper {
    padding: 24px;
    display: grid;
    height: 100%;
    overflow: auto;
  }

  &__item:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>
