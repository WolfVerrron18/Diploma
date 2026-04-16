<template>
  <div class="page-notes">
    <!-- Шапка страницы -->
    <PageHeader title="TO DO лист" />

    <Notes class="page-notes__notes" />
  </div>
</template>

<script setup>
import Notes from '@/components/notes/Notes.vue'
import PageHeader from '@/components/system/PageHeader.vue'
</script>

<style scoped lang="scss">
.page-interval {
  overflow: hidden;
  height: 100%;

  &__list {
    margin-top: 16px;
  }
}
</style>
