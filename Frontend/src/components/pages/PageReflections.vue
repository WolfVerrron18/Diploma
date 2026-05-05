<template>
  <div class="page-reflections">
    <!-- Шапка страницы -->
    <PageHeader title="Размышления" />

    <Reflections />
  </div>
</template>

<script setup>
import PageHeader from '@/components/system/PageHeader.vue'
import Reflections from '@/components/reflections/Reflections.vue'
</script>

<style scoped lang="scss">
.page-reflections {
  overflow: hidden;
  height: 100%;

  &__list {
    margin-top: 16px;
  }
}
</style>
