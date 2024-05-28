<template>
  <div class="bank-account-general">
    <!-- Название -->
    <SystemInput
      v-model.trim="bankAccount.name"
      :required="true"
      class="bank-account-general__item"
      label="Название"
      @change:model-value="updateBankAccount"
    />

    <!-- Описание -->
    <SystemInput
      v-model.trim="bankAccount.description"
      class="bank-account-general__item"
      label="Описание"
      type-field="textarea"
      @change:model-value="updateBankAccount"
    />

    <!-- Сумма -->
    <SystemInputNumber
      v-model="bankAccount.value"
      class="bank-account-general__item"
      label="Сумма"
      :disabled="isMode.edit"
      @update:model-value="updateBankAccount"
    />
  </div>
</template>

<script>
/** @module Components - Компоненты */
import SystemInput from '@/components/system/SystemInput.vue'
import SystemInputNumber from '@/components/system/SystemInputNumber.vue'

export default {
  name: 'BankAccountGeneral',

  components: { SystemInput, SystemInputNumber },

  props: {
    /** @param {object} bankAccount - Банковский аккаунт */
    bankAccount: {
      type: Object,
      default: () => ({})
    },

    /** @param {boolean} readonly - Режим только чтения */
    readonly: {
      type: Boolean,
      default: false
    },

    /** @param {boolean} loading - Режим только чтения */
    loading: {
      type: Object,
      default: () => ({})
    },

    /** @param {object} isMode: - Определение режима работы с карточкой */
    isMode: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['onBankAccountUpdated', 'onBankAccountCreate'],

  setup(props, { emit }) {
    const updateBankAccount = () => emit('onBankAccountUpdated')

    const createBankAccount = () => emit('onBankAccountCreate')

    return { updateBankAccount, createBankAccount }
  }
}
</script>

<style scoped lang="scss">
.bank-account-general {
  &__item {
    margin-bottom: 16px;
  }
}
</style>
