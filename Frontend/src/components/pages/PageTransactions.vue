<template>
  <div class="page-transactions">
    <!-- Шапка страницы -->
    <PageHeader title="Транзакции" />

    <TransactionsList class="page-transactions__list" />
  </div>
</template>

<script>
import PageHeader from '@/components/system/PageHeader.vue'
import TransactionsList from '@/components/transactions/list/TransactionsList.vue'
export default {
  name: 'PageTransactions',

  components: { TransactionsList, PageHeader }
}
</script>

<style scoped lang="scss">
.page-categories {
  overflow: hidden;
  height: 100%;

  &__list {
    margin-top: 16px;
  }
}
</style>
