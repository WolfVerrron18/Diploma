<template>
  <div class="page-retro">
    <!-- Шапка страницы -->
    <PageHeader title="Ретроспективы" />

    <RetrospectivesList />
  </div>
</template>

<script setup>
import PageHeader from '@/components/system/PageHeader.vue'
import RetrospectivesList from '@/components/retrospectives/RetrospectivesList.vue'
</script>

<style scoped lang="scss">
.page-retro {
  overflow: hidden;
  height: 100%;

  &__list {
    margin-top: 16px;
  }
}
</style>
