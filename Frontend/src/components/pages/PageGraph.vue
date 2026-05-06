<template>
  <div class="page-graph">
    <!-- Шапка страницы -->
    <PageHeader title="Аналитика" />

    <GraphView />
  </div>
</template>

<script setup>
import PageHeader from '@/components/system/PageHeader.vue'
import GraphView from '@/components/graph/GraphView.vue'
</script>

<style scoped lang="scss">
.page-graph {
  overflow: hidden;
  height: 100%;

  &__list {
    margin-top: 16px;
  }
}
</style>
