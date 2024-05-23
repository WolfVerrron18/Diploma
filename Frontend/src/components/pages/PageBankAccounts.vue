<template>
  <div class="page-bank-accounts">
    <!-- Шапка страницы -->
    <PageHeader
      title="Счета"
      button-text="Создать счёт"
      @on-button-clicked="bankAccounts.visibility = true"
    />

    <div class="page-bank-accounts__wrapper">
      <div class="page-bank-accounts__accounts">
        <BankAccount
          v-for="(account, index) in bankAccounts.list"
          :key="index"
          :active-id="bankAccounts.activeAccount._id"
          class="page-bank-accounts__item"
          :index="index"
          :account="account"
          @click="onBankAccountClicked(index)"
        />
      </div>

      <BankAccountCard
        v-if="!bankAccounts.loading"
        :key="bankAccounts.cardMode"
        :id="bankAccounts.activeAccount._id"
        :mode="bankAccounts.cardMode"
        @on-object-created="onBankAccountCreated"
      />
    </div>

    <Teleport v-if="isMounted" to=".page-header">
      <!-- Кнопка действия -->
      <el-button type="primary" @click="openCardInCreateMode">Создать счёт</el-button>
    </Teleport>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'

/** @class BankAccountsService - Сервис для работы с банковскими счетами */
import BankAccountsService from '@/components/bank-accounts/service/BankAccountsService.js'

/** @module Components - Компоненты */
import PageHeader from '@/components/system/PageHeader.vue'
import BankAccount from '@/components/bank-accounts/components/BankAccount.vue'
import BankAccountCard from '@/components/bank-accounts/card/BankAccountCard.vue'

export default {
  name: 'PageAccountBanks',

  components: { BankAccountCard, BankAccount, PageHeader },

  setup() {
    const isMounted = ref(false)

    const bankAccounts = reactive({
      cardMode: 'edit',
      list: [],
      loading: false,
      activeAccount: {}
    })

    const accounts = ref([
      {
        currency: 2,
        state: 0,
        name: 'Инфраменеджер',
        remains: 12122.12
      },
      {
        currency: 1,
        state: 0,
        name: 'Инфраменеджер',
        remains: 232332232323.12
      }
    ])

    const openCardInCreateMode = () => {
      bankAccounts.cardMode = 'create'
    }

    const onBankAccountClicked = (index) => {
      bankAccounts.cardMode = 'edit'

      bankAccounts.activeAccount = bankAccounts.list[index]
    }

    const onBankAccountCreated = (account) => {
      bankAccounts.list.push(account)
    }

    const getAccounts = async () => {
      bankAccounts.loading = true

      try {
        const { data } = await BankAccountsService.accounts.list()

        bankAccounts.list = data

        bankAccounts.activeAccount = data[0] ?? {}
      } finally {
        bankAccounts.loading = false
      }
    }

    getAccounts()

    onMounted(() => {
      isMounted.value = true
    })

    return {
      isMounted,
      bankAccounts,
      accounts,
      openCardInCreateMode,
      onBankAccountCreated,
      onBankAccountClicked
    }
  }
}
</script>

<style scoped lang="scss">
.page-bank-accounts {
  &__wrapper {
    margin-top: 16px;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 10px;
  }

  &__item:not(:last-child) {
    margin-bottom: 16px;
  }

  &__separator {
    border-right: 1px solid var(--el-border-color);
  }
}
</style>
