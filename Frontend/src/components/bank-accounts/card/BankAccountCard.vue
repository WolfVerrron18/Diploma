<template>
  <div class="bank-account-card">
    <!-- Обёртка карточки -->
    <div class="bank-account-card__wrapper">
      <!-- Контент карточки -->
      <div class="bank-account-card__content">
        <!-- Название -->
        <SystemInput
          v-model.trim="bankAccount.name"
          :required="true"
          class="bank-account-card__item"
          label="Название"
          :disabled="readonly"
          @change:model-value="updateBankAccount"
        />

        <!-- Описание -->
        <SystemInput
          v-model.trim="bankAccount.description"
          class="bank-account-card__item"
          label="Описание"
          type-field="textarea"
          :disabled="readonly"
          @change:model-value="updateBankAccount"
        />

        <!-- Сумма -->
        <SystemInputNumber
          v-model="bankAccount.value"
          class="purpose__item"
          label="Сумма"
          :disabled="isMode.edit"
          @update:model-value="updateBankAccount"
        />

        <!--        <Doughnut class="bank-account-card__chart" :options="chartOptions" :data="chartData" />-->
        <el-button
          v-if="isMode.create"
          class="bank-account-card__btn"
          type="primary"
          :loading="loading.button"
          :disabled="!(isContentChanged && isAllowSave)"
          @click="createBankAccount"
        >
          Сохранить
        </el-button>
      </div>

      <SystemTabs class="bank-account-card__tabs" :tabs="tabs" />
    </div>
  </div>
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { BankAccountModel } from '@/components/bank-accounts/card/model/BankAccountModel.js'
import BankAccountsService from '@/components/bank-accounts/service/BankAccountsService.js'
import SystemInput from '@/components/system/SystemInput.vue'
import { computed, reactive, ref, watch } from 'vue'
import SystemTabs from '@/components/system/SystemTabs.vue'
import SystemSelect from '@/components/system/SystemSelect.vue'
import SystemInputNumber from '@/components/system/SystemInputNumber.vue'
import { isEqual } from 'lodash'

export default {
  name: 'BankAccountCard',

  components: { SystemInputNumber, SystemSelect, SystemTabs, SystemInput, Doughnut },

  props: {
    /** @param {string} id - Идентификатор счёта */
    id: {
      type: String,
      default: ''
    },

    /** @param {boolean} readonly - Режим только чтения */
    readonly: {
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
      validator(cardMode) {
        return ['edit', 'create'].includes(cardMode)
      }
    }
  },

  emits: ['onObjectCreated'],

  setup(props, { emit }) {
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

    const bankAccount = ref({})
    const model = ref({})

    const loading = reactive({
      card: false,
      button: false
    })

    const isMode = computed(() => ({
      edit: props.mode === 'edit',
      create: props.mode === 'create'
    }))

    const tabs = computed(() => {
      return [
        {
          id: 'general',
          title: 'Общее'
        },
        {
          id: 'history',
          title: 'История'
        }
      ]
    })

    /** @computed
     * @name isAllowSave - Разрешено ли сохранять карточку */
    const isAllowSave = computed(() => {
      return !!bankAccount.value.name.length
    })

    /** @computed
     * @name isContentChanged - Изменился ли контент карточки */
    const isContentChanged = computed(() => {
      return !isEqual(bankAccount.value, model.value)
    })

    /** @function
     * @name createBankAccount - Создание банковского счёта */
    const createBankAccount = async () => {
      loading.button = true

      try {
        const { data } = await BankAccountsService.accounts.create(bankAccount.value)

        emit('onObjectCreated', data)
      } finally {
        loading.button = false
      }
    }

    /** @function
     * @name updateCategory - Обновление банковского счёта */
    const updateBankAccount = async () => {
      if (isMode.value.create) return

      loading.card = true

      try {
        const { data } = await BankAccountsService.accounts.update(
          bankAccount.value._id,
          bankAccount.value
        )

        bankAccount.value = data
        model.value = { ...data }

        emit('onObjectUpdated', data)
      } finally {
        loading.card = false
      }
    }

    /** @function
     * @name getBankAccount - Получение банковского счёта */
    const getBankAccount = async () => {
      loading.card = true

      try {
        const { data } = await BankAccountsService.accounts.get(props.id)

        bankAccount.value = data
        model.value = { ...data }
      } finally {
        loading.card = false
      }
    }

    /** @function
     * @name initBankAccount - Инициализация банковского счёта */
    const initBankAccount = () => {
      if (isMode.value.create) {
        bankAccount.value = new BankAccountModel(props.defaultData)
        model.value = new BankAccountModel(props.defaultData)
      } else {
        getBankAccount()
      }
    }

    initBankAccount()

    watch(
      () => props.id,
      (newId) => {
        if (newId && isMode.value.edit) getBankAccount()
      }
    )

    return {
      loading,
      bankAccount,
      tabs,
      isMode,
      isAllowSave,
      isContentChanged,
      createBankAccount,
      updateBankAccount
    }
  }
}
</script>

<style scoped lang="scss">
.bank-account-card {
  &__wrapper {
    display: grid;
    grid-template-columns: 1fr 100px;
    gap: 10px;
  }

  &__item:not(:last-child) {
    margin-bottom: 16px;
  }

  &__chart {
    height: 300px !important;
    width: 300px !important;
    margin: 16px auto;
  }

  &__btn {
    display: block;
    margin: auto;
  }
}
</style>
