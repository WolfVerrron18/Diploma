<template>
  <SystemModal
    :model-value="modelValue"
    :width="400"
    :height="400"
    :title="cardTitle[mode]"
    :show-footer="isMode.create"
    @on-hide-modal="onHideModal"
  >
    <template #content>
      <div class="category__wrapper" :class="{ 'category__wrapper-overlay': loading.card }">
        <!-- Название -->
        <SystemInput
          v-model="category.name"
          class="category__item"
          label="Название"
          @change:model-value="updateCategory"
        />

        <!-- Описание -->
        <SystemInput
          v-model="category.description"
          class="category__item"
          style="width: 240px"
          label="Описание"
          type-field="textarea"
          placeholder="Введите описание"
          @change:model-value="updateCategory"
        />

        <!-- Приоритет -->
        <SystemSelect
          class="category__item"
          v-model="category.type"
          :options="types"
          label="Тип категори"
          placeholder="Выберите тип категории"
          @update:model-value="updateCategory"
        />
      </div>
    </template>

    <template #footer>
      <el-button @click="onHideModal"> Отмена </el-button>

      <el-button
        type="primary"
        :disabled="isContentChanged"
        :loading="loading.button"
        @click="createTransaction"
      >
        Сохранить
      </el-button>
    </template>
  </SystemModal>
</template>

<script>
import SystemSelect from '@/components/system/SystemSelect.vue'
import SystemModal from '@/components/system/SystemModal.vue'
import SystemInput from '@/components/system/SystemInput.vue'
import { TransactionModel } from '@/components/categories/card/transaction/model/TransactionModel.js'
import { computed, reactive, ref, watch } from 'vue'
import { isEqual } from 'lodash'
import TransactionService from '@/components/categories/service/TransactionService.js'

export default {
  name: 'TransactionCard',

  components: { SystemSelect, SystemModal, SystemInput },

  props: {
    /** @param {boolean} modelValue - Видимость карточки */
    modelValue: {
      type: Boolean,
      default: false
    },

    /** @param {object} defaultData - Данные карточки по умолчанию */
    defaultData: {
      type: Object,
      default: () => ({})
    },

    /** @param {string} mode - Режим работы с карточкой */
    mode: {
      type: String,
      default: 'edit',
      validator(mode) {
        return ['create', 'edit'].includes(mode)
      }
    }
  },

  setup(props, { emit }) {
    const transaction = ref({})
    const model = ref({})

    const loading = reactive({
      button: false,
      card: false
    })

    /** @computed
     * @name isContentChanged - Изменился ли контент карточки */
    const isContentChanged = computed(() => {
      return isEqual(transaction.value, model.value)
    })

    const createTransaction = async () => {
      loading.button = true

      try {
        const { data } = await TransactionService.transactions.create(transaction.value)

        emit('onObjectCreated', data)
      } finally {
        loading.button = false
      }
    }

    const initCategory = () => {
      transaction.value = new TransactionModel(props.defaultData)
      model.value = new TransactionModel(props.defaultData)
    }

    watch(
      () => props.modelValue,
      () => {
        initCategory()
      },
      { immediate: true }
    )

    return { loading, isContentChanged, createTransaction }
  }
}
</script>

<style scoped lang="scss"></style>
