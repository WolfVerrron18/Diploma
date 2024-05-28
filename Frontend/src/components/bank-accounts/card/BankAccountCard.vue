<template>
  <div class="bank-account-card">
    <!-- Обёртка -->
    <div class="bank-account-card__wrapper">
      <!-- Контент -->
      <div class="bank-account-card__content">
        <!-- Представление -->
        <Transition name="dropdown" mode="out-in">
          <component
            :key="id"
            :is="defineSelectableComponent?.component"
            :id="id"
            :bank-account="bankAccount"
            :is-mode="isMode"
            :readonly="!(isContentChanged && isAllowSave)"
          />
        </Transition>

        <!-- Кнопки -->
        <div v-if="isMode.create" class="bank-account-card__buttons">
          <!-- Отмена -->
          <el-button @click="cancelCreate"> Отмена </el-button>

          <!-- Сохранить -->
          <el-button
            v-if="isMode.create"
            type="primary"
            :loading="loading.button"
            :disabled="readonly || !isAllowSave"
            @click="createBankAccount"
          >
            Сохранить
          </el-button>
        </div>
      </div>

      <!-- Вкладки -->
      <SystemTabs
        v-if="isMode.edit"
        class="bank-account-card__tabs"
        :tabs="tabs"
        @on-tab-selected="selectTab"
      />
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
import BankAccountGeneral from '@/components/bank-accounts/card/views/BankAccountGeneral.vue'
import BankAccountHistory from '@/components/bank-accounts/card/views/BankAccountHistory.vue'

export default {
  name: 'BankAccountCard',

  components: {
    SystemInputNumber,
    SystemSelect,
    SystemTabs,
    SystemInput,
    Doughnut,
    BankAccountGeneral,
    BankAccountHistory
  },

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

  emits: ['onObjectCreated', 'onCancelCreate'],

  setup(props, { emit }) {
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

    const tabs = [
      {
        id: 'general',
        title: 'Общее',
        component: 'BankAccountGeneral'
      },
      {
        id: 'history',
        title: 'История',
        component: 'BankAccountHistory'
      }
    ]

    const bankAccount = ref({})
    const model = ref({})

    const activeTabId = ref('')

    const loading = reactive({
      card: false,
      button: false
    })

    const isMode = computed(() => ({
      edit: props.mode === 'edit',
      create: props.mode === 'create'
    }))

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

    const defineSelectableComponent = computed(() => {
      return tabs.find((tab) => tab.id === activeTabId.value)
    })

    const selectTab = (tab) => (activeTabId.value = tab)

    const cancelCreate = () => emit('onCancelCreate')

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

        activeTabId.value = 'general'
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
      activeTabId,
      bankAccount,
      tabs,
      isMode,
      isAllowSave,
      isContentChanged,
      defineSelectableComponent,
      selectTab,
      cancelCreate,
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
    height: 100%;
  }

  &__item:not(:last-child) {
    margin-bottom: 16px;
  }

  &__chart {
    height: 300px !important;
    width: 300px !important;
    margin: 16px auto;
  }

  &__buttons {
    border-top: 1px solid var(--el-menu-border-color);
    padding-top: 16px;
    display: flex;
    gap: 5px;
    justify-content: center;
  }
}
</style>
