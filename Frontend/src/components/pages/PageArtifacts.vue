<template>
  <div class="page-artifacts">
    <!-- Шапка страницы -->
    <PageHeader title="Артефакты" />

    <ArtifactsList />
  </div>
</template>

<script setup>
import PageHeader from '@/components/system/PageHeader.vue'
import ArtifactsList from '@/components/artifacts/ArtifactsList.vue'
</script>

<style scoped lang="scss">
.page-artifacts {
  overflow: hidden;
  height: 100%;

  &__list {
    margin-top: 16px;
  }
}
</style>
