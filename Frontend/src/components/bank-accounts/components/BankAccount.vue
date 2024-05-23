<template>
  <div class="bank-account" :class="{ 'bank-account_active': activeId === account._id }">
    <!-- Валюта счёта -->
    <el-avatar class="bank-account__avatar">
      <el-avatar size="small"> ₽ </el-avatar>
    </el-avatar>

    <!-- Счёт -->
    <div class="bank-account__wrapper">
      <!-- Остаток счёта -->
      <p class="bank-account__remains">{{ account.value }}</p>

      <!-- Наименование счёта -->
      <p class="bank-account__title">{{ account.name }}</p>
    </div>

    <!-- Контролы -->
    <div class="bank-account__controls">
      <!-- Удалить -->
      <el-icon color="#303133" @click="onRemoveAccount"><Delete /></el-icon>
    </div>
  </div>
</template>

<script>
/** @module Icons - Иконки */
import { Delete } from '@element-plus/icons-vue'

export default {
  name: 'BankAccount',

  components: { Delete },

  props: {
    /** @param {string} activeId - Активный идентификатор счёта */
    activeId: {
      type: String,
      default: ''
    },

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
    /** @function
     * @name onRemoveAccount - Удаление счёта */
    const onRemoveAccount = () => {
      emit('onRemoveAccount', props.index)
    }

    /** @function
     * @name onHideAccount - Скрытие счёта */
    const onHideAccount = () => {
      emit('onHideAccount', props.index)
    }

    return { onRemoveAccount, onHideAccount }
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

  &_active {
    background: var(--el-color-primary-light-8);
  }

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
