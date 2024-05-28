<template>
  <div class="bank-account-history" v-loading="loading">
    <HistoryListItem v-for="item in historyList" :item="item" :key="item._id" />

    <el-empty v-if="!historyList.length && !loading" description="История по счёту отсутствует" />
  </div>
</template>

<script>
import TransactionService from '@/components/transactions/service/TransactionService.js'
import { ref, watch } from 'vue'
import HistoryListItem from '@/components/bank-accounts/components/history/HistoryListItem.vue'

export default {
  name: 'BankAccountHistory',
  components: { HistoryListItem },

  props: {
    id: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const loading = ref(false)

    const historyList = ref([])

    const getTransitions = async (id) => {
      loading.value = true

      try {
        const { data } = await TransactionService.transactions.list({ bankAccountId: id })

        historyList.value = data
      } finally {
        loading.value = false
      }
    }

    watch(
      () => props.id,
      (newValue) => getTransitions(newValue),
      { immediate: true }
    )

    return { loading, historyList }
  }
}
</script>

<style scoped lang="scss"></style>
