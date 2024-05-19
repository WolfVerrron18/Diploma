<template>
  <div class="bank-account">
    <!-- Валюта счёта -->
    <el-avatar class="bank-account__avatar">
      <el-avatar size="small"> {{ currencyValue }} </el-avatar>
    </el-avatar>

    <!-- Счёт -->
    <div class="bank-account__wrapper">
      <!-- Остаток счёта -->
      <p class="bank-account__remains">{{ account.remains }} {{ currencyValue }}</p>

      <!-- Наименование счёта -->
      <p class="bank-account__title">{{ account.name }}</p>
    </div>

    <!-- Контролы -->
    <div class="bank-account__controls">
      <!-- Скрыть / Показать -->
      <el-icon color="#303133">
        <component :is="stateIcon" />
      </el-icon>

      <!-- Удалить -->
      <el-icon color="#303133" @click="onRemoveAccount"><Delete /></el-icon>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

/** @module Icons - Иконки */
import { Delete, Hide, View } from '@element-plus/icons-vue'

/** @module enumCurrency - Списки возможных состояний счёта */
import {
  currencyList,
  stateAccountIcon,
  enumStateAccountId
} from '@/components/bank-accounts/enums/enumCurrency.js'

export default {
  name: 'BankAccount',

  components: { View, Delete, Hide },

  props: {
    /** @param {object} account - Счёт */
    account: {
      type: Object,
      default: () => ({})
    },

    /** @param {Number} index - Индекс в массиве (если используется с v-for) */
    index: {
      type: Number,
      default: null
    }
  },

  emits: ['onRemoveAccount', 'onHideAccount'],

  setup(props, { emit }) {
    /** @computed
     * @name currencyValue - Определение текущей валюты */
    const currencyValue = computed(() => currencyList[props.account.currency])

    /** @computed
     * @name stateIcon - Определение состояния счёта */
    const stateIcon = computed(() => stateAccountIcon[props.account.state])

    /** @function
     * @name onRemoveAccount - Удаление счёта */
    const onRemoveAccount = () => {
      emit('onRemoveAccount', props.index)
    }

    /** @function
     * @name onHideAccount - Скрытие счёта */
    const onHideAccount = () => {
      emit('onHideAccount', props.index, enumStateAccountId.display === props.account.state)
    }

    return { currencyValue, stateIcon, onRemoveAccount, onHideAccount }
  }
}
</script>

<style scoped lang="scss">
.bank-account {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 10px;
  padding: 10px;
  position: relative;
  max-width: 300px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-round);
  transition: all 0.25s var(--el-transition-function-ease-in-out-bezier);

  &:hover {
    background: var(--el-color-primary-light-8);
  }

  &__avatar {
    background: var(--el-color-primary-light-3);

    & > .el-avatar {
      box-shadow: var(--el-box-shadow-dark);
      background: var(--el-bg-color);
      font-size: var(--el-font-size-base);
      color: var(--el-text-color-primary);
      font-weight: var(--el-font-weight-primary);
    }
  }

  &__title {
    font-size: var(--el-font-size-large);
    color: var(--el-text-color-primary);
  }

  &__remains {
    font-size: var(--el-font-size-large);
    color: var(--el-text-color-primary);
    font-weight: var(--el-font-weight-primary);
  }

  &__controls {
    position: absolute;
    right: 10px;
    top: 16px;
    display: flex;
    align-items: center;
    gap: 10px;

    & .el-icon {
      cursor: pointer;
    }
  }
}
</style>
