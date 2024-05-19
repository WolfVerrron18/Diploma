<template>
  <div class="page-purposes">
    <!-- Шапка страницы -->
    <PageHeader
      title="Цели"
      button-text="Создать цель"
      @on-button-clicked="purpose.visibility = true"
    />

    <!-- Модальное окно цели -->
    <PurposeModal
      v-model="purpose.visibility"
      :mode="purpose.cardMode"
      @on-hide-modal="purpose.visibility = false"
    />
  </div>
</template>

<script>
import { reactive } from 'vue'

/** @module Components - Компоненты */
import PageHeader from '@/components/system/PageHeader.vue'
import PurposeModal from '@/components/purposes/card/PurposeModal.vue'

export default {
  name: 'PagePurposes',

  components: { PurposeModal, PageHeader },

  setup() {
    const purpose = reactive({
      visibility: false,
      cardMode: 'edit'
    })

    /** @function
     * @name createPurposes - Создание цели */
    const createPurposes = () => {}

    return { purpose, createPurposes }
  }
}
</script>

<style scoped></style>
