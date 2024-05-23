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
      <div class="transaction__wrapper" :class="{ 'transaction__wrapper-overlay': loading.card }">
        <!-- Название -->
        <SystemInput
          v-model="transaction.name"
          class="transaction__item"
          label="Название"
          @change:model-value="updateCategory"
        />

        <!-- Сумма -->
        <SystemInputNumber
          v-model="transaction.value"
          class="transaction__item"
          label="Сумма"
          :disabled="isMode.edit"
          @update:model-value="updateBankAccount"
        />

        <!-- Категория -->
        <SystemSelect
          class="transaction__item"
          :model-value="transaction.categoryId"
          :loading="loading.categories"
          :options="lists.categories"
          key-iteration-label="name"
          key-iteration-value="_id"
          label="Тип категори"
          placeholder="Выберите тип категории"
          @update:model-value="onUpdateCategory"
        >
          <template #option="{ option }">
            <div class="transaction__list-item">
              <p :style="{ color: option.color }">{{ option.name }}</p>

              <el-tag
                class="transaction__list-item-tag"
                :color="rowStyleCategories[option.type]"
                type="info"
              >
                {{ typeCategories[option.type] }}
              </el-tag>
            </div>
          </template>
        </SystemSelect>

        <!-- Счёт -->
        <SystemSelect
          :model-value="transaction.bankAccountId"
          class="transaction__item"
          label="Счёт"
          key-iteration-label="name"
          key-iteration-value="_id"
          :loading="loading.accounts"
          :options="lists.accounts"
          placeholder="Выберите счёт"
          @update:model-value="onUpdateBankAccount"
        >
          <template #option="{ option }"> {{ option.name }}: {{ option.value }}₽ </template>

          <!-- Префикс в виде валюты -->
          <template #prefix> ₽ </template>
        </SystemSelect>

        <!-- Дата транзакции -->
        <SystemDatePicker
          :model-value="transaction.date"
          label="Дата транзакции"
          @update:model-value="onUpdateDate"
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
import { TransactionModel } from '@/components/transactions/card/model/TransactionModel.js'
import { computed, reactive, ref, watch } from 'vue'
import { isEqual } from 'lodash'
import TransactionService from '@/components/transactions/service/TransactionService.js'
import CategoryService from '@/components/categories/service/CategoryService.js'
import SystemInputNumber from '@/components/system/SystemInputNumber.vue'
import BankAccountsService from '@/components/bank-accounts/service/BankAccountsService.js'
import SystemDatePicker from '@/components/system/SystemDatePicker.vue'
import dayjs from 'dayjs'
import { rowStyleCategories, typeCategories } from '@/components/categories/enums/enumCategories.js'

export default {
  name: 'TransactionCard',

  components: { SystemDatePicker, SystemInputNumber, SystemSelect, SystemModal, SystemInput },

  props: {
    /** @param {string} id - Идентификатор карточки */
    id: {
      type: String,
      default: ''
    },

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

  emits: ['onHideModal', 'update:modelValue', 'onObjectCreated', 'onObjectUpdated'],

  setup(props, { emit }) {
    const transaction = ref({})
    const model = ref({})

    const lists = ref({
      categories: [],
      accounts: []
    })

    const loading = reactive({
      button: false,
      card: false,
      categories: false,
      accounts: false
    })

    /** @computed
     * @name isMode - Определение режима с модальным окном */
    const isMode = computed(() => ({
      create: props.mode === 'create',
      edit: props.mode === 'edit'
    }))

    /** @computed
     * @name cardTitle - Заголовки модального окна */
    const cardTitle = computed(() => ({
      create: 'Cоздание транзакции',
      edit: `Транзакция "${model.value.name}"`
    }))

    /** @computed
     * @name isContentChanged - Изменился ли контент карточки */
    const isContentChanged = computed(() => {
      return isEqual(transaction.value, model.value)
    })

    const transactionBankAccount = computed(() => {
      return lists.value.accounts.find((account) => {
        return account._id === transaction.value.bankAccountId
      })
    })

    /** @function
     * @name createTransaction - Создание транзакции */
    const createTransaction = async () => {
      loading.button = true

      try {
        const { data } = await TransactionService.transactions.create(transaction.value)

        emit('onObjectCreated', data)
      } finally {
        loading.button = false
      }
    }

    /** @function
     * @name getTransaction - Получение транзакции */
    const getTransaction = async () => {
      loading.card = true

      try {
        const { data } = await TransactionService.transactions.get(props.id)

        transaction.value = data
        model.value = { ...data }
      } finally {
        loading.card = false
      }
    }

    /** @function
     * @name initTransaction - Инициализация транзакции */
    const initTransaction = () => {
      if (isMode.value.create) {
        transaction.value = new TransactionModel(props.defaultData)
        model.value = new TransactionModel(props.defaultData)
      } else if (props.modelValue) {
        getTransaction()
      }

      getCategories()

      getBankAccounts()
    }

    /** @function
     * @name onUpdateCategory - Обновление категории транзакции */
    const onUpdateCategory = (id) => {
      const foundCategory = lists.value.categories.find((category) => {
        return category._id === id
      })

      if (foundCategory) {
        transaction.value.categoryId = foundCategory._id
        transaction.value.type = foundCategory.type
      }
    }

    /** @function
     * @name getCategories - Получение списка категорий транзакции */
    const getCategories = async () => {
      loading.categories = true

      try {
        const { data } = await CategoryService.categories.list()

        lists.value.categories = data

        transaction.value.categoryId = data[0]._id
        transaction.value.type = data[0].type
      } finally {
        loading.categories = false
      }
    }

    /** @function
     * @name onUpdateBankAccount - Обновление счёта транзакции */
    const onUpdateBankAccount = (id) => {
      const foundAccount = lists.value.accounts.find((account) => {
        return account._id === id
      })

      if (foundAccount) {
        transaction.value.bankAccountId = foundAccount._id
      }
    }

    /** @function
     * @name getBankAccounts - Получение списка счетов для привязки к транзакции */
    const getBankAccounts = async () => {
      loading.accounts = true

      try {
        const { data } = await BankAccountsService.accounts.list()

        lists.value.accounts = data

        transaction.value.bankAccountId = data[0]._id
      } finally {
        loading.accounts = false
      }
    }

    const onUpdateDate = (date) => {
      transaction.value.date = dayjs(date).valueOf()
    }

    /** @function
     * @name onHideModal - Закрытие модального окна */
    const onHideModal = () => emit('onHideModal')

    watch(
      () => props.modelValue,
      () => initTransaction(),
      { immediate: true }
    )

    return {
      transaction,
      loading,
      lists,
      isMode,
      cardTitle,
      isContentChanged,
      transactionBankAccount,
      rowStyleCategories,
      typeCategories,
      onHideModal,
      onUpdateDate,
      onUpdateCategory,
      onUpdateBankAccount,
      createTransaction
    }
  }
}
</script>

<style scoped lang="scss">
.transaction {
  &__wrapper {
    padding: 24px;
    height: 100%;
    overflow: auto;
    position: relative;

    &-overlay {
      &::before {
        content: '';
        position: absolute;
        background: white;
        opacity: 0.4;
        z-index: 999;
        height: calc(100% - 48px);
        width: calc(100% - 24px);
      }
    }
  }

  &__item:not(:last-child) {
    margin-bottom: 16px;
  }

  &__list-item {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    &-tag {
      min-width: 60px;
    }
  }
}
</style>
