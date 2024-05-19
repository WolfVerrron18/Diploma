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
          v-for="(account, index) in accounts"
          :key="index"
          class="page-bank-accounts__item"
          :index="index"
          :account="account"
        />
      </div>

      <BankAccountCard />
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'

/** @module Components - Компоненты */
import PageHeader from '@/components/system/PageHeader.vue'
import BankAccount from '@/components/bank-accounts/components/BankAccount.vue'
import BankAccountCard from '@/components/bank-accounts/card/BankAccountCard.vue'

export default {
  name: 'PageAccountBanks',

  components: { BankAccountCard, BankAccount, PageHeader },

  setup() {
    const bankAccounts = reactive({
      visibility: false,
      cardMode: 'edit'
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

    return { bankAccounts, accounts }
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
